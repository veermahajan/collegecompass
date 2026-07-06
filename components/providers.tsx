"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

// Wraps the app with Auth.js's client session context so components like
// SiteNav can call useSession() to conditionally render nav items. The
// server-fetched `session` (from app/layout.tsx's `auth()` call) is passed
// in as the initial value so there's no client-side loading flash/flicker
// on first paint — useSession() resolves to the right state immediately.
export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
