import type { Config } from "tailwindcss";

// Design tokens — "Blueprint" theme (2026-07 rebrand). Same token names as
// before so every page that already references them by name (canvas, ink,
// sage-deep, sky, gold, line, ...) picks up the new palette automatically.
// Do not invent parallel color variables.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF8F5",
        "canvas-deep": "#EEF2F8",
        ink: "#0F172A", // navy — headings, primary text, solid dark surfaces
        "ink-soft": "#475569", // muted slate — secondary/body copy
        sage: "#3B82F6", // blue — interactive accent (alias of sage-deep)
        "sage-deep": "#3B82F6", // blue — links, focus rings, active states
        gold: "#22D3EE", // cyan — highlight accent (nav underline, pins, dots)
        sky: "#3B82F6", // blue — secondary accent, same family as sage-deep
        line: "rgba(15,23,42,0.12)", // hairline border, matches on white or canvas
      },
      fontFamily: {
        // Wired to next/font CSS variables set in app/layout.tsx
        display: ["var(--font-space-grotesk)", "sans-serif"], // headings only, weight 600
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"], // scores, numbers, timestamps
      },
      screens: {
        // Spec originally called for 860px, but nav item count has since
        // grown to 9 across workflows — at 860px even a tightened row
        // (gap-4, 0.85rem, nowrap) doesn't fit within the 1180px container's
        // available content width. Raised so the horizontal-tab layout only
        // appears once there's actually room for it; verified in-browser.
        nav: "1100px",
      },
    },
  },
  plugins: [],
};
export default config;
