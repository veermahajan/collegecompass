import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
