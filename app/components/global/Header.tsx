"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import DropdownMenu from "./DropdownMenu";
import GitHubIcon from "@/app/components/icons/GithubIcon";

const PLAYGROUND = [
  { id: 1, name: "LinkedIn search tool", href: "/projects/linkedin" },
  { id: 2, name: "Cover letter generator", href: "/projects/cover-letter" },
  { id: 3, name: "Planner", href: "/plan" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="bg-ground/85 fixed inset-x-0 top-0 z-50 border-b border-rule backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href="/"
          className="t-label flex items-center gap-2.5 text-ink transition-colors hover:text-copper"
          aria-label="Nik Shah, home"
        >
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center rounded-sm bg-copper text-[0.625rem] font-bold text-[#1a0f06]"
          >
            NS
          </span>
          <span className="hidden sm:inline">Nik Shah</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-5 font-display text-sm font-medium text-ink-2 sm:gap-7">
          <Link href="/#experience" className="py-1 transition-colors hover:text-copper">
            Work
          </Link>
          <Link href="/upkeepa" className="py-1 transition-colors hover:text-copper">
            Upkeepa
          </Link>
          <DropdownMenu
            title="Playground"
            items={PLAYGROUND}
            isOpen={menuOpen}
            onToggle={() => setMenuOpen((open) => !open)}
            onClose={close}
          />
          <a
            href="https://github.com/NikS-44/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-1 transition-colors hover:text-copper"
          >
            <GitHubIcon />
            <span className="sr-only">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
