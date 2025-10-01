import z, { negative } from "zod";
import { UserSchema } from "./schemas.js";
enum Difficulty {
  hard,
  medium,
  easy,
}
export const QuizSchema = z.object({
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
  password: UserSchema.pick({ password: true }),
  timeLimitSec: z.coerce.number().int().positive().min(10, "invalid time"),
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
});

export type Quiz = z.infer<typeof QuizSchema>;
