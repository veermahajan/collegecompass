"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HonorAward } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RIGOR_LEVEL_GUIDE, RIGOR_SAMPLE_ACTIVITIES } from "@/lib/rigor-scale";

function guideFor(level: number) {
  return RIGOR_LEVEL_GUIDE.find((g) => g.level === level);
}

export function HonorSection({
  initialHonors,
}: {
  initialHonors: HonorAward[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | "">("");
  const [showScale, setShowScale] = useState(false);

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
        level: Number(data.get("level")),
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
    setSelectedLevel("");
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/profile/honors/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const selectedGuide =
    selectedLevel === "" ? undefined : guideFor(selectedLevel);

  return (
    <Card hover={false}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">
          Honors &amp; awards
        </h2>
        <button
          type="button"
          onClick={() => setShowScale((v) => !v)}
          className="text-[0.8rem] font-medium text-sage-deep underline underline-offset-2"
        >
          {showScale ? "Hide" : "View"} rigor scale &amp; examples
        </button>
      </div>

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
                · Level {honor.level}
                {guideFor(honor.level) ? ` — ${guideFor(honor.level)!.label}` : ""} ·{" "}
                {honor.year}
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

      {showScale && (
        <div className="mb-5 rounded-lg border border-line p-4">
          <p className="mb-3 text-[0.85rem] text-ink-soft">
            Instead of local/state/national tags, rate each honor 1-10 by how
            selective it is. This captures rigor far better — an AP Scholar
            Award and an IMO medal used to both just say &quot;national&quot;.
          </p>
          <div className="mb-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[0.85rem]">
              <thead>
                <tr className="border-b border-line text-left text-ink-soft">
                  <th className="py-1.5 pr-3 font-medium">Level</th>
                  <th className="py-1.5 pr-3 font-medium">What it means</th>
                  <th className="py-1.5 font-medium">Example</th>
                </tr>
              </thead>
              <tbody>
                {RIGOR_LEVEL_GUIDE.map((g) => (
                  <tr key={g.level} className="border-b border-line/60 align-top">
                    <td className="py-1.5 pr-3 font-semibold">{g.level}</td>
                    <td className="py-1.5 pr-3">
                      <span className="font-medium">{g.label}.</span>{" "}
                      <span className="text-ink-soft">{g.description}</span>
                    </td>
                    <td className="py-1.5 text-ink-soft">{g.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="text-[0.85rem]">
            <summary className="cursor-pointer font-medium text-sage-deep">
              Browse ~100 sample activities by level
            </summary>
            <div className="mt-3 max-h-80 overflow-y-auto overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr className="border-b border-line text-left text-ink-soft">
                    <th className="py-1.5 pr-3 font-medium">Category</th>
                    <th className="py-1.5 pr-3 font-medium">Sample activity</th>
                    <th className="py-1.5 font-medium">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {RIGOR_SAMPLE_ACTIVITIES.map((a) => (
                    <tr
                      key={`${a.category}-${a.activity}`}
                      className="border-b border-line/60"
                    >
                      <td className="py-1 pr-3 text-ink-soft">{a.category}</td>
                      <td className="py-1 pr-3">{a.activity}</td>
                      <td className="py-1 font-semibold">{a.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
          value={selectedLevel}
          onChange={(e) =>
            setSelectedLevel(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        >
          <option value="" disabled>
            Level (1-10)
          </option>
          {RIGOR_LEVEL_GUIDE.map((g) => (
            <option key={g.level} value={g.level}>
              {g.level} — {g.label}
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
        {selectedGuide && (
          <p className="col-span-3 text-[0.8rem] text-ink-soft">
            e.g. <span className="font-medium">{selectedGuide.example}</span> —{" "}
            {selectedGuide.description}
          </p>
        )}
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
