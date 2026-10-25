/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// ── BetterBoard brand ──────────────────────────────────────────────────
// Taken from the app icon: an azure-to-indigo gradient on white keys.
export const betterboard = {
  blue: "#1E7FFF",
  indigo: "#4B35E0",
  ink: "#101633",
  inkSoft: "#4A5478",
  surface: "#FFFFFF",
  page: "#F5F7FF",
  border: "#DDE3F7",
  tintSoft: "#EEF2FF",
};

export const SUPPORT_EMAIL = "betterboard@nshah.org";

/**
 * The App Store listing does not exist until review clears, so there is
 * deliberately no link here. Set this once the app is live and the badge
 * turns into a real link on every page.
 */
export const APP_STORE_URL: string | null = null;

export function AppIcon({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/betterboard/app-icon.png"
      alt="BetterBoard app icon"
      width={size}
      height={size}
      className="rounded-[22%] shadow-sm ring-1 ring-black/5"
      style={{ width: size, height: size }}
    />
  );
}

export function AppStoreBadge({ className = "" }: { className?: string }) {
  const label = APP_STORE_URL ? "Download on the App Store" : "Coming soon to the App Store";

  const inner = (
    <>
      <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M16.37 12.76c.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.73-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.51-.71 2.84-.71s1.7.71 2.86.69c1.18-.02 1.93-1.08 2.65-2.15.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.5zM14.2 6.3c.6-.74 1.01-1.75.9-2.76-.87.04-1.94.58-2.57 1.3-.56.64-1.06 1.68-.93 2.67.98.07 1.98-.49 2.6-1.21z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[0.625rem] uppercase tracking-wide opacity-80">
          {APP_STORE_URL ? "Download on the" : "Coming soon to the"}
        </span>
        <span className="block text-lg font-semibold tracking-tight">App Store</span>
      </span>
    </>
  );

  const shared = "inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-white shadow-sm transition " + className;

  if (!APP_STORE_URL) {
    return (
      <span
        aria-label={label}
        className={`${shared} cursor-default opacity-90`}
        style={{ background: `linear-gradient(135deg, ${betterboard.blue}, ${betterboard.indigo})` }}
      >
        {inner}
      </span>
    );
  }

  return (
    <a
      href={APP_STORE_URL}
      aria-label={label}
      className={`${shared} hover:opacity-90`}
      style={{ background: `linear-gradient(135deg, ${betterboard.blue}, ${betterboard.indigo})` }}
    >
      {inner}
    </a>
  );
}

/** A phone-shaped frame so flat PNG captures read as a device. */
export function Screenshot({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className="flex flex-col items-center">
      <div
        className="w-full max-w-[18rem] overflow-hidden rounded-[2rem] border bg-white p-1.5 shadow-lg"
        style={{ borderColor: betterboard.border }}
      >
        <img
          src={src}
          alt={alt}
          width={880}
          height={1912}
          loading={priority ? "eager" : "lazy"}
          className="block w-full rounded-[1.6rem]"
        />
      </div>
      <figcaption className="mt-4 max-w-[22rem] text-center text-sm" style={{ color: betterboard.inkSoft }}>
        {caption}
      </figcaption>
    </figure>
  );
}

export function BetterBoardNav() {
  return (
    <header
      className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur"
      style={{ borderColor: betterboard.border }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/betterboard" className="flex items-center gap-3">
          <AppIcon size={32} />
          <span className="text-base font-bold tracking-tight" style={{ color: betterboard.ink }}>
            BetterBoard
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium" style={{ color: betterboard.inkSoft }}>
          <Link href="/betterboard/support" className="hover:text-[#1E7FFF]">
            Support
          </Link>
          <Link href="/betterboard/privacy" className="hover:text-[#1E7FFF]">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function BetterBoardFooter() {
  return (
    <footer className="border-t" style={{ borderColor: betterboard.border }}>
      <div
        className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between"
        style={{ color: betterboard.inkSoft }}
      >
        <div className="flex items-center gap-3">
          <AppIcon size={36} />
          <div>
            <p className="font-semibold" style={{ color: betterboard.ink }}>
              BetterBoard
            </p>
            <p>
              By{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-[#1E7FFF]">
                Nik Shah
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/betterboard/support" className="hover:text-[#1E7FFF]">
            Support
          </Link>
          <Link href="/betterboard/privacy" className="hover:text-[#1E7FFF]">
            Privacy Policy
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#1E7FFF]">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
