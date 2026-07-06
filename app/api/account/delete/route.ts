import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

// Phase A1 — user-initiated account deletion. Soft-deletes only
// (sets deletedAt); the hard-delete job in
// app/api/cron/hard-delete-users runs 30 days later per spec Sec 8.

const schema = z.object({ password: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.deletedAt) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
