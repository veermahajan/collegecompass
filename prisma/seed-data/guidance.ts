import type { GuidanceSectionSlug } from "../../lib/guidance-sections";

// Spec B2: "Founders edit GuidanceContent rows directly in code/seed data —
// no CMS needed." This file IS the CMS. To add or change a guidance item,
// edit this array only — nothing else needs to change for it to show up
// under /guidance once the DB is reseeded (npm run db:seed).
//
// `id` is a fixed slug (not the default cuid()) so re-running the seed
// upserts in place instead of creating duplicates.
//
// The entries below are placeholders, one per section, so the page has
// something to render and the pattern is obvious. Replace bodyMarkdown
// with actual founder-written advice before launch — this is meant to be
// in Geetansh/Veer's voice (spec Sec 1: recency and relatability), not
// generic copy, so it's deliberately left as a stub rather than written
// here. embedUrl is optional — omit it for a text-only item.
//
// Each item below already has a placeholder embedUrl wired up as a ready
// template: swap "REPLACE_WITH_YOUTUBE_ID" for the real YouTube video ID
// (or any other iframe-embeddable URL) and rewrite bodyMarkdown/title —
// no other code changes needed for the video to show up on /guidance.
// Delete the embedUrl line entirely on any item that should stay text-only.

export type GuidanceSeedItem = {
  id: string;
  section: GuidanceSectionSlug;
  title: string;
  embedUrl?: string;
  bodyMarkdown?: string;
  order: number;
};

export const GUIDANCE_CONTENT: GuidanceSeedItem[] = [
  {
    id: "rec-letters-1",
    section: "rec-letters",
    title: "How to ask for a strong recommendation letter",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own advice on rec letters.",
  },
  {
    id: "college-list-1",
    section: "college-list",
    title: "Building a college list that actually fits you",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own advice on building a list.",
  },
  {
    id: "reaches-targets-safeties-1",
    section: "reaches-targets-safeties",
    title: "What reach, target, and safety actually mean",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own advice on the three buckets.",
  },
  {
    id: "essays-1",
    section: "essays",
    title: "Starting a personal statement without a template",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own essay-writing advice.",
  },
  {
    id: "commonapp-1",
    section: "commonapp",
    title: "Walking through the CommonApp, section by section",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own CommonApp walkthrough.",
  },
  {
    id: "ed-rd-1",
    section: "ed-rd",
    title: "ED, EA, and RD — what's actually binding",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own ED/RD explainer.",
  },
  {
    id: "financial-aid-1",
    section: "financial-aid",
    title: "Reading a financial aid offer",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own financial aid advice.",
  },
  {
    id: "majors-1",
    section: "majors",
    title: "Choosing a major (or leaving it undeclared)",
    order: 1,
    embedUrl: "https://www.youtube.com/embed/REPLACE_WITH_YOUTUBE_ID",
    bodyMarkdown: "PLACEHOLDER — replace with your own advice on choosing majors.",
  },
];
