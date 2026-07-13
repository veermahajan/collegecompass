import { prisma } from "@/lib/prisma";
import { encryptJson, decryptJson } from "@/lib/encryption";
import type { ContextInput } from "@/lib/validations/profile";
import { toVisibleScores } from "@/lib/compass-score-serializer";
import type { VisibleCompassScores } from "@/lib/compass-score-serializer";
export type { VisibleCompassScores };

// Phase A4 — Compass Score engine (spec Sec 8 + A4 checklist).
//
// Five subscores are computed here. Four are visible to the user
// (Academics, Honors, Extracurriculars, Essays). The fifth (Context /
// socioeconomic) is computed and stored but is a **hard rule, not a style
// preference**: it must never leave this file in decrypted form, never be
// returned by any API route, and never be logged. toVisibleScores (in
// lib/compass-score-serializer.ts, kept dependency-free on purpose — see
// that file) is the ONLY function permitted to shape a client-facing
// payload, and it is structurally incapable of including context because
// VisibleCompassScores has no such field. scripts/verify-compass-score-serializer.ts
// calls that exact function with a row that has a live context value set,
// and fails the build if it ever leaks through.

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ---- Academics (0-100) ----
// Treats a 5.0 UC-weighted GPA as the practical ceiling (unweighted 4.0 +
// the max rigor bonus of ~1.0 that lib/gpa.ts's computeGpas can produce).
// Falls back to unweighted GPA if no weighted value exists yet (e.g. a
// profile with no courses added), and to 0 if neither exists.
const ACADEMICS_GPA_CEILING = 5.0;

function computeAcademicsScore(profile: {
  ucWeightedGpa: number | null;
  unweightedGpa: number | null;
}): number {
  const gpa = profile.ucWeightedGpa ?? profile.unweightedGpa ?? 0;
  return Math.round(clamp((gpa / ACADEMICS_GPA_CEILING) * 100, 0, 100));
}

// ---- Honors (0-100) ----
// Additive by rigor level (1-10, see lib/rigor-scale.ts), capped at 100.
// Points scale convexly rather than linearly — the gap between adjacent
// levels widens as level increases — so that one top-tier honor (e.g. a
// 10, IMO-caliber) plus a single other solid honor already nears the cap,
// while a handful of low-barrier honors (1-2s) can't stack up to the same
// total. Intentionally saturating: a couple of high-rigor honors should
// max the subscore rather than requiring dozens of entries to do so.
const HONOR_POINTS_BY_LEVEL: Record<number, number> = {
  1: 3,
  2: 5,
  3: 8,
  4: 12,
  5: 17,
  6: 23,
  7: 30,
  8: 38,
  9: 47,
  10: 60,
};

function computeHonorsScore(honors: { level: number }[]): number {
  const total = honors.reduce(
    (sum, h) => sum + (HONOR_POINTS_BY_LEVEL[h.level] ?? 0),
    0
  );
  return Math.round(clamp(total, 0, 100));
}

// ---- Extracurriculars (0-100) ----
// commitmentScore: total annual hours (hoursPerWeek * weeksPerYear, summed
// across entries) scaled against 500 hours/year (~10 hrs/week across a
// full school year) as a "heavily involved" benchmark, worth up to 80 of
// the 100 points.
// diversityBonus: up to 20 points for breadth across distinct categories
// (capped at 4 categories), since depth in one activity and breadth
// across several are both legitimate profiles.
const EXTRACURRICULAR_ANNUAL_HOURS_BENCHMARK = 500;
const EXTRACURRICULAR_COMMITMENT_WEIGHT = 80;
const EXTRACURRICULAR_DIVERSITY_CATEGORY_CAP = 4;
const EXTRACURRICULAR_DIVERSITY_POINTS_PER_CATEGORY = 5;

function computeExtracurricularsScore(
  entries: { category: string; hoursPerWeek: number; weeksPerYear: number }[]
): number {
  const totalAnnualHours = entries.reduce(
    (sum, e) => sum + e.hoursPerWeek * e.weeksPerYear,
    0
  );
  const commitmentScore = clamp(
    (totalAnnualHours / EXTRACURRICULAR_ANNUAL_HOURS_BENCHMARK) *
      EXTRACURRICULAR_COMMITMENT_WEIGHT,
    0,
    EXTRACURRICULAR_COMMITMENT_WEIGHT
  );
  const distinctCategories = new Set(
    entries.map((e) => e.category.trim().toLowerCase()).filter(Boolean)
  ).size;
  const diversityBonus =
    Math.min(distinctCategories, EXTRACURRICULAR_DIVERSITY_CATEGORY_CAP) *
    EXTRACURRICULAR_DIVERSITY_POINTS_PER_CATEGORY;
  return Math.round(clamp(commitmentScore + diversityBonus, 0, 100));
}

// ---- Essays (0-100) ----
// This is an engagement proxy, not a quality judgment — Compass cannot and
// does not assess essay quality. It reads word count and entry count from
// JournalEntry rows tagged "essay-draft" (Workflow B-owned model; this is
// a read-only cross-workflow query, no migration touches JournalEntry).
// 3000 words is treated as a solid-output benchmark (roughly a personal
// statement plus a handful of supplements), worth up to 70 of 100 points.
// Up to 5 distinct draft entries add 6 points each (30 max), rewarding
// iteration across multiple pieces over one long draft.
const ESSAY_WORD_COUNT_BENCHMARK = 3000;
const ESSAY_WORD_COUNT_WEIGHT = 70;
const ESSAY_ENTRY_COUNT_CAP = 5;
const ESSAY_POINTS_PER_ENTRY = 6;

function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

function computeEssaysScore(essayDraftEntries: { body: string }[]): number {
  const totalWords = essayDraftEntries.reduce(
    (sum, entry) => sum + countWords(entry.body),
    0
  );
  const wordScore = clamp(
    (totalWords / ESSAY_WORD_COUNT_BENCHMARK) * ESSAY_WORD_COUNT_WEIGHT,
    0,
    ESSAY_WORD_COUNT_WEIGHT
  );
  const entryBonus =
    Math.min(essayDraftEntries.length, ESSAY_ENTRY_COUNT_CAP) *
    ESSAY_POINTS_PER_ENTRY;
  return Math.round(clamp(wordScore + entryBonus, 0, 100));
}

// ---- Context / socioeconomic (0-100, SERVER-SIDE ONLY, never displayed) ----
// A heuristic weighting, not a judgment of the student. It exists solely
// to inform a future internal composite for college-list nuance (e.g.
// prioritizing need-blind schools) once Phase A3 wires it in — it is
// computed and stored now but not yet consumed anywhere. Higher score =
// more socioeconomic context to weigh in that future nuance, not "better"
// or "worse." Never included in any type returned to a client — see
// VisibleCompassScores above, which has no field for this at all.
const PARENTAL_EDUCATION_POINTS: Record<string, number> = {
  "no-high-school": 60,
  "high-school": 40,
  "some-college": 20,
  "bachelors-or-higher": 0,
};

const FINANCIAL_AID_POINTS: Record<string, number> = {
  "full-financial-need": 40,
  "some-financial-need": 20,
  "no-financial-need": 0,
  "prefer-not-to-say": 0,
};

function computeContextScore(input: ContextInput | null): number {
  if (!input) return 0;
  const eduPoints = PARENTAL_EDUCATION_POINTS[input.parentalEducationLevel] ?? 0;
  const aidPoints = FINANCIAL_AID_POINTS[input.financialAidStatus] ?? 0;
  return Math.round(clamp(eduPoints + aidPoints, 0, 100));
}

/**
 * Computes all five subscores, persists the full row (context encrypted),
 * and returns ONLY the four visible ones. This is the sole entry point
 * API routes should call.
 */
export async function computeCompassScore(
  userId: string
): Promise<VisibleCompassScores> {
  const profile = await prisma.academicProfile.findUnique({
    where: { userId },
    include: { extracurriculars: true, honors: true },
  });

  const essayDraftEntries = await prisma.journalEntry.findMany({
    where: { userId, tag: "essay-draft" },
    select: { body: true },
  });

  const academicsScore = computeAcademicsScore({
    ucWeightedGpa: profile?.ucWeightedGpa ?? null,
    unweightedGpa: profile?.unweightedGpa ?? null,
  });
  const honorsScore = computeHonorsScore(profile?.honors ?? []);
  const extracurricularsScore = computeExtracurricularsScore(
    profile?.extracurriculars ?? []
  );
  const essaysScore = computeEssaysScore(essayDraftEntries);

  let contextInput: ContextInput | null = null;
  if (profile?.contextInputEncrypted) {
    contextInput = decryptJson<ContextInput>(profile.contextInputEncrypted);
  }
  const contextScore = computeContextScore(contextInput);
  const contextScoreEncrypted = encryptJson({ score: contextScore });

  const row = await prisma.compassScore.upsert({
    where: { userId },
    update: {
      academicsScore,
      honorsScore,
      extracurricularsScore,
      essaysScore,
      contextScoreEncrypted,
    },
    create: {
      userId,
      academicsScore,
      honorsScore,
      extracurricularsScore,
      essaysScore,
      contextScoreEncrypted,
    },
  });

  return toVisibleScores(row);
}
