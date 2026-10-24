"use client";

import { useEffect, useRef } from "react";

type DotFieldProps = {
  className?: string;
  /** RGB triplet, e.g. "255,214,150" */
  color?: string;
  /** Distance between dots in CSS pixels */
  gap?: number;
  /** 0–1, how much of the grid is lit at any moment */
  density?: number;
};

/**
 * A quiet "instrument panel" dot matrix: columns of dots that drift and
 * brighten slowly. Decorative only. Pauses when off-screen and renders a
 * single still frame for people who prefer reduced motion.
 */
export default function DotField({ className, color = "255,214,150", gap = 14, density = 0.32 }: DotFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let last = 0;

    // Stable per-column personality so the field looks like data, not noise.
    const seeds: number[] = [];
    const seedFor = (column: number) => {
      while (seeds.length <= column) seeds.push(Math.random());
      return seeds[column];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const columns = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const threshold = 1 - density * 2;

      for (let c = 0; c < columns; c += 1) {
        const seed = seedFor(c);
        const speed = 0.00018 + seed * 0.00032;
        const phase = seed * 40;
        for (let r = 0; r < rows; r += 1) {
          const wave = Math.sin(r * 0.32 + phase - time * speed * (seed > 0.5 ? 1 : -1));
          const drift = Math.cos(c * 0.21 + time * 0.00012 + r * 0.05);
          const value = wave * 0.7 + drift * 0.3;
          if (value < threshold) continue;
          const strength = Math.min(1, (value - threshold) / (1 - threshold));
          const bright = strength > 0.92 && seed > 0.78;
          ctx.fillStyle = `rgba(${color},${(bright ? 0.95 : 0.16 + strength * 0.42).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(c * gap, r * gap, bright ? 1.7 : 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      if (!visible) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
      if (time - last < 33) return;
      last = time;
      draw(time);
    };

    resize();
    draw(performance.now());

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      // Restart the loop when the field comes back on screen; it stops itself when hidden.
      if (visible && !frame && !reduceMotion) frame = requestAnimationFrame(loop);
    });
    intersection.observe(canvas);

    if (!reduceMotion) frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, [color, gap, density]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
