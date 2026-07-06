import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/ui/nav";
import { CompassDivider } from "@/components/ui/compass-mark";
import { Card, CardBody } from "@/components/ui/card";

// Phase B3 — Essay Examples & Breakdown Library (spec Sec 6, Workflow B).
// Read-only, like Guidance: content lives in prisma/seed-data/essays.ts,
// loaded via `npm run db:seed`. Only `published: true` rows ever reach
// this query — draft entries stay invisible here and their detail route
// 404s directly (see [id]/page.tsx), satisfying the B3 verify bullet.
//
// fieldOfInterest is free text, not a fixed list, so grouping happens
// dynamically off whatever distinct values are in the data.

function excerpt(text: string, max = 140) {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trim()}…` : trimmed;
}

export default async function EssaysPage() {
  const essays = await prisma.essayExample.findMany({
    where: { published: true },
    orderBy: { fieldOfInterest: "asc" },
  });

  const byField = new Map<string, typeof essays>();
  for (const essay of essays) {
    const list = byField.get(essay.fieldOfInterest) ?? [];
    list.push(essay);
    byField.set(essay.fieldOfInterest, list);
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="mb-2 flex items-center gap-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sky">
          <span className="h-px w-4 bg-sky" />
          Essay breakdown library
        </div>
        <h1 className="mb-2 text-4xl leading-[1.1]">
          Real essays, with the why behind them
        </h1>
        <p className="mb-8 max-w-[560px] text-[1.02rem] text-ink-soft">
          Examples from past applicants, broken down by what worked and what
          didn&apos;t — grouped by field of interest.
        </p>

        <CompassDivider />

        {Array.from(byField.entries()).map(([field, items]) => (
          <section key={field} className="mt-12">
            <h2 className="mb-5 text-2xl">{field}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((essay) => (
                <Link key={essay.id} href={`/essays/${essay.id}`}>
                  <Card>
                    <CardBody className="text-ink">{excerpt(essay.essayText)}</CardBody>
                    <p className="mt-3 text-sm font-medium text-sky">
                      Read the full breakdown →
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {essays.length === 0 && (
          <p className="mt-8 rounded-xl border border-line bg-white p-4 text-sm text-ink-soft">
            No published essay examples yet. Seed data exists in{" "}
            <code className="font-mono">prisma/seed-data/essays.ts</code> but
            starts unpublished by design — replace the placeholder text with
            a real essay and breakdown, flip <code className="font-mono">published</code>{" "}
            to true, then run <code className="font-mono">npm run db:seed</code>.
          </p>
        )}
      </main>
    </>
  );
}
