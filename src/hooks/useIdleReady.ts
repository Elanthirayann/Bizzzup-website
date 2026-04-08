"use client";

import { useEffect, useState } from "react";

/**
 * Fires after the browser is idle (or after `timeout` ms max).
 * Spreads heavy client work past the first paint to reduce load jank.
 */
export function useIdleReady(timeout = 320) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window === "undefined") {
      run();
      return;
    }

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = globalThis.setTimeout(run, Math.min(timeout, 150));
    return () => {
      cancelled = true;
      globalThis.clearTimeout(t);
    };
  }, [timeout]);

  return ready;
}
