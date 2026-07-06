import type { Config } from "tailwindcss";

// Design tokens — spec Section 2, LOCKED.
// Do not invent parallel color variables. Both workflows use this set.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FBF7EE",
        "canvas-deep": "#F3EDDF",
        ink: "#2B2B26",
        "ink-soft": "#5B5A50",
        sage: "#7C9473", // growth / primary
        "sage-deep": "#5F7857",
        gold: "#D9A441", // achievement / accent
        sky: "#6E9CB0", // collaboration / secondary
        line: "#E8E0CF",
      },
      fontFamily: {
        // Wired to next/font CSS variables set in app/layout.tsx
        display: ["var(--font-fraunces)", "serif"], // headings only, weight 600
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
