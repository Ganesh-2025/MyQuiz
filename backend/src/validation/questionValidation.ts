import z from "zod";
import { optionProps, questionProps } from "./schemas.js";
import {
  createOption,
  createOptions,
  optionsRefinements,
  updateOption,
  updateOptions,
} from "./optionValidation.js";
import { id } from "zod/locales";

export const createQuestion = z.object({
  questionNo: questionProps.questionNo,
  text: questionProps.text,
  marks: questionProps.marks,
  deduct: questionProps.deduct.default(0),
  options: createOptions,
});

export const updateQuestion = createQuestion
  .omit({ options: true })
  .partial()
  .extend({
    options: createOptions,
    // options: z
    //   .array(z.union([updateOption, createOption]))
    //   .refine(optionsRefinements, { error: "invalid options" })
    //   .transform((opts) => ({
    //     create: opts.filter((opt: any) => !opt.id),
    //     update: opts.filter((opt: any) => opt.id),
    // //   })),
    // optionsToDelete: z.array(optionProps.id).default([]),
  });
export type CreateQuestion = z.infer<typeof createQuestion>;
export type UpdateQuestion = z.infer<typeof updateQuestion>;
