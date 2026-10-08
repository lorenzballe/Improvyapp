import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A step counter for the page's looping demos. It only runs while its
 * element is on screen, never for someone who asked their system for less
 * motion, and stops for good once [paused] is set — a demo the reader has
 * started steering should not wrest itself back from them.
 */
export function useTicker(intervalMs: number, paused = false) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const running = inView && !reduce && !paused;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [running, intervalMs]);

  return { ref, tick, setTick, running };
}
