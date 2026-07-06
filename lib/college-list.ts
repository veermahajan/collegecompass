// Phase A3 — reach/target/safety bucket suggestion.
//
// This is advisory, not predictive (spec Sec 5: "the algorithm advises,
// the student decides"). It compares the student's unweighted GPA and
// SAT/ACT scores against a college's published averages, then applies
// two acceptance-rate guardrails that reflect standard admissions
// counseling practice: no school under 5% acceptance is ever a
// "target" or "safety" for anyone (holistic review makes outcomes too
// unpredictable to call it anything but a reach), and no school under
// 10% acceptance is ever a "safety" even for a student well above its
// averages.
//
// Composite delta:
//   gpaDelta  = studentGpa - college.avgGpaUnweighted   (GPA points, 4.0 scale)
//   satDelta  = (studentSat - college.avgSat) / 100     (100 SAT pts ~ 1 "unit")
//   actDelta  = (studentAct - college.avgAct) / 3       (3 ACT pts ~ 1 "unit")
// testDelta = average of whichever of satDelta/actDelta the student has
// on file. composite = average of gpaDelta and testDelta (equal
// weight); if the student has no test scores, composite = gpaDelta
// alone; if neither GPA nor test scores are on file, there's nothing
// to compare and the suggestion defaults to "target".
//
// Bucket from composite, before guardrails:
//   composite <= -0.15       -> reach
//   -0.15 < composite < 0.15 -> target
//   composite >= 0.15        -> safety

export type Bucket = "reach" | "target" | "safety";

export const BUCKETS: Bucket[] = ["reach", "target", "safety"];

type StudentStats = {
  unweightedGpa: number | null;
  satScore: number | null;
  actScore: number | null;
};

type CollegeStats = {
  avgGpaUnweighted: number | null;
  avgSat: number | null;
  avgAct: number | null;
  acceptanceRate: number | null;
};

export function suggestBucket(
  student: StudentStats,
  college: CollegeStats
): Bucket {
  const deltas: number[] = [];

  if (student.unweightedGpa != null && college.avgGpaUnweighted != null) {
    deltas.push(student.unweightedGpa - college.avgGpaUnweighted);
  }

  const testDeltas: number[] = [];
  if (student.satScore != null && college.avgSat != null) {
    testDeltas.push((student.satScore - college.avgSat) / 100);
  }
  if (student.actScore != null && college.avgAct != null) {
    testDeltas.push((student.actScore - college.avgAct) / 3);
  }
  if (testDeltas.length > 0) {
    deltas.push(testDeltas.reduce((a, b) => a + b, 0) / testDeltas.length);
  }

  if (deltas.length === 0) return "target";

  const composite = deltas.reduce((a, b) => a + b, 0) / deltas.length;

  let bucket: Bucket;
  if (composite <= -0.15) bucket = "reach";
  else if (composite >= 0.15) bucket = "safety";
  else bucket = "target";

  const acceptanceRate = college.acceptanceRate;
  if (acceptanceRate != null) {
    if (acceptanceRate < 0.05) bucket = "reach";
    else if (acceptanceRate < 0.1 && bucket === "safety") bucket = "target";
  }

  return bucket;
}
