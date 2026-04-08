"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";

export const CORE = { x: 240, y: 240, r: 36, label: "Core Engine" };

export const OUTER_NODES = [
  { x: 120, y: 100, r: 22, label: "Research", accent: 2, enterFrom: { x: -30, y: -30 }, stagger: 0 },
  { x: 360, y: 100, r: 22, label: "Analysis", accent: 2, enterFrom: { x: 30, y: -30 }, stagger: 0.18 },
  { x: 410, y: 240, r: 20, label: "Pipeline", accent: 3, enterFrom: { x: 40, y: 0 }, stagger: 0.12 },
  { x: 360, y: 380, r: 20, label: "Gateway", accent: 3, enterFrom: { x: 30, y: 30 }, stagger: 0.20 },
  { x: 120, y: 380, r: 22, label: "Knowledge", accent: 2, enterFrom: { x: -30, y: 30 }, stagger: 0.14 },
  { x: 70, y: 240, r: 20, label: "Execution", accent: 3, enterFrom: { x: -40, y: 0 }, stagger: 0.16 },
];

export const NODE_BASE_DELAY = 1.3;
export const nodeDelay = OUTER_NODES.map((n) => NODE_BASE_DELAY + n.stagger);

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface SystemGraphProps {
  mode: "entrance" | "scroll";
  inView: boolean;
  reduced: boolean;
  /** Only used in scroll mode — 0-1 progress of hero scrolling out */
  scrollProgress?: MotionValue<number>;
}

/* ------------------------------------------------------------------ */
/*  Scroll-aware wrappers for outer nodes & core                        */
/* ------------------------------------------------------------------ */

function ScrollNodeOpacity({
  children,
  index,
  scrollProgress,
}: {
  children: React.ReactNode;
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const fadeStart = 0.1 + index * 0.04;
  const fadeEnd = fadeStart + 0.25;
  const opacity = useTransform(scrollProgress, [0, fadeStart, fadeEnd], [1, 1, 0]);
  return <motion.g style={{ opacity }}>{children}</motion.g>;
}

function ScrollCoreTransform({
  children,
  scrollProgress,
}: {
  children: React.ReactNode;
  scrollProgress: MotionValue<number>;
}) {
  const scale = useTransform(scrollProgress, [0, 0.35], [1, 1.4]);
  const opacity = useTransform(scrollProgress, [0.3, 0.6], [1, 0]);
  return (
    <motion.g
      style={{
        scale,
        opacity,
        transformOrigin: `${CORE.x}px ${CORE.y}px`,
      }}
    >
      {children}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/*  Main SystemGraph                                                    */
/* ------------------------------------------------------------------ */

export default function SystemGraph({
  mode,
  inView,
  reduced,
  scrollProgress,
}: SystemGraphProps) {
  const isScroll = mode === "scroll" && scrollProgress && !reduced;

  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      className="w-full max-w-[480px] mx-auto"
      style={{ overflow: "visible" }}
    >
      {/* ── Connection lines ── */}
      {OUTER_NODES.map((node, i) => {
        const len = Math.hypot(node.x - CORE.x, node.y - CORE.y);
        const lineDelay = nodeDelay[i] + 0.3;
        const line = (
          <motion.line
            key={`line-${i}`}
            x1={CORE.x}
            y1={CORE.y}
            x2={node.x}
            y2={node.y}
            style={{ stroke: "var(--color-border)" }}
            strokeWidth={1}
            strokeDasharray={len}
            initial={reduced ? { strokeDashoffset: 0, opacity: 0.6 } : { strokeDashoffset: len, opacity: 0 }}
            animate={inView ? { strokeDashoffset: 0, opacity: 0.6 } : undefined}
            transition={{ duration: 1.0, delay: lineDelay, ease: EXPO_OUT }}
          />
        );
        /* In scroll mode, wrap lines so they fade with their node */
        if (isScroll) {
          return (
            <ScrollNodeOpacity key={`line-wrap-${i}`} index={i} scrollProgress={scrollProgress}>
              {line}
            </ScrollNodeOpacity>
          );
        }
        return line;
      })}

      {/* ── Signal dots ── */}
      {!reduced &&
        OUTER_NODES.map((node, i) => {
          const dur = 4 + i * 0.35;
          const begin = 4.0 + i * 0.4;
          const path =
            i % 2 === 0
              ? `M${node.x},${node.y} L${CORE.x},${CORE.y}`
              : `M${CORE.x},${CORE.y} L${node.x},${node.y}`;
          const fill =
            i % 2 === 0
              ? "var(--color-accent-1);var(--color-accent-1)"
              : "var(--color-accent-2);var(--color-accent-2)";
          return (
            <circle key={`signal-${i}`} r={2} opacity={0}>
              <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
              <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
              <animate attributeName="fill" values={fill} dur="1s" repeatCount="indefinite" />
            </circle>
          );
        })}

      {/* ── Core node — 3-phase activation ── */}
      {(() => {
        const coreElements = (
          <>
            {/* Glow ring */}
            <motion.circle
              cx={CORE.x} cy={CORE.y} r={CORE.r + 8}
              style={{ fill: "var(--color-accent-glow)", transformOrigin: `${CORE.x}px ${CORE.y}px` }}
              initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.8, delay: 1.1, ease: EXPO_OUT }}
            >
              {!reduced && (
                <animate attributeName="r" values={`${CORE.r + 8};${CORE.r + 11};${CORE.r + 8}`} dur="4s" begin="3.5s" repeatCount="indefinite" />
              )}
            </motion.circle>

            {/* Outer ring */}
            <motion.circle
              cx={CORE.x} cy={CORE.y} r={CORE.r}
              style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-1)", transformOrigin: `${CORE.x}px ${CORE.y}px` }}
              strokeWidth={2}
              initial={reduced ? {} : { scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : undefined}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.9 }}
            />

            {/* Inner spark */}
            <motion.circle
              cx={CORE.x} cy={CORE.y} r={8}
              style={{ fill: "var(--color-accent-1)", transformOrigin: `${CORE.x}px ${CORE.y}px` }}
              initial={reduced ? { opacity: 0.3 } : { opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 0.35, scale: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.7, ease: EXPO_OUT }}
            >
              {!reduced && (
                <animate attributeName="r" values="7;9;7" dur="3s" begin="3.5s" repeatCount="indefinite" />
              )}
            </motion.circle>

            {/* Label */}
            <motion.text
              x={CORE.x} y={CORE.y + CORE.r + 18} textAnchor="middle"
              style={{ fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase" as const }}
              initial={reduced ? {} : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : undefined}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {CORE.label}
            </motion.text>
          </>
        );

        if (isScroll) {
          return (
            <ScrollCoreTransform scrollProgress={scrollProgress}>
              {coreElements}
            </ScrollCoreTransform>
          );
        }
        return coreElements;
      })()}

      {/* ── Outer nodes ── */}
      {OUTER_NODES.map((node, i) => {
        const accentVar = `var(--color-accent-${node.accent})`;
        const delay = nodeDelay[i];
        const nodeElement = (
          <motion.g
            key={`node-${i}`}
            initial={reduced ? {} : { x: node.enterFrom.x, y: node.enterFrom.y, opacity: 0 }}
            animate={inView ? { x: 0, y: 0, opacity: 1 } : undefined}
            transition={{ duration: 0.6, delay, ease: EXPO_OUT }}
          >
            <circle cx={node.x} cy={node.y} r={node.r} style={{ fill: "var(--color-bg-card)", stroke: accentVar }} strokeWidth={1.5} />
            <circle cx={node.x} cy={node.y} r={5} style={{ fill: accentVar }} opacity={0.25} />
            <text
              x={node.x} y={node.y + node.r + 16} textAnchor="middle"
              style={{ fill: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: 7, letterSpacing: "0.05em", textTransform: "uppercase" as const }}
            >
              {node.label}
            </text>
          </motion.g>
        );

        if (isScroll) {
          return (
            <ScrollNodeOpacity key={`node-wrap-${i}`} index={i} scrollProgress={scrollProgress}>
              {nodeElement}
            </ScrollNodeOpacity>
          );
        }
        return nodeElement;
      })}
    </svg>
  );
}
