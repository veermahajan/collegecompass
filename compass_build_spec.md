# Compass — Build Specification for Fable

**Status:** MVP build brief. Locked contracts below are not up for reinterpretation mid-build.
**Founders:** Geetansh Dhuria, Veer Mahajan
**Purpose of this document:** hand two independent build sessions ("Workflow A" and "Workflow B") enough shared contract that they can build in parallel without touching the same files, tables, or routes.

---

## 0. How To Use This Document

1. Read Section 4 (Data Model) first, in full, before writing any code. It is the shared contract. Neither workflow modifies it unilaterally — if a workflow discovers the schema is wrong, stop, flag it, do not patch around it silently.
2. Workflow A and Workflow B operate in **separate git branches**: `workflow-a/profile-calculators` and `workflow-b/content-community`. Neither touches the other's route folders or components. Merge only via PR review against `main`.
3. Each phase within a workflow is a checkpoint. Finish and verify one phase before starting the next. Do not run three phases at once and hope it compiles.
4. If a phase depends on something the other workflow owns (rare — flagged explicitly below), stub it with a typed mock and move on. Do not block.

---

## 1. Mission & Differentiators

Compass is a free, all-in-one college application tool built by current high schoolers, for students without access to paid counselors.

**What makes this different from CollegeVine, Naviance, or a subreddit:**
- Built and maintained by actual current high schoolers who went through this last cycle, not consultants or a company.
- All-encompassing: profile tracking, GPA calculation, college list generation, essay support, and a writing journal in one place, not one narrow tool.
- Testimonials and concrete tips from students who were just accepted — recency and relatability over generic advice.
- Direct one-on-one contact with the founders is a real feature, not a buried contact form. Students can actually reach a human who just did this.

**What Compass explicitly does NOT do:**
- It does not predict admission chances. Any score is directional — a self-assessment tool, never a probability.
- It does not compare a user against a fabricated "ideal student" profile. That feature is cut. Do not build it, do not resurrect it later without a full re-scoping conversation.

---

## 2. Design Tokens (reference — full mockup in `compass_homepage_mockup.html`)

```
Canvas:      #FBF7EE
Canvas Deep: #F3EDDF
Ink:         #2B2B26
Ink Soft:    #5B5A50
Sage:        #7C9473   (growth / primary)
Sage Deep:   #5F7857
Gold:        #D9A441   (achievement / accent)
Sky:         #6E9CB0   (collaboration / secondary)
Line:        #E8E0CF

Display font: Fraunces (600 weight, used for headings only)
Body font:    Inter
Mono/data:    IBM Plex Mono (scores, numbers, timestamps)

Nav pattern: horizontal top tabs ≥860px, hamburger + slide-down menu <860px
Signature motif: five-spoke radar/compass shape — used as logo mark, section
dividers, and the Compass Score visualization. Do not introduce a second
unrelated icon system.
```

Both workflows use this token set. Do not invent parallel color variables.

---

## 3. Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Neon Postgres
- **ORM:** Prisma
- **Auth:** Auth.js (NextAuth v5)
- **Styling:** Tailwind CSS, tokens above wired into `tailwind.config`
- **Hosting:** Vercel
- **Validation:** Zod on every API route input
- **Rate limiting:** Upstash Redis (or Vercel-native equivalent)
- **Error tracking:** Sentry, with PII scrubbing enabled (Section 8)

This matches the stack pattern already in use on other active projects — no reason to fragment tooling.

---

## 4. Data Model — Shared Contract (LOCKED)

Build this schema in full, in `prisma/schema.prisma`, **before either workflow starts feature work.** Whoever builds it first commits it to `main` and both branches pull from there. Do not let each workflow define its own competing version.

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  passwordHash      String
  displayName       String
  gradeLevel        String
  ageConfirmed13Plus Boolean  @default(false)
  consentSensitiveData Boolean @default(false) // explicit opt-in, see Sec 8
  createdAt         DateTime  @default(now())
  deletedAt         DateTime? // soft-delete flag, hard delete job runs on schedule

  profile           AcademicProfile?
  journalEntries    JournalEntry[]
  collegeListItems  CollegeListEntry[]
  feedbackSubmissions FeedbackSubmission[]
}

// ---- Owned primarily by Workflow A ----

model AcademicProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  unweightedGpa     Float?
  ucWeightedGpa     Float?
  satScore          Int?
  actScore          Int?
  courses           Course[]
  extracurriculars  ExtracurricularEntry[]
  honors            HonorAward[]
  updatedAt         DateTime @updatedAt
}

model Course {
  id            String   @id @default(cuid())
  profileId     String
  profile       AcademicProfile @relation(fields: [profileId], references: [id])
  name          String
  level         String   // Regular / Honors / AP / IB / DualEnrollment
  gradeReceived String
  rigorPoints   Float    // computed, see A2
}

model ExtracurricularEntry {
  id            String   @id @default(cuid())
  profileId     String
  profile       AcademicProfile @relation(fields: [profileId], references: [id])
  title         String
  category      String
  hoursPerWeek  Float
  weeksPerYear  Int
  description   String
}

model HonorAward {
  id            String   @id @default(cuid())
  profileId     String
  profile       AcademicProfile @relation(fields: [profileId], references: [id])
  title         String
  level         String   // school / regional / state / national / international
  year          Int
}

model CompassScore {
  id                  String   @id @default(cuid())
  userId              String   @unique
  academicsScore      Float
  honorsScore         Float
  extracurricularsScore Float
  essaysScore         Float
  contextScoreEncrypted String  // AES-256 encrypted blob, server-side only. NEVER returned in any API response. See Sec 8.
  computedAt          DateTime @updatedAt
}

model College {
  id            String   @id @default(cuid())
  name          String
  avgGpaUnweighted Float?
  avgSat        Int?
  avgAct        Int?
  acceptanceRate Float?
  needBlind     Boolean  @default(false)
}

model CollegeListEntry {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  collegeId   String
  bucket      String   // reach / target / safety
  addedAt     DateTime @default(now())
}

// ---- Owned primarily by Workflow B ----

model JournalEntry {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  body        String
  tag         String?  // essay-draft / story-idea / accomplishment-log
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GuidanceContent {
  id          String   @id @default(cuid())
  section     String   // rec-letters / college-list / essays / financial-aid / commonapp / majors
  title       String
  embedUrl    String?
  bodyMarkdown String?
  order       Int
}

model EssayExample {
  id          String   @id @default(cuid())
  fieldOfInterest String
  essayText   String
  breakdown   String   // why it worked / didn't
  published   Boolean  @default(false)
}

model Testimonial {
  id          String   @id @default(cuid())
  graduateName String
  schoolAdmitted String
  quote       String
  tipText     String
  yearGraduated Int
  approved    Boolean  @default(false)
}

model FeedbackSubmission {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  message     String
  honeypotTriggered Boolean @default(false)
  ipHash      String   // hashed, not raw IP — Sec 8
  createdAt   DateTime @default(now())
}

model ContactMessage {
  id          String   @id @default(cuid())
  fromEmail   String
  message     String
  respondedAt DateTime?
  createdAt   DateTime @default(now())
}
```

**Boundary rule:** Workflow A only writes migrations touching `AcademicProfile`, `Course`, `ExtracurricularEntry`, `HonorAward`, `CompassScore`, `College`, `CollegeListEntry`. Workflow B only writes migrations touching `JournalEntry`, `GuidanceContent`, `EssayExample`, `Testimonial`, `FeedbackSubmission`, `ContactMessage`. `User` is shared and frozen after Phase A1 ships — no further edits to that model without a joint check-in.

---

## 5. Workflow A — Profile & Calculators Track

**Branch:** `workflow-a/profile-calculators`
**Owns routes:** `/app/(auth)/*`, `/app/(profile)/*`, `/app/(college-list)/*`, `/app/api/profile/*`, `/app/api/compass-score/*`, `/app/api/college-list/*`

### Phase A1 — Auth & Account Foundation
- [ ] Set up Auth.js with email/password provider, secure httpOnly session cookies
- [ ] Signup flow includes: age confirmation (13+), explicit consent checkbox for sensitive data collection (Sec 8), link to ToS/Privacy Policy (Sec 9/10)
- [ ] Password hashing via bcrypt/argon2 — never store plaintext, never log raw password
- [ ] Login, logout, password reset (via emailed token, expiring in 15 min)
- [ ] Account deletion endpoint: soft-delete immediately, hard-delete job purges after 30 days
- **Verify before moving on:** a test user can sign up, log in, log out, and delete their account, and the deletion actually removes rows on schedule.

### Phase A2 — Academic Profile & UC GPA Calculator
- [ ] Course entry UI: name, level (Regular/Honors/AP/IB/Dual Enrollment), grade
- [ ] UC-specific weighted GPA calculator: implement actual UC honors-points rule (max 8 semesters of honors/AP/IB weighting, only 10th–11th grade counted for UC GPA)
- [ ] Unweighted GPA calculated in parallel, always shown alongside weighted
- [ ] Explicit UI copy: "Other colleges calculate GPA differently. This is your UC-weighted GPA — check each school's own policy." Link out, do not fake-generalize to "all colleges."
- [ ] Rigor score per course computed from level + grade (document the exact formula in code comments, do not bury it in a magic number)
- **Verify:** a known test transcript produces the GPA a human would calculate by hand for UC's actual rule.

### Phase A3 — College List Generator
- [ ] Seed `College` table with a starter dataset (avg GPA/SAT/ACT/acceptance rate) — sourced from public Common Data Sets, cited per-college
- [ ] Bucket logic: compare user's GPA/scores against each college's averages, assign reach/target/safety
- [ ] User can manually move a college between buckets (override the algorithm — the algorithm advises, the student decides)
- [ ] UI clearly labels this as a starting point, not a guarantee
- **Verify:** a test profile with known stats produces buckets that a human reviewer agrees are reasonable for at least 5 spot-checked colleges.

### Phase A4 — Compass Score Engine
- [ ] Compute four visible subscores: Academics, Honors, Extracurriculars, Essays — each 0–100, formula documented in code
- [ ] Compute the fifth (Context/socioeconomic) subscore **server-side only**
- [ ] Context subscore is AES-256 encrypted at rest, decrypted only inside the scoring computation function, **never included in any API response payload to the client, ever** — enforce with a serializer test that fails the build if that field leaks
- [ ] Radar chart renders only the four visible subscores by default; Context factors into an internal weighted composite used for college-list nuance (e.g., need-blind flag prioritization) but is never displayed as a number to the user
- [ ] All score UI copy includes: "Directional, not predictive. No tool can promise an admission decision."
- **Verify:** manually confirm a test API response for `/api/compass-score` does not contain the context field in any form, under any serialization path, including error responses and logs.

---

## 6. Workflow B — Content & Community Track

**Branch:** `workflow-b/content-community`
**Owns routes:** `/app/(journal)/*`, `/app/(guidance)/*`, `/app/(essays)/*`, `/app/(testimonials)/*`, `/app/(contact)/*`, `/app/api/journal/*`, `/app/api/feedback/*`, `/app/api/contact/*`

### Phase B1 — Journal / Persistent Writing Space
- [ ] Notebook-style UI, matching design tokens (cream background, serif headers)
- [ ] Autosave on interval + on blur, not just on manual save click
- [ ] Tagging: essay-draft / story-idea / accomplishment-log
- [ ] Entries are private to the user by default — no sharing feature in MVP
- **Verify:** entry survives a page refresh mid-edit without loss.

### Phase B2 — Guidance Library (hand-edited embeds)
- [ ] Founders edit `GuidanceContent` rows directly in code/seed data — no CMS needed, confirmed acceptable by founders
- [ ] Sections: rec letters, building a college list, safeties/targets/reaches, essay tips, CommonApp process, ED/RD, financial aid, choosing majors
- [ ] Each section renders embed + description from the seed data
- **Verify:** adding a new guidance item requires touching exactly one seed file, not multiple components.

### Phase B3 — Essay Examples & Breakdown Library
- [ ] Categorized by field of interest
- [ ] Each example includes a "why this worked / where it fell short" breakdown, written by founders
- [ ] `published` boolean gates visibility — draft entries stay hidden until flipped
- **Verify:** an unpublished entry does not appear in any public route, including via direct URL guess.

### Phase B4 — Testimonials & Recent-Grad Tips
- [ ] Structured entries: name, school admitted to, quote, one concrete tip, grad year
- [ ] `approved` boolean gates visibility (founders manually approve before publishing anyone's testimonial)
- [ ] Written consent from each contributor before publishing their name/quote — this is a manual founder process, not automated, note it in your ops checklist outside this codebase
- **Verify:** unapproved testimonials never render publicly.

### Phase B5 — Feedback Box + Spam Filtering
- [ ] Honeypot field (hidden input, bots fill it, humans don't) — reject silently if filled
- [ ] Rate limit by hashed IP: max 5 submissions per hour per source
- [ ] Store `ipHash`, never raw IP (Sec 8)
- [ ] Basic profanity/spam keyword filter flags for manual review, does not auto-publish anything (feedback isn't public-facing content anyway, but keep the same discipline)
- **Verify:** a scripted rapid-fire submission test gets rate-limited; the honeypot test submission is silently dropped.

### Phase B6 — One-on-One / Direct Communication Channel
- [ ] Simple contact form → `ContactMessage` table → email notification to founders
- [ ] Response tracked via `respondedAt` so founders can see what's outstanding
- [ ] UI copy makes clear this reaches actual current students, not a bot or a queue into a black hole — this is the differentiator, don't undersell it
- **Verify:** a test submission produces both a DB row and an actual email notification.

---

## 7. Parallelization Rules

1. Schema first, both workflows pull from `main` after it's merged. No workflow edits `schema.prisma` again without flagging it to the other.
2. No shared component files. If both workflows need a button or card style, that component lives in `/components/ui/` and is built **once**, before either workflow branches off, as part of Phase 0 setup — not duplicated by each workflow independently.
3. `User` model is frozen after A1 ships. If B needs a new field on `User`, it's a joint conversation, not a silent migration.
4. Each phase checkbox list above is the unit of "done." A workflow does not start its next phase until the current one is verified per the bullet under it.
5. If Workflow B needs something only Workflow A has built (e.g., `CompassScore` for a future cross-feature), stub it with a typed mock function and keep moving. Do not block Phase B work waiting on Phase A.

---

## 8. Security & Privacy — Engineering Checklist

- **Transport:** HTTPS everywhere, enforced by Vercel by default. No exceptions.
- **Passwords:** hashed via bcrypt/argon2 through Auth.js. Plaintext never touches a log, a DB column, or an error message.
- **Sensitive field (Context/socioeconomic subscore):** AES-256 encrypted at the application layer before it ever reaches Postgres. Decryption key lives in a KMS or Vercel encrypted env var, never in source. Decrypted value exists only inside the scoring function's memory for the duration of computation — never serialized, never logged, never returned to any client, admin panel included. There is no admin UI that displays this value. This is a hard rule, not a style preference.
- **Consent:** signup requires an explicit checkbox describing that sensitive background data (financial aid status, parental education) may be collected to inform matching, and that it is never shown back to the user as a visible score. No pre-checked boxes. No burying it in a wall of ToS text — a plain-language one-sentence summary above the checkbox.
- **Age gate:** users confirm 13+ at signup. Compass does not knowingly collect data from children under 13.
- **Input validation:** every API route validates input with Zod before touching the database. No raw request body hits Prisma directly.
- **Rate limiting:** auth endpoints (login, password reset) and the feedback/contact forms are rate-limited by hashed IP.
- **Logging:** Sentry (or equivalent) configured with PII scrubbing rules — no emails, no raw IPs, no journal content, no sensitive-field data in any log line, ever. Audit this before launch, not after.
- **Secrets:** all API keys, DB connection strings, encryption keys live in Vercel environment variables. Nothing committed to git. Add a pre-commit hook that scans for accidental secret commits.
- **Dependency hygiene:** Dependabot or `npm audit` run on a schedule, not just at project start.
- **Backups:** Neon's automated backups enabled, encrypted at rest.
- **Data deletion:** account deletion triggers soft-delete immediately, hard-delete of all associated rows (including `CompassScore`, `JournalEntry`, everything under that `userId`) within 30 days. Build the scheduled job in Phase A1, don't defer it.
- **Least privilege:** the application's DB role should not have superuser rights on Neon. Separate any admin/seed-script access from the runtime app role.

This checklist is not optional scope-creep — treat it as part of the MVP, not a "later" phase. A data leak on minors' financial/demographic data ends this project's credibility in one news cycle. Build it in from Phase 1.

---

## 9. Terms of Service (Draft)

> **This is a draft starting point, not legal advice. Have an actual attorney review this before public launch — you are collecting sensitive data from minors, and that carries real legal exposure regardless of good intentions.**

**1. Acceptance of Terms**
By creating an account with Compass, you agree to these Terms of Service and the accompanying Privacy Policy.

**2. Eligibility**
Compass is intended for users aged 13 and older. By creating an account, you confirm you meet this minimum age requirement.

**3. Description of Service**
Compass provides tools to track academic profile data, generate a preliminary college list, and access guidance content and a private writing journal. Any score, index, or "Compass Score" generated by the service is a self-assessment tool only. It is directional, not predictive, and does not represent an actual admissions decision, chance, or guarantee from any institution. No feature of this service should be treated as a substitute for guidance from a school counselor, admissions officer, or legal/financial advisor.

**4. User Accounts**
You are responsible for maintaining the confidentiality of your login credentials. You must provide accurate information during signup, including age confirmation.

**5. User Content**
Journal entries, essay drafts, and other content you create remain yours. Compass does not claim ownership over your written content. Feedback submissions may be reviewed by the founders to improve the service.

**6. Sensitive Data Disclosure**
Compass may ask for background information, including parental education level and financial aid status, as part of building your profile. This data is used only in aggregate scoring logic to provide more relevant college matching. It is never displayed back to you as a visible numeric score, and is handled under the security measures described in our Privacy Policy.

**7. Prohibited Conduct**
You may not use Compass to submit spam, harassment, false testimonials, or attempt to access another user's account or data.

**8. Disclaimers**
Compass is provided "as is." We make no warranty regarding admissions outcomes, the accuracy of GPA calculations for institutions other than the University of California system, or the completeness of guidance content.

**9. Limitation of Liability**
To the maximum extent permitted by law, Compass and its founders are not liable for decisions made based on information provided through this service.

**10. Termination**
You may delete your account at any time. We may suspend accounts that violate these terms.

**11. Changes to Terms**
We may update these terms. Continued use after changes constitutes acceptance.

**12. Contact**
[ENTER YOUR INFO HERE: contact email for legal/ToS inquiries]

---

## 10. Privacy Policy (Draft)

> **This is a draft starting point, not legal advice. Have an actual attorney review this before public launch.**

**1. Information We Collect**
- Account information: email, display name, grade level.
- Academic profile data: courses, grades, GPA, test scores, extracurriculars, honors.
- Sensitive background data: parental education level, financial aid/socioeconomic status, collected only with explicit opt-in consent at signup.
- Journal content: essay drafts and personal writing you create, stored privately.
- Usage data: basic technical logs for security and debugging, scrubbed of personal content.

**2. How We Use This Information**
To calculate your academic profile, generate a college list, compute your Compass Score, and provide guidance content. Sensitive background data factors into internal scoring logic only and is never displayed back to you as a visible number.

**3. Legal Basis / Consent**
We collect sensitive background data only with your explicit, unchecked-by-default consent at signup. You may decline this and still use the core profile and calculator features; declining may reduce the precision of college-list matching.

**4. Data Sharing**
We do not sell your data. We use third-party infrastructure providers (hosting, database, error monitoring) strictly to operate the service, under standard data processing terms. We do not share your academic or sensitive data with colleges, advertisers, or any other third party.

**5. Data Security**
Passwords are hashed, never stored in plain text. Sensitive background data is encrypted at rest. All traffic is encrypted in transit via HTTPS. Access to sensitive fields is restricted to the automated scoring process — no human reviewer, including the founders, can view your raw sensitive-field value through any admin interface.

**6. Data Retention & Deletion**
You may delete your account at any time. Deletion is immediate at the account level; all associated data is permanently removed within 30 days.

**7. Your Rights**
You may request a copy of your data or request deletion at any time by contacting us.

**8. Children's Privacy**
Compass requires users to confirm they are at least 13 years old. We do not knowingly collect data from children under 13.

**9. Cookies**
We use essential cookies for authentication/session management only. No third-party advertising cookies.

**10. Changes to This Policy**
We may update this policy. Material changes will be communicated via the email on file.

**11. Contact**
[ENTER YOUR INFO HERE: contact email for privacy inquiries]

---

## 11. Final Note to Fable

Security checklist in Section 8 is not a "nice to have" — treat every checkbox as a build blocker. Sensitive-field leakage (Context/socioeconomic subscore) is the single highest-risk failure mode in this entire spec: test it explicitly, at every API boundary, before either workflow calls a phase "done." Check your work before you report a phase complete — verify the checkbox, don't assume it.
