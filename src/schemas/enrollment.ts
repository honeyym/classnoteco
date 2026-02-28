import { z } from "zod";
import { courses } from "@/data/mockData";

const VALID_COURSE_IDS = new Set(courses.map((c) => c.id));

export const courseIdSchema = z
  .string()
  .min(1, "Course ID required")
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid course ID format")
  .refine((id) => VALID_COURSE_IDS.has(id), "Unknown course");
