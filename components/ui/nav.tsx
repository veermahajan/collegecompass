"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompassMark } from "./compass-mark";
import { ButtonLink } from "./button";

// Shared site nav — spec Sec 2 pattern: horizontal top tabs ≥860px
// (Tailwind screen `nav:`), hamburger + slide-down menu below.
// Built ONCE in Phase 0. Neither workflow duplicates or forks this;
// if a workflow needs a new tab, it edits NAV_ITEMS here via PR.

export type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-semibold"
        >
          <CompassMark size={30} />
          Compass
        </Link>

        {/* Desktop tabs (≥860px) */}
        <nav className="hidden gap-8 nav:flex" aria-label="Main">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative py-1 text-[0.95rem] font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? "text-sage-deep after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-sm after:bg-gold"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 nav:flex">
          <ButtonLink href="/login" variant="ghost">
            Log in
          </ButtonLink>
          <ButtonLink href="/signup" variant="solid">
            Get started
          </ButtonLink>
        </div>

        {/* Hamburger (<860px) */}
        <button
          type="button"
          className="flex flex-col gap-[5px] p-1.5 nav:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="h-0.5 w-6 rounded-sm bg-ink" />
          <span className="h-0.5 w-6 rounded-sm bg-ink" />
          <span className="h-0.5 w-6 rounded-sm bg-ink" />
        </button>
      </div>

      {/* Slide-down mobile menu */}
      {open && (
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
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="px-1 py-3 font-bold text-sage"
          >
            Get started →
          </Link>
        </div>
      )}
    </header>
  );
}
