"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CompassMark } from "./compass-mark";
import { ButtonLink } from "./button";

// Shared site nav — spec Sec 2 pattern: horizontal top tabs ≥ the `nav`
// breakpoint (tailwind.config.ts), hamburger + slide-down menu below.
// Built ONCE in Phase 0. Neither workflow duplicates or forks this;
// if a workflow needs a new tab, it edits NAV_ITEMS here via PR.
//
// Auth-gated visibility: signed-in users see the full tab set and no
// login/signup buttons; signed-out users see ONLY the logo plus Log in /
// Get started — every other tab is hidden so there's nothing to click
// but the join flow. useSession() reads the session app/layout.tsx
// already fetched server-side (passed through <Providers>), so there's
// no loading-state flash to handle here.

export type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "College List", href: "/college-list" },
  { label: "Journal", href: "/journal" },
  { label: "Guidance", href: "/guidance" },
  { label: "Essays", href: "/essays" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Feedback", href: "/feedback" },
  { label: "Contact", href: "/contact" },
];

export function SiteNav({ items = NAV_ITEMS }: { items?: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-display text-xl font-semibold"
        >
          <CompassMark size={30} />
          Compass
        </Link>

        {isAuthenticated && (
          <>
            {/* Desktop tabs (≥nav breakpoint). Item count has grown across
                workflows (9 tabs); gap/font are tightened and nowrap'd so the
                row fits inside the 1180px container without wrapping mid-word —
                verified in-browser at 1024/1180/1280/1440px. */}
            <nav className="hidden gap-4 nav:flex lg:gap-6" aria-label="Main">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative whitespace-nowrap py-1 text-[0.85rem] font-medium transition-colors duration-200 lg:text-[0.95rem] ${
                    isActive(item.href)
                      ? "text-sage-deep after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-sm after:bg-gold"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Hamburger, below the nav breakpoint. h-11/w-11 (44px) meets
                the iOS/Android minimum touch-target guidance — the icon
                itself is much smaller than that. */}
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] nav:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="h-0.5 w-6 rounded-sm bg-ink" />
              <span className="h-0.5 w-6 rounded-sm bg-ink" />
              <span className="h-0.5 w-6 rounded-sm bg-ink" />
            </button>
          </>
        )}

        {!isAuthenticated && (
          <div className="flex shrink-0 items-center gap-2">
            <ButtonLink href="/login" variant="ghost" className="whitespace-nowrap">
              Log in
            </ButtonLink>
            <ButtonLink href="/signup" variant="solid" className="whitespace-nowrap">
              Get started
            </ButtonLink>
          </div>
        )}
      </div>

      {/* Slide-down mobile menu — signed-in users only; signed-out users
          have nothing to put in it (Log in / Get started are already
          shown directly in the header, un-hidden, so join is one tap). */}
      {isAuthenticated && open && (
        <div
          id="mobile-menu"
          className="flex flex-col border-b border-line bg-canvas px-6 pb-5 pt-2 nav:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line px-1 py-3 font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
