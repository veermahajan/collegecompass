import { randomBytes, createHash } from "node:crypto";

// Raw token goes in the emailed link only; the DB stores just the hash,
// same pattern as ipHash on FeedbackSubmission (spec Sec 8).

export function generateResetToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString("hex");
  return { raw, hash: hashToken(raw) };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
