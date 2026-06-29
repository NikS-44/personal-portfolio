/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// ── Upkeepa brand palette ──────────────────────────────────────────────
// Pulled from the app: house greens + emerald accent + gold roof-beacon.
export const upkeepa = {
  ink: "#23362C",
  inkSoft: "#4B6557",
  accent: "#12856B",
  accentHover: "#0E6D58",
  mint: "#62B98A",
  mintLight: "#84CDA3",
  surface: "#E6F4EC",
  border: "#CDE9D8",
  gold: "#F5C24B",
  blush: "#F4A29A",
  page: "#F4FAF6",
};

// App Store link — swap in the real URL once the listing is live.
export const APP_STORE_URL = "https://apps.apple.com/app/upkeepa";
export const SUPPORT_EMAIL = "upkeepa@nshah.org";

export function Mascot({
  pose,
  size = 120,
  float = false,
  className = "",
}: {
  pose: string;
  size?: number;
  float?: boolean;
  className?: string;
}) {
  return (
    <img
      src={`/upkeepa/mascot/${pose}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`${float ? "upkeepa-float select-none" : "select-none"} ${className}`}
      style={{ width: size, height: "auto" }}
    />
  );
}

export function AppIcon({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/upkeepa/app-icon.png"
      alt="Upkeepa app icon"
      width={size}
      height={size}
      className="rounded-[22%] shadow-sm ring-1 ring-black/5"
      style={{ width: size, height: size }}
    />
  );
}

export function AppStoreBadge({ className = "" }: { className?: string }) {
  return (
    <Link
      href={APP_STORE_URL}
      className={`inline-flex items-center gap-3 rounded-2xl bg-[#23362C] px-5 py-3 text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-black ${className}`}
    >
      <svg viewBox="0 0 384 512" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.1 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium opacity-80">Download on the</span>
        <span className="text-lg font-semibold tracking-tight">App Store</span>
      </span>
    </Link>
  );
}

export function UpkeepaNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#CDE9D8]/70 bg-[#F4FAF6]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/upkeepa" className="flex items-center gap-2.5">
          <AppIcon size={36} />
          <span className="text-lg font-bold tracking-tight text-[#23362C]">Upkeepa</span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-[#4B6557]">
          <Link href="/upkeepa#features" className="hidden hover:text-[#12856B] sm:inline">
            Features
          </Link>
          <Link href="/upkeepa/support" className="hover:text-[#12856B]">
            Support
          </Link>
          <Link
            href={APP_STORE_URL}
            className="rounded-full bg-[#12856B] px-4 py-1.5 font-semibold text-white transition-colors hover:bg-[#0E6D58]"
          >
            Get the app
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function UpkeepaFooter() {
  return (
    <footer className="border-t border-[#CDE9D8] bg-[#EAF5EE]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AppIcon size={40} />
          <div>
            <p className="font-bold text-[#23362C]">Upkeepa</p>
            <p className="text-xs text-[#4B6557]">Keep your home, habits & day in good repair.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4B6557]">
          <Link href="/upkeepa" className="hover:text-[#12856B]">
            Home
          </Link>
          <Link href="/upkeepa/support" className="hover:text-[#12856B]">
            Support
          </Link>
          <Link href="/upkeepa/privacy" className="hover:text-[#12856B]">
            Privacy
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-[#12856B]">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-[#CDE9D8] px-5 py-4 text-center text-xs text-[#6B8175]">
        © {new Date().getFullYear()} Nik Shah. Upkeepa and the Upkeepa mascot are trademarks of Nik Shah. All rights
        reserved.
      </div>
    </footer>
  );
}
