import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://nshah.org"),
  title: {
    default: "Upkeepa — Keep your home, habits & day in good repair",
    template: "%s · Upkeepa",
  },
  description:
    "Upkeepa is a friendly iOS app for home upkeep, recurring maintenance, habits, tasks and meal planning — with a planner that shows exactly what today needs. Syncs across your household via iCloud.",
  applicationName: "Upkeepa",
  keywords: [
    "home maintenance",
    "household chores",
    "habit tracker",
    "daily planner",
    "meal planning",
    "reminders",
    "family organizer",
    "upkeep",
  ],
  openGraph: {
    title: "Upkeepa — Keep your home, habits & day in good repair",
    description:
      "Home upkeep, habits, tasks and meal planning in one friendly planner. Syncs across your household via iCloud.",
    url: "https://nshah.org/upkeepa",
    siteName: "Upkeepa",
    images: [{ url: "/upkeepa/app-icon.png", width: 1024, height: 1024, alt: "Upkeepa" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Upkeepa",
    description: "Keep your home, habits & day in good repair.",
    images: ["/upkeepa/app-icon.png"],
  },
};

export const viewport = {
  themeColor: "#12856B",
};

export default function UpkeepaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh w-full bg-[#F4FAF6] text-[#23362C]"
      style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* Scoped animations for the Upkeepa marketing surface. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes upkeepa-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-9px); }
            }
            .upkeepa-float { animation: upkeepa-float 4s ease-in-out infinite; }
            @keyframes upkeepa-rise {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .upkeepa-rise { animation: upkeepa-rise 0.7s ease forwards; }
            @media (prefers-reduced-motion: reduce) {
              .upkeepa-float, .upkeepa-rise { animation: none; }
            }
          `,
        }}
      />
      {children}
    </div>
  );
}
