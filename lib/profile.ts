import { prisma } from "@/lib/prisma";
import { computeGpas } from "@/lib/gpa";

export async function ensureProfile(userId: string) {
  const existing = await prisma.academicProfile.findUnique({
    where: { userId },
  });
  if (existing) return existing;
  return prisma.academicProfile.create({ data: { userId } });
}

/** Recalculates unweightedGpa/ucWeightedGpa from the profile's current courses. */
export async function recomputeGpas(profileId: string) {
  const courses = await prisma.course.findMany({
    where: { profileId },
    select: { level: true, gradeReceived: true },
  });
  const { unweightedGpa, ucWeightedGpa } = computeGpas(courses);
  return prisma.academicProfile.update({
    where: { id: profileId },
    data: { unweightedGpa, ucWeightedGpa },
  });
}
