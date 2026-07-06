"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { COURSE_LEVELS } from "@/lib/gpa";

export function CourseSection({
  initialCourses,
}: {
  initialCourses: Course[];
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
    const res = await fetch("/api/profile/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        level: data.get("level"),
        gradeReceived: data.get("gradeReceived"),
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Could not add course.");
      setSubmitting(false);
      return;
    }

    form.reset();
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/profile/courses/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Card hover={false} className="mb-8">
      <h2 className="mb-4 font-display text-lg font-semibold">Courses</h2>

      <ul className="mb-5 flex flex-col gap-2">
        {initialCourses.length === 0 && (
          <li className="text-[0.9rem] text-ink-soft">No courses yet.</li>
        )}
        {initialCourses.map((course) => (
          <li
            key={course.id}
            className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-[0.9rem]"
          >
            <span>
              {course.name}{" "}
              <span className="text-ink-soft">
                · {course.level} · {course.gradeReceived}
              </span>
            </span>
            <button
              type="button"
              onClick={() => handleDelete(course.id)}
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
          name="name"
          placeholder="Course name"
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
          {COURSE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="gradeReceived"
          placeholder="Grade (e.g. A-)"
          required
          className="rounded-lg border border-line bg-white px-3 py-2 text-[0.9rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage-deep"
        />
        {error && (
          <p className="col-span-3 text-[0.85rem] text-red-700" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting} className="col-span-3">
          {submitting ? "Adding…" : "Add course"}
        </Button>
      </form>
    </Card>
  );
}
