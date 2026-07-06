"use client";

import { useState } from "react";
import { SiteNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

// Phase B6 — Direct Communication Channel (spec Sec 6, Workflow B).
// Spec calls this out explicitly: the copy has to make clear a real
// person reads this, not a support bot or a ticket queue — that's the
// differentiator, so don't undersell it.

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(event.currentTarget);
    const body = {
      fromEmail: form.get("fromEmail"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 429) {
        setError("You've sent a few of these already — try again in a bit.");
        setStatus("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setError("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[560px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Talk to an actual person</h1>
        <p className="mb-8 text-[0.95rem] text-ink-soft">
          This reaches the students building Compass directly — not a bot,
          not a support queue that goes nowhere. Ask a real question, get a
          real answer.
        </p>

        {status === "done" ? (
          <p className="rounded-xl border border-line bg-white p-4 text-[0.95rem] text-ink">
            Got it — we&apos;ll reply to the email you gave us.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
              Your email
              <input
                type="email"
                name="fromEmail"
                required
                className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
              What&apos;s up?
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={6}
                className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              />
            </label>

            {error && (
              <p className="text-[0.85rem] text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={status === "submitting"} className="mt-2 w-full">
              {status === "submitting" ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
