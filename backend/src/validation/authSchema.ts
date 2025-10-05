import z from "zod";
import { userProps } from "./schemas.js";

export const signUpSchema = z
  .object({
    name: userProps.name,
    email: userProps.email,
    password: userProps.password,
  })
  .extend({
    confirmPassword: z.string().trim(),
  })
  .refine((body) => body.password === body.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform(({ confirmPassword, ...rest }) => rest);

export const signinSchema = z.object({
  email: userProps.email,
  password: userProps.password,
});

export const bearerTokenSchema = z.object({
  token: z
    .string()
    .trim()
    .startsWith("Bearer ")
    .transform((val) => val.replace("Bearer ", "")),
});

export type SignupBody = z.infer<typeof signUpSchema>;
export type SigninBody = z.infer<typeof signinSchema>;
export type BearerToken = z.infer<typeof bearerTokenSchema>;
