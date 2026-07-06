import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/ui/nav";
import { CompassDivider } from "@/components/ui/compass-mark";
import { Card, CardBody } from "@/components/ui/card";

// Phase B4 — Testimonials & Recent-Grad Tips (spec Sec 6, Workflow B).
// Read-only, seed-data driven, same shape as Guidance/Essays. Only
// `approved: true` rows are ever queried here — approval is a manual
// founder step taken after written consent from the contributor (see
// prisma/seed-data/testimonials.ts), not something this page gates.

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { yearGraduated: "desc" },
  });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="mb-2 flex items-center gap-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sky">
          <span className="h-px w-4 bg-sky" />
          Recent-grad tips
        </div>
        <h1 className="mb-2 text-4xl leading-[1.1]">
          Advice from people who just did this
        </h1>
        <p className="mb-8 max-w-[560px] text-[1.02rem] text-ink-soft">
          One concrete tip each, from students who were just accepted.
        </p>
        <ul>
          <li>Nikko Le (UC Berkeley, CO230): &quot;Self-reported data doesn&apos;t work because ... people lie.&quot;</li>
        </ul>

        <CompassDivider />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.id} hover={false}>
              <p className="mb-4 text-[1.02rem] italic text-ink">&ldquo;{t.quote}&rdquo;</p>
              <CardBody className="mb-4 whitespace-pre-wrap">{t.tipText}</CardBody>
              <p className="font-mono text-[0.8rem] text-ink-soft">
                {t.graduateName} · {t.schoolAdmitted} &apos;{String(t.yearGraduated).slice(-2)}
              </p>
            </Card>
          ))}
        </div>

        {testimonials.length === 0 && (
          <p className="mt-8 rounded-xl border border-line bg-white p-4 text-sm text-ink-soft">
            No approved testimonials yet. Seed data exists in{" "}
            <code className="font-mono">prisma/seed-data/testimonials.ts</code>{" "}
            but starts unapproved by design — a testimonial only goes live
            after written consent from the contributor and a founder
            flipping <code className="font-mono">approved</code> to true, then
            running <code className="font-mono">npm run db:seed</code>.
          </p>
        )}
      </main>
    </>
  );
}
