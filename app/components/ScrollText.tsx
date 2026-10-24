"use client";

import { useEffect, useRef, useState } from "react";

type ScrollTextProps = {
  text: string;
  className?: string;
  as?: "p" | "h2";
};

/**
 * A statement that "fills in" word by word as it scrolls through the
 * viewport. Screen readers get the plain sentence; the word spans are hidden
 * from them. Everything is lit immediately for reduced-motion users.
 */
export default function ScrollText({ text, className, as = "p" }: ScrollTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(words.length);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.88;
      const end = viewport * 0.38;
      const progress = (start - rect.top) / (start - end + rect.height * 0.6);
      const clamped = Math.max(0, Math.min(1, progress));
      setLit(Math.round(clamped * words.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  const Tag = as;
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>} className={`scroll-text${className ? ` ${className}` : ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className={index < lit ? "is-lit" : undefined}>{word}{index < words.length - 1 ? " " : ""}</span>
        ))}
      </span>
    </Tag>
  );
}
