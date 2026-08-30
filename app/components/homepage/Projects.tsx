"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/app/components/homepage/_data/experience";
import ProjectModal from "@/app/components/homepage/ProjectModal";

const CARD = "w-[17rem] shrink-0 snap-start sm:w-[20rem]";

function CardBody({ project }: { project: Project }) {
  return (
    <>
      {project.thumbnail && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-rule bg-ground">
          <Image
            src={project.thumbnail}
            alt=""
            fill
            sizes="(min-width: 640px) 23vw, 74vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h4 className="t-heading text-[0.9375rem] text-ink transition-colors group-hover:text-copper-2 sm:text-base">
          {project.title}
        </h4>
        <p className="mt-2.5 text-pretty text-sm leading-relaxed text-ink-2">{project.description}</p>
        {project.details && (
          <span className="t-label mt-4 inline-flex items-center gap-1.5 text-ink-3 transition-colors group-hover:text-copper">
            View
            <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor">
              <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </>
  );
}

export default function Projects({ projects, label = "Selected projects" }: { projects: Project[]; label?: string }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => observer.disconnect();
  }, [sync]);

  const scrollBy = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const scrollable = !atStart || !atEnd;

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="t-label text-ink-3">{label}</h3>
        {scrollable && (
          <div className="flex gap-1.5">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => scrollBy(direction)}
                disabled={direction === -1 ? atStart : atEnd}
                aria-label={direction === -1 ? "Previous projects" : "Next projects"}
                className="grid h-8 w-8 place-items-center rounded-sm border border-rule text-ink-2 transition-colors hover:border-rule-strong hover:bg-ground-3 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
              >
                <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor">
                  <path
                    d={direction === -1 ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      <ul
        ref={trackRef}
        onScroll={sync}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1"
      >
        {projects.map((project) => (
          <li key={project.id} className={`${CARD} flex`}>
            {project.details ? (
              <button
                type="button"
                onClick={() => setSelected(project)}
                className="group flex w-full flex-col overflow-hidden rounded-sm border border-rule bg-ground-2 text-left transition-colors hover:border-copper-dim hover:bg-ground-3"
              >
                <CardBody project={project} />
              </button>
            ) : (
              <article className="group flex w-full flex-col overflow-hidden rounded-sm border border-rule bg-ground-2">
                <CardBody project={project} />
              </article>
            )}
          </li>
        ))}
      </ul>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
