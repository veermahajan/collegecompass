import { SiteNav } from "@/components/ui/nav";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { CompassDivider } from "@/components/ui/compass-mark";

// Phase 0 placeholder page. Exercises every shared primitive so the
// build proves them out. The real homepage/dashboard is feature work —
// this page gets replaced, the primitives it imports do not.

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-6 py-16">
        <div className="mb-4 flex items-center gap-2 font-mono text-[0.78rem] font-medium uppercase tracking-[0.08em] text-sky">
          <span className="h-px w-4 bg-sky" />
          Phase 0 scaffold
        </div>
        <h1 className="mb-5 text-5xl leading-[1.08]">
          Find your <em className="italic text-sage-deep">direction</em>,
          <br />
          not just your dream school.
        </h1>
        <p className="mb-8 max-w-[480px] text-[1.15rem] text-ink-soft">
          Scaffold, schema, shared components, and auth config are in place.
          Feature work starts in Workflow A and Workflow B.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <ButtonLink href="/signup" size="lg">
            Build my profile
          </ButtonLink>
          <ButtonLink href="#" variant="ghost" size="lg">
            See how it works
          </ButtonLink>
        </div>

        <div className="my-14">
          <CompassDivider />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardTitle>Shared UI ready</CardTitle>
            <CardBody>
              Button, Card, Nav, and the compass mark live in
              /components/ui — built once, used by both workflows.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Schema locked</CardTitle>
            <CardBody>
              prisma/schema.prisma matches spec Section 4 exactly. Flag
              problems; never patch silently.
            </CardBody>
          </Card>
          <Card>
            <CardTitle>Auth scaffolded</CardTitle>
            <CardBody>
              Auth.js v5 config is stubbed. The full signup flow is Phase
              A1, Workflow A&apos;s job.
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
