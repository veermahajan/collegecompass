import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { computeCompassScore } from "@/lib/compass-score";

// GET /api/compass-score — Phase A4. Recomputes on every request so it
// always reflects the latest profile/courses/honors/extracurriculars/
// essay-draft journal entries. computeCompassScore's return type
// (VisibleCompassScores) structurally cannot include the Context
// subscore — see lib/compass-score.ts. Do not widen this response with a
// raw CompassScore row or a spread; that is exactly the leak
// scripts/verify-compass-score-serializer.ts exists to catch.

export async function GET() {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const scores = await computeCompassScore(userId);
    return NextResponse.json(scores);
  } catch (err) {
    console.error("Failed to compute Compass Score:", err);
    return NextResponse.json(
      { error: "Could not compute Compass Score." },
      { status: 500 }
    );
  }
}
