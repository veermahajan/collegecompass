import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { auth } from "@/auth";
import { Providers } from "@/components/providers";
import { AmbientBackground } from "@/components/ui/ambient-background";
import "./globals.css";

// Blueprint theme: Space Grotesk (display, 600, headings only), Inter
// (body), IBM Plex Mono (scores, numbers, timestamps).
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-space-grotesk",
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
  themeColor: "#FAF8F5",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}
      >
        <AmbientBackground />
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
