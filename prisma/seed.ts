import { prisma } from "../lib/prisma";
import { GUIDANCE_CONTENT } from "./seed-data/guidance";

// Run with: npm run db:seed
//
// Two independent things get seeded here:
//   - dev-seed-user: the fixed user id lib/current-user.ts falls back to
//     before Phase A1's real auth flow exists. Journal rows have a
//     required FK to User, so local testing needs this row to exist.
//   - GuidanceContent: the Phase B2 guidance library. The content itself
//     lives in prisma/seed-data/guidance.ts — add/edit items there, not
//     here. This file just upserts whatever's in that array.

async function main() {
  await prisma.user.upsert({
    where: { id: "dev-seed-user" },
    update: {},
    create: {
      id: "dev-seed-user",
      email: "dev@example.com",
      passwordHash: "not-a-real-hash",
      displayName: "Dev User",
      gradeLevel: "12",
      ageConfirmed13Plus: true,
    },
  });

  for (const item of GUIDANCE_CONTENT) {
    await prisma.guidanceContent.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
