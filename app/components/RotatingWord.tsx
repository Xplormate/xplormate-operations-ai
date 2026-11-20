"use client";

import { useEffect, useState } from "react";

const ROTATE_MS = 2400;

/** Cycles through a short list of words with a soft slide. Holds on the first word for reduced motion. */
export default function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % words.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <span className="rotating-word">
      <span className="sr-only">{words.join(", ")}</span>
      <em key={index} aria-hidden="true">{words[index]}</em>
    </span>
  );
}
