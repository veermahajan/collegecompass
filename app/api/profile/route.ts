import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { ensureProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { profilePatchSchema } from "@/lib/validations/profile";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const profile = await ensureProfile(userId);
  const [courses, extracurriculars, honors] = await Promise.all([
    prisma.course.findMany({ where: { profileId: profile.id } }),
    prisma.extracurricularEntry.findMany({ where: { profileId: profile.id } }),
    prisma.honorAward.findMany({ where: { profileId: profile.id } }),
  ]);

  return NextResponse.json({ profile, courses, extracurriculars, honors });
}

// Manual override of GPA fields + test scores. Note: unweightedGpa/
// ucWeightedGpa set here get recalculated (and overwritten) the next
// time a course is added, edited, or deleted — see lib/profile.ts.
export async function PATCH(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profilePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const profile = await ensureProfile(userId);
  const updated = await prisma.academicProfile.update({
    where: { id: profile.id },
    data: parsed.data,
  });

  return NextResponse.json({ profile: updated });
}
