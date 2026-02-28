import { z } from "zod";
import { isValidSafeUrl } from "@/lib/urlValidation";

export const createPostSchema = z.object({
  content: z.string().min(1).max(5000).trim(),
  link: z.string().url().optional().or(z.literal("")),
  isAnonymous: z.boolean(),
});

export const createPostSchemaSafe = createPostSchema.refine(
  (data) => !data.link || isValidSafeUrl(data.link),
  { message: "Invalid or unsafe URL" }
);
