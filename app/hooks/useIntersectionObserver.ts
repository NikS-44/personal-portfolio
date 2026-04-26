"use client";
import { useEffect, useRef, useMemo } from "react";

function useIntersectionObserver(
  options = {
    threshold: 0.1,
    rootMargin: "0px",
  },
) {
  const elementRef = useRef(null);
  const observerOptions = useMemo(() => options, [options]);

  useEffect(() => {
    const el = elementRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [observerOptions]);

  return elementRef;
}

export default useIntersectionObserver;
