import { z } from "zod";
import { JOURNAL_TAGS } from "@/lib/journal-tags";

// Zod on every API route input, per spec Sec 8 — no raw request body
// hits Prisma directly.

export const journalTagSchema = z.enum(JOURNAL_TAGS).nullable();

export const createJournalEntrySchema = z.object({
  title: z.string().max(200).default(""),
  body: z.string().max(200_000).default(""),
  tag: journalTagSchema.default(null),
});

export const updateJournalEntrySchema = z.object({
  title: z.string().max(200).optional(),
  body: z.string().max(200_000).optional(),
  tag: journalTagSchema.optional(),
});
