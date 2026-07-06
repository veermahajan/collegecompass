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

// Phase B6 — contact form notification (spec Sec 6, Workflow B). Notifies
// founders directly so a message doesn't sit unseen; respondedAt (set
// separately, once a founder replies) is how they track what's still
// outstanding. Same sandbox-sender caveat as above: until a verified
// domain exists, this can only deliver to the Resend account's own email.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessageNotification(fromEmail: string, message: string) {
  const notifyTo = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!notifyTo) {
    console.warn(
      "CONTACT_NOTIFICATION_EMAIL is not set — skipping contact notification email."
    );
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: [notifyTo],
    replyTo: fromEmail,
    subject: "New Compass contact message",
    html: `
      <p><strong>From:</strong> ${escapeHtml(fromEmail)}</p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
