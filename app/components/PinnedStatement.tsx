"use client";

import { useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";

/**
 * A statement that stays on screen while the visitor scrolls, filling in word
 * by word. The rail on the left shows how far through it they are.
 */
export default function PinnedStatement({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const words = text.split(" ");
  const lit = Math.round(Math.min(1, progress / 0.82) * words.length);

  return (
    <section className="pinned-statement" ref={ref}>
      <div className="pinned-sticky">
        <div className="shell pinned-inner">
          <span className="statement-rail" aria-hidden="true">
            {[0, 1, 2].map((segment) => (
              <i key={segment}><b style={{ transform: `scaleY(${Math.min(1, Math.max(0, progress * 3 - segment))})` }} /></i>
            ))}
          </span>
          <p className="scroll-text">
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
              {words.map((word, index) => (
                <span key={`${word}-${index}`} className={index < lit ? "is-lit" : undefined}>{word}{index < words.length - 1 ? " " : ""}</span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
