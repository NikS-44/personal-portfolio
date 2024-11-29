"use client";
import Resume from "@/app/components/homepage/Resume";
import Projects from "@/app/components/homepage/Projects";
import React from "react";
import Greeting from "@/app/components/homepage/Greeting";
import useIntersectionObserver from "@/app/hooks/useIntersectionObserver";

export default function Home() {
  const projectsRef = useIntersectionObserver();
  return (
    <>
      <section
        id="home"
        className="mx-auto mb-4 flex min-h-svh max-w-2xl flex-col items-center justify-center gap-6 px-8 text-white"
      >
        <div className="background-stencil absolute inset-0" />
        <Greeting />
      </section>
      <section id="resume" className="min-h-svh px-2.5 pb-16 pt-16">
        <Resume />
      </section>
      <section
        id="projects"
        ref={projectsRef}
        className="flex min-h-svh flex-col items-center justify-center py-16 opacity-0"
      >
        <Projects />
      </section>
    </>
  );
}
