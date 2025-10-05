import { bearerTokenSchema } from "@/validation/authValidation.js";
import type { NextFunction, Request, Response } from "express";
import { type JwtPayload } from "jsonwebtoken";
import catchAsync from "@/util/catchAsync.js";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "@/types/express.js";

export const authenticate = catchAsync(
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const data = bearerTokenSchema.parse({
      token: req.headers.authorization || req.cookies?.jwtToken,
    });
    console.log(data.token);
    jwt.verify(data.token, process.env.JWT_SECRET!);
    const payload = jwt.decode(data.token) as JwtPayload;
    (req as AuthRequest).payload = payload;
    next();
  }
);
