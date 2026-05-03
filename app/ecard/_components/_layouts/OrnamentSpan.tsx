"use client";

import { motion } from "framer-motion";
import type { OrnamentSpec } from "../../_data/types";

interface OrnamentSpanProps {
  ornament: OrnamentSpec;
  index?: number;
}

const springEntry = {
  hidden: { scale: 0, rotate: -180, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 18,
      delay: i * 0.08,
    },
  }),
};

export function OrnamentSpan({ ornament: o, index = 0 }: OrnamentSpanProps) {
  return (
    <motion.span
      className={`absolute ${o.positionClass} ${o.sizeClass} ${o.animation !== "none" ? `ecard-anim-${o.animation}` : ""}`}
      style={o.animationDelay ? { animationDelay: o.animationDelay } : undefined}
      variants={springEntry}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      {o.emoji}
    </motion.span>
  );
}
