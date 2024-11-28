import Resume from "@/app/components/homepage/Resume";
import Projects from "@/app/components/homepage/Projects";
import React from "react";
import Header from "@/app/components/global/Header";
import Greeting from "@/app/components/homepage/Greeting";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="background-element w-full flex-grow">
        <section
          id="about"
          className="mx-auto mb-4 flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-8 pt-20 text-white"
        >
          <Greeting />
        </section>
        <section id="resume" className="min-h-svh px-2.5 pb-16 pt-16">
          <Resume />
        </section>
        <section id="projects" className="flex min-h-svh flex-col items-center justify-center py-16">
          <Projects />
        </section>
      </main>
    </div>
  );
}
