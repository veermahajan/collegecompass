"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AcademicProfile } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GpaSummary({ profile }: { profile: AcademicProfile }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const toNumberOrNull = (v: FormDataEntryValue | null) =>
      v === null || v === "" ? null : Number(v);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unweightedGpa: toNumberOrNull(form.get("unweightedGpa")),
        ucWeightedGpa: toNumberOrNull(form.get("ucWeightedGpa")),
        satScore: toNumberOrNull(form.get("satScore")),
        actScore: toNumberOrNull(form.get("actScore")),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not save.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setEditing(false);
    router.refresh();
  }

  return (
    <Card hover={false} className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">
          GPA &amp; test scores
        </h2>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="text-[0.85rem] font-medium text-sage-deep"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumField
            label="Unweighted GPA"
            name="unweightedGpa"
            step="0.01"
            defaultValue={profile.unweightedGpa}
          />
          <NumField
            label="UC weighted GPA"
            name="ucWeightedGpa"
            step="0.01"
            defaultValue={profile.ucWeightedGpa}
          />
          <NumField
            label="SAT score"
            name="satScore"
            step="1"
            defaultValue={profile.satScore}
          />
          <NumField
            label="ACT score"
            name="actScore"
            step="1"
            defaultValue={profile.actScore}
          />
          {error && (
            <p className="col-span-2 text-[0.85rem] text-red-700" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={submitting}
            className="col-span-2 mt-1"
          >
            {submitting ? "Saving…" : "Save"}
          </Button>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Unweighted GPA" value={profile.unweightedGpa} />
          <Stat label="UC weighted GPA" value={profile.ucWeightedGpa} />
          <Stat label="SAT" value={profile.satScore} />
          <Stat label="ACT" value={profile.actScore} />
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="font-mono text-2xl text-ink">{value ?? "—"}</div>
      <div className="text-[0.8rem] text-ink-soft">{label}</div>
    </div>
  );
}

function NumField({
  label,
  name,
  step,
  defaultValue,
}: {
  label: string;
  name: string;
  step: string;
  defaultValue: number | null;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-[0.9rem] font-medium text-ink">
      {label}
      <input
        type="number"
        name={name}
        step={step}
        defaultValue={defaultValue ?? ""}
        className="rounded-lg border border-line bg-white px-3 py-2 text-[0.95rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
      />
    </label>
  );
}
