import { email, z } from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "must have at least one character")
    .max(100, "character length exceed"),
  email: z.email().trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});
