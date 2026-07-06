import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { extracurricularSchema } from "@/lib/validations/profile";

async function entryOwnedByUser(entryId: string, userId: string) {
  const entry = await prisma.extracurricularEntry.findUnique({
    where: { id: entryId },
    include: { profile: true },
  });
  if (!entry || entry.profile.userId !== userId) return null;
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
  const parsed = extracurricularSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const entry = await prisma.extracurricularEntry.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ entry });
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

  await prisma.extracurricularEntry.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
