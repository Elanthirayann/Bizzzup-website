"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";

const ITEMS = [
  "Multi-Agent Systems",
  "CrewAI Workflows",
  "AI Chatbots & Assistants",
  "RAG Platforms",
  "ComfyUI Pipelines",
  "Voice AI",
  "Data Preprocessing AI",
  "AI Brand Creatives",
];

const DRAG_THRESHOLD = 14;
const DRAG_SENSITIVITY = 0.62;

function Diamond({ index }: { index: number }) {
  const prefersReduced = useReducedMotion();

  const clip = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

  return (
    <motion.span
      className="mx-5 sm:mx-7 inline-block h-[9px] w-[9px] sm:h-[11px] sm:w-[11px] shrink-0 bg-linear-to-br from-accent-1 to-accent-2 shadow-[0_0_16px_color-mix(in_srgb,var(--color-accent-1)_38%,transparent)]"
      style={{ clipPath: clip }}
      animate={
        !prefersReduced
          ? { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }
          : { opacity: 0.88 }
      }
      transition={{
        duration: 2.8,
        repeat: prefersReduced ? 0 : Infinity,
        delay: index * 0.28,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    />
  );
}

function MarqueeTrack({
  offset,
  reduced,
}: {
  offset: number;
  reduced: boolean;
}) {
  const springHover = {
    type: "spring" as const,
    stiffness: 420,
    damping: 26,
  };

  return (
    <>
      {ITEMS.map((item, i) => (
        <motion.span
          key={`${offset}-${i}`}
          className="marquee-item flex items-center whitespace-nowrap"
          style={{ transformOrigin: "50% 50%" }}
          whileHover={
            reduced
              ? undefined
              : {
                  scale: 1.07,
                  transition: springHover,
                }
          }
          whileTap={
            reduced
              ? undefined
              : {
                  scale: 0.93,
                  transition: { duration: 0.12, ease: EXPO_OUT },
                }
          }
        >
          <Diamond index={offset + i} />
          <span className="relative inline-flex flex-col items-stretch">
            <span className="marquee-label relative z-1">{item}</span>
            <span
              className="marquee-label-line pointer-events-none -mt-0.5 h-px scale-x-0 bg-linear-to-r from-transparent via-accent-1/55 to-transparent"
              aria-hidden
            />
          </span>
        </motion.span>
      ))}
    </>
  );
}

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const dragX = useMotionValue(0);
  const smoothX = useSpring(dragX, {
    stiffness: 260,
    damping: 32,
    mass: 0.35,
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startClientX: number;
    originX: number;
    locked: boolean;
  } | null>(null);

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const hadLocked = d.locked;
      dragRef.current = null;
      setIsDragging(false);
      dragX.set(0);
      if (hadLocked && e.currentTarget instanceof HTMLElement) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          /* released */
        }
      }
    },
    [dragX]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (prefersReduced || e.button !== 0) return;
    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      originX: dragX.get(),
      locked: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startClientX;
    if (!d.locked) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      d.locked = true;
      setIsDragging(true);
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    }
    dragX.set(d.originX + dx * DRAG_SENSITIVITY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    endDrag(e);
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    endDrag(e);
  };

  const wrapperClass = [
    "marquee-wrapper relative z-[1] flex w-full items-center py-7 sm:py-9",
    !prefersReduced && "is-grabbable",
    isDragging && "is-dragging",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.section
      ref={sectionRef}
      aria-label="Capabilities we build. Hover to pause. Drag horizontally to nudge the strip."
      className="relative overflow-hidden border-t border-b border-border/90 bg-bg-surface"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={
        !prefersReduced
          ? { duration: 0.6, ease: "easeOut" }
          : { duration: 0 }
      }
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-accent-1) 5%, transparent) 0%, transparent 42%, transparent 58%, color-mix(in srgb, var(--color-accent-2) 4%, transparent) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border-accent to-transparent opacity-80"
        aria-hidden
      />

      <div
        className={wrapperClass}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={(e) => {
          if (dragRef.current?.pointerId === e.pointerId) {
            endDrag(e);
          }
        }}
      >
        <motion.div className="flex" style={{ x: prefersReduced ? 0 : smoothX }}>
          <div
            className="marquee-track flex items-center will-change-transform"
            style={{
              animation: `marquee-scroll ${prefersReduced ? 200 : 95}s linear infinite`,
            }}
          >
            <MarqueeTrack offset={0} reduced={!!prefersReduced} />
            <MarqueeTrack offset={ITEMS.length} reduced={!!prefersReduced} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
