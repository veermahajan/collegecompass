"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";

// Phase A1 — signup form. Age gate (13+) and consent are separate,
// explicit, unchecked checkboxes per spec Sec 8; neither is implied
// by the other and neither is pre-checked.

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const body = {
      email: form.get("email"),
      password: form.get("password"),
      displayName: form.get("displayName"),
      gradeLevel: form.get("gradeLevel"),
      ageConfirmed13Plus: form.get("ageConfirmed13Plus") === "on",
      consentSensitiveData: form.get("consentSensitiveData") === "on",
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Account could not be created.");
        setSubmitting(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[440px] px-6 py-16">
        <h1 className="mb-2 text-3xl">Create your account</h1>
        <p className="mb-8 text-[0.95rem] text-ink-soft">
          Free, forever, for students who don&apos;t have access to a paid
          counselor.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email" name="email" type="email" required />
          <Field
            label="Password"
            name="password"
            type="password"
            required
            minLength={8}
          />
          <Field label="Full name" name="displayName" type="text" required />

          <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
            Grade level
            <select
              name="gradeLevel"
              required
              defaultValue=""
              className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
            >
              <option value="" disabled>
                Select grade
              </option>
              <option value="9">9th grade</option>
              <option value="10">10th grade</option>
              <option value="11">11th grade</option>
              <option value="12">12th grade</option>
            </select>
          </label>

          <label className="flex items-start gap-2.5 text-[0.85rem] text-ink-soft">
            <input
              type="checkbox"
              name="ageConfirmed13Plus"
              required
              className="mt-0.5"
            />
            I confirm that I am 13 years of age or older.
          </label>

          <label className="flex items-start gap-2.5 text-[0.85rem] text-ink-soft">
            <input
              type="checkbox"
              name="consentSensitiveData"
              className="mt-0.5"
            />
            I consent to Compass storing sensitive profile data I choose to
            add (optional, can be changed later).
          </label>

          {error && (
            <p className="text-[0.85rem] text-red-700" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="mt-2 w-full">
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-[0.9rem] text-ink-soft">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-sage-deep">
            Log in
          </Link>
        </p>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  type,
  required,
  minLength,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
      {label}
      <input
        type={type}
        name={name}
        required={required}
        minLength={minLength}
        className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
      />
    </label>
  );
}
