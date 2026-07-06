import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { feedbackSubmissionSchema } from "@/lib/validation/feedback";
import { containsFlaggedKeyword } from "@/lib/spam-filter";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";

// POST /api/feedback — spec B5. Reuses lib/rate-limit.ts (built for
// login in Phase A1, but generic) rather than a second rate limiter.
//
// Order matters here:
//   1. Shape validation (Zod) — malformed requests fail normally.
//   2. Honeypot check — a filled `website` field means a bot. We still
//      return 201 with the same body a human gets; only the DB row
//      (honeypotTriggered: true) records the hit. Never let a bot learn
//      it was caught.
//   3. Rate limit — 5/hour per hashed IP (spec B5). This one IS a real,
//      visible rejection (429), unlike the honeypot.
//   4. Keyword filter — flags for manual review, never blocks the
//      submission itself.

const FEEDBACK_MAX_PER_HOUR = 5;
const FEEDBACK_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = feedbackSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const ipHash = hashIp(getClientIp(request));
  const userId = await getCurrentUserId();
  const { message, website } = parsed.data;

  if (website.trim() !== "") {
    await prisma.feedbackSubmission.create({
      data: {
        userId,
        message,
        ipHash,
        honeypotTriggered: true,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (!checkRateLimit(`feedback:${ipHash}`, FEEDBACK_MAX_PER_HOUR, FEEDBACK_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429 }
    );
  }

  const submission = await prisma.feedbackSubmission.create({
    data: {
      userId,
      message,
      ipHash,
      flaggedForReview: containsFlaggedKeyword(message),
    },
  });

  return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
}
