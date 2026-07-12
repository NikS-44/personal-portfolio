import type { Metadata, Viewport } from "next";
import "./_styles/plan.css";

/**
 * Auth: `middleware.ts` gates /plan behind `PLANNER_SECRET` (Vercel env) via
 * the `plan-key` cookie; /plan/unlock sets it. Unset secret = open (local dev).
 */
export const metadata: Metadata = {
  title: "Weekly plan",
  robots: { index: false, follow: false },
  manifest: "/plan.webmanifest",
  other: {
    "color-scheme": "light dark",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ebe8e3" },
    { media: "(prefers-color-scheme: dark)", color: "#131211" },
  ],
};

/** Inline (no defer/module) so a pinned light/dark preference applies before paint. */
const PLAN_THEME_BOOT =
  'try{var t=localStorage.getItem("plan-color-scheme");if(t==="light"||t==="dark"){var r=document.currentScript&&document.currentScript.parentElement;if(r)r.setAttribute("data-theme",t);var m=document.querySelector(\'meta[name="color-scheme"]\');if(m)m.setAttribute("content",t);}}catch(e){}';

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="plan-board">
      <script dangerouslySetInnerHTML={{ __html: PLAN_THEME_BOOT }} />
      <a href="#plan-board" className="plan-skip-link">
        Skip to board
      </a>
      {children}
    </div>
  );
}
