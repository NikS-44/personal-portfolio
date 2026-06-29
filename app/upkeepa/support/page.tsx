import type { Metadata } from "next";
import Link from "next/link";
import { Mascot, SUPPORT_EMAIL, UpkeepaFooter, UpkeepaNav } from "../_components/ui";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Help and support for Upkeepa — answers to common questions about syncing, reminders, habits, household sharing and your data. Contact upkeepa@nshah.org.",
  alternates: { canonical: "/upkeepa/support" },
};

const faqs = [
  {
    q: "How do I get help or report a bug?",
    a: `Email ${SUPPORT_EMAIL} with a short description of what happened and your iOS version. Screenshots are hugely helpful. I read every message.`,
  },
  {
    q: "My items aren't syncing across devices.",
    a: "Upkeepa syncs through your iCloud account. Make sure every device is signed into the same Apple ID, that iCloud Drive is on, and that you have a network connection. Syncing can take a moment after you make a change — give it up to a minute, then reopen the app.",
  },
  {
    q: "How does household sharing work?",
    a: "Upkeepa shares your plan, chores and upkeep with the people in your household through iCloud. Everyone sees the same items and can check things off — changes show up on each device once they sync.",
  },
  {
    q: "Why didn't I get a reminder notification?",
    a: "Make sure notifications are enabled for Upkeepa in Settings → Notifications → Upkeepa, that the task or reminder has a time set, and that Focus / Do Not Disturb isn't silencing it. Reminders fire at the time you set on the item.",
  },
  {
    q: "Can I use Upkeepa on Apple Watch?",
    a: "Yes — Upkeepa includes an Apple Watch app and a widget so you can see and complete today's items from your wrist and Home Screen.",
  },
  {
    q: "Where is my data stored?",
    a: "Your data lives on your device and in your private iCloud account. Upkeepa has no separate accounts and no third-party tracking. See the Privacy Policy for details.",
  },
  {
    q: "How do I delete my data?",
    a: "Deleting an item removes it everywhere it's synced. To remove everything, delete the items inside the app, or delete the app and remove its data from Settings → Apple ID → iCloud → Manage Storage. You can also email me and I'll walk you through it.",
  },
];

export default function SupportPage() {
  return (
    <>
      <UpkeepaNav />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <Mascot pose="thinking" size={140} float />
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#23362C]">How can Upkeepa help?</h1>
          <p className="mt-4 max-w-xl text-lg text-[#4B6557]">
            Questions, bugs, or feedback — I’m a real person on the other end, and I’d love to hear from you.
          </p>
        </div>

        {/* Contact card */}
        <div className="mt-10 rounded-2xl border border-[#CDE9D8] bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#12856B]">Get in touch</p>
          <p className="mt-2 text-[#4B6557]">Email me and I’ll get back to you, usually within a couple of days.</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Upkeepa%20Support`}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#12856B] px-6 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-[#0E6D58]"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            {SUPPORT_EMAIL}
          </a>
        </div>

        {/* FAQ */}
        <h2 className="mt-14 text-2xl font-bold tracking-tight text-[#23362C]">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-[#CDE9D8] overflow-hidden rounded-2xl border border-[#CDE9D8] bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#23362C]">
                {f.q}
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-[#12856B] transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#4B6557]">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#4B6557]">
          Looking for the{" "}
          <Link href="/upkeepa/privacy" className="font-semibold text-[#12856B] hover:underline">
            Privacy Policy
          </Link>{" "}
          or back to the{" "}
          <Link href="/upkeepa" className="font-semibold text-[#12856B] hover:underline">
            Upkeepa home page
          </Link>
          ?
        </p>
      </section>

      <UpkeepaFooter />
    </>
  );
}
