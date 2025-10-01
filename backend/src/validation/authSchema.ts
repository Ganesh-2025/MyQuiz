import z from "zod";
import { UserSchema } from "./schemas.js";

export const SignUpSchema = UserSchema.extend({
  confirmPassword: z.string().trim(),
})
  .refine((body) => body.password === body.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest);

export const SigninSchema = UserSchema.pick({ name: true, email: true });

export type signupBody = z.infer<typeof SignUpSchema>;
export type signinBody = z.infer<typeof SigninSchema>;
