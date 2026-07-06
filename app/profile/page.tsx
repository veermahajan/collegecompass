import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ensureProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { SiteNav } from "@/components/ui/nav";
import { CourseSection } from "./course-section";
import { ExtracurricularSection } from "./extracurricular-section";
import { HonorSection } from "./honor-section";
import { GpaSummary } from "./gpa-summary";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await ensureProfile(session.user.id);
  const [courses, extracurriculars, honors] = await Promise.all([
    prisma.course.findMany({
      where: { profileId: profile.id },
      orderBy: { name: "asc" },
    }),
    prisma.extracurricularEntry.findMany({
      where: { profileId: profile.id },
      orderBy: { title: "asc" },
    }),
    prisma.honorAward.findMany({
      where: { profileId: profile.id },
      orderBy: { year: "desc" },
    }),
  ]);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[860px] px-6 py-16">
        <h1 className="mb-2 text-4xl">Academic profile</h1>
        <p className="mb-10 max-w-[520px] text-[0.95rem] text-ink-soft">
          GPA and rigor are recalculated automatically from your courses.
          This is an approximation of your school&apos;s actual formula and
          UC&apos;s official weighting — you can override the numbers
          directly below, though they&apos;ll be recalculated the next time
          you add, edit, or delete a course.
        </p>

        <GpaSummary profile={profile} />
        <CourseSection initialCourses={courses} />
        <ExtracurricularSection initialEntries={extracurriculars} />
        <HonorSection initialHonors={honors} />
      </main>
    </>
  );
}
