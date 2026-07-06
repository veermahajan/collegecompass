// Phase A4 — deliberately has ZERO imports (no Prisma, no encryption).
// scripts/verify-compass-score-serializer.ts imports only this file so
// that the build-time leak check never transitively pulls in lib/prisma.ts
// (which throws eagerly at import time if DATABASE_URL isn't set) — the
// serializer check must run even in environments with no DB configured.

export type VisibleCompassScores = {
  academicsScore: number;
  honorsScore: number;
  extracurricularsScore: number;
  essaysScore: number;
  computedAt: Date;
};

export type CompassScoreRow = {
  academicsScore: number;
  honorsScore: number;
  extracurricularsScore: number;
  essaysScore: number;
  contextScoreEncrypted: string;
  computedAt: Date;
};

/**
 * The single, exclusive path from a full CompassScore DB row to anything
 * that leaves the server. Never spread a CompassScore row directly into a
 * response — always go through this function. This is a hard rule, not a
 * style preference (spec Sec 8): the Context/socioeconomic subscore must
 * never be returned to a client under any serialization path.
 */
export function toVisibleScores(row: CompassScoreRow): VisibleCompassScores {
  return {
    academicsScore: row.academicsScore,
    honorsScore: row.honorsScore,
    extracurricularsScore: row.extracurricularsScore,
    essaysScore: row.essaysScore,
    computedAt: row.computedAt,
  };
}
