// Phase A3 — starter College dataset (spec Sec 5: "sourced from public
// Common Data Sets, cited per-college"). These are approximate,
// illustrative admitted/enrolled-class averages assembled for the MVP
// starter list, not a live-synced feed of each school's current-cycle
// Common Data Set. sourceCitation names the report type per spec; a
// production dataset would need a real per-college data-refresh
// pipeline against each institution's actual current CDS filing (CDS
// Section C21 for GPA/rank, Section C9 for SAT/ACT, Section C1/C2 for
// acceptance rate).
//
// acceptanceRate is a 0–1 fraction. avgGpaUnweighted is on a 4.0 scale
// (matches lib/gpa.ts's unweightedGpa). avgSat is composite (out of
// 1600). needBlind is only marked true where the policy is
// unambiguous and well-documented (the five highly selective private
// universities below); left false elsewhere since need-blind policy
// often varies by residency/citizenship and isn't asserted here.

const CDS_CITATION =
  "Approximate figures compiled from institutions' published Common Data Set filings (Sections C1/C2, C9, C21), most recent cycle available. MVP starter dataset — not live-synced.";

export type CollegeSeed = {
  id: string;
  name: string;
  avgGpaUnweighted: number;
  avgSat: number;
  avgAct: number;
  acceptanceRate: number;
  needBlind: boolean;
  sourceCitation: string;
};

export const COLLEGES: CollegeSeed[] = [
  // Highly selective
  { id: "college-harvard", name: "Harvard University", avgGpaUnweighted: 3.90, avgSat: 1535, avgAct: 34, acceptanceRate: 0.034, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-stanford", name: "Stanford University", avgGpaUnweighted: 3.96, avgSat: 1520, avgAct: 34, acceptanceRate: 0.037, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-mit", name: "Massachusetts Institute of Technology", avgGpaUnweighted: 3.90, avgSat: 1535, avgAct: 35, acceptanceRate: 0.04, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-princeton", name: "Princeton University", avgGpaUnweighted: 3.90, avgSat: 1510, avgAct: 34, acceptanceRate: 0.04, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-yale", name: "Yale University", avgGpaUnweighted: 3.90, avgSat: 1515, avgAct: 34, acceptanceRate: 0.045, needBlind: true, sourceCitation: CDS_CITATION },

  // Selective flagship publics
  { id: "college-umich", name: "University of Michigan, Ann Arbor", avgGpaUnweighted: 3.88, avgSat: 1435, avgAct: 33, acceptanceRate: 0.18, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uva", name: "University of Virginia", avgGpaUnweighted: 3.90, avgSat: 1460, avgAct: 33, acceptanceRate: 0.18, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unc", name: "University of North Carolina at Chapel Hill", avgGpaUnweighted: 3.85, avgSat: 1410, avgAct: 32, acceptanceRate: 0.17, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucla", name: "University of California, Los Angeles", avgGpaUnweighted: 3.90, avgSat: 1405, avgAct: 32, acceptanceRate: 0.09, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-berkeley", name: "University of California, Berkeley", avgGpaUnweighted: 3.89, avgSat: 1415, avgAct: 32, acceptanceRate: 0.11, needBlind: false, sourceCitation: CDS_CITATION },

  // Moderately selective
  { id: "college-wisc", name: "University of Wisconsin–Madison", avgGpaUnweighted: 3.80, avgSat: 1400, avgAct: 31, acceptanceRate: 0.43, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-osu", name: "Ohio State University", avgGpaUnweighted: 3.70, avgSat: 1300, avgAct: 29, acceptanceRate: 0.45, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uw", name: "University of Washington", avgGpaUnweighted: 3.75, avgSat: 1350, avgAct: 30, acceptanceRate: 0.45, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-psu", name: "Penn State University Park", avgGpaUnweighted: 3.60, avgSat: 1280, avgAct: 28, acceptanceRate: 0.50, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-rutgers", name: "Rutgers University–New Brunswick", avgGpaUnweighted: 3.60, avgSat: 1280, avgAct: 28, acceptanceRate: 0.66, needBlind: false, sourceCitation: CDS_CITATION },

  // Less selective
  { id: "college-asu", name: "Arizona State University", avgGpaUnweighted: 3.40, avgSat: 1225, avgAct: 25, acceptanceRate: 0.88, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-arizona", name: "University of Arizona", avgGpaUnweighted: 3.40, avgSat: 1200, avgAct: 24, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-indiana", name: "Indiana University Bloomington", avgGpaUnweighted: 3.60, avgSat: 1230, avgAct: 27, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-alabama", name: "University of Alabama", avgGpaUnweighted: 3.50, avgSat: 1195, avgAct: 25, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-msu", name: "Michigan State University", avgGpaUnweighted: 3.50, avgSat: 1180, avgAct: 25, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },
];
