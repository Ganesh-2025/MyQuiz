import z from "zod";
import { optionProps } from "./schemas.js";

export const optionSchema = z.object({
  id: optionProps.id,
  optionNo: optionProps.optionNo,
  text: optionProps.text,
  isAnswer: optionProps.isAnswer,
});

// const optionsRefinements = (array: z.ZodArray<any>) =>
//   array
//     .refine(
//       (opts) => opts.length === new Set(opts.map((opt) => opt.optionNo)).size,
//       {
//         message: "Option numbers must be unique",
//       }
//     )
//     .refine((opts) => opts.length >= 2, {
//       message: "At least two options are required",
//     })
//     .refine((opts) => opts.some((opt) => opt.isAnswer), {
//       message: "At least one option must be correct",
//     });
export function optionsRefinements(opts: Array<any>): boolean {
  return (
    opts.length >= 2 &&
    opts.length === new Set(opts.map((opt) => opt.optionNo)).size &&
    opts.some((opt) => opt.isAnswer)
  );
}
export const createOption = optionSchema.omit({ id: true });
export const updateOption = createOption
  .partial()
  .extend({ id: optionProps.id });

export const createOptions = z
  .array(optionSchema.omit({ id: true }))
  .refine(optionsRefinements, { error: "invalid options" });
export const updateOptions = z
  .array(optionSchema.partial())
  .refine(optionsRefinements, { error: "invalid options" });
