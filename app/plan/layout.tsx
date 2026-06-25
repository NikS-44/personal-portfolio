import type { Metadata } from "next";
import "./_styles/plan.css";

/**
 * Future auth: gate this route with middleware comparing a cookie or header to
 * `process.env.PLANNER_SECRET` (set in Vercel project env). Not enabled yet.
 */
export const metadata: Metadata = {
  title: "Weekly plan",
  robots: { index: false, follow: false },
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return <div className="plan-board min-h-dvh">{children}</div>;
}
