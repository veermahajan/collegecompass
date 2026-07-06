import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Shared Prisma singleton. BOTH workflows import from here —
// never instantiate PrismaClient anywhere else (hot-reload in dev
// exhausts Neon's connection pool otherwise).
//
// Runtime uses the Neon serverless driver (pooled DATABASE_URL).
// Migrations use the direct URL via prisma.config.ts.

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill in your Neon connection string."
    );
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
