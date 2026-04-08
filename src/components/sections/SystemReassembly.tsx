"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SystemGraph from "@/components/ui/SystemGraph";
import { EXPO_OUT } from "@/lib/animations";

export default function SystemReassembly() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const prefersReduced = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      className="relative flex min-h-[50vh] items-center justify-center"
      style={{ background: "var(--color-bg-deep)" }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.8, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center px-6 py-10 lg:py-12">
        {/* System Graph */}
        <motion.div
          className="w-full"
          style={{ maxWidth: 500 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            isInView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.85 }
          }
          transition={{
            duration: prefersReduced ? 0 : 0.8,
            delay: prefersReduced ? 0 : 0.4,
            ease: EXPO_OUT,
          }}
        >
          <SystemGraph
            mode="entrance"
            inView={isInView}
            reduced={!!prefersReduced}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
