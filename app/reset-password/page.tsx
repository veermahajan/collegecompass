"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: form.get("password") }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "This reset link is invalid or has expired.");
      setSubmitting(false);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <p className="text-[0.95rem] text-ink-soft">
        This reset link is missing its token. Request a new one from the{" "}
        <Link href="/forgot-password" className="font-medium text-sage-deep">
          reset password page
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <p className="text-[0.95rem] text-ink-soft">
        Password updated. Redirecting you to log in…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
        New password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
      </label>

      {error && (
        <p className="text-[0.85rem] text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[440px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Set a new password</h1>
        <p className="mb-8 text-[0.95rem] text-ink-soft">
          Choose a new password for your account.
        </p>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}
