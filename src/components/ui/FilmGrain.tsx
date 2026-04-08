"use client";

import { useIdleReady } from "@/hooks/useIdleReady";

/**
 * Subtle fixed noise layer. pointer-events: none so it never blocks clicks.
 * Mounts after idle so the SVG filter does not compete with first paint.
 */
export default function FilmGrain() {
  const ready = useIdleReady(480);

  if (!ready) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[50] opacity-[0.035] mix-blend-multiply"
      aria-hidden
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}
