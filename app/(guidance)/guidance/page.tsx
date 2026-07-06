import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/ui/nav";
import { CompassDivider } from "@/components/ui/compass-mark";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { GUIDANCE_SECTIONS } from "@/lib/guidance-sections";

// Phase B2 — Guidance Library (spec Sec 6, Workflow B). Read-only reference
// content: no CMS, no admin UI. Rows come from prisma/seed-data/guidance.ts
// via `npm run db:seed` — adding an item means editing that one file, not
// this page. Section order/labels are the one other fixed point, in
// lib/guidance-sections.ts.

export default async function GuidancePage() {
  const items = await prisma.guidanceContent.findMany({
    orderBy: { order: "asc" },
  });

  const bySection = new Map<string, typeof items>();
  for (const item of items) {
    const list = bySection.get(item.section) ?? [];
    list.push(item);
    bySection.set(item.section, list);
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="mb-2 flex items-center gap-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sky">
          <span className="h-px w-4 bg-sky" />
          Guidance library
        </div>
        <h1 className="mb-2 text-4xl leading-[1.1]">Straight answers, section by section</h1>
        <p className="mb-8 max-w-[560px] text-[1.02rem] text-ink-soft">
          Written and curated by current students who just went through this.
        </p>

        <CompassDivider />

        {GUIDANCE_SECTIONS.map((section) => {
          const sectionItems = bySection.get(section.slug) ?? [];
          if (sectionItems.length === 0) return null;

          return (
            <section key={section.slug} className="mt-12">
              <h2 className="mb-5 text-2xl">{section.label}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {sectionItems.map((item) => (
                  <Card key={item.id} hover={false}>
                    <CardTitle>{item.title}</CardTitle>
                    {item.embedUrl && (
                      <div className="mb-4 aspect-video overflow-hidden rounded-xl border border-line">
                        <iframe
                          src={item.embedUrl}
                          className="h-full w-full"
                          allowFullScreen
                          title={item.title}
                        />
                      </div>
                    )}
                    {item.bodyMarkdown && (
                      <CardBody className="whitespace-pre-wrap">
                        {item.bodyMarkdown}
                      </CardBody>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })}

        {items.length === 0 && (
          <p className="mt-8 rounded-xl border border-line bg-white p-4 text-sm text-ink-soft">
            No guidance content yet — run{" "}
            <code className="font-mono">npm run db:seed</code> to load the
            starter content.
          </p>
        )}
      </main>
    </>
  );
}
