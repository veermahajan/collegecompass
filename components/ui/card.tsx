"use client";

import { useRef } from "react";
import type {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";

// Shared card — Blueprint theme. White surface, hairline border, blueprint
// radius, hover lift with a cursor-tracking spotlight glow (mirrors the
// mockup's .rcard). Both workflows use this.

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  className,
  hover = true,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean; children: ReactNode }) {
  const spotlightRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const el = spotlightRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-xl border border-line bg-white p-7",
        hover &&
          "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-[7px] hover:border-sage-deep/30 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.22)]",
        className
      )}
      onMouseMove={hover ? handleMouseMove : undefined}
      {...props}
    >
      {hover && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), rgba(59,130,246,0.08), transparent 70%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/** Colored icon tile at the top of a card (mockup .card-icon). */
export function CardIcon({
  color,
  children,
  className,
}: {
  /** Token hex or Tailwind bg class content color, e.g. "#3B82F6" */
  color: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "mb-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-xl",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cx("mb-2 font-display text-[1.1rem] font-semibold", className)}>
      {children}
    </h3>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cx("text-[0.92rem] text-ink-soft", className)}>{children}</p>
  );
}
