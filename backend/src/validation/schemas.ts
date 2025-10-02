import { z } from "zod";
import globalSchema from "./globalSchema.js";

const Difficulty = ["easy", "medium", "hard"] as const;

export const userSchema = {
  id: globalSchema.id,
  name: z
    .string()
    .trim()
    .min(1, "must have at least one character")
    .max(100, "character length exceed"),
  email: z.email().trim(),
  password: globalSchema.password,
};

export const quizSchema = {
  id: globalSchema.id,
  title: z
    .string()
    .trim()
    .min(1, "title required")
    .max(100, "title size exceed"),
  description: z
    .string()
    .trim()
    .min(1, "description required")
    .max(500, "description size exceed"),
  password: globalSchema.password,
  timeLimitSec: z.number().int().positive().min(10, "invalid time"),
  passingScore: z.number().gt(1, "invalid passing score"),
  totalMarks: z.number().gt(1, "invalid total marks"),
  attempts: z.number().gt(0, "invalid value"),
  difficulty: z.enum(Difficulty, "invalid value"),
  liveAt: z.date(),
  closeAt: z.date(),
  negativeMarking: z.boolean(),
  shuffle: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
};
