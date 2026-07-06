import "dotenv/config";
import { prisma } from "../lib/prisma";
import { GUIDANCE_CONTENT } from "./seed-data/guidance";
import { COLLEGES } from "./seed-data/colleges";
import { ESSAY_EXAMPLES } from "./seed-data/essays";
import { TESTIMONIALS } from "./seed-data/testimonials";

// Run with: npm run db:seed
//
// Independent things get seeded here:
//   - dev-seed-user: the fixed user id lib/current-user.ts falls back to
//     when there's no real session (local dev only, see that file).
//     Journal rows have a required FK to User, so local testing needs
//     this row to exist.
//   - GuidanceContent: the Phase B2 guidance library. Content lives in
//     prisma/seed-data/guidance.ts — add/edit items there, not here.
//   - College: the Phase A3 starter dataset. Lives in
//     prisma/seed-data/colleges.ts.
//   - EssayExample: the Phase B3 breakdown library. Content lives in
//     prisma/seed-data/essays.ts — add/edit items there, not here.
//   - Testimonial: the Phase B4 recent-grad tips. Content lives in
//     prisma/seed-data/testimonials.ts — add/edit items there, not here.

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

  for (const college of COLLEGES) {
    await prisma.college.upsert({
      where: { id: college.id },
      update: college,
      create: college,
    });
  }

  for (const item of ESSAY_EXAMPLES) {
    await prisma.essayExample.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  for (const item of TESTIMONIALS) {
    await prisma.testimonial.upsert({
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
