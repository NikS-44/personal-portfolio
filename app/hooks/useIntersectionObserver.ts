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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [observerOptions]);

  return elementRef;
}

export default useIntersectionObserver;
