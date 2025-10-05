import z from "zod";
import { quizProps } from "./schemas.js";

const ALLOWED_SORT = new Set([
  "title",
  "difficulty",
  "live",
  "negativeMarking",
  "timeLimitSec",
]);
const browseQuizesReqProps = {
  title: z.string(),
  live: z.boolean(),
  difficulty: quizProps.difficulty,
  negativeMarking: quizProps.negativeMarking,
  sort: z
    .string()
    .transform((arg) => {
      return arg
        .trim()
        .split(",")
        .map((arg) => {
          arg = arg.trim();
          const dir = arg.startsWith("-") ? "desc" : "asc";
          const val = dir === "desc" ? arg.slice(1) : arg;
          if (ALLOWED_SORT.has(val)) return { val: dir };
          return null;
        })
        .filter(Boolean)
        .reduce((pre, cur) => ({ ...pre, ...cur }), {});
    })
    .pipe(
      z.record(
        z.enum([...ALLOWED_SORT] as const),
        z.enum(["desc", "asc"] as const)
      )
    ),
  skip: z.coerce.number().positive(),
  take: z.coerce.number().min(1),
};

export const browseQuizesReqSchema = z.object(browseQuizesReqProps).partial();
export type BrowseQuizezReq = z.infer<typeof browseQuizesReqSchema>;
