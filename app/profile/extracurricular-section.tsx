"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExtracurricularEntry } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ExtracurricularSection({
  initialEntries,
}: {
  initialEntries: ExtracurricularEntry[];
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
    const res = await fetch("/api/profile/extracurriculars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.get("title"),
        category: data.get("category"),
        hoursPerWeek: Number(data.get("hoursPerWeek")),
        weeksPerYear: Number(data.get("weeksPerYear")),
        description: data.get("description"),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not add activity.");
      setSubmitting(false);
      return;
    }

    form.reset();
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/profile/extracurriculars/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Card hover={false} className="mb-8">
      <h2 className="mb-4 font-display text-lg font-semibold">
        Extracurriculars
      </h2>

      <ul className="mb-5 flex flex-col gap-2">
        {initialEntries.length === 0 && (
          <li className="text-[0.9rem] text-ink-soft">
            No activities yet.
          </li>
        )}
        {initialEntries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-[0.9rem]"
          >
            <span>
              {entry.title}{" "}
              <span className="text-ink-soft">
                · {entry.category} · {entry.hoursPerWeek}h/wk ×{" "}
                {entry.weeksPerYear}wk
              </span>
            </span>
            <button
              type="button"
              onClick={() => handleDelete(entry.id)}
              className="text-[0.8rem] font-medium text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          name="title"
          placeholder="Activity title"
          required
          className="col-span-2 rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          required
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        <input
          type="number"
          name="hoursPerWeek"
          placeholder="Hours / week"
          step="0.5"
          min="0"
          required
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        <input
          type="number"
          name="weeksPerYear"
          placeholder="Weeks / year"
          min="0"
          max="52"
          required
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="col-span-2 rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        {error && (
          <p className="col-span-2 text-[0.85rem] text-red-700" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="col-span-2">
          {submitting ? "Adding…" : "Add activity"}
        </Button>
      </form>
    </Card>
  );
}
