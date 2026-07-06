import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Shared button — matches mockup .btn / .btn-ghost / .btn-solid / .btn-lg.
// Both workflows use this. Do not fork per-feature button styles.

type Variant = "solid" | "ghost";
type Size = "default" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full border font-sans font-semibold cursor-pointer transition-all duration-200 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-deep " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid: "bg-sage-deep text-white border-transparent hover:bg-ink",
  ghost: "bg-transparent text-ink border-line hover:border-ink-soft",
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
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes(variant, size, className)} {...props}>
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
    <Link href={href} className={classes(variant, size, className)}>
      {children}
    </Link>
  );
}
