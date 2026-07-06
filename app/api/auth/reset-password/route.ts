import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";
import { hashToken } from "@/lib/tokens";

export async function POST(request: Request) {
  const ip = hashIp(getClientIp(request));
  const invalidResponse = () =>
    NextResponse.json(
      { error: "This reset link is invalid or has expired." },
      { status: 400 }
    );

  if (!checkRateLimit(`reset-password:${ip}`)) return invalidResponse();

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return invalidResponse();

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt < new Date() ||
      resetToken.user.deletedAt
    ) {
      return invalidResponse();
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return invalidResponse();
  }
}
