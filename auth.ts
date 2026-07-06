import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations/auth";
import { checkRateLimit, getClientIp, hashIp } from "@/lib/rate-limit";

// ============================================================
// Auth.js (NextAuth v5) — Phase A1 (Workflow A).
//
// Password reset and account deletion + 30-day hard-delete job are
// still open follow-ups for A1; credential login is implemented here.
//
// Hard rules from spec Sec 8:
//   - Plaintext passwords never touch a log, DB column, or error msg
//   - Zod-validate every input before Prisma sees it
//   - Rate-limit login/password-reset by hashed IP
//   - Signup requires age gate (13+) + explicit unchecked consent box
// ============================================================

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" }, // httpOnly session cookie, Auth.js default
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const ip = hashIp(getClientIp(request));
        if (!checkRateLimit(`login:${ip}`)) return null;

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Same failure path for "no such user" and "wrong password" —
        // never leak which one it was.
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.deletedAt) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
        };
      },
    }),
  ],
});
