import { toVisibleScores } from "../lib/compass-score-serializer";

// Phase A4 — spec Sec 8 hard rule: "Sensitive-field leakage (Context/
// socioeconomic subscore) is the single highest-risk failure mode in this
// entire spec: test it explicitly, at every API boundary." This script is
// wired into `npm run build` (see package.json) so a build fails outright
// if the context field ever leaks through the one function permitted to
// shape a Compass Score API payload.
//
// It calls the REAL toVisibleScores() from lib/compass-score-serializer.ts
// — not a hand-copied mock of it — against a fake row that has a live,
// obviously-sensitive context value set, so this only passes if that
// function is structurally incapable of forwarding it. Deliberately
// imports only the dependency-free serializer module, not
// lib/compass-score.ts itself, so this check never transitively requires
// DATABASE_URL (lib/prisma.ts throws eagerly at import time without it) —
// this must run in any build environment, DB configured or not.

const FORBIDDEN_KEY_PATTERN = /context/i;

function assertNoForbiddenKeys(value: unknown, path = ""): void {
  if (value === null || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (FORBIDDEN_KEY_PATTERN.test(key)) {
      throw new Error(
        `Compass Score serializer leak check failed: forbidden key "${path}${key}" ` +
          `found in the client-facing payload. The Context/socioeconomic ` +
          `subscore must never appear in any API response (spec Sec 8).`
      );
    }
    assertNoForbiddenKeys(nested, `${path}${key}.`);
  }
}

const fakeFullRow = {
  academicsScore: 72,
  honorsScore: 55,
  extracurricularsScore: 61,
  essaysScore: 48,
  contextScoreEncrypted: "AES256:THIS-VALUE-MUST-NEVER-APPEAR-IN-OUTPUT",
  computedAt: new Date(),
};

const payload = toVisibleScores(fakeFullRow);

assertNoForbiddenKeys(payload);

const serialized = JSON.stringify(payload);
assertNoForbiddenKeys(JSON.parse(serialized));

if (serialized.toLowerCase().includes("must-never-appear-in-output")) {
  throw new Error(
    "Compass Score serializer leak check failed: the encrypted context " +
      "blob's contents appeared in the serialized payload."
  );
}

console.log(
  "[verify-compass-score-serializer] OK — no context field present in the Compass Score API payload shape."
);
