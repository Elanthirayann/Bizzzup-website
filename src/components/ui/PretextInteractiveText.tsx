"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";
import { useIdleReady } from "@/hooks/useIdleReady";

type CharCell = {
  char: string;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/* Slightly stiff so pointer nudges stay subtle */
const SPRING = 0.095;
const DAMP = 0.93;
const FORCE_SCALE = 0.055;

type Props = {
  text: string;
  tone: "hero" | "body";
  className?: string;
  style?: CSSProperties;
};

export default function PretextInteractiveText({
  text,
  tone,
  className = "",
  style,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const idleReady = useIdleReady(200);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Static text until hydrated, then defer canvas until idle so first paint stays light. */
  const showCanvas = mounted && !prefersReduced && idleReady;

  const padY = tone === "hero" ? 6 : 4;
  const padX = 0;

  useEffect(() => {
    if (!showCanvas) return;

    const pointerRadius = tone === "hero" ? 120 : 83;
    const pointerStrength = tone === "hero" ? 18 : 13;
    const maxOffset = tone === "hero" ? 12 : 8;

    const root = wrapRef.current;
    const canvasEl = canvasRef.current;
    if (!root || !canvasEl) return;
    const host = root;
    const cvs = canvasEl;

    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const surface = ctx;

    let chars: CharCell[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    let mx = -99999;
    let my = -99999;
    let raf = 0;
    let fontCss = "";
    let lineHeightPx = 24;

    function syncFontMetrics() {
      const cs = getComputedStyle(host);
      fontCss = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`.trim();
      const lh = cs.lineHeight;
      const fs = parseFloat(cs.fontSize) || 16;
      lineHeightPx =
        lh === "normal" ? Math.round(fs * (tone === "hero" ? 1.1 : 1.75)) : parseFloat(lh) || Math.round(fs * 1.4);
    }

    function buildLayout() {
      syncFontMetrics();
      chars = [];
      const prepared = prepareWithSegments(text, fontCss);
      const maxW = Math.max(32, W - padX * 2);
      const { lines } = layoutWithLines(prepared, maxW, lineHeightPx);
      surface.font = fontCss;
      surface.textBaseline = "top";

      let maxBottom = padY;
      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i].text;
        const baseY = padY + i * lineHeightPx;
        let x = padX;
        for (let j = 0; j < lineText.length; j++) {
          const ch = lineText[j];
          const w = surface.measureText(ch).width;
          chars.push({
            char: ch,
            baseX: x,
            baseY,
            x,
            y: baseY,
            vx: 0,
            vy: 0,
          });
          x += w;
        }
        maxBottom = baseY + lineHeightPx;
      }
      H = Math.max(24, Math.ceil(maxBottom + padY));
    }

    function resize() {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      buildLayout();

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = W * dpr;
      cvs.height = H * dpr;
      cvs.style.width = `${W}px`;
      cvs.style.height = `${H}px`;
      surface.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function tick() {
      const bgKey = "--color-bg-deep";
      const bg =
        getComputedStyle(host).getPropertyValue(bgKey).trim() || "#fafaf8";
      const fg =
        getComputedStyle(host).getPropertyValue("--color-text-primary").trim() ||
        "#1a1a1a";
      const fgBody =
        getComputedStyle(host).getPropertyValue("--color-text-secondary").trim() ||
        "#5c5c5c";
      /* Same token as `bg-accent-1` on CTAs; read from root so it matches the button */
      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent-1")
          .trim() || "#4f46e5";

      const baseColor = tone === "hero" ? fg : fgBody;

      surface.fillStyle = bg;
      surface.fillRect(0, 0, W, H);
      surface.font = fontCss;
      surface.textBaseline = "top";

      for (const c of chars) {
        const dx = c.baseX - mx;
        const dy = c.baseY - my;
        const dist = Math.hypot(dx, dy);
        if (dist < pointerRadius && dist > 0.5) {
          const force = (1 - dist / pointerRadius) * pointerStrength;
          const ang = Math.atan2(dy, dx);
          c.vx += Math.cos(ang) * force * FORCE_SCALE;
          c.vy += Math.sin(ang) * force * FORCE_SCALE;
        }
        c.vx += (c.baseX - c.x) * SPRING;
        c.vy += (c.baseY - c.y) * SPRING;
        c.vx *= DAMP;
        c.vy *= DAMP;
        c.x += c.vx;
        c.y += c.vy;

        let ox = c.x - c.baseX;
        let oy = c.y - c.baseY;
        const off = Math.hypot(ox, oy);
        if (off > maxOffset && off > 0) {
          const s = maxOffset / off;
          c.x = c.baseX + ox * s;
          c.y = c.baseY + oy * s;
          c.vx *= 0.82;
          c.vy *= 0.82;
        }

        const disp = Math.hypot(c.x - c.baseX, c.y - c.baseY);
        surface.fillStyle = disp > 3 ? accent : baseColor;
        /* Full opacity for accent so it matches solid `bg-accent-1`, not a washed mix on the canvas */
        surface.globalAlpha = disp > 3 ? 1 : tone === "hero" ? 1 : 0.96;
        surface.fillText(c.char, c.x, c.y);
      }
      surface.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    const onPointer = (e: PointerEvent) => {
      const r = cvs.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -99999;
      my = -99999;
    };

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      resize();
      requestAnimationFrame(resize);
    };

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resize);
    });
    ro.observe(host);

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      start();
      requestAnimationFrame(() => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          if (cancelled) return;
          raf = requestAnimationFrame(tick);
        });
      });
    });

    cvs.addEventListener("pointermove", onPointer);
    cvs.addEventListener("pointerdown", onPointer);
    cvs.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      cvs.removeEventListener("pointermove", onPointer);
      cvs.removeEventListener("pointerdown", onPointer);
      cvs.removeEventListener("pointerleave", onLeave);
    };
  }, [showCanvas, text, tone]);

  if (!showCanvas) {
    return (
      <span className={className} style={style}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={wrapRef}
      className={`block w-full max-w-full ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="block h-auto w-full max-w-full touch-none cursor-crosshair"
        aria-hidden
      />
      <span className="sr-only">{text}</span>
    </span>
  );
}
