"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    }).catch(() => {});

    // Always show the same confirmation, whether or not the email exists.
    setSent(true);
    setSubmitting(false);
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[440px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Reset your password</h1>

        {sent ? (
          <p className="text-[0.95rem] text-ink-soft">
            If an account exists for that email, we&apos;ve sent a link to
            reset your password. It expires in 1 hour.
          </p>
        ) : (
          <>
            <p className="mb-8 text-[0.95rem] text-ink-soft">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
                />
              </label>
              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-[0.9rem] text-ink-soft">
          <Link href="/login" className="font-medium text-sage-deep">
            Back to log in
          </Link>
        </p>
      </main>
    </>
  );
}
