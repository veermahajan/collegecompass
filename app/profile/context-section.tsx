"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Phase A4 — collects the raw input for the Compass Score's internal
// Context/socioeconomic subscore. Only rendered when the account already
// has consentSensitiveData from signup (see app/profile/page.tsx). This
// value is never shown back to the user as a score, per Sec 8 — the copy
// below says so explicitly, matching the one-sentence-summary rule used
// at signup.

const PARENTAL_EDUCATION_OPTIONS = [
  { value: "no-high-school", label: "Did not finish high school" },
  { value: "high-school", label: "High school diploma or GED" },
  { value: "some-college", label: "Some college, no degree" },
  { value: "bachelors-or-higher", label: "Bachelor's degree or higher" },
];

const FINANCIAL_AID_OPTIONS = [
  { value: "full-financial-need", label: "Expect to need full financial aid" },
  { value: "some-financial-need", label: "Expect to need some financial aid" },
  { value: "no-financial-need", label: "Do not expect to need financial aid" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function ContextSection({ hasConsent }: { hasConsent: boolean }) {
  const [hasContextInput, setHasContextInput] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  useEffect(() => {
    if (!hasConsent) return;
    fetch("/api/profile/context")
      .then((res) => res.json())
      .then((data) => setHasContextInput(Boolean(data?.hasContextInput)))
      .catch(() => setHasContextInput(false));
  }, [hasConsent]);

  if (!hasConsent) {
    return (
      <Card className="mb-10">
        <CardTitle>Background context</CardTitle>
        <CardBody>
          You didn&apos;t opt in to sensitive-data collection at signup, so
          this section is off. It only ever factors into internal scoring
          logic and is never shown back to you as a visible number — if
          you&apos;d like to turn it on, contact us.
        </CardBody>
      </Card>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const form = new FormData(event.currentTarget);
    const body = {
      parentalEducationLevel: form.get("parentalEducationLevel"),
      financialAidStatus: form.get("financialAidStatus"),
    };
    try {
      const res = await fetch("/api/profile/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setHasContextInput(true);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card className="mb-10">
      <CardTitle>Background context</CardTitle>
      <CardBody className="mb-4">
        This is never shown back to you as a visible score — it only
        factors into internal scoring logic (Sec 8). It&apos;s encrypted
        before it&apos;s stored and only ever decrypted inside the scoring
        computation itself.
      </CardBody>

      {hasContextInput && (
        <p className="mb-4 text-[0.85rem] text-ink-soft">
          Saved. Submitting again replaces the previous answer.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
          Parent/guardian education level
          <select
            name="parentalEducationLevel"
            required
            defaultValue=""
            className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          >
            <option value="" disabled>
              Select one
            </option>
            {PARENTAL_EDUCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
          Financial aid expectation
          <select
            name="financialAidStatus"
            required
            defaultValue=""
            className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          >
            <option value="" disabled>
              Select one
            </option>
            {FINANCIAL_AID_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {status === "error" && (
          <p className="text-[0.85rem] text-red-700" role="alert">
            Something went wrong. Try again.
          </p>
        )}

        <Button type="submit" disabled={status === "submitting"} className="mt-2">
          {status === "submitting" ? "Saving…" : "Save"}
        </Button>
      </form>
    </Card>
  );
}
