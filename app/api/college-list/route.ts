import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { suggestBucket } from "@/lib/college-list";
import { addCollegeSchema } from "@/lib/validations/college-list";

async function studentStatsFor(userId: string) {
  const profile = await prisma.academicProfile.findUnique({ where: { userId } });
  return {
    unweightedGpa: profile?.unweightedGpa ?? null,
    satScore: profile?.satScore ?? null,
    actScore: profile?.actScore ?? null,
  };
}

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const [student, entries] = await Promise.all([
    studentStatsFor(userId),
    prisma.collegeListEntry.findMany({
      where: { userId },
      orderBy: { addedAt: "desc" },
    }),
  ]);

  // CollegeListEntry has no Prisma relation field to College (the
  // locked schema only stores collegeId), so join manually.
  const colleges = await prisma.college.findMany({
    where: { id: { in: entries.map((e) => e.collegeId) } },
  });
  const collegeById = new Map(colleges.map((c) => [c.id, c]));

  const items = entries
    .map((entry) => {
      const college = collegeById.get(entry.collegeId);
      if (!college) return null;
      return { ...entry, college, suggestedBucket: suggestBucket(student, college) };
    })
    .filter((item) => item !== null);

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addCollegeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const college = await prisma.college.findUnique({
    where: { id: parsed.data.collegeId },
  });
  if (!college) {
    return NextResponse.json({ error: "College not found." }, { status: 404 });
  }

  const existing = await prisma.collegeListEntry.findFirst({
    where: { userId, collegeId: college.id },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Already on your list." },
      { status: 409 }
    );
  }

  const student = await studentStatsFor(userId);
  const bucket = suggestBucket(student, college);

  const entry = await prisma.collegeListEntry.create({
    data: { userId, collegeId: college.id, bucket },
  });

  return NextResponse.json(
    { item: { ...entry, college, suggestedBucket: bucket } },
    { status: 201 }
  );
}
