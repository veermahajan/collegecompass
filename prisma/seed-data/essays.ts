// Spec B3: essay examples + founder breakdowns, categorized by field of
// interest. Same pattern as prisma/seed-data/guidance.ts — this file IS
// the source of truth. Add/edit an example here, re-run `npm run db:seed`.
//
// `fieldOfInterest` is free text, not a fixed enum (unlike guidance's
// sections) — students' interests aren't a closed list. The /essays page
// groups whatever distinct values show up here, sorted alphabetically.
//
// `published` gates visibility (spec B3 checklist). Every entry below
// starts unpublished: essayText/breakdown are placeholders, and real
// student essays need explicit permission before publishing. Flip to
// `true` only once the content is real and consent is confirmed.
//
// `id` is a fixed slug so re-seeding upserts in place instead of
// duplicating rows.

export type EssaySeedItem = {
  id: string;
  fieldOfInterest: string;
  essayText: string;
  breakdown: string;
  published: boolean;
};

export const ESSAY_EXAMPLES: EssaySeedItem[] = [
  {
    id: "essay-computer-science-1",
    fieldOfInterest: "Computer Science",
    essayText: "PLACEHOLDER — paste a real student essay here before publishing.",
    breakdown: "PLACEHOLDER — explain what worked and what fell short.",
    published: false,
  },
  {
    id: "essay-biology-premed-1",
    fieldOfInterest: "Biology / Pre-Med",
    essayText: "PLACEHOLDER — paste a real student essay here before publishing.",
    breakdown: "PLACEHOLDER — explain what worked and what fell short.",
    published: false,
  },
  {
    id: "essay-undecided-1",
    fieldOfInterest: "Undecided / Exploratory",
    essayText: "PLACEHOLDER — paste a real student essay here before publishing.",
    breakdown: "PLACEHOLDER — explain what worked and what fell short.",
    published: false,
  },
];
