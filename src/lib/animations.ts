/** Shared animation easings, variants, and hooks */

import type { Variants } from "framer-motion";
import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Parent stagger orchestrator */
export const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/** Child fade + slide up */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EXPO_OUT },
  },
};

/** Card-level fade + slide up (no blur — GPU-safe) */
export const fadeUpBlurVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EXPO_OUT },
  },
};

/** Decorative horizontal line scale-in from left */
export const scaleLineVariants: Variants = {
  hidden: { scaleX: 0, originX: "0%" },
  visible: {
    scaleX: 1,
    transition: { duration: 0.45, ease: EXPO_OUT },
  },
};

/**
 * Returns [isInView, replayKey].
 * replayKey increments each time the element re-enters the viewport,
 * allowing animations to replay by using it as a `key` prop.
 */
export function useReplay(
  ref: React.RefObject<Element | null>,
  options?: { margin?: string }
): [boolean, number] {
  const isInView = useInView(ref, { once: false, margin: options?.margin as never });
  const [key, setKey] = useState(0);
  const prevInView = useRef(false);

  useEffect(() => {
    if (isInView && !prevInView.current) {
      setKey((k) => k + 1);
    }
    prevInView.current = isInView;
  }, [isInView]);

  return [isInView, key];
}
