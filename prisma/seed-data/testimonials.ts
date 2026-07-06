// Spec B4: testimonials from recent grads, one concrete tip each. Same
// pattern as guidance.ts / essays.ts — this file IS the source of truth.
// Add/edit an entry here, re-run `npm run db:seed`.
//
// `approved` gates visibility (spec B4 checklist) and stays false until
// two things happen, both manual and outside this codebase:
//   1. Written consent from the contributor to publish their name + quote
//   2. A founder reviews the entry and flips it to true
// Every placeholder below starts unapproved for that reason — there is
// no contributor and no consent yet.
//
// `id` is a fixed slug so re-seeding upserts in place instead of
// duplicating rows.

export type TestimonialSeedItem = {
  id: string;
  graduateName: string;
  schoolAdmitted: string;
  quote: string;
  tipText: string;
  yearGraduated: number;
  approved: boolean;
};

export const TESTIMONIALS: TestimonialSeedItem[] = [
  {
    id: "testimonial-1",
    graduateName: "PLACEHOLDER — contributor name",
    schoolAdmitted: "PLACEHOLDER — school admitted to",
    quote: "PLACEHOLDER — replace with the contributor's actual quote.",
    tipText: "PLACEHOLDER — one concrete, specific tip, not generic advice.",
    yearGraduated: 2026,
    approved: false,
  },
];
