import { prisma } from "@/server.js";
import type { AuthRequest } from "@/types/express.js";
import catchAsync from "@/util/catchAsync.js";
import { createQuiz, type CreateQuiz } from "@/validation/quizValidation.js";
import type { Request, Response } from "express";

export const create = catchAsync(
  async (req: Request, res: Response): Promise<Response | void> => {
    const authReq = req as AuthRequest;
    const parsedBodys: CreateQuiz[] = authReq.body?.map((b) =>
      createQuiz.parse(b)
    );
    const quiz = await prisma.question.createMany({
      data: [
        {
          questionNo: 1,
          text: "What is 2+2?",
          marks: 5,
          quizId: "clgq6j4k30000qzrmn8v7v6y1",
          c,
        },
      ],
    });
  }
);
