import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().refine((e) => e.endsWith(".edu"), "Use a .edu email"),
  password: z.string().min(8, "At least 8 characters"),
});
