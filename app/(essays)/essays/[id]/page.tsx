import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/ui/nav";
import { Card, CardBody } from "@/components/ui/card";

// Detail route for a single essay example. Unpublished rows and unknown
// ids both 404 the same way — spec B3's verify bullet requires that a
// direct URL guess can't expose a draft entry, so there's no separate
// "this exists but isn't published" response to distinguish the two.

export default async function EssayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const essay = await prisma.essayExample.findUnique({ where: { id } });

  if (!essay || !essay.published) {
    notFound();
  }

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[820px] px-6 py-12">
        <Link href="/essays" className="text-sm font-medium text-sky">
          ← Back to the essay library
        </Link>

        <div className="mb-2 mt-6 flex items-center gap-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sky">
          <span className="h-px w-4 bg-sky" />
          {essay.fieldOfInterest}
        </div>

        <Card hover={false} className="mt-4">
          <p className="mb-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-ink-soft">
            The essay
          </p>
          <CardBody className="whitespace-pre-wrap text-ink">{essay.essayText}</CardBody>
        </Card>

        <Card hover={false} className="mt-6 border-sky/40 bg-sky/[0.04]">
          <p className="mb-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sky">
            Why it worked (and where it didn&apos;t)
          </p>
          <CardBody className="whitespace-pre-wrap text-ink">{essay.breakdown}</CardBody>
        </Card>
      </main>
    </>
  );
}
