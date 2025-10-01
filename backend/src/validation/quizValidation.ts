import z from "zod";
import { QuizSchema } from "./quizSchema.js";

const createQuiz = QuizSchema.pick({
  title: true,
  description: true,
  password: true,
  timeLimitSec: true,
  passingScore: true,
  totalMarks: true,
  attempts: true,
  difficulty: true,
  liveAt: true,
  closeAt: true,
});
