"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

type Props = {
  children: ReactNode;
  /** Pull strength toward cursor (0–1 scale) */
  strength?: number;
  /** Max shift in px */
  max?: number;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function Magnetic({
  children,
  strength = 0.2,
  max = 12,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={wrapRef}
      className={`inline-block ${className}`}
      onMouseMove={(e) => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * strength;
        const dy = (e.clientY - cy) * strength;
        x.set(clamp(dx, -max, max));
        y.set(clamp(dy, -max, max));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ x: sx, y: sy }} className="inline-block">
        {children}
      </motion.div>
    </div>
  );
}
