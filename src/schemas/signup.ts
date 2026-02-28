import { z } from "zod";

const ALLOWED_EMAIL_DOMAINS = new Set([
  "d.umn.edu",
  "umn.edu",
  "stthomas.edu",
  "go.minnstate.edu",
]);

export const signupSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z
    .string()
    .email()
    .refine(
      (e) => {
        const domain = e.split("@")[1]?.toLowerCase();
        return domain ? ALLOWED_EMAIL_DOMAINS.has(domain) : false;
      },
      { message: "Use an email from d.umn.edu, umn.edu, stthomas.edu, or go.minnstate.edu" }
    ),
  password: z.string().min(8, "At least 8 characters"),
});
