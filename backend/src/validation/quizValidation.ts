import z, { coerce } from "zod";
import { quizProps } from "./schemas.js";
import globalSchema from "./globalSchema.js";
import { createQuestion } from "./questionValidation.js";

export const createQuiz = z
  .object({
    title: quizProps.title,
    description: quizProps.description,
    password: quizProps.password.optional(),
    timeLimitSec: coerce.number().pipe(quizProps.timeLimitSec).optional(),
    passingScore: coerce.number().pipe(quizProps.passingScore).optional(),
    totalMarks: coerce.number().pipe(quizProps.totalMarks).optional(),
    attempts: coerce.number().pipe(quizProps.attempts).optional(),
    difficulty: quizProps.difficulty,
    liveAt: coerce.date().pipe(quizProps.liveAt).optional(),
    closeAt: coerce.date().pipe(quizProps.closeAt).optional(),
    negativeMarking: globalSchema.strOrBool
      .prefault(false)
      .pipe(quizProps.negativeMarking),
    shuffle: globalSchema.strOrBool.prefault(false).pipe(quizProps.shuffle),
    questions: z
      .array(createQuestion)
      .min(1, "at least one question is required"),
  })
  .refine(
    (data) =>
      Boolean(data.liveAt) === Boolean(data.closeAt) &&
      data.liveAt &&
      data.closeAt &&
      data.closeAt > data.liveAt,
    { error: "invalid live and close time" }
  );

export const updateQuiz = createQuiz.omit({ questions: true }).partial();
export type CreateQuiz = z.infer<typeof createQuiz>;
export type UpdateQuiz = z.infer<typeof updateQuiz>;
