// Spec B5: "basic profanity/spam keyword filter flags for manual review,
// does not auto-publish anything." This never blocks a submission — it
// only sets flaggedForReview so founders can triage. Deliberately a small
// literal list, not a third-party moderation API: feedback isn't public
// content, so the bar here is "help a human skim faster," not perfect
// detection.

const FLAGGED_KEYWORDS = [
  "viagra",
  "crypto giveaway",
  "click here",
  "free money",
  " seo services",
  "bitcoin investment",
  "work from home opportunity",
];

export function containsFlaggedKeyword(message: string): boolean {
  const lower = message.toLowerCase();
  return FLAGGED_KEYWORDS.some((keyword) => lower.includes(keyword));
}
