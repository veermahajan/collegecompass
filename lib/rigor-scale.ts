// Honors & awards rigor scale (replaces the old school/regional/state/
// national/international tier with a 1-10 gradient). A single "national"
// tag couldn't distinguish an AP Scholar Award from a USAJMO qualification
// even though the barrier to entry is wildly different — this scale is
// meant to track selectivity/rigor directly instead. Anchors: 1 = AP
// Scholar (open to any qualifying AP student), 6 = AIME qualification,
// 8 = USAJMO, 9 = MOSP, 10 = IMO. Consumed by app/profile/honor-section.tsx
// (the picker + reference table) and lib/compass-score.ts (scoring).

export type RigorLevelGuide = {
  level: number;
  label: string;
  description: string;
  example: string;
};

export const RIGOR_LEVEL_GUIDE: RigorLevelGuide[] = [
  {
    level: 1,
    label: "Getting started",
    description:
      "Open to essentially any student who meets a basic bar — no competition against other applicants.",
    example: "AP Scholar Award",
  },
  {
    level: 2,
    label: "Consistent involvement",
    description:
      "Regular participation or a minor role beyond just showing up, still entirely school-based.",
    example: "Math Honor Society induction",
  },
  {
    level: 3,
    label: "School standout",
    description:
      "Recognized leadership or achievement within your own school, or your first step into competing beyond it.",
    example: "Student body president",
  },
  {
    level: 4,
    label: "Regional recognition",
    description:
      "Now competing against students from other schools in your area and placing or qualifying.",
    example: "Regional Science Fair qualifier",
  },
  {
    level: 5,
    label: "State-level achievement",
    description:
      "Recognition across an entire state, or sustained real leadership rather than a title alone.",
    example: "All-State Orchestra",
  },
  {
    level: 6,
    label: "National qualifying threshold",
    description:
      "A well-known national-caliber cutoff — the point where a result starts reading as genuinely competitive nationally.",
    example: "AIME qualification",
  },
  {
    level: 7,
    label: "National recognition",
    description:
      "Named among a select group at the national level, beyond just clearing the qualifying bar.",
    example: "National Merit Finalist",
  },
  {
    level: 8,
    label: "National finals",
    description:
      "Competed in (or won at) the actual national finals of a well-known competition — a small fraction of qualifiers get here.",
    example: "USAJMO qualifier",
  },
  {
    level: 9,
    label: "Elite invitation-only program",
    description:
      "Selected into a highly selective national training program that most national qualifiers never reach.",
    example: "MOP/MOSP (Math Olympiad Summer Program)",
  },
  {
    level: 10,
    label: "International representation",
    description:
      "Represented the U.S. (or your country) internationally — among a literal handful of students nationwide.",
    example: "IMO team member",
  },
];

export type RigorSampleActivity = {
  category: string;
  activity: string;
  level: number;
};

export const RIGOR_SAMPLE_ACTIVITIES: RigorSampleActivity[] = [
  // Math & Quant Competitions
  { category: "Math & Quant", activity: "AP Scholar Award (Calculus/Statistics)", level: 1 },
  { category: "Math & Quant", activity: "Mu Alpha Theta (Math Honor Society) induction", level: 2 },
  { category: "Math & Quant", activity: "School Math Team regular member", level: 2 },
  { category: "Math & Quant", activity: "AMC 10/12 participant", level: 3 },
  { category: "Math & Quant", activity: "AMC 10/12 Honor Roll / Distinction", level: 4 },
  { category: "Math & Quant", activity: "State MATHCOUNTS qualifier", level: 5 },
  { category: "Math & Quant", activity: "AIME qualification", level: 6 },
  { category: "Math & Quant", activity: "USAMTS top scorer", level: 7 },
  { category: "Math & Quant", activity: "USAJMO / USAMO qualifier", level: 8 },
  { category: "Math & Quant", activity: "MOP/MOSP (Math Olympiad Summer Program) selection", level: 9 },
  { category: "Math & Quant", activity: "IMO team member", level: 10 },

  // Science & Research
  { category: "Science & Research", activity: "Science National Honor Society induction", level: 1 },
  { category: "Science & Research", activity: "School science fair participant", level: 2 },
  { category: "Science & Research", activity: "Regional science fair qualifier", level: 3 },
  { category: "Science & Research", activity: "Science Olympiad regional medal", level: 4 },
  { category: "Science & Research", activity: "State Science Fair finalist", level: 5 },
  { category: "Science & Research", activity: "Junior Science & Humanities Symposium regional winner", level: 6 },
  { category: "Science & Research", activity: "Regeneron ISEF qualifier", level: 7 },
  { category: "Science & Research", activity: "Regeneron ISEF Grand Award finalist", level: 8 },
  { category: "Science & Research", activity: "Research Science Institute (RSI) selection", level: 9 },
  { category: "Science & Research", activity: "USA Biology/Chemistry/Physics Olympiad team member", level: 10 },

  // Computer Science
  { category: "Computer Science", activity: "School coding club member", level: 1 },
  { category: "Computer Science", activity: "AP Computer Science A, score of 5", level: 2 },
  { category: "Computer Science", activity: "USACO Bronze division", level: 3 },
  { category: "Computer Science", activity: "Congressional App Challenge district winner", level: 4 },
  { category: "Computer Science", activity: "USACO Silver division", level: 5 },
  { category: "Computer Science", activity: "USACO Gold division", level: 6 },
  { category: "Computer Science", activity: "Major League Hacking national hackathon top prize", level: 7 },
  { category: "Computer Science", activity: "USACO Platinum division", level: 8 },
  { category: "Computer Science", activity: "ICPC World Finals qualifier", level: 9 },
  { category: "Computer Science", activity: "International Olympiad in Informatics (IOI) team member", level: 10 },

  // Debate & Speech
  { category: "Debate & Speech", activity: "School debate club member", level: 1 },
  { category: "Debate & Speech", activity: "Novice tournament participant", level: 2 },
  { category: "Debate & Speech", activity: "JV-to-varsity call-up", level: 3 },
  { category: "Debate & Speech", activity: "District/regional debate qualifier", level: 4 },
  { category: "Debate & Speech", activity: "State debate tournament qualifier", level: 5 },
  { category: "Debate & Speech", activity: "State debate champion", level: 6 },
  { category: "Debate & Speech", activity: "NSDA Nationals qualifier", level: 7 },
  { category: "Debate & Speech", activity: "NSDA Nationals elimination rounds (top 60)", level: 8 },
  { category: "Debate & Speech", activity: "Tournament of Champions (TOC) qualifier", level: 9 },
  { category: "Debate & Speech", activity: "World Schools Debating Championships national team", level: 10 },

  // Writing & Literature
  { category: "Writing & Literature", activity: "School newspaper staff writer", level: 1 },
  { category: "Writing & Literature", activity: "Literary magazine contributor", level: 2 },
  { category: "Writing & Literature", activity: "School newspaper/yearbook editor-in-chief", level: 3 },
  { category: "Writing & Literature", activity: "Scholastic Art & Writing Regional Honorable Mention", level: 4 },
  { category: "Writing & Literature", activity: "Scholastic Art & Writing Regional Gold Key", level: 5 },
  { category: "Writing & Literature", activity: "Scholastic Art & Writing National Silver Medal", level: 6 },
  { category: "Writing & Literature", activity: "Published in a recognized national youth literary journal", level: 7 },
  { category: "Writing & Literature", activity: "Scholastic Art & Writing National Gold Medal", level: 8 },
  { category: "Writing & Literature", activity: "National Student Poets Program honoree", level: 9 },
  { category: "Writing & Literature", activity: "Foyle Young Poets of the Year, top international winner", level: 10 },

  // Music
  { category: "Music", activity: "School band/orchestra/choir member", level: 1 },
  { category: "Music", activity: "County/district honor ensemble", level: 2 },
  { category: "Music", activity: "All-Region orchestra/band/choir", level: 3 },
  { category: "Music", activity: "Concerto competition regional winner", level: 4 },
  { category: "Music", activity: "All-State orchestra/band/choir", level: 5 },
  { category: "Music", activity: "YoungArts merit award (music)", level: 6 },
  { category: "Music", activity: "YoungArts finalist (music)", level: 7 },
  { category: "Music", activity: "National Youth Orchestra (NYO-USA) member", level: 8 },
  { category: "Music", activity: "Young Concert Artists international auditions winner", level: 9 },
  { category: "Music", activity: "Menuhin/Tchaikovsky international competition winner", level: 10 },

  // Visual & Performing Arts
  { category: "Visual & Performing Arts", activity: "Art/theater club member", level: 1 },
  { category: "Visual & Performing Arts", activity: "School art show exhibitor / school play cast member", level: 2 },
  { category: "Visual & Performing Arts", activity: "School play lead role / gallery feature", level: 3 },
  { category: "Visual & Performing Arts", activity: "Scholastic Art & Writing Regional Gold Key (art)", level: 4 },
  { category: "Visual & Performing Arts", activity: "State Thespian Festival participant", level: 5 },
  { category: "Visual & Performing Arts", activity: "Scholastic Art & Writing National Silver Medal (art)", level: 6 },
  { category: "Visual & Performing Arts", activity: "International Thespian Festival main-stage selection", level: 7 },
  { category: "Visual & Performing Arts", activity: "Scholastic Art & Writing National Gold Medal (art)", level: 8 },
  { category: "Visual & Performing Arts", activity: "YoungArts finalist (visual/performing arts)", level: 9 },
  { category: "Visual & Performing Arts", activity: "Presidential Scholar in the Arts", level: 10 },

  // Athletics
  { category: "Athletics", activity: "JV team member", level: 1 },
  { category: "Athletics", activity: "Varsity team member", level: 2 },
  { category: "Athletics", activity: "Team captain", level: 3 },
  { category: "Athletics", activity: "All-Conference honor", level: 4 },
  { category: "Athletics", activity: "All-Region honor", level: 5 },
  { category: "Athletics", activity: "All-State honor", level: 6 },
  { category: "Athletics", activity: "All-American honorable mention", level: 7 },
  { category: "Athletics", activity: "All-American first team", level: 8 },
  { category: "Athletics", activity: "Junior national team member (e.g., USA Swimming Juniors)", level: 9 },
  { category: "Athletics", activity: "Senior national team / international competitor", level: 10 },

  // Leadership & Service
  { category: "Leadership & Service", activity: "Club member", level: 1 },
  { category: "Leadership & Service", activity: "Club officer", level: 2 },
  { category: "Leadership & Service", activity: "Class officer", level: 3 },
  { category: "Leadership & Service", activity: "Student body president", level: 4 },
  { category: "Leadership & Service", activity: "Founder of a school-based service initiative", level: 5 },
  { category: "Leadership & Service", activity: "Eagle Scout / Girl Scout Gold Award", level: 6 },
  { category: "Leadership & Service", activity: "State-level youth leadership program (e.g., Governor's School)", level: 7 },
  { category: "Leadership & Service", activity: "U.S. Senate Youth Program delegate", level: 8 },
  { category: "Leadership & Service", activity: "Presidential Scholars Program honoree", level: 9 },
  { category: "Leadership & Service", activity: "United Nations Youth Assembly delegate", level: 10 },

  // Global Affairs & Business
  { category: "Global Affairs & Business", activity: "Model UN / DECA club member", level: 1 },
  { category: "Global Affairs & Business", activity: "Local Model UN conference delegate", level: 2 },
  { category: "Global Affairs & Business", activity: "DECA/FBLA regional qualifier", level: 3 },
  { category: "Global Affairs & Business", activity: "DECA/FBLA state qualifier", level: 4 },
  { category: "Global Affairs & Business", activity: "National Model UN conference (e.g., NHSMUN) delegate", level: 5 },
  { category: "Global Affairs & Business", activity: "DECA/FBLA state champion", level: 6 },
  { category: "Global Affairs & Business", activity: "DECA/FBLA International Career Development Conference qualifier", level: 7 },
  { category: "Global Affairs & Business", activity: "Conrad Challenge / Diamond Challenge national finalist", level: 8 },
  { category: "Global Affairs & Business", activity: "Thiel Fellowship / national startup accelerator selection", level: 9 },
  { category: "Global Affairs & Business", activity: "International business plan competition, global winner", level: 10 },
];
