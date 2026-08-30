"use client";
import React, { useCallback, useEffect, useId, useRef } from "react";
import Image from "next/image";
import type { Project } from "@/app/components/homepage/_data/experience";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Detail view for a project card. Uses a native <dialog> for focus trapping
 * and Escape handling, and adds what the platform doesn't: a dimmed backdrop,
 * a scroll lock, accessible labelling, and the card's own description so the
 * detail view never shows less context than the card did.
 */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();
  const details = project?.details;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      dialog.showModal();
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  // Lock the page behind the dialog without the layout shifting as the
  // scrollbar disappears.
  useEffect(() => {
    if (!project) return;
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [project]);

  // Clicking the backdrop closes. The event target is the <dialog> itself
  // only when the click landed outside the panel.
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) onClose();
    },
    [onClose],
  );

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleClick}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="m-auto w-[min(64rem,calc(100vw-1.5rem))] max-w-none rounded-sm border border-rule-strong bg-ground-2 p-0 text-ink backdrop:bg-[rgba(6,9,10,0.82)] backdrop:backdrop-blur-[3px] open:animate-fadeUp"
    >
      {project && (
        <div className="flex max-h-[min(88vh,52rem)] flex-col">
          <header className="flex items-start justify-between gap-6 border-b border-rule px-5 py-4 sm:px-7 sm:py-5">
            <div className="min-w-0">
              <p className="t-label text-copper">Project</p>
              <h2 id={titleId} className="t-heading mt-2 text-lg text-ink sm:text-xl">
                {project.title}
              </h2>
              <p id={descId} className="mt-2.5 max-w-[74ch] text-pretty text-sm leading-relaxed text-ink-2">
                {project.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-rule text-ink-2 transition-colors hover:border-rule-strong hover:bg-ground-3 hover:text-ink"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          {details && (
            <div className="min-h-0 flex-1 overflow-y-auto bg-ground p-4 sm:p-6">
              <Image
                src={details.image}
                alt={details.altText}
                width={details.width}
                height={details.height}
                className="mx-auto h-auto w-auto max-w-full rounded-sm border border-rule object-contain"
                style={{ maxHeight: "min(52vh, 30rem)" }}
                unoptimized={details.image.src.endsWith(".gif")}
              />
              <p className="t-mono mt-3 text-center text-xs text-ink-3">{details.title}</p>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
