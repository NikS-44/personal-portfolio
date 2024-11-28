"use client";
import React, { useState } from "react";
import GitHubIcon from "@/app/components/GithubIcon";

interface Project {
  id: number;
  name: string;
  href: string;
}

const projects: Project[] = [{ id: 1, name: "My Work", href: "#projects" }];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed z-50 flex w-full justify-center py-3 text-white">
      <nav className="flex w-fit items-center gap-2 space-x-6 text-nowrap rounded-lg border border-solid border-cyan-950 bg-neutral-900 px-4 py-3 shadow-xl">
        <a href="#about" className="transition-colors duration-300 hover:text-cyan-400">
          About Me
        </a>
        <a href="#resume" className="transition-colors duration-300 hover:text-cyan-400">
          Resume
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center space-x-1 transition-colors duration-300 hover:text-cyan-400"
        >
          <span>Projects</span>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {isOpen && (
            <div className="absolute left-1/2 top-full z-10 mt-2 w-48 -translate-x-1/2 rounded-md bg-white shadow-lg dark:bg-gray-800">
              <div className="py-1">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={project.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    {project.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </button>
        <a
          className="mr-2 flex items-center gap-2 border-gray-300 transition-colors duration-300 hover:text-cyan-400 hover:underline hover:underline-offset-4"
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
