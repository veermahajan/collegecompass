import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { recomputeGpas } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/validations/profile";
import { rigorPointsForLevel } from "@/lib/gpa";

async function courseOwnedByUser(courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { profile: true },
  });
  if (!course || course.profile.userId !== userId) return null;
  return course;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existing = await courseOwnedByUser(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, level, gradeReceived } = parsed.data;
  const course = await prisma.course.update({
    where: { id: params.id },
    data: { name, level, gradeReceived, rigorPoints: rigorPointsForLevel(level) },
  });

  const profile = await recomputeGpas(existing.profileId);

  return NextResponse.json({ course, profile });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existing = await courseOwnedByUser(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.course.delete({ where: { id: params.id } });
  const profile = await recomputeGpas(existing.profileId);

  return NextResponse.json({ ok: true, profile });
}
