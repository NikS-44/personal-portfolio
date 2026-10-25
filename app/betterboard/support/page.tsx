import type { Metadata } from "next";
import Link from "next/link";
import { BetterBoardFooter, BetterBoardNav, SUPPORT_EMAIL, betterboard } from "../_components/ui";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Help with BetterBoard — adding the keyboard, Full Access, clipboard and paste, swipe typing, autocorrect, Apple Intelligence and resetting what it has learned.",
  alternates: { canonical: "/betterboard/support" },
};

const faqs = [
  {
    q: "How do I add BetterBoard to my keyboards?",
    a: "Open Settings → General → Keyboard → Keyboards → Add New Keyboard, then choose BetterBoard. To use it, tap and hold the globe key while typing and pick BetterBoard. The app walks you through this on first launch.",
  },
  {
    q: "Why does iOS warn me about Full Access?",
    a: "iOS shows that warning for every third-party keyboard, because the permission could allow a keyboard to send data off the device. BetterBoard has no networking code at all. It uses Full Access only so the keyboard and the app can read the same private container on your iPhone, which is what makes learning, clipboard history and saved items work in both places.",
  },
  {
    q: "Can I use it without Full Access?",
    a: "Yes. The keyboard works for typing, autocorrect and swipe. The features that need the app and keyboard to share data — clipboard history, saved items and synced learning — stay off until you grant it.",
  },
  {
    q: "The keyboard didn't appear, or I got Apple's keyboard instead.",
    a: "iOS falls back to its own keyboard if a third-party keyboard fails to start. Try removing and re-adding BetterBoard in Settings → General → Keyboard → Keyboards, then restart your iPhone. If it keeps happening, email me with your iPhone model and iOS version.",
  },
  {
    q: "Why do I have to tap Paste to use the clipboard?",
    a: "BetterBoard never reads your pasteboard on its own. It can see only that the pasteboard changed, not what is in it. Tapping the system Paste control is what grants access to that one item, which is why there is no repeated “would like to paste” prompt.",
  },
  {
    q: "How do I undo an autocorrection?",
    a: "Press backspace immediately after the correction and BetterBoard restores exactly what you typed. Doing this also teaches it not to make that correction again.",
  },
  {
    q: "Swipe typing isn't picking the right word.",
    a: "Tap the suggestion bar right after a swipe to swap in another candidate. Each pick teaches the decoder your preference. If a word you use often never appears, type it out a few times and it becomes part of your personal vocabulary.",
  },
  {
    q: "How do I stop it learning a particular word?",
    a: "Open the app's Learning tab, find the word and remove it. You can also reset everything BetterBoard has learned from the same screen.",
  },
  {
    q: "Write or Apple Intelligence features are missing.",
    a: "Write uses Apple's on-device models, which require a supported iPhone with Apple Intelligence turned on in Settings. If your device doesn't support it, the rest of the keyboard works normally.",
  },
  {
    q: "How do I delete everything BetterBoard has stored?",
    a: "In the app, clear the clipboard, delete your saved items, and reset learning and field memory in Settings. Deleting the app removes all of it. Nothing is ever uploaded, so there is no server copy.",
  },
  {
    q: "How do I report a bug or request a feature?",
    a: `Email ${SUPPORT_EMAIL} with what happened, your iPhone model and your iOS version. Screenshots help a lot. I read every message.`,
  },
];

export default function SupportPage() {
  return (
    <>
      <BetterBoardNav />

      <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: betterboard.blue }}>
          Support
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight" style={{ color: betterboard.ink }}>
          How can I help?
        </h1>
        <p className="mt-4 text-lg leading-relaxed" style={{ color: betterboard.inkSoft }}>
          BetterBoard is made by one person. Email me and you will reach me directly.
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=BetterBoard%20Support`}
          className="mt-8 inline-flex items-center gap-3 rounded-2xl px-5 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${betterboard.blue}, ${betterboard.indigo})` }}
        >
          Email {SUPPORT_EMAIL}
        </a>

        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: betterboard.ink }}>
            Common questions
          </h2>
          <dl className="mt-8 space-y-8">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border-b pb-8 last:border-0" style={{ borderColor: betterboard.border }}>
                <dt className="font-semibold" style={{ color: betterboard.ink }}>
                  {q}
                </dt>
                <dd className="mt-2 leading-relaxed" style={{ color: betterboard.inkSoft }}>
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: betterboard.ink }}>
            Privacy
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: betterboard.inkSoft }}>
            BetterBoard collects nothing and sends nothing off your device.{" "}
            <Link
              href="/betterboard/privacy"
              className="font-semibold underline underline-offset-4"
              style={{ color: betterboard.blue }}
            >
              Read the privacy policy
            </Link>
            .
          </p>
        </section>
      </main>

      <BetterBoardFooter />
    </>
  );
}
