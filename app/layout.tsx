import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/app/components/global/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nik Shah | Frontend Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Nik Shah | Frontend Engineer</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} background-element flex min-h-dvh flex-col scroll-smooth antialiased focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400`}
      >
        <Header />
        <main className="[&>*:first-child]:pt-20">{children}</main>
      </body>
    </html>
  );
}
