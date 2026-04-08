"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 360;

function scrollToTop() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      data-no-click-spark
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`clip-corner-md fixed z-[1020] flex h-12 w-12 min-h-12 min-w-12 items-center justify-center border border-border bg-bg-card text-text-primary shadow-[0_8px_28px_color-mix(in_srgb,var(--color-text-primary)_8%,transparent)] transition-all duration-300 hover:border-accent-1/35 hover:text-accent-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep left-[max(1.25rem,env(safe-area-inset-left,0px))] bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:left-[max(1.5rem,env(safe-area-inset-left,0px))] ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
