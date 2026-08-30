import type { Metadata } from "next";
import localFont from "next/font/local";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";

/**
 * Three faces, three jobs.
 *  - Archivo (variable, incl. the `wdth` axis) is the drawing-sheet voice:
 *    condensed uppercase for labels, heavy and tight for display.
 *  - Source Serif 4 carries the prose, the warm counterweight to the
 *    measured headings.
 *  - Geist Mono annotates: dates, designators, durations.
 */
const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["wdth"],
  display: "swap",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

// Still consumed by /plan and /upkeepa, which keep their own visual language.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const SITE_DESCRIPTION =
  "Nik Shah is a senior software engineer on design systems at Samsara. Before that, Amazon (Shopbop) and a decade of server hardware at HPE.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nshah.org"),
  title: {
    default: "Nik Shah | Design Systems Engineer",
    template: "%s · Nik Shah",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Nik Shah | Design Systems Engineer",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Nik Shah",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nik Shah | Design Systems Engineer",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} ${geistSans.variable} bench-ground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
