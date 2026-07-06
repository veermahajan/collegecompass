# Phase 0 — Handoff Notes

Phase 0 is complete: scaffold, locked schema, shared UI primitives, auth config.
No Workflow A or B feature work has been started. Read `compass_build_spec.md`
Section 4 in full before writing any code.

## What exists

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | LOCKED data model, spec Sec 4 verbatim. Ownership boundaries commented at top. |
| `prisma.config.ts` | Prisma 7 config. Migrations use `DATABASE_URL_UNPOOLED` (Neon direct). |
| `lib/prisma.ts` | Singleton PrismaClient via Neon serverless adapter. Import from here only. |
| `lib/generated/prisma/` | Generated client (gitignored, regenerate with `npx prisma generate`). |
| `auth.ts` | Auth.js v5 config. Credentials provider stubbed — full flow is Phase A1. |
| `app/api/auth/[...nextauth]/route.ts` | Auth route handler. Edit `auth.ts`, not this. |
| `components/ui/button.tsx` | `Button` + `ButtonLink` (solid/ghost, default/lg). |
| `components/ui/card.tsx` | `Card`, `CardIcon`, `CardTitle`, `CardBody`. |
| `components/ui/nav.tsx` | `SiteNav`: desktop tabs ≥860px, hamburger below. Edit `NAV_ITEMS` via PR only. |
| `components/ui/compass-mark.tsx` | `CompassMark` + `CompassDivider` — the signature five-spoke motif. No second icon system. |
| `tailwind.config.ts` | Spec Sec 2 tokens: canvas/ink/sage/gold/sky/line, font vars, `nav:` breakpoint at 860px. |
| `app/layout.tsx` | Fraunces 600 / Inter / IBM Plex Mono via next/font, wired to Tailwind font vars. |
| `app/globals.css` | Base palette + heading typography. No dark mode. |
| `app/page.tsx` | Placeholder exercising the primitives. Replace the page, not the primitives. |
| `.env.example` | `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`. `.env` is gitignored. |

## Before feature work

1. `cp .env.example .env`, fill in Neon URLs (pooled + direct) and `AUTH_SECRET`.
2. `npx prisma migrate dev --name init` — no migration has been run (no DB was
   available in the build sandbox).
3. `npm run build` on a networked machine — verifies Google Fonts fetch.
   (Build was verified in the sandbox with fonts stubbed; tsc and lint are clean.)

## Rules both sessions obey (spec Sec 7)

- Branches: `workflow-a/profile-calculators`, `workflow-b/content-community`.
- Nobody edits `schema.prisma` without flagging the other workflow.
- No new components in `/components/ui/` duplicated per-workflow; shared things
  land here once, via PR.
- `User` model freezes after A1 ships.
- Zod on every API route input. No raw request body touches Prisma.

## Known spec/mockup conflicts — resolve before Phase A4

1. **Context score visibility.** The mockup shows Context as a fifth visible
   subscore (radar legend + a "40" bar). Spec Sec 4/A4/Sec 8 says Context is
   NEVER displayed to the user in any form. The spec is the locked contract:
   build four visible subscores. The mockup's five-spoke shape stays as the
   brand motif, but the rendered radar chart shows four data points.
2. **Off-token color.** The mockup uses `#B0846E` for Context. It is not in
   the Sec 2 token set. Do not add it to the Tailwind config — moot once
   conflict #1 resolves in the spec's favor.
