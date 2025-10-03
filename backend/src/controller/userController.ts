import { prisma } from "@/server.js";
import type { AuthRequest } from "@/types/express.js";
import catchAsync from "@/util/catchAsync.js";
import type { NextFunction, Request, Response } from "express";

export const getMe = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const authReq = req as AuthRequest;
    const user = await prisma.user.findUnique({
      where: { id: authReq.payload.sub! },
      omit: { password: true },
    });
    return res.status(200).json({
      status: "success",
      message: "user fetched",
      data: { user },
    });
  }
);
