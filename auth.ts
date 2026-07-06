import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// ============================================================
// Auth.js (NextAuth v5) — Phase 0 scaffolding ONLY.
//
// The full email/password flow (signup, bcrypt/argon2 hashing,
// login validation, password reset, account deletion + 30-day
// hard-delete job) is PHASE A1, owned by Workflow A on branch
// workflow-a/profile-calculators. Do not implement it elsewhere.
//
// Hard rules carried from spec Sec 8 for whoever builds A1:
//   - Plaintext passwords never touch a log, DB column, or error msg
//   - Zod-validate every input before Prisma sees it
//   - Rate-limit login/password-reset by hashed IP
//   - Signup requires age gate (13+) + explicit unchecked consent box
// ============================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" }, // httpOnly session cookie, Auth.js default
  pages: {
    signIn: "/login", // Workflow A builds this page in Phase A1
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // PHASE A1 (Workflow A): Zod-validate credentials, look up
        // non-deleted user via prisma, verify against passwordHash
        // with bcrypt/argon2, return { id, email, name } or null.
        // Never log the raw password. Never leak "email exists" vs
        // "wrong password" in the error message.
        return null;
      },
    }),
  ],
});
