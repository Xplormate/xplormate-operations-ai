"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AgentPanel, { type AgentEntry } from "./AgentPanel";
import HeroSequence, { type HeroSlide } from "./HeroSequence";

export type HeroScene = HeroSlide & {
  /** The card entry this scene adds. */
  entry: AgentEntry;
  /** Where the marker sits on the clip, as fractions of the 16:9 frame (x, y). */
  focus: [number, number];
  /** Short mono readout shown beside the marker. */
  readout: string;
  /** One-line summary shown over the clip on phones, where the card is hidden. */
  short: string;
};

const SCENE_MS = 7000;
const MEDIA_W = 1280;
const MEDIA_H = 720;

type Point = { x: number; y: number };
type Hud = { marker: Point; target: Point | null; side: "left" | "right" };

/**
 * The hero scene: plant clips, the agent card and a light annotation layer kept in step.
 * Each scene adds one entry to the card; a marker sits on the machine in the clip and a dotted line
 * runs from it to that entry. It plays through once and rests on the entry that needs approval.
 */
export default function HeroStory({ scenes }: { scenes: HeroScene[] }) {
  const [step, setStep] = useState(0);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [variant, setVariant] = useState<"desktop" | "mobile" | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReduced(prefersReduced);
      setVariant(window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop");
      if (prefersReduced) {
        setStep(scenes.length - 1);
        setEnded(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [scenes.length]);

  // Stop the clock while the hero is off screen.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(layer);
    return () => observer.disconnect();
  }, []);

  const running = !paused && !reduced && onScreen && !ended;


  // The active progress bar is the clock: when its animation ends, move on (or stop after the last scene).
  const next = useCallback(() => {
    if (step < scenes.length - 1) setStep(step + 1);
    else setEnded(true);
  }, [step, scenes.length]);

  // Place the marker on the clip (the clip is object-fit: cover) and aim the line at the current card entry.
  const measure = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const box = layer.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const scale = Math.max(box.width / MEDIA_W, box.height / MEDIA_H);
    const width = MEDIA_W * scale;
    const height = MEDIA_H * scale;
    const offsetX = (box.width - width) * (window.matchMedia("(max-width: 760px)").matches ? 0.6 : 0.5);
    const offsetY = (box.height - height) / 2;
    const [fx, fy] = scenes[step].focus;
    // The clip slowly zooms (about 1.06 on average) around the frame centre; follow it.
    const zoom = 1.06;
    const marker = {
      x: box.width / 2 + (offsetX + fx * width - box.width / 2) * zoom,
      y: box.height / 2 + (offsetY + fy * height - box.height / 2) * zoom,
    };

    let target: Point | null = null;
    let cardLeft = Infinity;
    let cardBottom = -Infinity;
    const card = cardRef.current;
    const row = card?.querySelector<HTMLElement>(`li[data-row="${step}"]`);
    if (card && row && card.offsetParent !== null) {
      const cardBox = card.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      cardLeft = cardBox.left - box.left;
      cardBottom = cardBox.bottom - box.top;
      target = { x: cardLeft, y: rowBox.top - box.top + Math.min(rowBox.height, 60) / 2 };
    }
    // Never draw under the card.
    if (target && marker.x > cardLeft - 24 && marker.y < cardBottom + 24) {
      setHud(null);
      return;
    }
    const nearCard = marker.x + 250 > cardLeft && marker.y + 14 < cardBottom + 8;
    const preferred: Hud["side"] = marker.x > box.width * 0.62 || nearCard ? "left" : "right";
    // Never sit on the headline: test the marker and the readout's box against the heading's text lines.
    const lines: DOMRect[] = [];
    const heading = layer.parentElement?.querySelector("h1");
    if (heading) {
      const range = document.createRange();
      range.selectNodeContents(heading);
      lines.push(...Array.from(range.getClientRects()));
    }
    const clashes = (sideToTry: Hud["side"]) => {
      const x1 = sideToTry === "right" ? marker.x - 12 : marker.x - 240;
      const x2 = sideToTry === "right" ? marker.x + 240 : marker.x + 12;
      return lines.some((line) => x2 > line.left - box.left && x1 < line.right - box.left && marker.y + 42 > line.top - box.top && marker.y - 12 < line.bottom - box.top);
    };
    const other: Hud["side"] = preferred === "left" ? "right" : "left";
    const otherFits = other === "left" || marker.x + 250 < cardLeft;
    const side: Hud["side"] | null = !clashes(preferred) ? preferred : otherFits && !clashes(other) ? other : null;
    if (!side) {
      setHud(null);
      return;
    }
    const round = (value: number) => Math.round(value);
    setHud((current) => {
      const nextHud = { marker: { x: round(marker.x), y: round(marker.y) }, target: target ? { x: round(target.x), y: round(target.y) } : null, side };
      return current && JSON.stringify(current) === JSON.stringify(nextHud) ? current : nextHud;
    });
  }, [scenes, step]);

  // Re-measure as the card row opens, and on resize.
  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const tick = () => {
      measure();
      if (performance.now() - started < 1500) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const layer = layerRef.current;
    const observer = layer ? new ResizeObserver(() => measure()) : null;
    if (layer && observer) observer.observe(layer);
    if (cardRef.current && observer) observer.observe(cardRef.current);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [measure]);

  const select = (index: number) => {
    setStep(index);
    setEnded(reduced);
    setPaused(false);
  };

  const scene = scenes[step];
  const entries = scenes.map((item) => item.entry);

  return (
    <>
      <HeroSequence
        slides={scenes}
        active={step}
        running={running}
        paused={paused}
        reduced={reduced}
        variant={variant}
        durationMs={SCENE_MS}
        ended={ended}
        onScreen={onScreen}
        onSceneEnd={next}
        onSelect={select}
        onTogglePause={() => setPaused((value) => !value)}
      />
      <div className="hero-hud" ref={layerRef} aria-hidden="true">
        {hud ? (
          <div className="hero-hud-scene" key={step}>
            <span className="hud-dots" style={{ left: hud.marker.x, top: hud.marker.y }} />
            {hud.target ? (
              <svg className="hud-line" width="100%" height="100%">
                <line x1={hud.marker.x} y1={hud.marker.y} x2={hud.target.x} y2={hud.target.y} />
                <circle cx={hud.target.x} cy={hud.target.y} r={3} />
              </svg>
            ) : null}
            <span className="hud-marker" style={{ left: hud.marker.x, top: hud.marker.y }} />
            <span className={`hud-readout is-${hud.side}`} style={{ left: hud.marker.x, top: hud.marker.y }}>{scene.readout}</span>
          </div>
        ) : null}
        <div className={`hud-chip is-${scene.entry.status}`} key={`chip-${step}`}><span>{scene.entry.area}</span><em>{scene.short}</em><i>SAMPLE</i></div>
      </div>
      <p className="sr-only">Sample data: a plant follow-up agent’s log for one day at one plant. The agent sent the morning review, reminded a CAPA owner and escalated a late work order on its own. An order to a backup supplier for packing film waits for a person to approve.</p>
      <AgentPanel ref={cardRef} entries={entries} shown={step + 1} />
    </>
  );
}
