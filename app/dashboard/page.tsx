import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/ui/nav";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

// Post-login landing page. Referenced by app/login/page.tsx's redirect and
// by the shared nav since Phase 0, but never built by either workflow —
// not owned by either track in the spec. Built now because every login
// was 404ing without it.

const DASHBOARD_LINKS = [
  {
    href: "/profile",
    title: "Academic profile",
    body: "Courses, GPA, extracurriculars, honors, and your Compass Score.",
  },
  {
    href: "/college-list",
    title: "College list",
    body: "Reach / target / safety, built from your profile — you make the final call.",
  },
  {
    href: "/journal",
    title: "Journal",
    body: "A private space for essay drafts, story ideas, and accomplishments.",
  },
  {
    href: "/guidance",
    title: "Guidance",
    body: "Rec letters, essay tips, financial aid, and more, in one library.",
  },
  {
    href: "/essays",
    title: "Essay examples",
    body: "Real essays with a founder breakdown of what worked and what didn't.",
  },
  {
    href: "/testimonials",
    title: "Testimonials",
    body: "Concrete tips from recent grads who've been through the process.",
  },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true },
  });

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-6 py-16">
        <h1 className="mb-2 text-4xl">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ""}
        </h1>
        <p className="mb-10 max-w-[560px] text-[0.95rem] text-ink-soft">
          Everything you&apos;ve built so far, in one place.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD_LINKS.map((link) => (
            <Card key={link.href}>
              <CardTitle>{link.title}</CardTitle>
              <CardBody className="mb-5">{link.body}</CardBody>
              <ButtonLink href={link.href} variant="ghost">
                Open
              </ButtonLink>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
