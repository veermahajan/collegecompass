import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/current-user";
import { updateJournalEntrySchema } from "@/lib/validation/journal";

// GET/PATCH/DELETE /api/journal/:id — scoped to the owning user. A
// mismatched or missing entry returns 404, never 403, so requests can't
// probe for other users' entry ids (spec: entries are private by default).

async function loadOwnedEntry(id: string, userId: string) {
  const entry = await prisma.journalEntry.findUnique({ where: { id } });
  if (!entry || entry.userId !== userId) return null;
  return entry;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await loadOwnedEntry(params.id, userId);
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ entry });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await loadOwnedEntry(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = updateJournalEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const entry = await prisma.journalEntry.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return NextResponse.json({ entry });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await loadOwnedEntry(params.id, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
