// Phase A2 — GPA and rigor calculation.
//
// This is a transparent approximation, not an official UC or
// school-specific calculation. Two things it doesn't do that a real
// UC GPA calculation does: (1) restrict to 10th/11th grade courses,
// (2) cap bonus points at 8 semesters using per-semester course
// records. Our schema stores one row per course with no year or
// semester field, so we approximate the UC "bonus point per honors
// course" convention as a bonus proportional to the share of
// advanced-level courses, capped at 8 courses' worth of bonus.
// unweightedGpa / ucWeightedGpa are recalculated on every course
// mutation but can be manually overridden via PATCH /api/profile —
// that override holds until the next course add/edit/delete, which
// recalculates and replaces it.

export type CourseLevel =
  | "Regular"
  | "Honors"
  | "AP"
  | "IB"
  | "DualEnrollment";

export const COURSE_LEVELS: CourseLevel[] = [
  "Regular",
  "Honors",
  "AP",
  "IB",
  "DualEnrollment",
];

const ADVANCED_LEVELS: ReadonlySet<string> = new Set([
  "Honors",
  "AP",
  "IB",
  "DualEnrollment",
]);

const RIGOR_POINTS_BY_LEVEL: Record<CourseLevel, number> = {
  Regular: 1.0,
  Honors: 1.5,
  AP: 2.0,
  IB: 2.0,
  DualEnrollment: 2.0,
};

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0,
};

export function isKnownLevel(level: string): level is CourseLevel {
  return level in RIGOR_POINTS_BY_LEVEL;
}

export function rigorPointsForLevel(level: string): number {
  return RIGOR_POINTS_BY_LEVEL[level as CourseLevel] ?? 1.0;
}

export function gradePointsForGrade(grade: string): number | null {
  const points = GRADE_POINTS[grade.trim().toUpperCase()];
  return points === undefined ? null : points;
}

type CourseForGpa = { level: string; gradeReceived: string };

const MAX_BONUS_COURSES = 8;
const BONUS_PER_COURSE = 1.0;

export function computeGpas(courses: CourseForGpa[]): {
  unweightedGpa: number | null;
  ucWeightedGpa: number | null;
} {
  const graded = courses
    .map((c) => gradePointsForGrade(c.gradeReceived))
    .filter((p): p is number => p !== null);

  if (graded.length === 0) {
    return { unweightedGpa: null, ucWeightedGpa: null };
  }

  const unweightedGpa =
    Math.round((graded.reduce((sum, p) => sum + p, 0) / graded.length) * 100) /
    100;

  const advancedCount = courses.filter((c) =>
    ADVANCED_LEVELS.has(c.level)
  ).length;
  const bonus =
    (Math.min(advancedCount, MAX_BONUS_COURSES) * BONUS_PER_COURSE) /
    courses.length;
  const ucWeightedGpa = Math.round((unweightedGpa + bonus) * 100) / 100;

  return { unweightedGpa, ucWeightedGpa };
}
