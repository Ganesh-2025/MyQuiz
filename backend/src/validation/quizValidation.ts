import z, { coerce } from "zod";
import { quizSchema } from "./schemas.js";
import globalSchema from "./globalSchema.js";

export const createQuiz = z.object({
  title: quizSchema.title,
  description: quizSchema.description,
  password: quizSchema.password,
  timeLimitSec: coerce.number().pipe(quizSchema.timeLimitSec),
  passingScore: coerce.number().pipe(quizSchema.passingScore),
  totalMarks: coerce.number().pipe(quizSchema.passingScore),
  attempts: coerce.number().pipe(quizSchema.attempts),
  difficulty: quizSchema.difficulty,
  liveAt: quizSchema.liveAt,
  closeAt: quizSchema.closeAt,
  negativeMarking: globalSchema.strOrBool.pipe(quizSchema.negativeMarking),
  shuffle: globalSchema.strOrBool.pipe(quizSchema.shuffle),
});

export const updateQuiz = createQuiz.partial();

export type CreateQuiz = z.infer<typeof createQuiz>;
export type UpdateQuiz = z.infer<typeof updateQuiz>;
