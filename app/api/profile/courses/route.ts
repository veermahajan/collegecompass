import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { ensureProfile, recomputeGpas } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/validations/profile";
import { rigorPointsForLevel } from "@/lib/gpa";

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = courseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const profile = await ensureProfile(userId);
  const { name, level, gradeReceived } = parsed.data;

  const course = await prisma.course.create({
    data: {
      profileId: profile.id,
      name,
      level,
      gradeReceived,
      rigorPoints: rigorPointsForLevel(level),
    },
  });

  const updatedProfile = await recomputeGpas(profile.id);

  return NextResponse.json({ course, profile: updatedProfile }, { status: 201 });
}
