import { z } from "zod";

export const updateStudentProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(8).max(15).optional(),
  password: z.string().min(6).max(100).optional(),
});

export type UpdateStudentProfileInput = z.infer<
  typeof updateStudentProfileSchema
>;
