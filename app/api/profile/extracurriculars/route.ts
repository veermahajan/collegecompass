import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { ensureProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { extracurricularSchema } from "@/lib/validations/profile";

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = extracurricularSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const profile = await ensureProfile(userId);
  const entry = await prisma.extracurricularEntry.create({
    data: { profileId: profile.id, ...parsed.data },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
