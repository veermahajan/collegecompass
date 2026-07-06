import { prisma } from "../lib/prisma";

// Dev-only seed: creates the fixed user id that lib/current-user.ts falls
// back to before Phase A1's real auth flow exists. Journal rows have a
// required FK to User, so local testing needs this row to exist.
// Run with: npm run db:seed

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
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
