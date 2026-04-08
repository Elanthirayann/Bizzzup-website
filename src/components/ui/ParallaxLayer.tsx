"use client";

import type { RefObject, ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type Props = {
  /** Section (or block) whose visibility drives the parallax range */
  scrollTargetRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  /** Peak vertical shift in px at the ends of the scroll range */
  range?: number;
  /** Far-layer feel: move opposite to the default direction */
  invert?: boolean;
};

/**
 * Scroll-linked translateY for decorative layers only.
 * Disabled when prefers-reduced-motion is set.
 */
export default function ParallaxLayer({
  scrollTargetRef,
  children,
  className = "",
  range = 40,
  invert = false,
}: Props) {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });
  const start = invert ? -range : range;
  const end = invert ? range : -range;
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);

  return (
    <motion.div
      className={className}
      style={{ y: prefersReduced ? 0 : y }}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}
