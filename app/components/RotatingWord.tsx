"use client";

import { useEffect, useRef, useState } from "react";

const ROTATE_MS = 2400;

const spoken = (words: string[]) => (words.length > 1 ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}` : words[0]);

/**
 * Cycles through a short list of words with a soft slide.
 * All words share one grid cell, so the line never reflows. Holds still for reduced motion
 * and while off screen.
 */
export default function RotatingWord({ words, suffix = "" }: { words: string[]; suffix?: string }) {
  const [step, setStep] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const index = step % words.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setStep((current) => current + 1), ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [onScreen, step, words.length]);

  return (
    <span className="rotating-word" ref={rootRef}>
      <span className="sr-only">{spoken(words)}{suffix}</span>
      {words.map((word, wordIndex) => (
        <em key={word} aria-hidden="true" className={wordIndex === index ? "is-active" : undefined}>{word}{suffix}</em>
      ))}
    </span>
  );
}
