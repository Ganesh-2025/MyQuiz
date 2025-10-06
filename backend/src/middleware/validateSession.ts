import type { AuthRequest } from "@/types/express.js";
import AppError from "@/util/AppError.js";
import type { NextFunction, Request, Response } from "express";

const validateSession = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (
    authReq.session &&
    authReq.session.userID &&
    authReq.session.userID === authReq.payload.sub
  ) {
    next();
  } else {
    return next(new AppError(401, "error", "Unauthorized: invalid session"));
  }
};
export default validateSession;
