import { z } from "zod";

// Phase A1 — spec Sec 8: Zod-validate every input before Prisma sees it.

const email = z.string().trim().toLowerCase().email().max(254);

// Length bounds only — no complexity rules (those hurt more than they help
// and are easy to route around with a password manager).
const password = z.string().min(8).max(200);

export const signupSchema = z.object({
  email,
  password,
  displayName: z.string().trim().min(1).max(100),
  gradeLevel: z.enum(["9", "10", "11", "12"]),
  ageConfirmed13Plus: z.literal(true, {
    message: "You must confirm you are 13 years of age or older.",
  }),
  consentSensitiveData: z.boolean().default(false),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(200),
});

export type LoginInput = z.infer<typeof loginSchema>;
