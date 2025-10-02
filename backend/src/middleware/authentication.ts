import { bearerTokenSchema } from "@/validation/authSchema.js";
import type { NextFunction, Request, Response } from "express";
import { type JwtPayload } from "jsonwebtoken";
import catchAsync from "@/util/catchAsync.js";
import jwt from "jsonwebtoken";

export const authenticate = catchAsync(
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const token = bearerTokenSchema.parse(
      req.headers.authorization || req.cookies.jwt
    );
    const payload = jwt.verify(
      token.token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    (req as any).payload = payload;
    next();
  }
);
