// Five-spoke radar/compass mark — the signature motif (spec Sec 2).
// Used as logo, section divider, and (later, Workflow A) the Compass
// Score radar. Do NOT introduce a second unrelated icon system.

type CompassMarkProps = {
  size?: number;
  /** Token color for the pentagon stroke. Defaults to sage. */
  color?: string;
  /** Render the interior spokes (logo style) or outline only (divider style). */
  spokes?: boolean;
  className?: string;
};

export function CompassMark({
  size = 30,
  color = "#7C9473",
  spokes = true,
  className,
}: CompassMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <polygon
        points="20,4 34,15 29,34 11,34 6,15"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {spokes && (
        <>
          <line x1="20" y1="20" x2="20" y2="4" stroke={color} strokeWidth="1.3" opacity="0.5" />
          <line x1="20" y1="20" x2="34" y2="15" stroke={color} strokeWidth="1.3" opacity="0.5" />
          <line x1="20" y1="20" x2="29" y2="34" stroke={color} strokeWidth="1.3" opacity="0.5" />
          <line x1="20" y1="20" x2="11" y2="34" stroke={color} strokeWidth="1.3" opacity="0.5" />
          <line x1="20" y1="20" x2="6" y2="15" stroke={color} strokeWidth="1.3" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

/** Section divider with the compass motif, per the mockup. */
export function CompassDivider() {
  return (
    <div className="flex items-center justify-center gap-4 px-6 py-2 opacity-60">
      <div className="h-px max-w-[220px] flex-1 bg-line" />
      <CompassMark size={22} color="#D9A441" spokes={false} />
      <div className="h-px max-w-[220px] flex-1 bg-line" />
    </div>
  );
}
