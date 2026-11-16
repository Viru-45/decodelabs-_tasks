import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getProfile, login, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

const authRoutes = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later" },
});

authRoutes.post("/register", authLimiter, validateRequest(registerSchema), register);
authRoutes.post("/login", authLimiter, validateRequest(loginSchema), login);
authRoutes.get("/profile", authenticate, getProfile);

export default authRoutes;
