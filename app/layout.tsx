import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { auth } from "@/auth";
import { Providers } from "@/components/providers";
import "./globals.css";

// Spec Sec 2: Fraunces (display, 600, headings only), Inter (body),
// IBM Plex Mono (scores, numbers, timestamps).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-fraunces",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Compass — College Guidance, Built by Students",
  description:
    "A free, all-in-one college application tool built by current high schoolers, for students without access to paid counselors.",
};

// Without this, mobile browsers render at a virtual desktop-width
// viewport (~980px on iOS Safari) and scale the whole page down —
// nav, headings, and forms all render tiny until the user pinch-zooms.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF7EE",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
      >
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
