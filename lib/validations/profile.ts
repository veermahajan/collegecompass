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

// Rigor/selectivity on a 1-10 gradient — see lib/rigor-scale.ts for the
// full level guide (1 = AP Scholar-tier, 6 = AIME, 8 = USAJMO, 9 = MOSP,
// 10 = IMO) and sample activity table.
export const honorSchema = z.object({
  title: z.string().trim().min(1).max(150),
  level: z.number().int().min(1).max(10),
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

// Phase A4 — raw input for the Compass Score engine's Context/socioeconomic
// subscore. Requires the user to have already checked consentSensitiveData
// at signup (Sec 8); enforced in app/api/profile/context/route.ts, not here.
// Encrypted immediately on write (lib/encryption.ts) — never stored or
// returned in plaintext.
export const CONTEXT_PARENTAL_EDUCATION_LEVELS = [
  "no-high-school",
  "high-school",
  "some-college",
  "bachelors-or-higher",
] as const;

export const CONTEXT_FINANCIAL_AID_STATUSES = [
  "full-financial-need",
  "some-financial-need",
  "no-financial-need",
  "prefer-not-to-say",
] as const;

export const contextInputSchema = z.object({
  parentalEducationLevel: z.enum(CONTEXT_PARENTAL_EDUCATION_LEVELS),
  financialAidStatus: z.enum(CONTEXT_FINANCIAL_AID_STATUSES),
});

export type ContextInput = z.infer<typeof contextInputSchema>;
