"use client";

import { EXPO_OUT } from "@/lib/animations";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";

type Accent = 1 | 2 | 3;

interface GraphNode {
  id: string;
  cx: number;
  cy: number;
  accent: Accent;
  label: string;
  outerR: number;
  midR: number;
  coreR: number;
  labelBelow: number;
}

const NODES: GraphNode[] = [
  {
    id: "orchestrator",
    cx: 300,
    cy: 200,
    accent: 1,
    label: "ORCHESTRATOR",
    outerR: 28,
    midR: 16,
    coreR: 5,
    labelBelow: 45,
  },
  {
    id: "ingest",
    cx: 150,
    cy: 120,
    accent: 2,
    label: "INGEST",
    outerR: 20,
    midR: 10,
    coreR: 4,
    labelBelow: 35,
  },
  {
    id: "reason",
    cx: 450,
    cy: 150,
    accent: 3,
    label: "REASON",
    outerR: 22,
    midR: 11,
    coreR: 4,
    labelBelow: 35,
  },
  {
    id: "store",
    cx: 200,
    cy: 320,
    accent: 1,
    label: "STORE",
    outerR: 18,
    midR: 9,
    coreR: 3.5,
    labelBelow: 30,
  },
  {
    id: "execute",
    cx: 430,
    cy: 300,
    accent: 2,
    label: "EXECUTE",
    outerR: 20,
    midR: 10,
    coreR: 4,
    labelBelow: 30,
  },
];

const EDGE_LINES: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  a: string;
  b: string;
}[] = [
  { x1: 150, y1: 120, x2: 300, y2: 200, a: "ingest", b: "orchestrator" },
  { x1: 300, y1: 200, x2: 450, y2: 150, a: "orchestrator", b: "reason" },
  { x1: 300, y1: 200, x2: 200, y2: 320, a: "orchestrator", b: "store" },
  { x1: 300, y1: 200, x2: 430, y2: 300, a: "orchestrator", b: "execute" },
  { x1: 200, y1: 320, x2: 430, y2: 300, a: "store", b: "execute" },
  { x1: 450, y1: 150, x2: 430, y2: 300, a: "reason", b: "execute" },
];

function nodeById(id: string): GraphNode | undefined {
  return NODES.find((n) => n.id === id);
}

function accentVar(a: Accent): string {
  return `var(--color-accent-${a})`;
}

interface ShowcaseOrchestratorGraphProps {
  prefersReduced: boolean | null;
  inView: boolean;
}

export default function ShowcaseOrchestratorGraph({
  prefersReduced,
  inView,
}: ShowcaseOrchestratorGraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const focusId = selectedId ?? hoveredId;
  const reduced = !!prefersReduced;
  const systemReduced = useReducedMotion() ?? false;

  const clearHover = useCallback(() => setHoveredId(null), []);
  const toggleSelected = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const hoverLift = !reduced && !systemReduced;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-surface">
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-mesh)" }}
      />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="showcase-orch-grid"
            width={40}
            height={40}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#showcase-orch-grid)" />
      </svg>

      <svg
        role="img"
        aria-label="Interactive system diagram. Tap or hover nodes to highlight connections."
        className="relative z-[1] h-full w-full touch-manipulation"
        viewBox="0 0 600 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onPointerLeave={clearHover}
      >
        <defs>
          <filter
            id="orch-line-glow"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Primary edges: visible idle + soft glow when linked node is focused */}
        {EDGE_LINES.map((e, i) => {
          const active = !!focusId && (e.a === focusId || e.b === focusId);
          const fn = focusId ? nodeById(focusId) : undefined;
          const glowStroke =
            active && fn ? accentVar(fn.accent) : "transparent";
          const na = nodeById(e.a);
          const idleStroke = na
            ? accentVar(na.accent)
            : "var(--color-text-secondary)";
          /* Slightly higher when any node is focused so non-highlighted edges stay legible */
          const idleOpacity = focusId ? 0.58 : 0.48;
          const sharpStroke = active && fn ? accentVar(fn.accent) : idleStroke;

          return (
            <g key={`pe-${i}`}>
              {active && fn && (
                <line
                  x1={e.x1}
                  y1={e.y1}
                  x2={e.x2}
                  y2={e.y2}
                  stroke={glowStroke}
                  strokeWidth={9}
                  strokeLinecap="round"
                  opacity={0.2}
                  style={{ filter: "url(#orch-line-glow)" }}
                />
              )}
              <motion.line
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke={sharpStroke}
                strokeLinecap="round"
                initial={false}
                animate={{
                  opacity: active ? 0.95 : idleOpacity,
                  strokeWidth: active ? 2.05 : 1.45,
                }}
                transition={{ duration: 0.35, ease: EXPO_OUT }}
              />
            </g>
          );
        })}

        {NODES.map((node) => {
          const av = accentVar(node.accent);
          const focused = focusId === node.id;
          const dimOthers = focusId !== null && !focused;
          const origin = `${node.cx}px ${node.cy}px`;

          return (
            <motion.g
              key={node.id}
              style={{
                transformOrigin: origin,
                transformBox: "fill-box" as const,
                cursor: "pointer",
              }}
              initial={reduced ? {} : { opacity: 0, scale: 0.88 }}
              animate={
                inView
                  ? {
                      /* Was 0.38: multiplied with label opacity and looked washed out */
                      opacity: dimOthers ? 0.64 : 1,
                      scale: 1,
                    }
                  : { opacity: 0, scale: 0.88 }
              }
              transition={{ duration: 0.55, ease: EXPO_OUT }}
              whileHover={
                hoverLift ? { scale: focused ? 1.08 : 1.06 } : undefined
              }
              whileTap={hoverLift ? { scale: 0.94 } : undefined}
              onPointerEnter={() => setHoveredId(node.id)}
              onClick={(e) => {
                e.stopPropagation();
                toggleSelected(node.id);
              }}
            >
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.outerR}
                fill={av}
                opacity={focused ? 0.14 : dimOthers ? 0.1 : 0.08}
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.midR}
                fill={av}
                opacity={focused ? 0.18 : dimOthers ? 0.15 : 0.12}
              />
              {!reduced && focused && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.outerR + 6}
                  fill="none"
                  stroke={av}
                  strokeWidth={0.6}
                  opacity={0.35}
                >
                  <animate
                    attributeName="r"
                    values={`${node.outerR + 4};${node.outerR + 18};${node.outerR + 4}`}
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.coreR}
                fill={av}
                opacity={focused ? 0.85 : dimOthers ? 0.72 : 0.55}
              />
              <text
                x={node.cx}
                y={node.cy + node.labelBelow}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: node.id === "orchestrator" ? 11 : 10,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  fill: focused ? av : "var(--color-text-primary)",
                  opacity: focused ? 1 : dimOthers ? 0.92 : 0.72,
                  pointerEvents: "none",
                }}
              >
                {node.label}
              </text>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.id === "orchestrator" ? 52 : 40}
                fill="transparent"
              />
              <title>
                {`${node.label}. Hover to highlight links. Click to pin; click again to release.`}
              </title>
            </motion.g>
          );
        })}
      </svg>

      {!reduced && inView && (
        <motion.div
          className="pointer-events-none absolute rounded-full border border-accent-1/25"
          style={{
            width: 88,
            height: 88,
            left: "calc(50% - 44px)",
            top: "calc(44.4% - 44px)",
          }}
          initial={{ opacity: 0 }}
          animate={{
            scale: [1, 1.75, 1],
            opacity: [0.28, 0, 0.28],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
}
