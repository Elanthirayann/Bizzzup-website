"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useReplay, EXPO_OUT } from "@/lib/animations";

/* ── Rotating word component ── */
function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ width: "4.2em", height: "1.15em" }}>
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="absolute left-0 top-0 gradient-text font-[800]"
          initial={{ y: "100%", opacity: 0 }}
          animate={
            i === index
              ? { y: "0%", opacity: 1 }
              : { y: "-100%", opacity: 0 }
          }
          transition={{ duration: 0.5, ease: EXPO_OUT }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── System thread connector ── */

const NODE_MAP = [
  { label: "Research Agent", accent: "var(--color-accent-2)" },
  { label: "Analysis Agent", accent: "var(--color-accent-2)" },
  { label: "Data Pipeline", accent: "var(--color-accent-3)" },
  { label: "API Gateway", accent: "var(--color-accent-3)" },
  { label: "Knowledge Base", accent: "var(--color-accent-2)" },
  { label: "Execution Layer", accent: "var(--color-accent-3)" },
];

function SystemThread({ index, inView, reduced }: { index: number; inView: boolean; reduced: boolean }) {
  const node = NODE_MAP[index];
  if (!node) return null;
  return (
    <motion.div
      className="flex items-center gap-2 mb-3"
      initial={reduced ? {} : { opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, delay: 0.1, ease: EXPO_OUT }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12">
        <circle cx="6" cy="6" r="5" style={{ fill: "none", stroke: node.accent }} strokeWidth={1.5} />
        <circle cx="6" cy="6" r={2} style={{ fill: node.accent }} opacity={0.4} />
      </svg>
      <span className="font-mono text-[0.6rem] tracking-[0.08em] uppercase text-text-muted">
        {node.label}
      </span>
      <div style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(to right, ${node.accent}, transparent)`,
        opacity: 0.2,
      }} />
    </motion.div>
  );
}

/* ── Feature visuals ── */

function FlowchartVisual() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const active = isInView && !prefersReduced;

  /* Shared easing — gentle expo-out for everything */
  

  /*
   * Timing anchors (seconds)
   * Sequence: node settles → pause → lines draw → pause → next node
   * Each phase has breathing room so nothing overlaps.
   */
  const t = {
    inputNode: 0.15,       // slight delay so it doesn't fire on paint
    upperLines: 0.7,       // lines begin after INPUT is fully settled
    midNodes: 1.35,        // ANALYZE/DESIGN after lines land
    lowerLines: 2.0,       // lower lines after mid-nodes settle
    outputNode: 2.65,      // OUTPUT after lower lines land
    idle: 3.6,             // orbs start well after full sequence
  };

  /*
   * Node layout (280×220 viewBox, centered on x=140)
   *
   *         [  INPUT  ]        y: 16–54  (wider: 92w × 38h)
   *          /        \
   *   [ANALYZE]    [DESIGN]   y: 92–126  (76w × 34h)
   *          \        /
   *         [ OUTPUT  ]        y: 164–200 (84w × 36h)
   */
  const lineUpper = Math.hypot(52, 38); // INPUT→mid nodes ~64.4
  const lineLower = Math.hypot(52, 38); // mid nodes→OUTPUT ~64.4

  return (
    <svg ref={ref} viewBox="0 0 280 220" fill="none" className="w-full h-full">
      <defs>
        {/* Node soft-edge — minimal blur for refinement, not glow */}
        <filter id="fc-glow-green" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fc-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fc-glow-pink" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Traveling orb — soft dot, no halo */}
        <filter id="fc-orb-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Line trace — barely visible softening */}
        <filter id="fc-line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Upper connector: INPUT → ANALYZE ── */}
      <motion.path
        d="M118 54 L66 92"
        style={{ stroke: "var(--color-border)" }} strokeWidth="0.8" opacity={0.6}
        strokeDasharray={lineUpper} strokeDashoffset={lineUpper}
        animate={active ? { strokeDashoffset: 0 } : {}}
        transition={{ delay: t.upperLines, duration: 0.65, ease: EXPO_OUT }}
      />
      <motion.path
        d="M118 54 L66 92"
        style={{ stroke: "var(--color-accent-1)" }} strokeWidth="1" strokeLinecap="round"
        filter="url(#fc-line-glow)" opacity={0}
        strokeDasharray={lineUpper} strokeDashoffset={lineUpper}
        animate={active ? { strokeDashoffset: 0, opacity: [0, 0.4, 0.2] } : {}}
        transition={{ delay: t.upperLines, duration: 0.7, ease: EXPO_OUT }}
      />

      {/* ── Upper connector: INPUT → DESIGN ── */}
      <motion.path
        d="M162 54 L214 92"
        style={{ stroke: "var(--color-border)" }} strokeWidth="0.8" opacity={0.6}
        strokeDasharray={lineUpper} strokeDashoffset={lineUpper}
        animate={active ? { strokeDashoffset: 0 } : {}}
        transition={{ delay: t.upperLines + 0.15, duration: 0.65, ease: EXPO_OUT }}
      />
      <motion.path
        d="M162 54 L214 92"
        style={{ stroke: "var(--color-accent-1)" }} strokeWidth="1" strokeLinecap="round"
        filter="url(#fc-line-glow)" opacity={0}
        strokeDasharray={lineUpper} strokeDashoffset={lineUpper}
        animate={active ? { strokeDashoffset: 0, opacity: [0, 0.4, 0.2] } : {}}
        transition={{ delay: t.upperLines + 0.15, duration: 0.7, ease: EXPO_OUT }}
      />

      {/* ── Lower connector: ANALYZE → OUTPUT ── */}
      <motion.path
        d="M66 126 L118 164"
        style={{ stroke: "var(--color-border)" }} strokeWidth="0.8" opacity={0.6}
        strokeDasharray={lineLower} strokeDashoffset={lineLower}
        animate={active ? { strokeDashoffset: 0 } : {}}
        transition={{ delay: t.lowerLines, duration: 0.65, ease: EXPO_OUT }}
      />
      <motion.path
        d="M66 126 L118 164"
        style={{ stroke: "var(--color-accent-2)" }} strokeWidth="1" strokeLinecap="round"
        filter="url(#fc-line-glow)" opacity={0}
        strokeDasharray={lineLower} strokeDashoffset={lineLower}
        animate={active ? { strokeDashoffset: 0, opacity: [0, 0.35, 0.18] } : {}}
        transition={{ delay: t.lowerLines, duration: 0.7, ease: EXPO_OUT }}
      />

      {/* ── Lower connector: DESIGN → OUTPUT ── */}
      <motion.path
        d="M214 126 L162 164"
        style={{ stroke: "var(--color-border)" }} strokeWidth="0.8" opacity={0.6}
        strokeDasharray={lineLower} strokeDashoffset={lineLower}
        animate={active ? { strokeDashoffset: 0 } : {}}
        transition={{ delay: t.lowerLines + 0.15, duration: 0.65, ease: EXPO_OUT }}
      />
      <motion.path
        d="M214 126 L162 164"
        style={{ stroke: "var(--color-accent-2)" }} strokeWidth="1" strokeLinecap="round"
        filter="url(#fc-line-glow)" opacity={0}
        strokeDasharray={lineLower} strokeDashoffset={lineLower}
        animate={active ? { strokeDashoffset: 0, opacity: [0, 0.35, 0.18] } : {}}
        transition={{ delay: t.lowerLines + 0.15, duration: 0.7, ease: EXPO_OUT }}
      />

      {/* ── INPUT node (wider — visual anchor) ── */}
      <motion.g
        initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
        animate={active ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.inputNode, duration: 0.6, ease: EXPO_OUT }}
        filter="url(#fc-glow-green)"
        style={{ transformOrigin: "140px 35px" }}
      >
        <motion.rect
          x="94" y="16" width="92" height="38" rx="5"
          style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-1)" }} strokeWidth="1"
          strokeDasharray={260} strokeDashoffset={260}
          animate={active ? { strokeDashoffset: 0 } : {}}
          transition={{ delay: t.inputNode, duration: 0.7, ease: EXPO_OUT }}
        />
        <motion.text
          x="140" y="40" textAnchor="middle" style={{ fill: "var(--color-accent-1)" }} fontSize="11" fontFamily="monospace"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.inputNode + 0.35, duration: 0.35 }}
        >
          INPUT
        </motion.text>
      </motion.g>

      {/* ── ANALYZE node ── */}
      <motion.g
        initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
        animate={active ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.midNodes, duration: 0.6, ease: EXPO_OUT }}
        filter="url(#fc-glow-cyan)"
        style={{ transformOrigin: "66px 109px" }}
      >
        <motion.rect
          x="28" y="92" width="76" height="34" rx="4"
          style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-2)" }} strokeWidth="1"
          strokeDasharray={220} strokeDashoffset={220}
          animate={active ? { strokeDashoffset: 0 } : {}}
          transition={{ delay: t.midNodes, duration: 0.7, ease: EXPO_OUT }}
        />
        <motion.text
          x="66" y="114" textAnchor="middle" style={{ fill: "var(--color-accent-2)" }} fontSize="10" fontFamily="monospace"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.midNodes + 0.35, duration: 0.35 }}
        >
          ANALYZE
        </motion.text>
      </motion.g>

      {/* ── DESIGN node ── */}
      <motion.g
        initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
        animate={active ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.midNodes + 0.18, duration: 0.6, ease: EXPO_OUT }}
        filter="url(#fc-glow-cyan)"
        style={{ transformOrigin: "214px 109px" }}
      >
        <motion.rect
          x="176" y="92" width="76" height="34" rx="4"
          style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-2)" }} strokeWidth="1"
          strokeDasharray={220} strokeDashoffset={220}
          animate={active ? { strokeDashoffset: 0 } : {}}
          transition={{ delay: t.midNodes + 0.18, duration: 0.7, ease: EXPO_OUT }}
        />
        <motion.text
          x="214" y="114" textAnchor="middle" style={{ fill: "var(--color-accent-2)" }} fontSize="10" fontFamily="monospace"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.midNodes + 0.5, duration: 0.35 }}
        >
          DESIGN
        </motion.text>
      </motion.g>

      {/* ── OUTPUT node ── */}
      <motion.g
        initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
        animate={active ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.outputNode, duration: 0.6, ease: EXPO_OUT }}
        filter="url(#fc-glow-pink)"
        style={{ transformOrigin: "140px 182px" }}
      >
        <motion.rect
          x="98" y="164" width="84" height="36" rx="4"
          style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-3)" }} strokeWidth="1"
          strokeDasharray={240} strokeDashoffset={240}
          animate={active ? { strokeDashoffset: 0 } : {}}
          transition={{ delay: t.outputNode, duration: 0.7, ease: EXPO_OUT }}
        />
        <motion.text
          x="140" y="187" textAnchor="middle" style={{ fill: "var(--color-accent-3)" }} fontSize="11" fontFamily="monospace"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={active ? { opacity: 1 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.outputNode + 0.35, duration: 0.35 }}
        >
          OUTPUT
        </motion.text>
      </motion.g>

      {/* ── Traveling glow orb — left path (INPUT → ANALYZE → OUTPUT) ── */}
      {!prefersReduced && (
        <g filter="url(#fc-orb-glow)">
          <circle r="1.8" style={{ fill: "var(--color-accent-1)" }} opacity="0">
            <animate attributeName="opacity" values="0;0.35;0.35;0" dur="4.5s" keyTimes="0;0.06;0.9;1" begin={`${t.idle}s`} repeatCount="indefinite" />
            <animateMotion dur="4.5s" begin={`${t.idle}s`} repeatCount="indefinite" path="M118,54 L66,126 L118,164" />
          </circle>
        </g>
      )}

      {/* ── Traveling glow orb — right path (INPUT → DESIGN → OUTPUT) ── */}
      {!prefersReduced && (
        <g filter="url(#fc-orb-glow)">
          <circle r="1.8" style={{ fill: "var(--color-accent-2)" }} opacity="0">
            <animate attributeName="opacity" values="0;0.35;0.35;0" dur="4.5s" keyTimes="0;0.06;0.9;1" begin={`${t.idle + 2.25}s`} repeatCount="indefinite" />
            <animateMotion dur="4.5s" begin={`${t.idle + 2.25}s`} repeatCount="indefinite" path="M162,54 L214,126 L162,164" />
          </circle>
        </g>
      )}
    </svg>
  );
}

function BookVisual() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const on = isInView && !prefersReduced;
  

  /*
   * Narrative sequence — a story being drafted on an open book:
   *
   *   0.15s — Spine appears (the book exists)
   *   0.55s — Pages unfold outward from the spine
   *   1.2s  — Page surfaces materialise (the paper is ready)
   *   1.5s  — Writing begins: lines appear L→R in reading order,
   *           interleaved across the spread (left line 1, right line 1,
   *           left line 2, right line 2 …) with organic length variation
   *   2.5s  — First "aha" dot lands mid-writing (an idea crystallises)
   *   3.1s  — Writing finishes
   *   3.3s  — Second dot lands (the conclusion)
   *   3.6s  — A faint arc connects the two dots (the throughline)
   *   4.2s  — Idle: book breathes with a gentle tilt
   */
  const t = {
    spine: 0.15,
    pages: 0.55,
    surface: 1.2,
    write: 1.5,
    firstDot: 2.5,
    secondDot: 3.3,
    arc: 3.6,
    idle: 4.2,
  };

  const spineLen = 180;
  const pageLen = 560;

  /*
   * Writing lines — interleaved across the spread.
   * Each entry: [side, y, length, delay-offset].
   * Lengths vary (28–50) to mimic real sentence widths.
   * "left" lines write from spine outward (x2 → x1 = rightward read),
   * "right" lines write from spine outward (x1 → x2 = rightward).
   */
  const lines: Array<["l" | "r", number, number, number]> = [
    ["l",  60, 44, 0],
    ["r",  60, 50, 0.09],
    ["l",  76, 36, 0.20],
    ["r",  76, 46, 0.30],
    ["l",  92, 48, 0.42],
    ["r",  92, 38, 0.52],
    ["l", 108, 30, 0.64],
    ["r", 108, 50, 0.74],
    ["l", 124, 42, 0.88],
    ["r", 124, 32, 0.98],
    ["l", 140, 28, 1.10],
    ["r", 140, 44, 1.20],
  ];

  return (
    <svg ref={ref} viewBox="0 0 320 240" fill="none" className="w-full h-full">
      <defs>
        <filter id="bk-glow-dot" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bk-glow-arc" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Idle breathing — gentle held-book tilt ── */}
      <motion.g
        animate={
          on
            ? {
                y: [0, -1.2, 0],
                rotate: [0, 0.3, 0],
              }
            : {}
        }
        transition={
          on
            ? {
                delay: t.idle,
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop" as const,
              }
            : undefined
        }
        style={{ transformOrigin: "160px 120px" }}
      >
        {/* ── 1. Spine — the book opens ── */}
        <motion.path
          d="M160 30 L160 210"
          style={{ stroke: "var(--color-border)" }} strokeWidth="1.5"
          strokeDasharray={spineLen} strokeDashoffset={spineLen}
          animate={on ? { strokeDashoffset: 0, opacity: [0, 0.45, 0.3] } : {}}
          transition={{ delay: t.spine, duration: 0.55, ease: EXPO_OUT }}
        />

        {/* ── 2. Pages unfold from spine outward ── */}
        {/* Left page fill */}
        <motion.path
          d="M160 30 Q120 28 60 40 L60 200 Q120 190 160 210 Z"
          stroke="none"
          initial={prefersReduced ? false : { opacity: 0, scaleX: 0 }}
          animate={on ? { opacity: 0.9, scaleX: 1 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.pages, duration: 0.7, ease: EXPO_OUT }}
          style={{ fill: "var(--color-bg-card)", transformOrigin: "160px 120px" }}
        />
        {/* Right page fill */}
        <motion.path
          d="M160 30 Q200 28 260 40 L260 200 Q200 190 160 210 Z"
          stroke="none"
          initial={prefersReduced ? false : { opacity: 0, scaleX: 0 }}
          animate={on ? { opacity: 0.9, scaleX: 1 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.pages + 0.12, duration: 0.7, ease: EXPO_OUT }}
          style={{ fill: "var(--color-bg-card)", transformOrigin: "160px 120px" }}
        />

        {/* Left page edge */}
        <motion.path
          d="M160 30 Q120 28 60 40 L60 200 Q120 190 160 210"
          fill="none" style={{ stroke: "var(--color-accent-2)" }} strokeWidth="0.8"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={on ? { opacity: 0.45 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.pages + 0.4, duration: 0.5, ease: EXPO_OUT }}
        />
        {/* Right page edge */}
        <motion.path
          d="M160 30 Q200 28 260 40 L260 200 Q200 190 160 210"
          fill="none" style={{ stroke: "var(--color-accent-3)" }} strokeWidth="0.8"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={on ? { opacity: 0.45 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.pages + 0.5, duration: 0.5, ease: EXPO_OUT }}
        />

        {/* ── 3. Writing — interleaved lines across the spread ── */}
        {lines.map(([side, y, len, offset], i) => {
          const isLeft = side === "l";
          /* Left: line grows from spine (x=155) leftward.
             Right: line grows from spine (x=165) rightward. */
          const origin = isLeft ? 155 : 165;
          const endX = isLeft ? origin - len : origin + len;

          /* Opacity varies: earlier lines slightly brighter (fresh ink),
             later lines fade as the writing settles */
          const ink = 0.5 - i * 0.015;

          return (
            <motion.line
              key={`${side}${i}`}
              x1={origin} y1={y} x2={origin} y2={y}
              style={{ stroke: "var(--color-border)" }} strokeWidth="1"
              strokeLinecap="round"
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={
                on
                  ? { opacity: ink, x2: endX }
                  : prefersReduced ? {} : undefined
              }
              transition={{
                delay: t.write + offset,
                duration: 0.35,
                ease: EXPO_OUT,
              }}
            />
          );
        })}

        {/* ── 4a. First idea dot — mid-writing "aha" moment ── */}
        <motion.circle
          cx="210" cy="82" r="2.5" style={{ fill: "var(--color-accent-1)" }}
          filter="url(#bk-glow-dot)"
          initial={prefersReduced ? false : { opacity: 0, r: 0 }}
          animate={
            on
              ? { opacity: [0, 0.5, 0.35], r: [0, 3.2, 2.5] }
              : prefersReduced ? {} : undefined
          }
          transition={{ delay: t.firstDot, duration: 0.5, ease: EXPO_OUT }}
        />

        {/* ── 4b. Second idea dot — the conclusion ── */}
        <motion.circle
          cx="95" cy="150" r="2" style={{ fill: "var(--color-accent-3)" }}
          filter="url(#bk-glow-dot)"
          initial={prefersReduced ? false : { opacity: 0, r: 0 }}
          animate={
            on
              ? { opacity: [0, 0.4, 0.25], r: [0, 2.8, 2] }
              : prefersReduced ? {} : undefined
          }
          transition={{ delay: t.secondDot, duration: 0.5, ease: EXPO_OUT }}
        />

        {/* ── 5. Throughline arc — connecting the two ideas ── */}
        <motion.path
          d="M210 82 Q160 105 95 150"
          fill="none" stroke="url(#bk-arc-grad)" strokeWidth="0.8"
          strokeLinecap="round" filter="url(#bk-glow-arc)"
          strokeDasharray={160} strokeDashoffset={160}
          animate={on ? { strokeDashoffset: 0, opacity: [0, 0.4, 0.2] } : {}}
          transition={{ delay: t.arc, duration: 0.7, ease: EXPO_OUT }}
        />
      </motion.g>

      {/* Gradient for throughline arc (outside breathing group so it doesn't transform) */}
      <defs>
        <linearGradient id="bk-arc-grad" x1="210" y1="82" x2="95" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: "var(--color-accent-1)" }} stopOpacity="0.6" />
          <stop offset="100%" style={{ stopColor: "var(--color-accent-3)" }} stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function NetworkVisual() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const on = isInView && !prefersReduced;
  

  /*
   * Network topology:
   *   0 = Hub (center, green, largest)
   *   1–6 = Outer agents, revealed in a balanced clockwise sweep
   *
   * Sequence:
   *   0.15s — Hub activates with glow ring
   *   0.7s  — Hub-to-outer edges trace outward, staggered per node
   *   0.85s — Outer nodes appear one-by-one (clockwise: 1,2,4,6,5,3)
   *   2.0s  — Peer edges trace between adjacent outer nodes
   *   2.8s  — Idle: subtle signal pulses travel hub↔outer
   */
  const t = {
    hub: 0.2,
    hubEdges: 0.85,
    outerNodes: 1.0,
    outerStagger: 0.2,
    peerEdges: 2.4,
    idle: 3.2,
  };

  /*
   * Node layout — even hexagonal ring around a centered hub.
   * Hub sits at the true center (150, 118).
   * Outer nodes are spaced on a ~85px radius ring for visual balance.
   */
  const nodes = [
    { x: 150, y: 118, r: 15, color: "var(--color-accent-1)" },  // 0: Hub (slightly larger)
    { x: 78,  y: 55,  r: 7,  color: "var(--color-accent-2)" },   // 1: top-left
    { x: 222, y: 55,  r: 7,  color: "var(--color-accent-2)" },   // 2: top-right
    { x: 52,  y: 148, r: 7,  color: "var(--color-accent-3)" },   // 3: mid-left
    { x: 248, y: 148, r: 7,  color: "var(--color-accent-3)" },   // 4: mid-right
    { x: 95,  y: 208, r: 6,  color: "var(--color-accent-2)" },   // 5: bottom-left
    { x: 205, y: 208, r: 6,  color: "var(--color-accent-2)" },   // 6: bottom-right
  ];

  /* Clockwise reveal order for outer nodes */
  const revealOrder = [1, 2, 4, 6, 5, 3];

  /* Hub-to-outer edges (always from node 0) */
  const hubEdges = [1, 2, 3, 4, 5, 6];

  /* Peer edges (between outer nodes) */
  const peerEdges: [number, number][] = [
    [1, 2], [2, 4], [4, 6], [6, 5], [5, 3], [1, 3],
  ];

  /* Edge length helper */
  const edgeLen = (a: number, b: number) =>
    Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);

  /* Delay for a hub edge — matches when its target node appears */
  const hubEdgeDelay = (target: number) => {
    const orderIdx = revealOrder.indexOf(target);
    return t.hubEdges + orderIdx * t.outerStagger;
  };

  /*
   * Idle signals — two distinct types:
   *   Dispatch (hub → agent): green, faster, larger — commands going out
   *   Report  (agent → hub): agent's color, slower, smaller — results coming back
   * Each pair is staggered so it reads: dispatch sent → pause → report returns
   */
  const dispatches = [
    { target: 1, begin: 0 },
    { target: 4, begin: 2.5 },
    { target: 6, begin: 5.0 },
    { target: 3, begin: 7.5 },
  ];

  const reports = [
    { target: 1, begin: 1.6 },   // reply returns after dispatch travel + agent processing
    { target: 4, begin: 4.1 },
    { target: 6, begin: 6.6 },
    { target: 3, begin: 9.1 },
  ];

  return (
    <svg ref={ref} viewBox="0 0 300 240" fill="none" className="w-full h-full">
      <defs>
        <filter id="nw-glow-hub" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nw-glow-node" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="nw-glow-signal" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Hub-to-outer edges (trace outward as each node joins) ── */}
      {hubEdges.map((target) => {
        const len = edgeLen(0, target);
        const delay = hubEdgeDelay(target);
        return (
          <React.Fragment key={`he-${target}`}>
            {/* Base track — hub spokes are primary, so slightly heavier */}
            <motion.line
              x1={nodes[0].x} y1={nodes[0].y}
              x2={nodes[target].x} y2={nodes[target].y}
              style={{ stroke: "var(--color-border)" }} strokeWidth="0.7"
              strokeDasharray={len} strokeDashoffset={len}
              animate={on ? { strokeDashoffset: 0, opacity: [0, 0.45] } : {}}
              transition={{ delay, duration: 0.6, ease: EXPO_OUT }}
            />
            {/* Color trace */}
            <motion.line
              x1={nodes[0].x} y1={nodes[0].y}
              x2={nodes[target].x} y2={nodes[target].y}
              style={{ stroke: nodes[target].color }} strokeWidth="0.5"
              strokeLinecap="round" opacity={0}
              strokeDasharray={len} strokeDashoffset={len}
              animate={on ? { strokeDashoffset: 0, opacity: [0, 0.4, 0.15] } : {}}
              transition={{ delay, duration: 0.65, ease: EXPO_OUT }}
            />
          </React.Fragment>
        );
      })}

      {/* ── Peer edges (trace after all nodes are in) ── */}
      {peerEdges.map(([a, b], i) => {
        const len = edgeLen(a, b);
        return (
          <motion.line
            key={`pe-${a}-${b}`}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            style={{ stroke: "var(--color-border)" }} strokeWidth="0.5" opacity={0}
            strokeDasharray={len} strokeDashoffset={len}
            animate={on ? { strokeDashoffset: 0, opacity: [0, 0.2] } : {}}
            transition={{ delay: t.peerEdges + i * 0.1, duration: 0.5, ease: EXPO_OUT }}
          />
        );
      })}

      {/* ── Hub node (command layer) ── */}
      <motion.g
        filter="url(#nw-glow-hub)"
        initial={prefersReduced ? false : { opacity: 0, scale: 0.6 }}
        animate={on ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.hub, duration: 0.65, ease: EXPO_OUT }}
        style={{ transformOrigin: `${nodes[0].x}px ${nodes[0].y}px` }}
      >
        {/* Outer ring — command perimeter */}
        <circle
          cx={nodes[0].x} cy={nodes[0].y} r={nodes[0].r + 4}
          fill="none" style={{ stroke: nodes[0].color }} strokeWidth="0.3" opacity="0.12"
        />
        {/* Main circle */}
        <circle
          cx={nodes[0].x} cy={nodes[0].y} r={nodes[0].r}
          style={{ fill: "var(--color-bg-card)", stroke: nodes[0].color }} strokeWidth="1"
        />
        {/* Inner crosshair — reads as "control" */}
        <line
          x1={nodes[0].x - 5} y1={nodes[0].y}
          x2={nodes[0].x + 5} y2={nodes[0].y}
          style={{ stroke: nodes[0].color }} strokeWidth="0.5" opacity="0.28"
        />
        <line
          x1={nodes[0].x} y1={nodes[0].y - 5}
          x2={nodes[0].x} y2={nodes[0].y + 5}
          style={{ stroke: nodes[0].color }} strokeWidth="0.5" opacity="0.28"
        />

        {/* Activation ring — single outward pulse on appear */}
        {!prefersReduced && (
          <circle
            cx={nodes[0].x} cy={nodes[0].y} r={nodes[0].r}
            fill="none" style={{ stroke: nodes[0].color }} strokeWidth="0.4" opacity="0"
          >
            <animate
              attributeName="r"
              values={`${nodes[0].r};${nodes[0].r + 9};${nodes[0].r + 5}`}
              dur="1.1s" begin={`${t.hub}s`} fill="freeze"
            />
            <animate
              attributeName="opacity"
              values="0;0.18;0.06"
              dur="1.1s" begin={`${t.hub}s`} fill="freeze"
            />
          </circle>
        )}

        {/* Idle breathing ring — slow, authoritative */}
        {!prefersReduced && (
          <circle
            cx={nodes[0].x} cy={nodes[0].y} r={nodes[0].r + 4}
            fill="none" style={{ stroke: nodes[0].color }} strokeWidth="0.3" opacity="0"
          >
            <animate
              attributeName="r"
              values={`${nodes[0].r + 3};${nodes[0].r + 8};${nodes[0].r + 3}`}
              dur="5.5s" begin={`${t.idle}s`} repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.1;0.03;0.1"
              dur="5.5s" begin={`${t.idle}s`} repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Report-received pulse — hub briefly brightens when a report arrives */}
        {!prefersReduced && reports.map((r, i) => (
          <circle
            key={`rp-${i}`}
            cx={nodes[0].x} cy={nodes[0].y} r={nodes[0].r - 2}
            style={{ fill: nodes[0].color }} opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.12;0"
              dur="0.8s"
              begin={`${t.idle + r.begin}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </motion.g>

      {/* ── Outer nodes (agents — clockwise reveal) ── */}
      {revealOrder.map((idx, order) => {
        const n = nodes[idx];
        const delay = t.outerNodes + order * t.outerStagger;

        /* Find if this agent receives dispatches — for the "acknowledged" flash */
        const dispatchHit = dispatches.find((d) => d.target === idx);

        return (
          <motion.g
            key={`node-${idx}`}
            filter="url(#nw-glow-node)"
            initial={prefersReduced ? false : { opacity: 0, scale: 0.5 }}
            animate={on ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
            transition={{ delay, duration: 0.55, ease: EXPO_OUT }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <circle
              cx={n.x} cy={n.y} r={n.r}
              style={{ fill: "var(--color-bg-card)", stroke: n.color }} strokeWidth="0.8"
            />

            {/* "Acknowledged" flash — agent lights up when a dispatch lands */}
            {!prefersReduced && dispatchHit && (
              <>
                {/* Inner fill flash */}
                <circle cx={n.x} cy={n.y} r={n.r - 1} style={{ fill: nodes[0].color }} opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;0.1;0"
                    dur="1s"
                    begin={`${t.idle + dispatchHit.begin + 0.7}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Ring ripple outward */}
                <circle cx={n.x} cy={n.y} r={n.r} fill="none" style={{ stroke: n.color }} strokeWidth="0.3" opacity="0">
                  <animate
                    attributeName="r"
                    values={`${n.r};${n.r + 3.5};${n.r + 3.5}`}
                    dur="1s"
                    begin={`${t.idle + dispatchHit.begin + 0.7}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.1;0"
                    dur="1s"
                    begin={`${t.idle + dispatchHit.begin + 0.7}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </motion.g>
        );
      })}

      {/* ── Dispatch signals (hub → agent): green, faster, larger ── */}
      {!prefersReduced && dispatches.map((d, i) => {
        const target = nodes[d.target];
        return (
          <g key={`disp-${i}`} filter="url(#nw-glow-signal)">
            <circle r="1.8" style={{ fill: nodes[0].color }} opacity="0">
              <animate
                attributeName="opacity"
                values="0;0.35;0.35;0"
                keyTimes="0;0.1;0.85;1"
                dur="1.3s"
                begin={`${t.idle + d.begin}s`}
                repeatCount="indefinite"
              />
              <animateMotion
                dur="1.3s"
                begin={`${t.idle + d.begin}s`}
                repeatCount="indefinite"
                path={`M${nodes[0].x},${nodes[0].y} L${target.x},${target.y}`}
              />
            </circle>
          </g>
        );
      })}

      {/* ── Report signals (agent → hub): agent color, slower, smaller ── */}
      {!prefersReduced && reports.map((r, i) => {
        const source = nodes[r.target];
        return (
          <g key={`rpt-${i}`} filter="url(#nw-glow-signal)">
            <circle r="1.2" style={{ fill: source.color }} opacity="0">
              <animate
                attributeName="opacity"
                values="0;0.25;0.25;0"
                keyTimes="0;0.1;0.85;1"
                dur="1.8s"
                begin={`${t.idle + r.begin}s`}
                repeatCount="indefinite"
              />
              <animateMotion
                dur="1.8s"
                begin={`${t.idle + r.begin}s`}
                repeatCount="indefinite"
                path={`M${source.x},${source.y} L${nodes[0].x},${nodes[0].y}`}
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function DocumentsVisual() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const on = isInView && !prefersReduced;
  

  /*
   * Sequence:
   *   0.1s  — Back docs fade in
   *   0.4s  — Front doc appears
   *   0.7s  — Text lines write in (staggered)
   *   1.6s  — Magnifier enters from bottom-right
   *   2.0s  — Magnifier drifts up across text lines, pausing at each "hit"
   *   2.4s+ — Lines under the lens highlight as "found"
   *   idle  — Magnifier breathes in place, scan line sweeps inside lens
   */
  const t = {
    backDocs: 0.15,
    frontDoc: 0.5,
    lines: 0.85,
    lineStagger: 0.08,
    lensEnter: 1.8,
    idle: 5.0,
  };

  /* Text lines: [y, x2, isHit] — some are "relevant" and will highlight */
  const textLines: [number, number, boolean][] = [
    [68,  178, false],
    [83,  202, true],   // hit
    [98,  188, false],
    [113, 198, true],   // hit
    [128, 172, false],
    [143, 196, false],
    [158, 182, true],   // hit
  ];

  /* Magnifier path — drifts from bottom-right up across the document,
     pausing near the "hit" lines. Coordinates trace its center. */
  const lensPath = "M225,185 C215,155 165,138 160,112 C158,98 168,85 172,78";
  const lensDur = 7; // seconds for full drift — slower = more deliberate

  /* Which lines get highlighted and when (timed to when lens passes them) */
  const hitTimings = [
    { y: 83,  delay: 2.8 },
    { y: 113, delay: 3.8 },
    { y: 158, delay: 4.6 },
  ];

  return (
    <svg ref={ref} viewBox="0 0 320 240" fill="none" className="w-full h-full">
      <defs>
        <filter id="doc-glow-lens" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="doc-glow-hit" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Lens inner tint — slightly stronger for readability */}
        <radialGradient id="doc-lens-tint" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "var(--color-accent-1)" }} stopOpacity="0.04" />
          <stop offset="80%" style={{ stopColor: "var(--color-accent-1)" }} stopOpacity="0.01" />
          <stop offset="100%" style={{ stopColor: "var(--color-accent-1)" }} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Back documents (stagger in — more offset for clear depth) ── */}
      <motion.rect
        x="95" y="65" width="135" height="160" rx="4"
        style={{ fill: "var(--color-bg-surface)", stroke: "var(--color-border)" }} strokeWidth="0.7"
        transform="rotate(-4 162 145)"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={on ? { opacity: 0.35 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.backDocs, duration: 0.55, ease: EXPO_OUT }}
      />
      <motion.rect
        x="92" y="52" width="138" height="165" rx="4"
        style={{ fill: "var(--color-bg-card)", stroke: "var(--color-border)" }} strokeWidth="0.8"
        transform="rotate(2.5 160 135)"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={on ? { opacity: 0.55 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.backDocs + 0.15, duration: 0.55, ease: EXPO_OUT }}
      />

      {/* ── Front document ── */}
      <motion.rect
        x="88" y="42" width="142" height="170" rx="4"
        style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-2)" }} strokeWidth="0.8"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={on ? { opacity: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.frontDoc, duration: 0.55, ease: EXPO_OUT }}
      />

      {/* ── Text lines (write in left-to-right) ── */}
      {textLines.map(([y, x2], i) => (
        <motion.line
          key={`tl-${i}`}
          x1={108} y1={y} x2={108} y2={y}
          style={{ stroke: "var(--color-border)" }} strokeWidth="0.8"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={
            on
              ? { opacity: 0.25 + i * 0.03, x2 }
              : prefersReduced ? {} : undefined
          }
          transition={{
            delay: t.lines + i * t.lineStagger,
            duration: 0.4,
            ease: EXPO_OUT,
          }}
        />
      ))}

      {/* ── Highlighted lines (appear when magnifier "finds" them) ── */}
      {hitTimings.map((hit, i) => {
        const line = textLines.find(([y]) => y === hit.y);
        if (!line) return null;
        const [y, x2] = line;
        return (
          <React.Fragment key={`hit-${i}`}>
            {/* Accent overlay on the detected line */}
            <motion.line
              x1={108} y1={y} x2={x2} y2={y}
              style={{ stroke: "var(--color-accent-1)" }} strokeWidth="1" strokeLinecap="round"
              filter="url(#doc-glow-hit)"
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={on ? { opacity: [0, 0.35, 0.2] } : prefersReduced ? {} : undefined}
              transition={{ delay: hit.delay, duration: 0.55, ease: EXPO_OUT }}
            />
            {/* Diamond marker */}
            <motion.rect
              x={101} y={y - 2} width="4" height="4"
              style={{ fill: "var(--color-accent-1)", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={on ? { opacity: [0, 0.4, 0.28] } : prefersReduced ? {} : undefined}
              transition={{ delay: hit.delay + 0.2, duration: 0.4, ease: EXPO_OUT }}
            />
          </React.Fragment>
        );
      })}

      {/* ── Magnifier group (enters, drifts, then idles) ── */}
      <motion.g
        filter="url(#doc-glow-lens)"
        initial={prefersReduced ? false : { opacity: 0, scale: 0.8 }}
        animate={on ? { opacity: 1, scale: 1 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.lensEnter, duration: 0.55, ease: EXPO_OUT }}
      >
        <g>
          {/* Drift motion along the scan path */}
          {!prefersReduced && (
            <animateMotion
              path={lensPath}
              dur={`${lensDur}s`}
              begin={`${t.lensEnter}s`}
              fill="freeze"
            />
          )}

          {/* Lens circle — main ring */}
          <circle cx="0" cy="0" r="17" style={{ stroke: "var(--color-accent-1)" }} strokeWidth="1" fill="none" opacity="0.6" />

          {/* Inner tinted fill */}
          <circle cx="0" cy="0" r="16" fill="url(#doc-lens-tint)" />

          {/* Scan line — sweeps vertically inside the lens */}
          {!prefersReduced && (
            <line x1="-11" y1="0" x2="11" y2="0" style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.5" opacity="0">
              <animate attributeName="opacity" values="0;0.3;0" dur="2.8s" begin={`${t.lensEnter + 0.6}s`} repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="translate" values="0,-10;0,10;0,-10" dur="2.8s" begin={`${t.lensEnter + 0.6}s`} repeatCount="indefinite" />
            </line>
          )}

          {/* Handle */}
          <line x1="12" y1="12" x2="24" y2="24" style={{ stroke: "var(--color-accent-1)" }} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

          {/* Outer detection ring — slow, subtle */}
          {!prefersReduced && (
            <circle cx="0" cy="0" r="17" fill="none" style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.25" opacity="0">
              <animate attributeName="r" values="17;21;17" dur="3.5s" begin={`${t.lensEnter + 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.12;0.03;0.12" dur="3.5s" begin={`${t.lensEnter + 0.4}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </motion.g>
    </svg>
  );
}

function WaveformCalendarVisual() {
  return (
    <svg viewBox="0 0 320 240" fill="none" className="w-full h-full">
      {/* Waveform */}
      {[60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260].map((x, i) => {
        const h = [20, 35, 50, 30, 60, 45, 25, 55, 35, 40, 20][i];
        return (
          <rect key={i} x={x - 4} y={50 - h / 2 + 30} width="8" height={h} rx="4" style={{ fill: "var(--color-accent-1)" }} opacity={0.3 + (i % 3) * 0.15}>
            <animate attributeName="height" values={`${h};${h * 0.5};${h}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${50 - h / 2 + 30};${50 - h * 0.25 + 30};${50 - h / 2 + 30}`} dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          </rect>
        );
      })}
      {/* Calendar grid */}
      <rect x="80" y="120" width="160" height="100" rx="4" style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-2)" }} strokeWidth="1" />
      <line x1="80" y1="142" x2="240" y2="142" style={{ stroke: "var(--color-accent-2)" }} strokeWidth="0.8" />
      {/* Day cells */}
      {[0, 1, 2, 3, 4].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={92 + col * 30}
            y={150 + row * 22}
            width="20"
            height="14"
            rx="2"
            style={{ fill: col === 2 && row === 1 ? "var(--color-accent-1)" : "var(--color-bg-card)" }}
            opacity={col === 2 && row === 1 ? 0.3 : 0.5}
          />
        ))
      )}
    </svg>
  );
}

function ShieldDocumentVisual() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const prefersReduced = useReducedMotion();

  const on = isInView && !prefersReduced;
  

  /*
   * Narrative: a contract is reviewed, validated, and sealed.
   *
   *   0.15s  — Contract document arrives (slides in)
   *   0.55s  — Clause lines write in top-down (the document has content)
   *   1.2s   — Scan bar sweeps down the doc (review in progress)
   *   1.4s+  — Reviewed clauses turn green one-by-one (approved)
   *   2.6s   — Shield traces in around the checkmark area (protection forming)
   *   3.2s   — Shield fill solidifies
   *   3.4s   — Inner shield layer appears
   *   3.7s   — Checkmark draws (verdict: validated)
   *   4.2s   — Connection arc from doc → shield (contract bound to protection)
   *   4.5s   — Confirmation pulse from checkmark
   *   5.0s   — Idle: protective breathing
   */
  const t = {
    doc: 0.2,
    clauses: 0.65,
    clauseStagger: 0.09,
    scan: 1.35,
    approve: 1.9,
    approveStagger: 0.35,
    shield: 3.0,
    shieldFill: 3.7,
    innerShield: 3.9,
    check: 4.25,
    connection: 4.8,
    confirm: 5.15,
    idle: 5.7,
  };

  /*
   * Shield geometry — pulled in slightly for better balance.
   * Outer: centered on x=130, y range 40–200 (160px tall, was 180).
   * Leaves clear breathing room to the doc on the right.
   */
  const outerShieldLen = 480;
  const innerShieldLen = 380;
  const checkLen = 60;
  const connectionLen = 70;

  /*
   * Clause lines: [y, x2, approved]
   * Lines stay inside doc bounds (x: 218–272, doc is x: 210–278).
   */
  const clauses: [number, number, boolean][] = [
    [98,  268, false],
    [110, 264, true],
    [122, 258, false],
    [134, 266, true],
    [146, 254, true],
    [156, 262, false],
  ];

  const approvedClauses = clauses
    .map(([y, x2, ok], i) => ({ y, x2, i, ok }))
    .filter((c) => c.ok);

  return (
    <svg ref={ref} viewBox="0 0 320 240" fill="none" className="w-full h-full">
      <defs>
        <filter id="lg-glow-shield" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lg-glow-check" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lg-glow-pulse" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="lg-glow-approve" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="lg-conn-grad" x1="210" y1="128" x2="155" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: "var(--color-accent-2)" }} stopOpacity="0.35" />
          <stop offset="100%" style={{ stopColor: "var(--color-accent-1)" }} stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* ── 1. Contract document arrives ── */}
      <motion.g
        initial={prefersReduced ? false : { opacity: 0, x: 18 }}
        animate={on ? { opacity: 1, x: 0 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.doc, duration: 0.65, ease: EXPO_OUT }}
      >
        <rect
          x="210" y="72" width="68" height="96" rx="3"
          style={{ fill: "var(--color-bg-card)", stroke: "var(--color-accent-2)" }} strokeWidth="0.7" opacity="0.65"
        />
        {/* Doc header bar */}
        <rect x="220" y="79" width="48" height="2.5" rx="1" style={{ fill: "var(--color-accent-2)" }} opacity="0.12" />
      </motion.g>

      {/* ── 2. Clause lines write in ── */}
      {clauses.map(([y, x2], i) => (
        <motion.line
          key={`cl-${i}`}
          x1={220} y1={y} x2={220} y2={y}
          style={{ stroke: "var(--color-border)" }} strokeWidth="0.7"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={on ? { opacity: 0.28, x2 } : prefersReduced ? {} : undefined}
          transition={{ delay: t.clauses + i * t.clauseStagger, duration: 0.38, ease: EXPO_OUT }}
        />
      ))}

      {/* ── 3. Scan bar sweeps down the document ── */}
      {!prefersReduced && (
        <motion.line
          x1={212} y1={90} x2={276} y2={90}
          style={{ stroke: "var(--color-accent-2)" }} strokeWidth="0.5" opacity={0}
          animate={on ? { y1: [90, 162, 162], y2: [90, 162, 162], opacity: [0, 0.35, 0] } : {}}
          transition={{ delay: t.scan, duration: 1.4, ease: EXPO_OUT }}
        />
      )}

      {/* ── 4. Approved clauses highlight green ── */}
      {approvedClauses.map((c, order) => (
        <React.Fragment key={`ap-${c.i}`}>
          <motion.line
            x1={220} y1={c.y} x2={c.x2} y2={c.y}
            style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.8" strokeLinecap="round"
            filter="url(#lg-glow-approve)"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={on ? { opacity: [0, 0.3, 0.18] } : prefersReduced ? {} : undefined}
            transition={{ delay: t.approve + order * t.approveStagger, duration: 0.5, ease: EXPO_OUT }}
          />
          {/* Clause check tick */}
          <motion.path
            d={`M${215} ${c.y - 1} l2 2.5 l3.5 -4.5`}
            style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"
            fill="none"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={on ? { opacity: [0, 0.4, 0.28] } : prefersReduced ? {} : undefined}
            transition={{ delay: t.approve + order * t.approveStagger + 0.18, duration: 0.3, ease: EXPO_OUT }}
          />
        </React.Fragment>
      ))}

      {/* ── 5. Shield traces in ── */}
      <motion.path
        d="M130 40 L185 62 L185 130 Q185 168 130 198 Q75 168 75 130 L75 62 Z"
        fill="none" style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.9"
        filter="url(#lg-glow-shield)"
        strokeDasharray={outerShieldLen} strokeDashoffset={outerShieldLen}
        animate={on ? { strokeDashoffset: 0, opacity: [0, 0.5, 0.4] } : {}}
        transition={{ delay: t.shield, duration: 0.85, ease: EXPO_OUT }}
      />

      {/* ── 6. Shield fill ── */}
      <motion.path
        d="M130 40 L185 62 L185 130 Q185 168 130 198 Q75 168 75 130 L75 62 Z"
        style={{ fill: "var(--color-bg-card)" }} stroke="none"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={on ? { opacity: 0.92 } : prefersReduced ? {} : undefined}
        transition={{ delay: t.shieldFill, duration: 0.5, ease: EXPO_OUT }}
      />

      {/* ── 7. Inner shield layer ── */}
      <motion.path
        d="M130 58 L172 75 L172 125 Q172 155 130 178 Q88 155 88 125 L88 75 Z"
        fill="none" style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.3"
        strokeDasharray={innerShieldLen} strokeDashoffset={innerShieldLen}
        animate={on ? { strokeDashoffset: 0, opacity: [0, 0.25, 0.15] } : {}}
        transition={{ delay: t.innerShield, duration: 0.7, ease: EXPO_OUT }}
      />

      {/* ── 8. Checkmark — validated ── */}
      <motion.path
        d="M114 122 L127 135 L152 105"
        style={{ stroke: "var(--color-accent-1)" }} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        fill="none" filter="url(#lg-glow-check)"
        strokeDasharray={checkLen} strokeDashoffset={checkLen}
        animate={on ? { strokeDashoffset: 0 } : {}}
        transition={{ delay: t.check, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── 9. Connection arc — contract bound to shield ── */}
      <motion.path
        d="M210 130 Q195 120 188 118"
        fill="none" stroke="url(#lg-conn-grad)" strokeWidth="0.7"
        strokeLinecap="round"
        strokeDasharray={connectionLen} strokeDashoffset={connectionLen}
        animate={on ? { strokeDashoffset: 0, opacity: [0, 0.35, 0.18] } : {}}
        transition={{ delay: t.connection, duration: 0.55, ease: EXPO_OUT }}
      />

      {/* ── 10. Confirmation pulse ── */}
      {!prefersReduced && (
        <motion.circle
          cx="130" cy="120" r="8" fill="none"
          style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.35"
          filter="url(#lg-glow-pulse)"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: [0, 0.18, 0], r: [8, 38, 44] } : {}}
          transition={{ delay: t.confirm, duration: 0.9, ease: EXPO_OUT }}
        />
      )}

      {/* ── 11. Idle — protective breathing ── */}
      {!prefersReduced && (
        <circle
          cx="130" cy="120" r="40" fill="none"
          style={{ stroke: "var(--color-accent-1)" }} strokeWidth="0.2" opacity="0"
        >
          <animate
            attributeName="r" values="40;46;40"
            dur="6s" begin={`${t.idle}s`} repeatCount="indefinite"
          />
          <animate
            attributeName="opacity" values="0.06;0.02;0.06"
            dur="6s" begin={`${t.idle}s`} repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}

const VISUALS: Record<number, () => React.ReactElement> = {
  0: FlowchartVisual,
  1: BookVisual,
  2: NetworkVisual,
  3: DocumentsVisual,
  4: WaveformCalendarVisual,
  5: ShieldDocumentVisual,
};

/* ── Feature data ── */

interface Feature {
  tag: string;
  title: string;
  titleAccent: string;
  description: string;
  bullets: string[];
}

const FEATURES: Feature[] = [
  {
    tag: "Design Intelligence",
    title: "Design Assist",
    titleAccent: "Assist",
    description:
      "AI-powered design intelligence that transforms briefs into production-ready brand assets, layouts, and creative systems in minutes.",
    bullets: [
      "Brief-to-design pipeline with brand memory",
      "Multi-format exports: social, print, web",
      "Style consistency scoring and auto-correction",
    ],
  },
  {
    tag: "Generative Media",
    title: "Storytelling AI",
    titleAccent: "Storytelling",
    description:
      "Generative media engine that turns concepts into compelling narratives across text, image, and video formats.",
    bullets: [
      "Narrative arc generation from seed ideas",
      "Cross-modal content: text, images, storyboards",
      "Brand voice adaptation and tone control",
    ],
  },
  {
    tag: "Multi-Agent Systems",
    title: "Agentic Lead Gen",
    titleAccent: "Agentic",
    description:
      "Multi-agent orchestration that researches, qualifies, and engages prospects autonomously with human-level precision.",
    bullets: [
      "CrewAI-powered agent orchestration",
      "Real-time lead scoring and enrichment",
      "Automated outreach with personalization",
    ],
  },
  {
    tag: "Document Intelligence",
    title: "Smart RAG Platform",
    titleAccent: "Smart",
    description:
      "Enterprise-grade retrieval-augmented generation that makes your documents searchable, queryable, and actionable.",
    bullets: [
      "Multi-source ingestion: PDF, Notion, Drive",
      "Hybrid search with semantic reranking",
      "Citation-backed answers with confidence scores",
    ],
  },
  {
    tag: "Voice AI",
    title: "Voice Calendar",
    titleAccent: "Voice",
    description:
      "Voice-first scheduling assistant that manages your calendar through natural conversation and intelligent context.",
    bullets: [
      "Natural language scheduling and rescheduling",
      "Multi-calendar conflict resolution",
      "Proactive reminders with smart prioritization",
    ],
  },
  {
    tag: "Legal Tech",
    title: "Legal AI",
    titleAccent: "Legal",
    description:
      "AI-driven legal document analysis that reviews, summarizes, and flags risks across contracts and compliance documents.",
    bullets: [
      "Clause extraction and risk flagging",
      "Multi-jurisdiction compliance checks",
      "Automated summary generation with key terms",
    ],
  },
];

/* ── Feature row ── */

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-80px" });
  const isReversed = index % 2 !== 0;
  const num = String(index + 1).padStart(2, "0");
  const Visual = VISUALS[index];
  const prefersReduced = useReducedMotion();

  /* Visual card parallax */
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: visualProgress } = useScroll({
    target: visualRef,
    offset: ["start end", "end start"],
  });
  const visualY = useTransform(visualProgress, [0, 1], [15, -15]);

  const titleParts = feature.title.split(feature.titleAccent);

  return (
    <div ref={ref}>
    <motion.div
      key={replayKey}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, ease: EXPO_OUT }}
    >
      <div className={`feature-grid ${isReversed ? "feature-grid--reversed" : ""}`}>
        {/* Text block */}
        <div className="relative">
          {/* Large faded number */}
          <span
            className="absolute -top-8 -left-2 select-none pointer-events-none font-display font-[800] text-text-muted opacity-[0.08] leading-none"
            style={{ fontSize: "clamp(5rem, 10vw, 8rem)" }}
          >
            {num}
          </span>

          {/* System thread connector */}
          <SystemThread index={index} inView={isInView} reduced={!!prefersReduced} />

          {/* Tag */}
          <span className="clip-corner-sm inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-widest mb-5 font-mono bg-accent-glow text-accent-1 border border-border-accent">
            {feature.tag}
          </span>

          {/* Title */}
          <h3
            className="mb-4 font-display font-[800] text-text-primary leading-[1.2]"
            style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.6rem)" }}
          >
            {titleParts[0]}
            <span className="gradient-text italic">{feature.titleAccent}</span>
            {titleParts[1] || ""}
          </h3>

          {/* Description */}
          <p className="mb-6 font-body text-base leading-[1.7] text-text-secondary max-w-[480px]">
            {feature.description}
          </p>

          {/* Bullets */}
          <ul className="space-y-3 mb-6">
            {feature.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-2 shrink-0 inline-block h-[7px] w-[7px] bg-accent-1 opacity-60"
                  style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                  aria-hidden="true"
                />
                <span className="text-text-secondary text-[1rem] leading-[1.7]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>

          {/* Learn more */}
          <a
            href="#"
            className="inline-flex items-center gap-2 group/link transition-colors font-mono text-[0.82rem] font-medium text-accent-1 tracking-[0.04em]"
          >
            Learn more
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform group-hover/link:translate-x-1"
            >
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Visual block */}
        <motion.div
          ref={visualRef}
          className="relative"
          style={prefersReduced ? {} : { y: visualY }}
        >
          <div className="clip-corner-card relative overflow-hidden transition-shadow duration-500 hover:shadow-[0_4px_24px_color-mix(in_srgb,var(--color-text-primary)_6%,transparent)] bg-bg-card border border-border aspect-[4/3]">
            <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8">
              <Visual />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
}

/* ── Main Features section ── */

export default function Features() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerInView, headerKey] = useReplay(headerRef, { margin: "-60px" });

  return (
    <section
      className="relative py-10 lg:py-14 bg-bg-deep"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Section header */}
        <div ref={headerRef}>
        <motion.div
          key={headerKey}
          initial={{ opacity: 0, y: 40 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="mb-12 lg:mb-16 max-w-2xl"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="block h-px w-[30px] bg-accent-1" />
            <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
              What We Build
            </span>
          </div>

          {/* Heading */}
          <h2
            className="mb-5 font-display font-[800] leading-[1.15] text-text-primary"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
          >
            AI solutions that{" "}
            <span className="gradient-text italic">actually</span>{" "}
            <RotatingWord words={["ship", "scale", "deploy", "perform"]} />
          </h2>

          {/* Description */}
          <p className="font-body text-[1.1rem] leading-[1.75] text-text-secondary max-w-[540px]">
            From multi-agent orchestration to voice-first interfaces, we build
            AI products that move from prototype to production — fast, reliable,
            and designed to grow with you.
          </p>
        </motion.div>
        </div>

        {/* Feature rows */}
        <div className="space-y-16 lg:space-y-24">
          {FEATURES.map((feature, index) => (
            <FeatureRow key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
