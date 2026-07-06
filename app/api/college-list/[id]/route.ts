import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { bucketPatchSchema } from "@/lib/validations/college-list";

async function entryOwnedByUser(entryId: string, userId: string) {
  const entry = await prisma.collegeListEntry.findUnique({
    where: { id: entryId },
  });
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existing = await entryOwnedByUser(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bucketPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Manual override: the algorithm advises, the student decides (spec Sec 5).
  const entry = await prisma.collegeListEntry.update({
    where: { id: params.id },
    data: { bucket: parsed.data.bucket },
  });
  const college = await prisma.college.findUnique({
    where: { id: entry.collegeId },
  });

  return NextResponse.json({ item: { ...entry, college } });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existing = await entryOwnedByUser(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.collegeListEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
