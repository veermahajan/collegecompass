import { z } from "zod";

// Zod on every API route input, per spec Sec 8.
//
// `website` is the honeypot: a field real users never see or fill (see
// the feedback page's hidden input). Any non-empty value here means the
// submitter is a bot, not a human — spec B5 says reject silently, so
// this stays a normal, valid-shaped field rather than something that
// fails validation and gives a bot a distinguishable error response.

export const feedbackSubmissionSchema = z.object({
  message: z.string().min(1).max(5000),
  website: z.string().max(200).optional().default(""),
});
