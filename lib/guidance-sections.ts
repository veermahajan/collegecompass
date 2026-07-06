// Spec B2: the fixed list of guidance sections. This is the one place
// that defines which sections exist and the order they render in — the
// content *within* a section lives in prisma/seed-data/guidance.ts and
// doesn't require touching this file.

export const GUIDANCE_SECTIONS = [
  { slug: "rec-letters", label: "Recommendation Letters" },
  { slug: "college-list", label: "Building a College List" },
  { slug: "reaches-targets-safeties", label: "Reaches, Targets & Safeties" },
  { slug: "essays", label: "Essay Tips" },
  { slug: "commonapp", label: "The CommonApp Process" },
  { slug: "ed-rd", label: "ED / RD" },
  { slug: "financial-aid", label: "Financial Aid" },
  { slug: "majors", label: "Choosing a Major" },
] as const;

export type GuidanceSectionSlug = (typeof GUIDANCE_SECTIONS)[number]["slug"];
