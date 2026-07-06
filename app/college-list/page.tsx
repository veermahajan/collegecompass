import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { suggestBucket } from "@/lib/college-list";
import { SiteNav } from "@/components/ui/nav";
import { CollegeListSection } from "./college-list-section";

export default async function CollegeListPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  const [profile, entries, colleges] = await Promise.all([
    prisma.academicProfile.findUnique({ where: { userId } }),
    prisma.collegeListEntry.findMany({
      where: { userId },
      orderBy: { addedAt: "desc" },
    }),
    prisma.college.findMany({ orderBy: { name: "asc" } }),
  ]);

  const collegeById = new Map(colleges.map((c) => [c.id, c]));
  const student = {
    unweightedGpa: profile?.unweightedGpa ?? null,
    satScore: profile?.satScore ?? null,
    actScore: profile?.actScore ?? null,
  };

  const items = entries
    .map((entry) => {
      const college = collegeById.get(entry.collegeId);
      if (!college) return null;
      return {
        ...entry,
        college,
        suggestedBucket: suggestBucket(student, college),
      };
    })
    .filter((item) => item !== null);

  const addedCollegeIds = new Set(entries.map((e) => e.collegeId));
  const availableColleges = colleges.filter((c) => !addedCollegeIds.has(c.id));

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[860px] px-6 py-16">
        <h1 className="mb-2 text-4xl">College list</h1>
        <p className="mb-10 max-w-[560px] text-[0.95rem] text-ink-soft">
          Reach / target / safety is a starting point based on published
          averages for each school, compared against your GPA and test
          scores — it&apos;s not a guarantee of admission or rejection.
          Move any school between buckets yourself; your judgment
          overrides the algorithm.
        </p>

        <CollegeListSection
          initialItems={items}
          availableColleges={availableColleges}
          hasProfileStats={
            student.unweightedGpa != null ||
            student.satScore != null ||
            student.actScore != null
          }
        />
      </main>
    </>
  );
}
