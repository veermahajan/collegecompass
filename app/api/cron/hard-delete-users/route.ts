import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Spec Sec 4/8: soft-deleted accounts (deletedAt set) are permanently
// erased 30 days later. Triggered by Vercel Cron (see vercel.json);
// Vercel signs the request with `Authorization: Bearer $CRON_SECRET`
// automatically when CRON_SECRET is set on the project.
//
// Deletes are ordered manually (rather than relying on DB cascade,
// which isn't configured on these relations) to satisfy FK
// constraints before the User row itself is removed. If a new model
// gains a userId FK, add its cleanup here too.

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS);
  const dueUsers = await prisma.user.findMany({
    where: { deletedAt: { lt: cutoff } },
    select: { id: true },
  });

  for (const { id: userId } of dueUsers) {
    await prisma.$transaction(async (tx) => {
      const profile = await tx.academicProfile.findUnique({
        where: { userId },
      });
      if (profile) {
        await tx.course.deleteMany({ where: { profileId: profile.id } });
        await tx.extracurricularEntry.deleteMany({
          where: { profileId: profile.id },
        });
        await tx.honorAward.deleteMany({ where: { profileId: profile.id } });
        await tx.academicProfile.delete({ where: { id: profile.id } });
      }

      await tx.compassScore.deleteMany({ where: { userId } });
      await tx.collegeListEntry.deleteMany({ where: { userId } });
      await tx.journalEntry.deleteMany({ where: { userId } });
      await tx.passwordResetToken.deleteMany({ where: { userId } });
      // Feedback content is kept (already stripped of PII — hashed IP
      // only) but unlinked from the deleted account.
      await tx.feedbackSubmission.updateMany({
        where: { userId },
        data: { userId: null },
      });

      await tx.user.delete({ where: { id: userId } });
    });
  }

  return NextResponse.json({ deletedUsers: dueUsers.length });
}
