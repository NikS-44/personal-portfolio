"use client";
import { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import HomeIcon from "@/app/components/icons/HomeIcon";
import Link from "next/link";
import GitHubIcon from "@/app/components/icons/GithubIcon";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const personal = [
    {
      id: 1,
      name: "About Me",
      href: "/",
    },
    {
      id: 2,
      name: "My Work",
      href: "/#resume",
    },
  ];

  const creations = [
    {
      id: 1,
      name: "Articles",
      href: "/articles",
    },
    {
      id: 2,
      name: "Linkedin Helper",
      href: "/projects/linkedin",
    },
  ];

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header className="fixed z-50 flex w-full justify-center py-3 text-white">
      <nav className="flex w-fit items-center gap-2 space-x-6 text-nowrap rounded-lg border border-solid border-cyan-950 bg-neutral-900 px-4 py-3 shadow-xl">
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 border-gray-300 transition-colors duration-300 hover:text-cyan-400 hover:underline hover:underline-offset-4"
        >
          <HomeIcon />
        </Link>
        <DropdownMenu
          title="About"
          items={personal}
          isOpen={activeMenu === "projects"}
          onToggle={() => toggleMenu("projects")}
        />
        <DropdownMenu
          title="Creations"
          items={creations}
          isOpen={activeMenu === "creations"}
          onToggle={() => toggleMenu("creations")}
        />
        <a
          className="mr-2 flex items-center gap-2 border-gray-300 transition-colors duration-300 hover:text-cyan-400"
          href="https://github.com/NikS-44/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </nav>
    </header>
  );
};

export default Header;
