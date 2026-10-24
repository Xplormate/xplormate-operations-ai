"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * 0 → 1 progress of an element through the viewport.
 *  - "pin":  0 when the element's top reaches the top of the screen, 1 when its
 *            bottom reaches the bottom (use for tall sections with a sticky child).
 *  - "pass": 0 when the element enters from below, 1 when it has fully left above.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, mode: "pin" | "pass" = "pin") {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = mode === "pin" ? rect.height - viewport : rect.height + viewport;
      const travelled = mode === "pin" ? -rect.top : viewport - rect.top;
      const value = total > 0 ? Math.min(1, Math.max(0, travelled / total)) : 0;
      setProgress((previous) => (Math.abs(previous - value) > 0.002 ? value : previous));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, mode]);

  return progress;
}
