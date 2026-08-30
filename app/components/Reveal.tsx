"use client";
import React from "react";
import useIntersectionObserver from "@/app/hooks/useIntersectionObserver";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger within a group, in milliseconds. */
  delay?: number;
  as?: "div" | "section" | "li" | "header" | "article";
}

/**
 * Fades content up as it enters the viewport. The hidden state is added by
 * JS, so content is always visible without it. The hook also opts out
 * entirely when the visitor prefers reduced motion.
 */
export default function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useIntersectionObserver<HTMLElement>();
  const Tag: React.ElementType = as;

  return (
    // `as` is a union of tags, so the ref type narrows to their intersection.
    // A never-typed ref is assignable to every element ref.
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
