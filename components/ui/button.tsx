"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

// Shared button — Blueprint theme. Navy solid / hairline ghost, with a
// magnetic pointer-follow tilt and a click ripple (mirrors the mockup's
// .btn behavior). Both workflows use this; do not fork per-feature button
// styles. Variant/size API is unchanged so existing call sites don't need
// to change.

type Variant = "solid" | "ghost";
type Size = "default" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg border font-sans font-semibold cursor-pointer transition-[transform,box-shadow,border-color] duration-200 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid:
    "bg-ink text-white border-transparent hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(59,130,246,0.55)]",
  ghost:
    "bg-transparent text-ink border-line hover:-translate-y-0.5 hover:border-ink",
};

// min-h ensures every button meets the ~44px iOS/Android minimum
// touch-target size regardless of its (usually shorter) text content.
const sizes: Record<Size, string> = {
  default: "min-h-11 px-[18px] py-[9px] text-[0.9rem]",
  lg: "min-h-11 px-[26px] py-[13px] text-[0.95rem]",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function handleMagneticMove(e: MouseEvent<HTMLElement>) {
  if (prefersReducedMotion()) return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const relX = e.clientX - rect.left - rect.width / 2;
  const relY = e.clientY - rect.top - rect.height / 2;
  el.style.transform = `translate(${relX * 0.12}px, ${relY * 0.3}px)`;
}

function handleMagneticLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = "";
}

function handleRipple(e: MouseEvent<HTMLElement>) {
  if (prefersReducedMotion()) return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className =
    "pointer-events-none absolute h-5 w-5 scale-0 rounded-full bg-white/55 [animation:compass-ripple_0.6s_ease-out]";
  ripple.style.left = `${e.clientX - rect.left - 10}px`;
  ripple.style.top = `${e.clientY - rect.top - 10}px`;
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "solid",
  size = "default",
  className,
  children,
  onClick,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={classes(variant, size, className)}
      onMouseMove={handleMagneticMove}
      onMouseLeave={handleMagneticLeave}
      onClick={(e) => {
        handleRipple(e);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/** Link styled as a button (nav CTAs, hero actions). */
export function ButtonLink({
  href,
  variant = "solid",
  size = "default",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={classes(variant, size, className)}
      onMouseMove={handleMagneticMove}
      onMouseLeave={handleMagneticLeave}
      onClick={handleRipple}
    >
      {children}
    </Link>
  );
}
