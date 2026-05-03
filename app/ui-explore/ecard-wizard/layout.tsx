import "../../ecard/_styles/animations.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI Explore — eCard Wizard",
};

export default function UIExploreLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-gray-50">{children}</div>;
}
