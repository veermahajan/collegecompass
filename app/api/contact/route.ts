import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validation/contact";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";
import { sendContactMessageNotification } from "@/lib/mail";

// POST /api/contact — spec B6. The DB row is the durable record; the
// notification email is best-effort (founders also see it by re-querying
// ContactMessage). A submission is never lost just because Resend hiccups.
//
// Rate-limited by hashed IP for the same reason as forgot-password and
// feedback: it's a public, unauthenticated endpoint that sends email.

const CONTACT_MAX_PER_HOUR = 5;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const ipHash = hashIp(getClientIp(request));
  if (!checkRateLimit(`contact:${ipHash}`, CONTACT_MAX_PER_HOUR, CONTACT_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { fromEmail, message } = parsed.data;

  const contactMessage = await prisma.contactMessage.create({
    data: { fromEmail, message },
  });

  try {
    await sendContactMessageNotification(fromEmail, message);
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }

  return NextResponse.json({ ok: true, id: contactMessage.id }, { status: 201 });
}
