"use client";
import { useEffect, useRef } from "react";

const PRE_ANIMATION_CLASS = "reveal";
const IN_CLASS = "reveal-in";

/**
 * Reveals an element once it scrolls into view.
 *
 * The hidden state is applied *by this hook*, never in the markup, so with
 * JavaScript off, or if the observer never fires, the content is simply
 * visible rather than stuck at `opacity: 0`.
 */
function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(rootMargin = "0px 0px -10% 0px") {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    el.classList.add(PRE_ANIMATION_CLASS);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(IN_CLASS);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return elementRef;
}

export default useIntersectionObserver;
