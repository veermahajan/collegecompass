import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { ensureProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { contextInputSchema } from "@/lib/validations/profile";
import { encryptJson } from "@/lib/encryption";

// Phase A4 — collects the raw input for the Compass Score engine's
// Context/socioeconomic subscore. Requires the user to have already
// checked consentSensitiveData at signup (Sec 8) — this endpoint does not
// grant consent itself. The value is encrypted before it ever reaches
// Postgres and is never echoed back in plaintext: GET only reports
// whether a value is set, never what it is.

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const profile = await prisma.academicProfile.findUnique({
    where: { userId },
    select: { contextInputEncrypted: true },
  });

  return NextResponse.json({
    hasContextInput: Boolean(profile?.contextInputEncrypted),
  });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { consentSensitiveData: true },
  });
  if (!user?.consentSensitiveData) {
    return NextResponse.json(
      { error: "Sensitive-data consent has not been given for this account." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contextInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const profile = await ensureProfile(userId);
  const contextInputEncrypted = encryptJson(parsed.data);

  await prisma.academicProfile.update({
    where: { id: profile.id },
    data: { contextInputEncrypted },
  });

  return NextResponse.json({ ok: true, hasContextInput: true });
}
