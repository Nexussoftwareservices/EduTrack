import { z } from "zod";

export const courseIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "Invalid course ID"),
});

export const courseIdResourceSchema = z.object({
  courseId: z.string().regex(/^\d+$/, "Invalid course ID"),
});
