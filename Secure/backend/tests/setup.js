import "dotenv/config";

const testDbUrl = process.env.TEST_DATABASE_URL;

if (!testDbUrl) {
  throw new Error("TEST_DATABASE_URL environment variable is required for test runs.");
}

let dbName = "";
try {
  const parsed = new URL(testDbUrl);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol)) {
    throw new Error("TEST_DATABASE_URL must be a PostgreSQL connection URL.");
  }
  dbName = parsed.pathname.replace(/^\//, "");
} catch (err) {
  throw new Error(`Invalid TEST_DATABASE_URL: ${err.message}`);
}

if (!dbName.endsWith("_test")) {
  throw new Error(
    `Safety guard error: test database name must end in '_test', received '${dbName}'`
  );
}

// Point Prisma and app to dedicated test database
process.env.DATABASE_URL = testDbUrl;
process.env.NODE_ENV = "test";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test-jwt-secret-at-least-32-characters-long-safe";
process.env.FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
process.env.PORT = process.env.PORT || "3000";

