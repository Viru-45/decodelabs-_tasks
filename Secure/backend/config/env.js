import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (value) => {
        try {
          return ["postgres:", "postgresql:"].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      },
      { message: "must be a PostgreSQL connection URL" },
    ),
  JWT_SECRET: z.string().min(32, "must be at least 32 characters"),
  FRONTEND_ORIGIN: z
    .string()
    .url()
    .refine((value) => {
      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) && url.origin === value;
      } catch {
        return false;
      }
    }, "must be an exact HTTP(S) origin with no path"),
  PORT: z
    .string()
    .regex(/^\d+$/, "must be a valid port")
    .transform(Number)
    .pipe(z.number().int().min(1).max(65535)),
});

export function validateEnv(source = process.env) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return result.data;
}

export const env = validateEnv();
