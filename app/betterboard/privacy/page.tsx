import type { Metadata } from "next";
import { BetterBoardFooter, BetterBoardNav, SUPPORT_EMAIL, betterboard } from "../_components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "BetterBoard's privacy policy. The keyboard has no network access, collects nothing, and keeps everything you type, copy and save on your iPhone.",
  alternates: { canonical: "/betterboard/privacy" },
};

const EFFECTIVE = "October 24, 2026";

const sections = [
  {
    title: "The short version",
    body: [
      "BetterBoard does not collect, transmit, sell or share any of your information. There is no account to create, no analytics, and no third-party SDKs.",
      "The keyboard extension contains no networking code. What you type, what the keyboard learns, your clipboard history and your saved items stay on your iPhone.",
    ],
  },
  {
    title: "What BetterBoard stores on your device",
    body: [
      "Learned words and typing patterns. BetterBoard learns from words you actually type and keep, so its corrections get better over time. This lives in a private container shared between the app and the keyboard.",
      "Clipboard history. When you turn it on, BetterBoard keeps recent copied text so you can paste it again. Items expire on the schedule you choose, and you can delete any item or clear the whole list at any time.",
      "Saved items. Text you deliberately save, such as an email address or a phrase you type often.",
      "Settings and typing calibration. Your preferences, and optional Typing Lab measurements used to adapt the keyboard to where your thumbs land.",
    ],
  },
  {
    title: "What BetterBoard never does",
    body: [
      "It does not log the text you type. There is no debug logging of typed content in shipping builds.",
      "It does not learn from fields marked sensitive. Password, credit card and one-time-code fields are treated as literal text and never contribute to learning.",
      "It does not read your clipboard in the background. The keyboard checks only whether the pasteboard has changed, which does not expose the contents. Reading an item requires you to tap the system Paste control.",
      "It does not track you across apps or websites, and it contains no advertising identifiers.",
    ],
  },
  {
    title: "Full Access",
    body: [
      "iOS asks for Full Access before a third-party keyboard can share data with its containing app. BetterBoard uses it for exactly one thing: letting the keyboard and the app read the same private container on your device, so what the keyboard learns shows up in the app and your saved items reach the keyboard.",
      "iOS shows a strongly worded warning when you grant this to any keyboard, because the permission would allow network access. BetterBoard has none. You can use the keyboard without Full Access; the shared features simply stay off.",
    ],
  },
  {
    title: "Apple Intelligence",
    body: [
      "The Write feature, which fixes grammar and rewrites text, uses Apple's on-device Foundation Models. The text you select is processed on your iPhone and is not sent to me or to any server.",
      "Availability depends on your device and your Apple Intelligence settings.",
    ],
  },
  {
    title: "Deleting your data",
    body: [
      "Everything BetterBoard holds can be erased from inside the app: clear the clipboard, delete saved items, and reset learning and field memory in Settings.",
      "Deleting the app removes all of it from your device. Because nothing is ever uploaded, there is no server-side copy to request or delete.",
    ],
  },
  {
    title: "Children",
    body: [
      "BetterBoard is not directed at children under 13 and collects no information from anyone, including children.",
    ],
  },
  {
    title: "Changes",
    body: [
      "If this policy changes, the updated version will be posted on this page with a new effective date. Material changes will be noted in the app's release notes.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <BetterBoardNav />

      <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: betterboard.blue }}>
          Privacy Policy
        </p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight" style={{ color: betterboard.ink }}>
          BetterBoard keeps your typing to itself.
        </h1>
        <p className="mt-4 text-sm" style={{ color: betterboard.inkSoft }}>
          Effective {EFFECTIVE}
        </p>

        <div className="mt-12 space-y-12">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: betterboard.ink }}>
                {title}
              </h2>
              <div className="mt-4 space-y-4">
                {body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed" style={{ color: betterboard.inkSoft }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold tracking-tight" style={{ color: betterboard.ink }}>
              Contact
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: betterboard.inkSoft }}>
              Questions about this policy? Email{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=BetterBoard%20Privacy`}
                className="font-semibold underline underline-offset-4"
                style={{ color: betterboard.blue }}
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <BetterBoardFooter />
    </>
  );
}
