import { prisma } from "@/server.js";
import type { AuthRequest } from "@/types/express.js";
import AppError from "@/util/AppError.js";
import catchAsync from "@/util/catchAsync.js";
import {
  createQuizBody,
  submitQuizBody,
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
import bcrypt from "bcrypt";
import { ca } from "zod/locales";
import type z from "zod";

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
    const hashedPassword = parsedBody.password
      ? await bcrypt.hash(parsedBody.password, 12)
      : null;
    const quiz = await prisma.quiz.create({
      data: {
        title: parsedBody.title,
        description: parsedBody.description,
        password: hashedPassword,
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

export const startQuiz = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const userID = (req as AuthRequest).payload.sub!;
    const quizID = req.params.quizID;
    const password = req.body.password as string;

    const quiz = await prisma.quiz.findUnique({
      select: {
        id: true,
        title: true,
        difficulty: true,
        closeAt: true,
        liveAt: true,
        timeLimitSec: true,
        negativeMarking: true,
        totalMarks: true,
        password: true,
        attempts: true,
        questions: {
          select: {
            options: { select: { optionNo: true, text: true } },
            questionNo: true,
            text: true,
            marks: true,
          },
        },
        _count: {
          select: {
            Submissions: {
              where: { AND: [{ userId: userID }, { quizId: quizID! }] },
            },
          },
        },
      },
      where: { id: quizID! },
    });

    if (!quiz) return next(new AppError(404, "error", "Quiz not found"));
    if (quiz.attempts && quiz._count.Submissions >= quiz.attempts)
      return next(
        new AppError(403, "error", "Maximum attempts for this quiz reached")
      );
    if (quiz.password && !bcrypt.compareSync(password, quiz.password))
      return next(new AppError(401, "error", "Incorrect password"));

    const startedAt = Date.now();
    const expiredAt = quiz.timeLimitSec
      ? new Date(startedAt + quiz.timeLimitSec * 1000)
      : null;
    const hasTimeLimit = Boolean(quiz.timeLimitSec);

    const submission = await prisma.submissions.create({
      data: {
        quizId: quiz.id,
        userId: userID,
        score: 0,
        attemptNo: (quiz._count.Submissions ?? 0) + 1,
      },
    });

    req.session.quizID = quiz.id;
    req.session.startedAt = startedAt;
    req.session.expiredAt = expiredAt;
    req.session.hasTimeLimit = hasTimeLimit;
    req.session.userID = userID;
    req.session.submissionID = submission.id;

    return res.status(200).json({
      status: "success",
      data: { quiz, startedAt, expiredAt, hasTimeLimit },
    });
  }
);

export const submitQuiz = catchAsync(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const quizID = req.session.quizID;
    if (!quizID) return next(new AppError(400, "error", "No quiz in session"));
    const markOptions = submitQuizBody.parse(req.body);
    const submissionID = req.session.submissionID;
    req.session.destroy(next);

    const quizQuestions = await prisma.question.findMany({
      where: { quizId: quizID },
      select: { id: true, marks: true, options: true },
    });
    const score = evaluate(quizQuestions, markOptions);

    await prisma.markOptions.createMany({
      data: markOptions
        .map((q) =>
          q.selectedOptionIds.map((opt) => ({
            optionId: opt,
            questionID: q.questionId,
            submissionId: submissionID!,
          }))
        )
        .flat(),
    });
    await prisma.submissions.update({
      where: { id: submissionID! },
      data: { score },
    });

    return res.status(200).json({
      status: "success",
      message: "quiz submitted",
      data: { score, submissionID },
    });
  }
);
const evaluate = (
  quizQuestions: any,
  markOptions: z.infer<typeof submitQuizBody>
): number => {
  let score = 0;
  const markOptionsMap = new Map(
    markOptions.map((opts) => [
      opts.questionId,
      new Set(opts.selectedOptionIds),
    ])
  );

  quizQuestions.forEach((question: any) => {
    const correctOptions = question.options
      .filter((opt: any) => opt.isAnswer)
      .map((opt: any) => opt.id);
    const selectedOptions = markOptionsMap.get(question.id) || new Set();

    const isCorrect = correctOptions.every((opt: any) =>
      selectedOptions.has(opt)
    );
    if (isCorrect) score += question.marks;
    else if (question.deduct > 0) score -= question.deduct;
  });
  return score;
};
export const sendReport = catchAsync
async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const submissionID = req.params.submissionID;
  if (!submissionID)
    return next(new AppError(400, "error", "No submission ID provided"));
  const userID = (req as AuthRequest).payload.sub!;
  const submission = await prisma.submissions.findFirst({
    where: { id: submissionID, userId: userID },
    select: {
      score: true,
      markOptions: true,
      attemptNo: true,
      quiz: {
        select: {
          title: true,
          questions: { include: { options: true } },
        },
      },
    },
  });
  if (!submission)
    return next(new AppError(404, "error", "Submission not found"));
  submission.quiz.questions.forEach((question) => {
    (question as any).markOptions =
      submission.markOptions.filter((m) => m.questionID === question.id) ?? [];
  });
  return res.status(200).json({
    status: "success",
    data: { submission },
  });
};

export const sendCurrentQuizData = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const quizID = req.session.quizID;
    if (!quizID) return next(new AppError(400, "error", "No quiz ID provided"));
    return res.status(200).json({
      status: "success",
      data: { quizID, startedAt: req.session.startedAt, expiredAt: req.session.expiredAt, hasTimeLimit: req.session.hasTimeLimit, timeremainingSec: req.session.timeremainingSec },
    });
  }
  
);