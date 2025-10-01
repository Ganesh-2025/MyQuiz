import z from "zod";
import { UserSchema } from "./schemas.js";

const signUpSchema = UserSchema.extend({ confirmPassword: z.string().trim() })
  .refine((body) => body.password === body.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest);
