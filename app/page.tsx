import GitHubIcon from "@/app/components/GithubIcon";
import LinkedInIcon from "@/app/components/LinkedInIcon";
import Resume from "@/app/components/Resume";
import Projects from "@/app/components/Projects";
import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      <header className="fixed z-50 flex w-full justify-center bg-black py-3 text-white shadow-md">
        <nav className="flex w-fit items-center gap-2 space-x-6 text-nowrap rounded-lg bg-neutral-900 px-4 py-3">
          <a href="#about" className="transition-colors duration-300 hover:text-cyan-400">
            About Me
          </a>
          <a href="#resume" className="transition-colors duration-300 hover:text-cyan-400">
            Resume
          </a>
          <a href="#projects" className="transition-colors duration-300 hover:text-cyan-400">
            Projects
          </a>
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
      <main className="w-full flex-grow bg-black">
        <section
          id="about"
          className="mx-auto mb-4 flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-8 pt-20 text-white"
        >
          <h1 className="text-6xl">Hi, I&apos;m Nik!</h1>
          <p className="mt-5">
            I&#39;m a front-end developer with a passion for all things tech and love the challenge of solving complex
            problems. In my free time, you can find me at the climbing gym, in the mountains, or setting up the latest
            silly home automation. In a former life, I was a senior hardware engineer designing server motherboards, but
            I gave that all up so I could build websites!
          </p>
          <p>
            As a frontend developer, I&apos;ve worked professionally with React and Angular, and while I don&apos;t
            favor one or the other, I strongly prefer Typescript in whatever web project I am working on. I excel when
            working on teams with a strong collaborative culture, and I get the most joy working with others. I enjoy
            understanding the low level details of how the web actually works, and my goal is to lead teams in building
            scalable, reliable, and performant websites. I also have a strong passion for web accessibility, and believe
            it is paramount to build inclusive and usable websites for all.
          </p>
          <div className="flex gap-4">
            <div className="relative rounded-lg border-2 border-transparent text-white transition-colors hover:border-neutral-500">
              <a
                className="relative flex animate-[moving-cyan-black_3s_linear_infinite] items-center gap-2 text-nowrap rounded-md bg-gradient-to-r from-cyan-900 to-black bg-[length:200%_200%] px-4 py-2 transition-colors duration-300"
                href="https://www.linkedin.com/in/nik-shah-657ba616/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
                Hire Me!
              </a>
            </div>
            <div className="relative rounded-lg border-2 border-transparent text-white transition-colors hover:border-cyan-600">
              <a
                className="relative flex animate-[moving-cyan-black_3s_linear_infinite] items-center gap-2 text-nowrap rounded-md bg-gradient-to-r from-cyan-900 to-black bg-[length:200%_200%] px-4 py-2 transition-colors duration-300"
                href="#resume"
                rel="noopener noreferrer"
              >
                My Work
              </a>
            </div>
          </div>
        </section>
        <section id="resume" className="min-h-svh px-2.5 pb-16 pt-16">
          <Resume />
        </section>
        <section id="projects" className="flex min-h-svh flex-col items-center justify-start py-16">
          <Projects />
        </section>
      </main>
    </div>
  );
}
