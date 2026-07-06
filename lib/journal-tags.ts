// Spec B1: tagging is essay-draft / story-idea / accomplishment-log.
// Single source of truth — API validation and the editor UI both import
// this instead of redeclaring the list.

export const JOURNAL_TAGS = [
  "essay-draft",
  "story-idea",
  "accomplishment-log",
] as const;

export type JournalTag = (typeof JOURNAL_TAGS)[number];

export const JOURNAL_TAG_LABELS: Record<JournalTag, string> = {
  "essay-draft": "Essay draft",
  "story-idea": "Story idea",
  "accomplishment-log": "Accomplishment log",
};
