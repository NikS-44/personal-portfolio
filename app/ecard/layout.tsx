import type { Metadata } from "next";
import "./_styles/animations.css";

export const metadata: Metadata = {
  title: "Create an eCard",
  description: "Send a beautiful personalized eCard to someone you love.",
};

export default function ECardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-white">{children}</div>;
}
