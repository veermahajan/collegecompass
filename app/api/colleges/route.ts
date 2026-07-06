import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Read-only catalog browse, used by the college-list UI to search/add
// colleges. Not part of a user's list — see /api/college-list for that.
export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const colleges = await prisma.college.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ colleges });
}
