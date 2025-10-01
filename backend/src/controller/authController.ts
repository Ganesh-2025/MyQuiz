import becrypt from "bcrypt";
import type { NextFunction } from "express";

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  return res.json();
};
