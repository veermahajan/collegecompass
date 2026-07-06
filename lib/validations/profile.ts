import { z } from "zod";
import { COURSE_LEVELS } from "@/lib/gpa";

// Phase A2 — spec Sec 8: zod on every API route input.

export const courseSchema = z.object({
  name: z.string().trim().min(1).max(150),
  level: z.enum(COURSE_LEVELS as [string, ...string[]]),
  gradeReceived: z.string().trim().min(1).max(5),
});

export type CourseInput = z.infer<typeof courseSchema>;

export const extracurricularSchema = z.object({
  title: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(100),
  hoursPerWeek: z.number().min(0).max(168),
  weeksPerYear: z.number().int().min(0).max(52),
  description: z.string().trim().max(2000),
});

export type ExtracurricularInput = z.infer<typeof extracurricularSchema>;

export const honorSchema = z.object({
  title: z.string().trim().min(1).max(150),
  level: z.enum(["school", "regional", "state", "national", "international"]),
  year: z.number().int().min(1990).max(2100),
});

export type HonorInput = z.infer<typeof honorSchema>;

// Manual override of computed fields, plus test scores.
export const profilePatchSchema = z.object({
  unweightedGpa: z.number().min(0).max(5).nullable().optional(),
  ucWeightedGpa: z.number().min(0).max(5).nullable().optional(),
  satScore: z.number().int().min(400).max(1600).nullable().optional(),
  actScore: z.number().int().min(1).max(36).nullable().optional(),
});

export type ProfilePatchInput = z.infer<typeof profilePatchSchema>;
