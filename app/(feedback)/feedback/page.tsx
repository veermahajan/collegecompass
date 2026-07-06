"use client";

import { useState } from "react";
import { SiteNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

// Phase B5 — Feedback Box (spec Sec 6, Workflow B). Anonymous-friendly:
// no login required to submit. Spam defenses (honeypot, rate limit,
// keyword flag) live server-side in app/api/feedback/route.ts — this
// page's only job is to render the hidden honeypot field correctly and
// never reveal to a submitter whether they tripped it.

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const form = new FormData(event.currentTarget);
    const body = {
      message: form.get("message"),
      website: form.get("website"),
    };

    try {
      const res = await fetch("/api/feedback", {
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
        setError("Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("done");
      setMessage("");
    } catch {
      setError("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[560px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Tell us what&apos;s not working</h1>
        <p className="mb-8 text-[0.95rem] text-ink-soft">
          Short and specific is great. This goes straight to the people
          building Compass, not a ticket queue.
        </p>

        {status === "done" ? (
          <p className="rounded-xl border border-line bg-white p-4 text-[0.95rem] text-ink">
            Thanks — we read every one of these.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
              Your feedback
              <textarea
                name="message"
                required
                maxLength={5000}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
              />
            </label>

            {/* Honeypot: hidden from sighted users and assistive tech,
                out of tab order. Real users never touch this. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
            />

            {error && (
              <p className="text-[0.85rem] text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={status === "submitting"} className="mt-2 w-full">
              {status === "submitting" ? "Sending…" : "Send feedback"}
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
