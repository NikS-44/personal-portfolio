import type { Metadata } from "next";

const DESCRIPTION =
  "BetterBoard is a private iOS keyboard that hits the keys you meant, learns how you type, and keeps your clipboard and saved text one tap away. Everything stays on your iPhone.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nshah.org"),
  title: {
    default: "BetterBoard — A keyboard that hits the keys you meant",
    template: "%s · BetterBoard",
  },
  description: DESCRIPTION,
  applicationName: "BetterBoard",
  keywords: [
    "iOS keyboard",
    "custom keyboard",
    "swipe typing",
    "autocorrect",
    "clipboard history",
    "text snippets",
    "private keyboard",
    "on-device",
    "Apple Intelligence",
  ],
  openGraph: {
    title: "BetterBoard — A keyboard that hits the keys you meant",
    description: DESCRIPTION,
    url: "https://nshah.org/betterboard",
    siteName: "BetterBoard",
    images: [{ url: "/betterboard/app-icon.png", width: 512, height: 512, alt: "BetterBoard" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "BetterBoard",
    description: "A keyboard that hits the keys you meant. Private by design.",
    images: ["/betterboard/app-icon.png"],
  },
};

export const viewport = {
  themeColor: "#1E7FFF",
};

export default function BetterBoardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh w-full bg-[#F5F7FF] text-[#101633]"
      style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes betterboard-rise {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .betterboard-rise { animation: betterboard-rise 0.7s ease forwards; }
            @media (prefers-reduced-motion: reduce) {
              .betterboard-rise { animation: none; }
            }
          `,
        }}
      />
      {children}
    </div>
  );
}
