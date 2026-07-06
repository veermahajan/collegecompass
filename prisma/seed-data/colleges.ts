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
// unambiguous and well-documented (Ivies + a small set of elite
// privates/LACs with well-publicized need-blind, meets-full-need
// policies); left false elsewhere since need-blind policy often
// varies by residency/citizenship and isn't asserted here.
//
// Expanded to 250+ schools across selectivity tiers (highly selective
// privates, elite public flagships, liberal arts colleges, broad public
// universities, HBCUs, religious/regional privates, STEM-focused
// institutes) so the college list and bucket-suggestion logic have a
// realistic range to work against. Same caveat as above applies to every
// row: approximate and illustrative, not a live per-cycle feed.

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

  // Remaining Ivy League
  { id: "college-penn", name: "University of Pennsylvania", avgGpaUnweighted: 3.90, avgSat: 1520, avgAct: 34, acceptanceRate: 0.055, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-cornell", name: "Cornell University", avgGpaUnweighted: 3.89, avgSat: 1495, avgAct: 34, acceptanceRate: 0.075, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-columbia", name: "Columbia University", avgGpaUnweighted: 3.90, avgSat: 1525, avgAct: 34, acceptanceRate: 0.04, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-dartmouth", name: "Dartmouth College", avgGpaUnweighted: 3.90, avgSat: 1510, avgAct: 34, acceptanceRate: 0.06, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-brown", name: "Brown University", avgGpaUnweighted: 3.90, avgSat: 1505, avgAct: 34, acceptanceRate: 0.05, needBlind: true, sourceCitation: CDS_CITATION },

  // Other highly selective private universities
  { id: "college-duke", name: "Duke University", avgGpaUnweighted: 3.91, avgSat: 1520, avgAct: 34, acceptanceRate: 0.06, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-northwestern", name: "Northwestern University", avgGpaUnweighted: 3.90, avgSat: 1500, avgAct: 34, acceptanceRate: 0.07, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-uchicago", name: "University of Chicago", avgGpaUnweighted: 3.90, avgSat: 1520, avgAct: 34, acceptanceRate: 0.05, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-jhu", name: "Johns Hopkins University", avgGpaUnweighted: 3.92, avgSat: 1530, avgAct: 35, acceptanceRate: 0.07, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-caltech", name: "California Institute of Technology", avgGpaUnweighted: 3.97, avgSat: 1545, avgAct: 35, acceptanceRate: 0.03, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-rice", name: "Rice University", avgGpaUnweighted: 3.91, avgSat: 1515, avgAct: 34, acceptanceRate: 0.09, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-vanderbilt", name: "Vanderbilt University", avgGpaUnweighted: 3.89, avgSat: 1520, avgAct: 34, acceptanceRate: 0.07, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-wustl", name: "Washington University in St. Louis", avgGpaUnweighted: 3.90, avgSat: 1530, avgAct: 34, acceptanceRate: 0.12, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-georgetown", name: "Georgetown University", avgGpaUnweighted: 3.89, avgSat: 1500, avgAct: 34, acceptanceRate: 0.12, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-nd", name: "University of Notre Dame", avgGpaUnweighted: 3.90, avgSat: 1500, avgAct: 34, acceptanceRate: 0.13, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-emory", name: "Emory University", avgGpaUnweighted: 3.80, avgSat: 1470, avgAct: 33, acceptanceRate: 0.11, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-usc", name: "University of Southern California", avgGpaUnweighted: 3.79, avgSat: 1470, avgAct: 33, acceptanceRate: 0.10, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-nyu", name: "New York University", avgGpaUnweighted: 3.70, avgSat: 1500, avgAct: 33, acceptanceRate: 0.08, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-tufts", name: "Tufts University", avgGpaUnweighted: 3.90, avgSat: 1480, avgAct: 33, acceptanceRate: 0.09, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-cmu", name: "Carnegie Mellon University", avgGpaUnweighted: 3.80, avgSat: 1520, avgAct: 34, acceptanceRate: 0.11, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bc", name: "Boston College", avgGpaUnweighted: 3.80, avgSat: 1450, avgAct: 33, acceptanceRate: 0.15, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bu", name: "Boston University", avgGpaUnweighted: 3.70, avgSat: 1450, avgAct: 32, acceptanceRate: 0.14, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-rochester", name: "University of Rochester", avgGpaUnweighted: 3.60, avgSat: 1440, avgAct: 32, acceptanceRate: 0.28, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-cwru", name: "Case Western Reserve University", avgGpaUnweighted: 3.80, avgSat: 1470, avgAct: 33, acceptanceRate: 0.28, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wakeforest", name: "Wake Forest University", avgGpaUnweighted: 3.70, avgSat: 1420, avgAct: 32, acceptanceRate: 0.22, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-lehigh", name: "Lehigh University", avgGpaUnweighted: 3.60, avgSat: 1400, avgAct: 31, acceptanceRate: 0.32, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-villanova", name: "Villanova University", avgGpaUnweighted: 3.70, avgSat: 1400, avgAct: 32, acceptanceRate: 0.22, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-northeastern", name: "Northeastern University", avgGpaUnweighted: 3.85, avgSat: 1490, avgAct: 34, acceptanceRate: 0.07, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-brandeis", name: "Brandeis University", avgGpaUnweighted: 3.70, avgSat: 1450, avgAct: 32, acceptanceRate: 0.35, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-gwu", name: "George Washington University", avgGpaUnweighted: 3.70, avgSat: 1350, avgAct: 30, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-tulane", name: "Tulane University", avgGpaUnweighted: 3.60, avgSat: 1420, avgAct: 32, acceptanceRate: 0.11, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-miami", name: "University of Miami", avgGpaUnweighted: 3.60, avgSat: 1400, avgAct: 31, acceptanceRate: 0.19, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-smu", name: "Southern Methodist University", avgGpaUnweighted: 3.60, avgSat: 1350, avgAct: 30, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-fordham", name: "Fordham University", avgGpaUnweighted: 3.60, avgSat: 1370, avgAct: 31, acceptanceRate: 0.45, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-syracuse", name: "Syracuse University", avgGpaUnweighted: 3.50, avgSat: 1330, avgAct: 29, acceptanceRate: 0.51, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-pepperdine", name: "Pepperdine University", avgGpaUnweighted: 3.70, avgSat: 1330, avgAct: 29, acceptanceRate: 0.38, needBlind: false, sourceCitation: CDS_CITATION },

  // Selective liberal arts colleges
  { id: "college-williams", name: "Williams College", avgGpaUnweighted: 3.90, avgSat: 1500, avgAct: 34, acceptanceRate: 0.08, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-amherst", name: "Amherst College", avgGpaUnweighted: 3.91, avgSat: 1500, avgAct: 34, acceptanceRate: 0.07, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-swarthmore", name: "Swarthmore College", avgGpaUnweighted: 3.90, avgSat: 1500, avgAct: 34, acceptanceRate: 0.08, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-pomona", name: "Pomona College", avgGpaUnweighted: 3.90, avgSat: 1500, avgAct: 34, acceptanceRate: 0.06, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-wellesley", name: "Wellesley College", avgGpaUnweighted: 3.89, avgSat: 1480, avgAct: 33, acceptanceRate: 0.13, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-bowdoin", name: "Bowdoin College", avgGpaUnweighted: 3.90, avgSat: 1490, avgAct: 33, acceptanceRate: 0.08, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-middlebury", name: "Middlebury College", avgGpaUnweighted: 3.80, avgSat: 1450, avgAct: 32, acceptanceRate: 0.13, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-carleton", name: "Carleton College", avgGpaUnweighted: 3.89, avgSat: 1480, avgAct: 33, acceptanceRate: 0.15, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-colby", name: "Colby College", avgGpaUnweighted: 3.80, avgSat: 1460, avgAct: 33, acceptanceRate: 0.08, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bates", name: "Bates College", avgGpaUnweighted: 3.70, avgSat: 1440, avgAct: 32, acceptanceRate: 0.13, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-hamilton", name: "Hamilton College", avgGpaUnweighted: 3.80, avgSat: 1460, avgAct: 33, acceptanceRate: 0.12, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-vassar", name: "Vassar College", avgGpaUnweighted: 3.80, avgSat: 1450, avgAct: 32, acceptanceRate: 0.18, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-haverford", name: "Haverford College", avgGpaUnweighted: 3.89, avgSat: 1470, avgAct: 33, acceptanceRate: 0.14, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-cmc", name: "Claremont McKenna College", avgGpaUnweighted: 3.90, avgSat: 1490, avgAct: 33, acceptanceRate: 0.10, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-davidson", name: "Davidson College", avgGpaUnweighted: 3.90, avgSat: 1440, avgAct: 32, acceptanceRate: 0.17, needBlind: true, sourceCitation: CDS_CITATION },
  { id: "college-colgate", name: "Colgate University", avgGpaUnweighted: 3.70, avgSat: 1450, avgAct: 32, acceptanceRate: 0.14, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wesleyan", name: "Wesleyan University", avgGpaUnweighted: 3.80, avgSat: 1460, avgAct: 33, acceptanceRate: 0.15, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-smith", name: "Smith College", avgGpaUnweighted: 3.70, avgSat: 1400, avgAct: 31, acceptanceRate: 0.30, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-mtholyoke", name: "Mount Holyoke College", avgGpaUnweighted: 3.70, avgSat: 1380, avgAct: 30, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-barnard", name: "Barnard College", avgGpaUnweighted: 3.80, avgSat: 1460, avgAct: 33, acceptanceRate: 0.09, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-oberlin", name: "Oberlin College", avgGpaUnweighted: 3.70, avgSat: 1420, avgAct: 31, acceptanceRate: 0.33, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-grinnell", name: "Grinnell College", avgGpaUnweighted: 3.80, avgSat: 1440, avgAct: 32, acceptanceRate: 0.10, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wl", name: "Washington and Lee University", avgGpaUnweighted: 3.80, avgSat: 1420, avgAct: 32, acceptanceRate: 0.16, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-trinity", name: "Trinity College", avgGpaUnweighted: 3.60, avgSat: 1380, avgAct: 30, acceptanceRate: 0.32, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-conncollege", name: "Connecticut College", avgGpaUnweighted: 3.60, avgSat: 1380, avgAct: 30, acceptanceRate: 0.38, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-skidmore", name: "Skidmore College", avgGpaUnweighted: 3.60, avgSat: 1350, avgAct: 29, acceptanceRate: 0.32, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bard", name: "Bard College", avgGpaUnweighted: 3.60, avgSat: 1330, avgAct: 29, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-kenyon", name: "Kenyon College", avgGpaUnweighted: 3.70, avgSat: 1420, avgAct: 31, acceptanceRate: 0.34, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-denison", name: "Denison University", avgGpaUnweighted: 3.60, avgSat: 1380, avgAct: 30, acceptanceRate: 0.28, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-depauw", name: "DePauw University", avgGpaUnweighted: 3.60, avgSat: 1280, avgAct: 27, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-dickinson", name: "Dickinson College", avgGpaUnweighted: 3.60, avgSat: 1320, avgAct: 29, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-fandm", name: "Franklin & Marshall College", avgGpaUnweighted: 3.60, avgSat: 1330, avgAct: 29, acceptanceRate: 0.38, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-gettysburg", name: "Gettysburg College", avgGpaUnweighted: 3.60, avgSat: 1300, avgAct: 28, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bucknell", name: "Bucknell University", avgGpaUnweighted: 3.70, avgSat: 1380, avgAct: 30, acceptanceRate: 0.32, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-lafayette", name: "Lafayette College", avgGpaUnweighted: 3.60, avgSat: 1350, avgAct: 29, acceptanceRate: 0.32, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-union", name: "Union College", avgGpaUnweighted: 3.60, avgSat: 1360, avgAct: 30, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-coloradocollege", name: "Colorado College", avgGpaUnweighted: 3.70, avgSat: 1400, avgAct: 31, acceptanceRate: 0.15, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-whitman", name: "Whitman College", avgGpaUnweighted: 3.70, avgSat: 1370, avgAct: 30, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-reed", name: "Reed College", avgGpaUnweighted: 3.70, avgSat: 1420, avgAct: 31, acceptanceRate: 0.35, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-occidental", name: "Occidental College", avgGpaUnweighted: 3.70, avgSat: 1370, avgAct: 30, acceptanceRate: 0.35, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-scripps", name: "Scripps College", avgGpaUnweighted: 3.80, avgSat: 1420, avgAct: 31, acceptanceRate: 0.30, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-pitzer", name: "Pitzer College", avgGpaUnweighted: 3.70, avgSat: 1360, avgAct: 30, acceptanceRate: 0.18, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-harveymudd", name: "Harvey Mudd College", avgGpaUnweighted: 3.90, avgSat: 1530, avgAct: 34, acceptanceRate: 0.13, needBlind: false, sourceCitation: CDS_CITATION },

  // Public flagships and elite public research universities
  { id: "college-ucsd", name: "University of California, San Diego", avgGpaUnweighted: 3.90, avgSat: 1390, avgAct: 31, acceptanceRate: 0.24, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucdavis", name: "University of California, Davis", avgGpaUnweighted: 3.85, avgSat: 1330, avgAct: 29, acceptanceRate: 0.36, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucirvine", name: "University of California, Irvine", avgGpaUnweighted: 3.85, avgSat: 1340, avgAct: 29, acceptanceRate: 0.21, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucsb", name: "University of California, Santa Barbara", avgGpaUnweighted: 3.90, avgSat: 1370, avgAct: 30, acceptanceRate: 0.26, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucsc", name: "University of California, Santa Cruz", avgGpaUnweighted: 3.70, avgSat: 1280, avgAct: 27, acceptanceRate: 0.46, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucriverside", name: "University of California, Riverside", avgGpaUnweighted: 3.60, avgSat: 1180, avgAct: 24, acceptanceRate: 0.60, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucmerced", name: "University of California, Merced", avgGpaUnweighted: 3.50, avgSat: 1120, avgAct: 22, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uflorida", name: "University of Florida", avgGpaUnweighted: 4.00, avgSat: 1380, avgAct: 30, acceptanceRate: 0.24, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-utaustin", name: "University of Texas at Austin", avgGpaUnweighted: 3.80, avgSat: 1355, avgAct: 30, acceptanceRate: 0.29, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-tamu", name: "Texas A&M University", avgGpaUnweighted: 3.70, avgSat: 1280, avgAct: 28, acceptanceRate: 0.63, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-gatech", name: "Georgia Institute of Technology", avgGpaUnweighted: 3.90, avgSat: 1480, avgAct: 33, acceptanceRate: 0.16, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ugeorgia", name: "University of Georgia", avgGpaUnweighted: 3.90, avgSat: 1330, avgAct: 29, acceptanceRate: 0.40, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uiuc", name: "University of Illinois Urbana-Champaign", avgGpaUnweighted: 3.80, avgSat: 1390, avgAct: 31, acceptanceRate: 0.44, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-purdue", name: "Purdue University", avgGpaUnweighted: 3.70, avgSat: 1330, avgAct: 29, acceptanceRate: 0.53, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-umd", name: "University of Maryland, College Park", avgGpaUnweighted: 3.80, avgSat: 1370, avgAct: 31, acceptanceRate: 0.44, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-umass", name: "University of Massachusetts Amherst", avgGpaUnweighted: 3.60, avgSat: 1310, avgAct: 29, acceptanceRate: 0.58, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uminnesota", name: "University of Minnesota, Twin Cities", avgGpaUnweighted: 3.70, avgSat: 1350, avgAct: 28, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uiowa", name: "University of Iowa", avgGpaUnweighted: 3.60, avgSat: 1220, avgAct: 25, acceptanceRate: 0.83, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ukansas", name: "University of Kansas", avgGpaUnweighted: 3.60, avgSat: 1200, avgAct: 25, acceptanceRate: 0.88, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-umissouri", name: "University of Missouri", avgGpaUnweighted: 3.60, avgSat: 1210, avgAct: 25, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unl", name: "University of Nebraska–Lincoln", avgGpaUnweighted: 3.60, avgSat: 1190, avgAct: 24, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-cuboulder", name: "University of Colorado Boulder", avgGpaUnweighted: 3.60, avgSat: 1260, avgAct: 27, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-utah", name: "University of Utah", avgGpaUnweighted: 3.70, avgSat: 1200, avgAct: 25, acceptanceRate: 0.83, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uoregon", name: "University of Oregon", avgGpaUnweighted: 3.60, avgSat: 1190, avgAct: 25, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-oregonstate", name: "Oregon State University", avgGpaUnweighted: 3.60, avgSat: 1180, avgAct: 25, acceptanceRate: 0.82, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wsu", name: "Washington State University", avgGpaUnweighted: 3.50, avgSat: 1100, avgAct: 22, acceptanceRate: 0.83, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unm", name: "University of New Mexico", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.96, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unr", name: "University of Nevada, Reno", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unlv", name: "University of Nevada, Las Vegas", avgGpaUnweighted: 3.40, avgSat: 1050, avgAct: 20, acceptanceRate: 0.86, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uhawaii", name: "University of Hawaii at Manoa", avgGpaUnweighted: 3.50, avgSat: 1130, avgAct: 23, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-auburn", name: "Auburn University", avgGpaUnweighted: 3.80, avgSat: 1240, avgAct: 27, acceptanceRate: 0.44, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-olemiss", name: "University of Mississippi", avgGpaUnweighted: 3.50, avgSat: 1130, avgAct: 23, acceptanceRate: 0.94, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-msstate", name: "Mississippi State University", avgGpaUnweighted: 3.50, avgSat: 1100, avgAct: 22, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-utk", name: "University of Tennessee, Knoxville", avgGpaUnweighted: 3.70, avgSat: 1230, avgAct: 27, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ukentucky", name: "University of Kentucky", avgGpaUnweighted: 3.60, avgSat: 1150, avgAct: 24, acceptanceRate: 0.94, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-scarolina", name: "University of South Carolina", avgGpaUnweighted: 3.70, avgSat: 1230, avgAct: 27, acceptanceRate: 0.63, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-clemson", name: "Clemson University", avgGpaUnweighted: 3.90, avgSat: 1310, avgAct: 29, acceptanceRate: 0.43, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ncstate", name: "North Carolina State University", avgGpaUnweighted: 4.00, avgSat: 1330, avgAct: 29, acceptanceRate: 0.44, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-vt", name: "Virginia Tech", avgGpaUnweighted: 4.00, avgSat: 1330, avgAct: 29, acceptanceRate: 0.56, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wm", name: "College of William & Mary", avgGpaUnweighted: 3.90, avgSat: 1420, avgAct: 32, acceptanceRate: 0.33, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-gmu", name: "George Mason University", avgGpaUnweighted: 3.60, avgSat: 1210, avgAct: 25, acceptanceRate: 0.90, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-udel", name: "University of Delaware", avgGpaUnweighted: 3.60, avgSat: 1250, avgAct: 27, acceptanceRate: 0.72, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uconn", name: "University of Connecticut", avgGpaUnweighted: 3.90, avgSat: 1330, avgAct: 29, acceptanceRate: 0.51, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uvm", name: "University of Vermont", avgGpaUnweighted: 3.60, avgSat: 1280, avgAct: 28, acceptanceRate: 0.61, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unh", name: "University of New Hampshire", avgGpaUnweighted: 3.60, avgSat: 1190, avgAct: 25, acceptanceRate: 0.84, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-umaine", name: "University of Maine", avgGpaUnweighted: 3.30, avgSat: 1140, avgAct: 23, acceptanceRate: 0.92, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uri", name: "University of Rhode Island", avgGpaUnweighted: 3.40, avgSat: 1180, avgAct: 24, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-temple", name: "Temple University", avgGpaUnweighted: 3.50, avgSat: 1240, avgAct: 27, acceptanceRate: 0.66, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-pitt", name: "University of Pittsburgh", avgGpaUnweighted: 3.80, avgSat: 1370, avgAct: 30, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-drexel", name: "Drexel University", avgGpaUnweighted: 3.50, avgSat: 1280, avgAct: 28, acceptanceRate: 0.72, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucincinnati", name: "University of Cincinnati", avgGpaUnweighted: 3.60, avgSat: 1220, avgAct: 26, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-miamioh", name: "Miami University (Ohio)", avgGpaUnweighted: 3.80, avgSat: 1270, avgAct: 28, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-dayton", name: "University of Dayton", avgGpaUnweighted: 3.60, avgSat: 1220, avgAct: 26, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-kentstate", name: "Kent State University", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bgsu", name: "Bowling Green State University", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.88, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-akron", name: "University of Akron", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-toledo", name: "University of Toledo", avgGpaUnweighted: 3.40, avgSat: 1050, avgAct: 20, acceptanceRate: 0.90, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wrightstate", name: "Wright State University", avgGpaUnweighted: 3.30, avgSat: 1030, avgAct: 20, acceptanceRate: 0.90, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-cmich", name: "Central Michigan University", avgGpaUnweighted: 3.40, avgSat: 1050, avgAct: 21, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wmich", name: "Western Michigan University", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-emich", name: "Eastern Michigan University", avgGpaUnweighted: 3.30, avgSat: 1020, avgAct: 19, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-buffalo", name: "University at Buffalo", avgGpaUnweighted: 3.70, avgSat: 1300, avgAct: 28, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-stonybrook", name: "Stony Brook University", avgGpaUnweighted: 3.80, avgSat: 1350, avgAct: 29, acceptanceRate: 0.44, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-binghamton", name: "Binghamton University", avgGpaUnweighted: 3.90, avgSat: 1380, avgAct: 30, acceptanceRate: 0.40, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-albany", name: "University at Albany", avgGpaUnweighted: 3.50, avgSat: 1200, avgAct: 25, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-lsu", name: "Louisiana State University", avgGpaUnweighted: 3.60, avgSat: 1200, avgAct: 25, acceptanceRate: 0.73, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uark", name: "University of Arkansas", avgGpaUnweighted: 3.60, avgSat: 1150, avgAct: 24, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ou", name: "University of Oklahoma", avgGpaUnweighted: 3.70, avgSat: 1230, avgAct: 27, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-okstate", name: "Oklahoma State University", avgGpaUnweighted: 3.60, avgSat: 1140, avgAct: 24, acceptanceRate: 0.71, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-kstate", name: "Kansas State University", avgGpaUnweighted: 3.50, avgSat: 1130, avgAct: 23, acceptanceRate: 0.94, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-iastate", name: "Iowa State University", avgGpaUnweighted: 3.60, avgSat: 1160, avgAct: 24, acceptanceRate: 0.88, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-sdstate", name: "South Dakota State University", avgGpaUnweighted: 3.50, avgSat: 1100, avgAct: 22, acceptanceRate: 0.90, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ndsu", name: "North Dakota State University", avgGpaUnweighted: 3.50, avgSat: 1090, avgAct: 22, acceptanceRate: 0.94, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-mtstate", name: "Montana State University", avgGpaUnweighted: 3.40, avgSat: 1090, avgAct: 22, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-umontana", name: "University of Montana", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.94, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uwyoming", name: "University of Wyoming", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 22, acceptanceRate: 0.96, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uidaho", name: "University of Idaho", avgGpaUnweighted: 3.50, avgSat: 1090, avgAct: 22, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-boisestate", name: "Boise State University", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },

  // HBCUs
  { id: "college-howard", name: "Howard University", avgGpaUnweighted: 3.60, avgSat: 1220, avgAct: 26, acceptanceRate: 0.36, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-spelman", name: "Spelman College", avgGpaUnweighted: 3.70, avgSat: 1180, avgAct: 25, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-morehouse", name: "Morehouse College", avgGpaUnweighted: 3.40, avgSat: 1100, avgAct: 23, acceptanceRate: 0.55, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-hampton", name: "Hampton University", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-xavierla", name: "Xavier University of Louisiana", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.60, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-tuskegee", name: "Tuskegee University", avgGpaUnweighted: 3.30, avgSat: 1000, avgAct: 19, acceptanceRate: 0.50, needBlind: false, sourceCitation: CDS_CITATION },

  // Religious and other notable private universities
  { id: "college-baylor", name: "Baylor University", avgGpaUnweighted: 3.70, avgSat: 1310, avgAct: 29, acceptanceRate: 0.45, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-tcu", name: "Texas Christian University", avgGpaUnweighted: 3.70, avgSat: 1280, avgAct: 27, acceptanceRate: 0.47, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-byu", name: "Brigham Young University", avgGpaUnweighted: 3.80, avgSat: 1360, avgAct: 29, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-lmu", name: "Loyola Marymount University", avgGpaUnweighted: 3.70, avgSat: 1280, avgAct: 27, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-scu", name: "Santa Clara University", avgGpaUnweighted: 3.90, avgSat: 1400, avgAct: 31, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-usd", name: "University of San Diego", avgGpaUnweighted: 3.70, avgSat: 1290, avgAct: 28, acceptanceRate: 0.50, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-udenver", name: "University of Denver", avgGpaUnweighted: 3.60, avgSat: 1270, avgAct: 27, acceptanceRate: 0.65, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-tulsa", name: "University of Tulsa", avgGpaUnweighted: 3.70, avgSat: 1290, avgAct: 27, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-creighton", name: "Creighton University", avgGpaUnweighted: 3.70, avgSat: 1250, avgAct: 27, acceptanceRate: 0.72, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-marquette", name: "Marquette University", avgGpaUnweighted: 3.60, avgSat: 1240, avgAct: 26, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-depaul", name: "DePaul University", avgGpaUnweighted: 3.50, avgSat: 1160, avgAct: 24, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-loyolachicago", name: "Loyola University Chicago", avgGpaUnweighted: 3.60, avgSat: 1240, avgAct: 26, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-xavierohio", name: "Xavier University (Ohio)", avgGpaUnweighted: 3.50, avgSat: 1150, avgAct: 23, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-slu", name: "Saint Louis University", avgGpaUnweighted: 3.70, avgSat: 1270, avgAct: 27, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },

  // Additional regional publics
  { id: "college-uh", name: "University of Houston", avgGpaUnweighted: 3.60, avgSat: 1230, avgAct: 26, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-unt", name: "University of North Texas", avgGpaUnweighted: 3.50, avgSat: 1140, avgAct: 23, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ttu", name: "Texas Tech University", avgGpaUnweighted: 3.50, avgSat: 1160, avgAct: 24, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-utdallas", name: "University of Texas at Dallas", avgGpaUnweighted: 3.80, avgSat: 1370, avgAct: 30, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-utsa", name: "University of Texas at San Antonio", avgGpaUnweighted: 3.40, avgSat: 1100, avgAct: 22, acceptanceRate: 0.86, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-sdsu", name: "San Diego State University", avgGpaUnweighted: 3.80, avgSat: 1240, avgAct: 26, acceptanceRate: 0.35, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-sjsu", name: "San Jose State University", avgGpaUnweighted: 3.60, avgSat: 1150, avgAct: 23, acceptanceRate: 0.66, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-calpoly", name: "California Polytechnic State University, San Luis Obispo", avgGpaUnweighted: 4.00, avgSat: 1350, avgAct: 29, acceptanceRate: 0.28, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-csulb", name: "California State University, Long Beach", avgGpaUnweighted: 3.70, avgSat: 1150, avgAct: 23, acceptanceRate: 0.40, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-csuf", name: "California State University, Fullerton", avgGpaUnweighted: 3.60, avgSat: 1130, avgAct: 22, acceptanceRate: 0.60, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-csus", name: "California State University, Sacramento", avgGpaUnweighted: 3.40, avgSat: 1080, avgAct: 21, acceptanceRate: 0.86, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-pacific", name: "University of the Pacific", avgGpaUnweighted: 3.60, avgSat: 1200, avgAct: 25, acceptanceRate: 0.65, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-chapman", name: "Chapman University", avgGpaUnweighted: 3.80, avgSat: 1290, avgAct: 28, acceptanceRate: 0.50, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-usfca", name: "University of San Francisco", avgGpaUnweighted: 3.60, avgSat: 1230, avgAct: 27, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },

  // STEM-focused institutes
  { id: "college-rpi", name: "Rensselaer Polytechnic Institute", avgGpaUnweighted: 3.80, avgSat: 1420, avgAct: 32, acceptanceRate: 0.50, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wpi", name: "Worcester Polytechnic Institute", avgGpaUnweighted: 3.80, avgSat: 1390, avgAct: 31, acceptanceRate: 0.48, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-illinoistech", name: "Illinois Institute of Technology", avgGpaUnweighted: 3.60, avgSat: 1330, avgAct: 29, acceptanceRate: 0.55, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-stevens", name: "Stevens Institute of Technology", avgGpaUnweighted: 3.80, avgSat: 1440, avgAct: 32, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-rosehulman", name: "Rose-Hulman Institute of Technology", avgGpaUnweighted: 3.90, avgSat: 1420, avgAct: 32, acceptanceRate: 0.65, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-mines", name: "Colorado School of Mines", avgGpaUnweighted: 3.80, avgSat: 1350, avgAct: 30, acceptanceRate: 0.55, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-mst", name: "Missouri University of Science and Technology", avgGpaUnweighted: 3.70, avgSat: 1290, avgAct: 28, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-njit", name: "New Jersey Institute of Technology", avgGpaUnweighted: 3.70, avgSat: 1300, avgAct: 28, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },

  // Additional regional and mid-size universities
  { id: "college-american", name: "American University", avgGpaUnweighted: 3.60, avgSat: 1260, avgAct: 27, acceptanceRate: 0.41, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-cua", name: "Catholic University of America", avgGpaUnweighted: 3.50, avgSat: 1180, avgAct: 25, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-gonzaga", name: "Gonzaga University", avgGpaUnweighted: 3.70, avgSat: 1270, avgAct: 27, acceptanceRate: 0.72, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-seattleu", name: "Seattle University", avgGpaUnweighted: 3.60, avgSat: 1210, avgAct: 26, acceptanceRate: 0.78, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-uportland", name: "University of Portland", avgGpaUnweighted: 3.60, avgSat: 1200, avgAct: 25, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-bentley", name: "Bentley University", avgGpaUnweighted: 3.60, avgSat: 1290, avgAct: 28, acceptanceRate: 0.60, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-babson", name: "Babson College", avgGpaUnweighted: 3.60, avgSat: 1330, avgAct: 29, acceptanceRate: 0.22, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-fairfield", name: "Fairfield University", avgGpaUnweighted: 3.60, avgSat: 1270, avgAct: 27, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-providence", name: "Providence College", avgGpaUnweighted: 3.60, avgSat: 1260, avgAct: 27, acceptanceRate: 0.68, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-quinnipiac", name: "Quinnipiac University", avgGpaUnweighted: 3.50, avgSat: 1180, avgAct: 25, acceptanceRate: 0.80, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-loyolamd", name: "Loyola University Maryland", avgGpaUnweighted: 3.60, avgSat: 1230, avgAct: 26, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-stetson", name: "Stetson University", avgGpaUnweighted: 3.50, avgSat: 1170, avgAct: 24, acceptanceRate: 0.72, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-rollins", name: "Rollins College", avgGpaUnweighted: 3.60, avgSat: 1200, avgAct: 25, acceptanceRate: 0.62, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-highpoint", name: "High Point University", avgGpaUnweighted: 3.40, avgSat: 1130, avgAct: 23, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-butler", name: "Butler University", avgGpaUnweighted: 3.70, avgSat: 1230, avgAct: 27, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-valpo", name: "Valparaiso University", avgGpaUnweighted: 3.50, avgSat: 1150, avgAct: 24, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-muhlenberg", name: "Muhlenberg College", avgGpaUnweighted: 3.50, avgSat: 1250, avgAct: 28, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ursinus", name: "Ursinus College", avgGpaUnweighted: 3.50, avgSat: 1220, avgAct: 27, acceptanceRate: 0.65, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-usf", name: "University of South Florida", avgGpaUnweighted: 3.90, avgSat: 1280, avgAct: 27, acceptanceRate: 0.44, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-fiu", name: "Florida International University", avgGpaUnweighted: 3.60, avgSat: 1180, avgAct: 24, acceptanceRate: 0.63, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-fau", name: "Florida Atlantic University", avgGpaUnweighted: 3.50, avgSat: 1150, avgAct: 23, acceptanceRate: 0.70, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-colostate", name: "Colorado State University", avgGpaUnweighted: 3.60, avgSat: 1170, avgAct: 24, acceptanceRate: 0.84, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-louisville", name: "University of Louisville", avgGpaUnweighted: 3.70, avgSat: 1210, avgAct: 26, acceptanceRate: 0.71, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-fsu", name: "Florida State University", avgGpaUnweighted: 3.90, avgSat: 1300, avgAct: 28, acceptanceRate: 0.35, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-wvu", name: "West Virginia University", avgGpaUnweighted: 3.50, avgSat: 1130, avgAct: 23, acceptanceRate: 0.90, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-ucf", name: "University of Central Florida", avgGpaUnweighted: 4.00, avgSat: 1310, avgAct: 28, acceptanceRate: 0.42, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-richmond", name: "University of Richmond", avgGpaUnweighted: 3.70, avgSat: 1370, avgAct: 31, acceptanceRate: 0.27, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-elon", name: "Elon University", avgGpaUnweighted: 3.70, avgSat: 1230, avgAct: 27, acceptanceRate: 0.75, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-furman", name: "Furman University", avgGpaUnweighted: 3.70, avgSat: 1300, avgAct: 28, acceptanceRate: 0.60, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-jmu", name: "James Madison University", avgGpaUnweighted: 3.70, avgSat: 1200, avgAct: 25, acceptanceRate: 0.79, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-vcu", name: "Virginia Commonwealth University", avgGpaUnweighted: 3.60, avgSat: 1170, avgAct: 24, acceptanceRate: 0.85, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-odu", name: "Old Dominion University", avgGpaUnweighted: 3.40, avgSat: 1100, avgAct: 22, acceptanceRate: 0.90, needBlind: false, sourceCitation: CDS_CITATION },
  { id: "college-txstate", name: "Texas State University", avgGpaUnweighted: 3.40, avgSat: 1120, avgAct: 22, acceptanceRate: 0.83, needBlind: false, sourceCitation: CDS_CITATION },
];
