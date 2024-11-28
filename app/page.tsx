import Resume from "@/app/components/homepage/Resume";
import Projects from "@/app/components/homepage/Projects";
import React from "react";
import Greeting from "@/app/components/homepage/Greeting";

export default function Home() {
  return (
    <>
      <section
        id="about"
        className="mx-auto mb-4 flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-8 text-white"
      >
        <Greeting />
      </section>
      <section id="resume" className="min-h-svh px-2.5 pb-16 pt-16">
        <Resume />
      </section>
      <section id="projects" className="flex min-h-svh flex-col items-center justify-center py-16">
        <Projects />
      </section>
    </>
  );
}
