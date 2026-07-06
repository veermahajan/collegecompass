"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { SiteNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    if (!result || result.error) {
      // Deliberately generic — never confirm whether the email exists.
      setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[440px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Log in</h1>
        <p className="mb-8 text-[0.95rem] text-ink-soft">
          Welcome back.
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

          <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
            Password
            <input
              type="password"
              name="password"
              required
              className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            />
          </label>

          <Link
            href="/forgot-password"
            className="-mt-2 self-end text-[0.85rem] font-medium text-sage-deep"
          >
            Forgot password?
          </Link>

          {error && (
            <p className="text-[0.85rem] text-red-700" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-[0.9rem] text-ink-soft">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-sage-deep">
            Sign up
          </Link>
        </p>
      </main>
    </>
  );
}
