import type { HTMLAttributes, ReactNode } from "react";

// Shared card — matches mockup .card. White surface, line border,
// 16px radius, hover lift. Both workflows use this.

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Card({
  className,
  hover = true,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean; children: ReactNode }) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-line bg-white p-7",
        hover &&
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_16px_32px_-18px_rgba(43,43,38,0.18)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Colored icon tile at the top of a card (mockup .card-icon). */
export function CardIcon({
  color,
  children,
  className,
}: {
  /** Token hex or Tailwind bg class content color, e.g. "#7C9473" */
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
