import { auth } from "@/auth";

// ============================================================
// TEMPORARY STUB — Phase B1 (Workflow B) needs a signed-in user
// to scope journal entries, but Phase A1 (Workflow A, auth flow)
// hasn't shipped yet: auth.ts's Credentials.authorize() always
// returns null, so a real session never has a user id. Per spec
// Sec 7 rule 5, this is a typed mock to unblock Workflow B — do
// not build a parallel auth system around it.
//
// Once A1 ships a real session.user.id, the fallback below stops
// firing on its own (auth() will return a populated session) and
// this file can be deleted; DEV_FALLBACK_USER_ID exists only for
// local development against a seeded DB (see prisma/seed.ts).
// ============================================================

const DEV_FALLBACK_USER_ID = "dev-seed-user";

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  // Cast: default next-auth Session["user"] has no `id` field until A1 adds
  // a session callback + module augmentation. This reads it opportunistically
  // without requiring that type change to land first.
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (userId) return userId;

  if (process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK_USER_ID;
  }
  return null;
}
