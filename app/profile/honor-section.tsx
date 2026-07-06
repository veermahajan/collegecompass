"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HonorAward } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HONOR_LEVELS = [
  "school",
  "regional",
  "state",
  "national",
  "international",
] as const;

export function HonorSection({
  initialHonors,
}: {
  initialHonors: HonorAward[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const res = await fetch("/api/profile/honors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        level: data.get("level"),
        year: Number(data.get("year")),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not add honor.");
      setSubmitting(false);
      return;
    }

    form.reset();
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/profile/honors/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Card hover={false}>
      <h2 className="mb-4 font-display text-lg font-semibold">
        Honors &amp; awards
      </h2>

      <ul className="mb-5 flex flex-col gap-2">
        {initialHonors.length === 0 && (
          <li className="text-[0.9rem] text-ink-soft">No honors yet.</li>
        )}
        {initialHonors.map((honor) => (
          <li
            key={honor.id}
            className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-[0.9rem]"
          >
            <span>
              {honor.title}{" "}
              <span className="text-ink-soft">
                · {honor.level} · {honor.year}
              </span>
            </span>
            <button
              type="button"
              onClick={() => handleDelete(honor.id)}
              className="text-[0.8rem] font-medium text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="grid grid-cols-3 gap-3">
        <input
          type="text"
          name="title"
          placeholder="Honor / award title"
          required
          className="col-span-3 rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep sm:col-span-1"
        />
        <select
          name="level"
          required
          defaultValue=""
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        >
          <option value="" disabled>
            Level
          </option>
          {HONOR_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="year"
          placeholder="Year"
          min="1990"
          max="2100"
          required
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        {error && (
          <p className="col-span-3 text-[0.85rem] text-red-700" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="col-span-3">
          {submitting ? "Adding…" : "Add honor"}
        </Button>
      </form>
    </Card>
  );
}
