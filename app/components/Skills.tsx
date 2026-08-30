import React from "react";

/** Flat, quiet chips. The list is data, not decoration, so it shouldn't shout. */
export default function Skills({ skills, className = "" }: { skills: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {skills.map((skill) => (
        <li
          key={skill}
          className="t-mono rounded-sm border border-rule px-2 py-1 text-[0.6875rem] leading-none text-ink-3"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
