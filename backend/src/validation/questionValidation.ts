import z from "zod";
import { optionProps, questionProps } from "./schemas.js";

export const createQuestion = z.object({
  questionNo: questionProps.questionNo,
  text: questionProps.text,
  marks: questionProps.marks,
  deduct: questionProps.deduct.default(0),
  options: z
    .array(
      z.object({
        optionNo: optionProps.optionNo,
        text: optionProps.text,
        isAnswer: optionProps.isAnswer,
      })
    )
    .refine((opts) => opts.length === new Set(opts.keys()).size, {
      error: "Option numbers must be unique",
    })
    .refine((opts) => opts.length >= 2, {
      error: "At least two options are required",
    })
    .refine((opts) => opts.some((opt) => opt.isAnswer), {
      error: "At least one option must be correct",
    }),
});

export const updateQuestion = createQuestion
  .omit({ options: true })
  .partial()
  .extend({
    id: questionProps.id,
    options: z.array(z.object({})),
  });
export type CreateQuestion = z.infer<typeof createQuestion>;
export type UpdateQuestion = z.infer<typeof updateQuestion>;
