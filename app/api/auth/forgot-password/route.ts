import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";
import { generateResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// Spec Sec 8: rate-limit password reset by hashed IP. Always return the
// same generic response — never confirm whether the email is registered.

export async function POST(request: Request) {
  const ip = hashIp(getClientIp(request));
  const genericResponse = () =>
    NextResponse.json({
      message: "If an account exists for that email, a reset link was sent.",
    });

  if (!checkRateLimit(`forgot-password:${ip}`)) return genericResponse();

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) return genericResponse();

  const { email } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && !user.deletedAt) {
      const { raw, hash } = generateResetToken();
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hash,
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const resetUrl = new URL(
        `/reset-password?token=${raw}`,
        request.url
      ).toString();
      await sendPasswordResetEmail(user.email, resetUrl);
    }
  } catch {
    // Fall through to the generic response either way.
  }

  return genericResponse();
}
