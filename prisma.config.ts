import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 config. Migrations connect via DATABASE_URL (Neon).
// Use Neon's *direct* (non-pooled) connection string for migrations;
// the runtime app uses the pooled/serverless driver in lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "",
  },
});
