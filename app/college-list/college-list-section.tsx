"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { College, CollegeListEntry } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BUCKETS, type Bucket } from "@/lib/college-list";

type ListItem = CollegeListEntry & {
  college: College;
  suggestedBucket: Bucket;
};

const BUCKET_LABEL: Record<Bucket, string> = {
  reach: "Reach",
  target: "Target",
  safety: "Safety",
};

export function CollegeListSection({
  initialItems,
  availableColleges,
  hasProfileStats,
}: {
  initialItems: ListItem[];
  availableColleges: College[];
  hasProfileStats: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCollegeId) return;
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/college-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId: selectedCollegeId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not add college.");
      setSubmitting(false);
      return;
    }

    setSelectedCollegeId("");
    setSubmitting(false);
    router.refresh();
  }

  async function handleBucketChange(id: string, bucket: Bucket) {
    await fetch(`/api/college-list/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket }),
    });
    router.refresh();
  }

  async function handleRemove(id: string) {
    await fetch(`/api/college-list/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      {!hasProfileStats && (
        <Card hover={false} className="mb-8 border-sky/40 bg-sky/5">
          <p className="text-[0.9rem] text-ink-soft">
            Add your GPA and test scores on your{" "}
            <a href="/profile" className="font-medium text-sage-deep">
              academic profile
            </a>{" "}
            to get bucket suggestions for each school. Without them, new
            additions default to &quot;target.&quot;
          </p>
        </Card>
      )}

      <Card hover={false} className="mb-8">
        <h2 className="mb-4 font-display text-lg font-semibold">Your list</h2>

        {initialItems.length === 0 && (
          <p className="text-[0.9rem] text-ink-soft">
            No colleges on your list yet — add one below.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {initialItems.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border border-line px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-[0.9rem]">
                <span className="font-medium">{item.college.name}</span>{" "}
                <span className="text-ink-soft">
                  · GPA {item.college.avgGpaUnweighted ?? "—"} · SAT{" "}
                  {item.college.avgSat ?? "—"} · ACT{" "}
                  {item.college.avgAct ?? "—"} · accept{" "}
                  {item.college.acceptanceRate != null
                    ? `${Math.round(item.college.acceptanceRate * 100)}%`
                    : "—"}
                </span>
                {item.bucket !== item.suggestedBucket && (
                  <div className="mt-0.5 text-[0.78rem] text-ink-soft">
                    Suggested: {BUCKET_LABEL[item.suggestedBucket]} (you moved
                    this to {BUCKET_LABEL[item.bucket as Bucket]})
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={item.bucket}
                  onChange={(e) =>
                    handleBucketChange(item.id, e.target.value as Bucket)
                  }
                  className="rounded-lg border border-line bg-white px-2 py-1.5 text-[0.85rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
                >
                  {BUCKETS.map((b) => (
                    <option key={b} value={b}>
                      {BUCKET_LABEL[b]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="text-[0.8rem] font-medium text-red-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card hover={false}>
        <h2 className="mb-4 font-display text-lg font-semibold">
          Add a college
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedCollegeId}
            onChange={(e) => setSelectedCollegeId(e.target.value)}
            required
            className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
          >
            <option value="" disabled>
              Choose a school
            </option>
            {availableColleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={submitting || !selectedCollegeId}>
            {submitting ? "Adding…" : "Add to list"}
          </Button>
        </form>
        {error && (
          <p className="mt-3 text-[0.85rem] text-red-700" role="alert">
            {error}
          </p>
        )}
      </Card>
    </>
  );
}
