import { prisma } from "@/server.js";
import { userRes } from "@/types/projection.js";
import AppError from "@/util/AppError.js";
import catchAsync from "@/util/catchAsync.js";
import {
  signinSchema,
  signUpSchema,
  type SigninBody,
  type SignupBody,
} from "@/validation/authSchema.js";
import becrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as boolean | "lax" | "strict" | "none" | undefined,
  maxAge: Number(process.env.COOKIE_MAX_AGE),
};
const JWT_COOKIE = "jwtToken";

const signJwtToken = (payload: string): string => {
  const secret = process.env.JWT_SECRET as Secret;
  const expiresIn = Number(process.env.JWT_EXPIRES_IN) as number;
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const signup = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const signupBody: SignupBody = signUpSchema.parse(req.body);
    const hashedPassword = await becrypt.hash(signupBody.password, 12);
    signupBody.password = hashedPassword;
    const user = await prisma.user.create({
      data: signupBody,
      omit: { password: true },
    });
    const jwtToken = signJwtToken(user.id);

    return res.cookie(JWT_COOKIE, jwtToken, cookieOptions).status(200).json({
      status: "success",
      message: "user created",
      data: { user, jwtToken },
    });
  }
);

export const signin = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, password } = signinSchema.parse(req.body) as SigninBody;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !becrypt.compareSync(password, user.password))
      throw new AppError(400, "error", "email or password is wrong");
    const jwtToken = signJwtToken(user.id);
    delete (user as any).password;
    return res.cookie(JWT_COOKIE, jwtToken, cookieOptions).status(200).json({
      status: "success",
      message: "user created",
      data: { user, jwtToken },
    });
  }
);

export const signOut = (req: Request, res: Response): Response => {
  res.cookie(JWT_COOKIE, null);
  return res.status(200).json({
    status: "success",
    message: "logout successfull",
  });
};
