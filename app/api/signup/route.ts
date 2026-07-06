import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";

// Phase A1 — spec Sec 8: signup requires age gate (13+) + explicit
// unchecked consent box. Never confirm whether an email is already
// registered — generic error either way.

export async function POST(request: Request) {
  const ip = hashIp(getClientIp(request));
  if (!checkRateLimit(`signup:${ip}`)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password, displayName, gradeLevel, consentSensitiveData } =
    parsed.data;

  const genericFailure = () =>
    NextResponse.json(
      { error: "Account could not be created." },
      { status: 400 }
    );

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return genericFailure();

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        gradeLevel,
        ageConfirmed13Plus: true,
        consentSensitiveData,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return genericFailure();
  }
}
