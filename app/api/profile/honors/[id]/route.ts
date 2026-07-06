import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { honorSchema } from "@/lib/validations/profile";

async function honorOwnedByUser(honorId: string, userId: string) {
  const honor = await prisma.honorAward.findUnique({
    where: { id: honorId },
    include: { profile: true },
  });
  if (!honor || honor.profile.userId !== userId) return null;
  return honor;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existing = await honorOwnedByUser(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = honorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const honor = await prisma.honorAward.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ honor });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const existing = await honorOwnedByUser(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.honorAward.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
