import { prisma } from "@/server.js";
import type { AuthRequest } from "@/types/express.js";
import AppError from "@/util/AppError.js";
import catchAsync from "@/util/catchAsync.js";
import {
  createQuizBody,
  updateQuizBody,
  type CreateQuiz,
  type UpdateQuiz,
} from "@/validation/quizValidation.js";
import {
  browseQuizesReqSchema,
  type BrowseQuizezReq,
} from "@/validation/schemas.js";
import type { NextFunction, Request, Response } from "express";
import type { Prisma } from "generated/prisma/index.js";

export const getAllQuizes = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const parsedQuery: BrowseQuizezReq = browseQuizesReqSchema.parse(req.query);

    const where = {} as Record<string, any>;
    if (parsedQuery.title) where["title"] = parsedQuery.title;
    if (parsedQuery.difficulty) where["difficulty"] = parsedQuery.difficulty;
    if (parsedQuery.live) where["live"] = parsedQuery.live;
    if (parsedQuery.negativeMarking)
      where["negativeMarking"] = parsedQuery.negativeMarking;

    const quizzes = await prisma.quiz.findMany({
      where,
      orderBy: parsedQuery.sort as any,
      skip: parsedQuery.skip ?? 0,
      take: parsedQuery.take ?? 10,
    });
    return res.status(200).json({
      status: "success",
      data: {
        quizzes,
      },
    });
  }
);

export const getMyQuizes = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const quizzes = await prisma.quiz.findMany({
      where: { authorID: authReq.payload.sub! },
    });

    return res.json({
      status: "success",
      data: {
        quizzes,
      },
    });
  }
);

export const getQuizById = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id! },
      include: { questions: { include: { options: true } } },
      omit: { authorID: true },
    });
    if (!quiz) return next(new AppError(400, "error", "quiz not found"));
    return res.json({
      status: "success",
      data: {
        quiz,
      },
    });
  }
);

export const createQuiz = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const parsedBody: CreateQuiz = createQuizBody.parse(authReq.body);

    const quiz = await prisma.quiz.create({
      data: {
        title: parsedBody.title,
        description: parsedBody.description,
        password: parsedBody.password ?? null,
        timeLimitSec: parsedBody.timeLimitSec ?? null,
        passingScore: parsedBody.passingScore ?? null,
        totalMarks: parsedBody.totalMarks ?? null,
        attempts: parsedBody.attempts ?? null,
        difficulty: parsedBody.difficulty ?? null,
        liveAt: parsedBody.liveAt ?? null,
        closeAt: parsedBody.closeAt ?? null,
        negativeMarking: parsedBody.negativeMarking ?? false,
        shuffle: parsedBody.shuffle ?? null,
        author: { connect: { id: authReq.payload.sub! } },
        questions: {
          create: [
            ...parsedBody.questions.map((q) => ({
              ...q,
              options: {
                createMany: {
                  data: q.options,
                },
              },
            })),
          ],
        },
      },
      include: { questions: { select: { options: true } } },
      omit: { authorID: true },
    });
    return res.json({
      status: "success",
      data: {
        quiz,
      },
    });
  }
);

export const updateQuiz = catchAsync(
  async (req: Request, res: Response): Promise<Response | void> => {
    const authReq = req as AuthRequest;
    const parsedBody = updateQuizBody.parse(
      authReq.body
    ) as unknown as Prisma.QuizUpdateInput;
    const updatedQuiz = await prisma.quiz.update({
      where: { id: req.params.id!, authorID: authReq.payload.sub! },
      data: {
        ...parsedBody,
      },
      include: { questions: { include: { options: true } } },
      omit: { authorID: true },
    });
    return res.status(200).json({
      status: "success",
      message: "quiz updated",
      data: {
        quiz: updatedQuiz,
      },
    });
  }
);

export const deleteQuiz = catchAsync(
  async (req: Request, res: Response): Promise<Response | void> => {
    const authReq = req as AuthRequest;
    await prisma.quiz.delete({
      where: { id: req.params.id!, authorID: authReq.payload.sub! },
    });
    return res.status(200).json({ status: "success", message: "quiz deleted" });
  }
);
