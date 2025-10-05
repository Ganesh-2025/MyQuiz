import { prisma } from "@/server.js";
import type { AuthRequest } from "@/types/express.js";
import catchAsync from "@/util/catchAsync.js";
import {
  createQuestion,
  updateQuestion,
} from "@/validation/questionValidation.js";
import type { Request, Response } from "express";

export const create = catchAsync(
  async (req: Request, res: Response): Promise<Response | void> => {
    const authReq = req as AuthRequest;
    const quizID = req.params?.quizID! as string;
    const parsedBody = createQuestion.parse(req.body);
    const createdQuestion = await prisma.question.create({
      data: {
        questionNo: parsedBody.questionNo,
        text: parsedBody.text,
        marks: parsedBody.marks,
        options: {
          createMany: {
            data: parsedBody.options.map((opt) => ({
              optionNo: opt.optionNo,
              text: opt.text,
              isAnswer: opt.isAnswer,
            })),
          },
        },
        quiz: { connect: { id: quizID!, authorID: authReq.payload.sub! } },
      },
      include: {
        options: { orderBy: { optionNo: "asc" } },
        quiz: true,
      },
    });
    return res.json({
      status: "success",
      message: "question created",
      data: { createdQuestion },
    });
  }
);

export const update = catchAsync(
  async (req: Request, res: Response): Promise<Response | void> => {
    const authReq = req as AuthRequest;
    const quizID = req.params?.quizID;
    const questionID = req.params?.questionID;
    const parsedBody = updateQuestion.parse(req.body);
    const { options, ...questionData } = parsedBody;
    const updatedQuestion = await prisma.question.update({
      where: {
        id: questionID!,
        quizId: quizID!,
        quiz: { is: { authorID: authReq.payload.sub! } },
      },
      data: {
        ...(questionData as any),
        options: {
          // update: options.update as any,
          deleteMany: {},
          createMany: { data: options as any },
          // disconnect: optionsToDelete as any[],
        },
      },
      include: { options: true },
    });
    return res.status(200).json({
      status: "success",
      message: "question updated",
      data: updatedQuestion,
    });
  }
);
