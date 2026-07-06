"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function DeleteAccountForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong.");
      setSubmitting(false);
      return;
    }

    await signOut({ redirect: false });
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
        Password
        <input
          type="password"
          name="password"
          required
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
      </label>

      {error && (
        <p className="text-[0.85rem] text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="ghost"
        disabled={submitting}
        className="border-red-300 text-red-700 hover:border-red-700"
      >
        {submitting ? "Deleting…" : "Delete my account"}
      </Button>
    </form>
  );
}
