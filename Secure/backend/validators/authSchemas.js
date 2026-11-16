import { z } from "zod";

const passwordSchema = z
  .string()
  .refine(
    (val) => {
      const bytes = Buffer.byteLength(val, "utf8");
      return bytes >= 12 && bytes <= 72;
    },
    {
      message: "Password must be between 12 and 72 bytes",
    }
  );

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

