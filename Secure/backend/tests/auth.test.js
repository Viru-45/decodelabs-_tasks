import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app.js";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

describe("Authentication API Integration Tests", () => {
  const createdUserIds = [];

  after(async () => {
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: {
            in: createdUserIds,
          },
        },
      });
    }
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("rejects missing or invalid fields with 400", async () => {
      // Missing name
      const res1 = await request(app)
        .post("/api/auth/register")
        .send({ email: "valid@example.com", password: "Password12345!" });
      assert.equal(res1.status, 400);

      // Invalid email
      const res2 = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "invalid-email", password: "Password12345!" });
      assert.equal(res2.status, 400);

      // Password too short (< 12 characters)
      const res3 = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "valid@example.com", password: "Short1!" });
      assert.equal(res3.status, 400);

      // Password too long (> 72 bytes)
      const longPassword = "A".repeat(73);
      const res4 = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test User", email: "valid@example.com", password: longPassword });
      assert.equal(res4.status, 400);
    });

    it("returns 201 on success and never includes password or password hash", async () => {
      const email = `test-reg-${Date.now()}@example.com`;
      const plainPassword = "SecurePassword123!";

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Register User",
          email,
          password: plainPassword,
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.id);
      assert.equal(res.body.name, "Register User");
      assert.equal(res.body.email, email.toLowerCase());
      assert.ok(res.body.createdAt);
      assert.equal(res.body.password, undefined);
      assert.equal(res.body.hash, undefined);

      createdUserIds.push(res.body.id);
    });

    it("verifies stored password differs from submitted password and verifies with bcrypt", async () => {
      const email = `test-bcrypt-${Date.now()}@example.com`;
      const plainPassword = "BcryptPassword123!";

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Bcrypt User",
          email,
          password: plainPassword,
        });

      assert.equal(res.status, 201);
      createdUserIds.push(res.body.id);

      const dbUser = await prisma.user.findUnique({
        where: { id: res.body.id },
      });

      assert.ok(dbUser);
      assert.notEqual(dbUser.password, plainPassword);
      const isMatch = await bcrypt.compare(plainPassword, dbUser.password);
      assert.equal(isMatch, true);
    });

    it("returns 409 for duplicate normalized email including case variations", async () => {
      const baseEmail = `dup-${Date.now()}`;
      const email1 = `${baseEmail}@example.com`;
      const email2 = `${baseEmail.toUpperCase()}@EXAMPLE.COM`;

      const res1 = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Original User",
          email: email1,
          password: "OriginalPassword123!",
        });

      assert.equal(res1.status, 201);
      createdUserIds.push(res1.body.id);

      const res2 = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Duplicate User",
          email: email2,
          password: "DuplicatePassword123!",
        });

      assert.equal(res2.status, 409);
      assert.ok(res2.body.error);
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns a JWT and public user data for valid credentials", async () => {
      const email = `test-login-${Date.now()}@example.com`;
      const password = "LoginPassword123!";

      const regRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Login User",
          email,
          password,
        });
      assert.equal(regRes.status, 201);
      createdUserIds.push(regRes.body.id);

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email,
          password,
        });

      assert.equal(loginRes.status, 200);
      assert.ok(loginRes.body.token);
      assert.ok(typeof loginRes.body.token === "string");
      assert.ok(loginRes.body.user);
      assert.equal(loginRes.body.user.id, regRes.body.id);
      assert.equal(loginRes.body.user.email, email);
      assert.equal(loginRes.body.user.name, "Login User");
      assert.equal(loginRes.body.user.password, undefined);
    });

    it("returns 401 with the exact same error message for unknown email and wrong password", async () => {
      const email = `test-authfail-${Date.now()}@example.com`;
      const password = "AuthPassword123!";

      const regRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Auth User",
          email,
          password,
        });
      assert.equal(regRes.status, 201);
      createdUserIds.push(regRes.body.id);

      // Unknown email
      const resUnknown = await request(app)
        .post("/api/auth/login")
        .send({
          email: `unknown-${Date.now()}@example.com`,
          password,
        });
      assert.equal(resUnknown.status, 401);

      // Wrong password
      const resWrongPassword = await request(app)
        .post("/api/auth/login")
        .send({
          email,
          password: "WrongPassword123!",
        });
      assert.equal(resWrongPassword.status, 401);

      // Verify identical generic error messages
      assert.ok(resUnknown.body.error);
      assert.equal(resUnknown.body.error, resWrongPassword.body.error);
    });
  });

  describe("GET /api/auth/profile", () => {
    it("returns 401 without bearer token, with malformed token, and with expired token", async () => {
      // Missing token
      const resNoToken = await request(app).get("/api/auth/profile");
      assert.equal(resNoToken.status, 401);

      // Malformed header
      const resMalformed1 = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Basic abcdefg");
      assert.equal(resMalformed1.status, 401);

      const resMalformed2 = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-jwt-token");
      assert.equal(resMalformed2.status, 401);

      // Expired token
      const expiredToken = jwt.sign(
        { sub: "some-user-id" },
        env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "-10s" }
      );
      const resExpired = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${expiredToken}`);
      assert.equal(resExpired.status, 401);
    });

    it("returns only authenticated user public data with valid token", async () => {
      const email = `test-profile-${Date.now()}@example.com`;
      const password = "ProfilePassword123!";

      const regRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Profile User",
          email,
          password,
        });
      assert.equal(regRes.status, 201);
      createdUserIds.push(regRes.body.id);

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email, password });
      assert.equal(loginRes.status, 200);

      const token = loginRes.body.token;

      const profileRes = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      assert.equal(profileRes.status, 200);
      const user = profileRes.body.user || profileRes.body;
      assert.equal(user.id, regRes.body.id);
      assert.equal(user.name, "Profile User");
      assert.equal(user.email, email);
      assert.ok(user.createdAt);
      assert.equal(user.password, undefined);
      assert.equal(user.hash, undefined);
    });
  });
});

