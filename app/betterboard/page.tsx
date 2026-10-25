import Link from "next/link";
import { AppIcon, AppStoreBadge, BetterBoardFooter, BetterBoardNav, Screenshot, betterboard } from "./_components/ui";

/** Add a capture here and it appears in the gallery. */
const SCREENS = [
  {
    src: "/betterboard/screens/home.png",
    alt: "The BetterBoard app showing keyboard status, the privacy promise, a test field and Typing Lab",
    caption: "Set it up, try it out, and see what the keyboard has learned.",
  },
  {
    src: "/betterboard/screens/privacy.png",
    alt: "BetterBoard's privacy screen: on this device only, no network access, no account and no tracking",
    caption: "On-device only. No account, no analytics, no network calls.",
  },
];

const FEATURES = [
  {
    title: "Accurate taps",
    body: "Every point on the keyboard belongs to exactly one key, gaps included, and it adapts to where your thumbs actually land.",
  },
  {
    title: "Swipe typing",
    body: "Glide across the letters and tap a suggestion to swap the word.",
  },
  {
    title: "Autocorrect you can undo",
    body: "Backspace right after a correction puts back exactly what you typed.",
  },
  {
    title: "Clipboard history",
    body: "Everything you copy, ready to paste again. A fresh copy, and any code, email or link inside it, shows up in the suggestion bar.",
  },
  {
    title: "Saved items",
    body: "Keep the emails, addresses and phrases you type constantly, and insert them with one tap.",
  },
  {
    title: "Write with Apple Intelligence",
    body: "Fix grammar, or rewrite a paragraph friendlier, more professional or shorter. On device.",
  },
  {
    title: "Faster delete",
    body: "Hold delete to speed up to whole words, or slide left from delete to erase them. Slide back to restore.",
  },
  {
    title: "Numbers without switching",
    body: "Hold a top-row letter to type the number above it.",
  },
  {
    title: "Space-bar trackpad",
    body: "Hold or drag the space bar to move the cursor exactly where you want it.",
  },
  {
    title: "Learns privately",
    body: "Picks up your words on device, and only from what you actually type and keep.",
  },
];

const PRIVACY_POINTS = [
  {
    title: "On this device only",
    body: "What BetterBoard learns, your clipboard and your saved items never leave your iPhone.",
  },
  {
    title: "No network access",
    body: "The keyboard has no networking code at all. Write runs on on-device Apple Intelligence.",
  },
  {
    title: "No account, no tracking",
    body: "No sign-up and no analytics. You can erase everything at any time in Settings.",
  },
];

export default function BetterBoardPage() {
  return (
    <>
      <BetterBoardNav />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 55% at 72% 0%, #E2ECFF 0%, rgba(226,236,255,0) 70%), linear-gradient(180deg, #FFFFFF 0%, #F5F7FF 100%)",
          }}
        />
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 sm:py-24 md:grid-cols-2">
          <div className="betterboard-rise">
            <AppIcon size={64} />
            <h1
              className="mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
              style={{ color: betterboard.ink }}
            >
              A keyboard that hits the keys you meant.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed" style={{ color: betterboard.inkSoft }}>
              BetterBoard learns how you type, adapts to where your thumbs land, and keeps everything you copy one tap
              away. All of it on your iPhone, none of it anywhere else.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AppStoreBadge />
              <Link
                href="/betterboard/support"
                className="text-sm font-semibold underline underline-offset-4"
                style={{ color: betterboard.inkSoft }}
              >
                Questions? Start here
              </Link>
            </div>
            <p className="mt-5 text-sm" style={{ color: betterboard.inkSoft }}>
              For iPhone. Requires iOS 26 or later.
            </p>
          </div>

          <div className="betterboard-rise">
            <Screenshot {...SCREENS[0]} priority />
          </div>
        </div>
      </section>

      {/* ── Privacy promise ────────────────────────────────────────────── */}
      <section className="border-y bg-white" style={{ borderColor: betterboard.border }}>
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: betterboard.blue }}>
                Private by design
              </p>
              <h2
                className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
                style={{ color: betterboard.ink }}
              >
                Everything stays on your iPhone.
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed" style={{ color: betterboard.inkSoft }}>
                A keyboard sees everything you write, so BetterBoard is built to see none of it. Nothing is collected,
                stored or sent anywhere.
              </p>
              <dl className="mt-8 space-y-6">
                {PRIVACY_POINTS.map(({ title, body }) => (
                  <div key={title}>
                    <dt className="font-semibold" style={{ color: betterboard.ink }}>
                      {title}
                    </dt>
                    <dd className="mt-1 leading-relaxed" style={{ color: betterboard.inkSoft }}>
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/betterboard/privacy"
                className="mt-8 inline-block text-sm font-semibold underline underline-offset-4"
                style={{ color: betterboard.blue }}
              >
                Read the full privacy policy
              </Link>
            </div>

            <Screenshot {...SCREENS[1]} />
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <h2
          className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: betterboard.ink }}
        >
          What&apos;s in the box
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed" style={{ color: betterboard.inkSoft }}>
          The small things you hit hundreds of times a day, done properly.
        </p>

        <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {FEATURES.map(({ title, body }) => (
            <li key={title}>
              <h3 className="font-semibold" style={{ color: betterboard.ink }}>
                {title}
              </h3>
              <p className="mt-1.5 leading-relaxed" style={{ color: betterboard.inkSoft }}>
                {body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Getting started ────────────────────────────────────────────── */}
      <section className="border-t bg-white" style={{ borderColor: betterboard.border }}>
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <h2
            className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: betterboard.ink }}
          >
            Three steps to set up
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "1",
                title: "Install the app",
                body: "BetterBoard installs like any other app and walks you through the rest.",
              },
              {
                n: "2",
                title: "Add the keyboard",
                body: "Settings → General → Keyboard → Keyboards → Add New Keyboard, then pick BetterBoard.",
              },
              {
                n: "3",
                title: "Turn on Full Access",
                body: "This lets the keyboard share what it learns with the app. Your data still never leaves the device.",
              },
            ].map(({ n, title, body }) => (
              <li key={n}>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${betterboard.blue}, ${betterboard.indigo})` }}
                >
                  {n}
                </span>
                <h3 className="mt-4 font-semibold" style={{ color: betterboard.ink }}>
                  {title}
                </h3>
                <p className="mt-1.5 leading-relaxed" style={{ color: betterboard.inkSoft }}>
                  {body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <AppStoreBadge />
            <Link
              href="/betterboard/support"
              className="text-sm font-semibold underline underline-offset-4"
              style={{ color: betterboard.inkSoft }}
            >
              Full setup help
            </Link>
          </div>
        </div>
      </section>

      <BetterBoardFooter />
    </>
  );
}
