import { Resend } from "resend";

// Phase A1 — password reset email.
// No custom domain verified yet: sender is Resend's sandbox address,
// which can only deliver to the email the Resend account was created
// with. Swap FROM to a verified domain address once one exists.

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Compass <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Reset your Compass password",
    html: `
      <p>Someone requested a password reset for this Compass account.</p>
      <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
}
