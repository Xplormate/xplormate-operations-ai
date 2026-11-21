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

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      if (step < scenes.length - 1) setStep(step + 1);
      else setEnded(true);
    }, SCENE_MS);
    return () => window.clearTimeout(timer);
  }, [running, step, scenes.length]);

  // Place the marker on the clip (the clip is object-fit: cover) and aim the line at the current card entry.
  const measure = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const box = layer.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const scale = Math.max(box.width / MEDIA_W, box.height / MEDIA_H);
    const width = MEDIA_W * scale;
    const height = MEDIA_H * scale;
    const offsetX = (box.width - width) * (box.width <= 760 ? 0.6 : 0.5);
    const offsetY = (box.height - height) / 2;
    const [fx, fy] = scenes[step].focus;
    const marker = { x: offsetX + fx * width, y: offsetY + fy * height };

    let target: Point | null = null;
    const card = cardRef.current;
    const row = card?.querySelector<HTMLElement>(`li[data-row="${step}"]`);
    if (card && row && card.offsetParent !== null) {
      const cardBox = card.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      target = { x: cardBox.left - box.left, y: rowBox.top - box.top + Math.min(rowBox.height, 60) / 2 };
    }
    setHud({ marker, target, side: marker.x > box.width * 0.62 ? "left" : "right" });
  }, [scenes, step]);

  // Re-measure as the card row opens, and on resize.
  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const tick = () => {
      measure();
      if (performance.now() - started < 900) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const layer = layerRef.current;
    const observer = layer ? new ResizeObserver(() => measure()) : null;
    if (layer && observer) observer.observe(layer);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [measure]);

  const select = (index: number) => {
    setStep(index);
    setEnded(reduced);
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
        <div className={`hud-chip is-${scene.entry.status}`} key={`chip-${step}`}><span>{scene.entry.area}</span>{scene.short}</div>
      </div>
      <AgentPanel ref={cardRef} entries={entries} shown={step + 1} />
    </>
  );
}
