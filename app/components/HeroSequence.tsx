"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export type HeroSlide = {
  label: string;
  /** Still frame: the poster shown before (and instead of) the clip. */
  image: string;
  /** Short muted clip. A lighter "-m.mp4" version is used on phones. */
  video?: string;
  alt: string;
  readouts: { text: string; alert?: boolean }[];
};

const STILL_MS = 6500;
const VIDEO_MS = 7000;

const clipFor = (video: string, variant: "desktop" | "mobile") => (variant === "mobile" ? video.replace(/\.mp4$/, "-m.mp4") : video);

/**
 * The hero's background: short plant clips that crossfade one after another,
 * each with its own illustrative data readouts, plus scene buttons and a pause
 * control. Only the visible clip plays and only the next one preloads; phones
 * get lighter files. Reduced-motion visitors get the first scene's still frame.
 */
export default function HeroSequence({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Clips get a source only after hydration, once we know which size to load.
  const [variant, setVariant] = useState<"desktop" | "mobile" | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setVariant(window.matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const running = !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const duration = slides[active].video ? VIDEO_MS : STILL_MS;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % slides.length), duration);
    return () => window.clearTimeout(timer);
  }, [active, running, slides]);

  // Only the visible clip plays.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && running && variant) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [active, running, variant]);

  const show = (index: number) => {
    const video = videoRefs.current[index];
    if (video) video.currentTime = 0;
    setActive(index);
  };

  // Restart each clip from the top when its scene comes round again.
  useEffect(() => {
    const video = videoRefs.current[active];
    if (video && video.currentTime > 0.5) video.currentTime = 0;
  }, [active]);

  const slide = slides[active];

  return (
    <>
      <div className="hero-slides">
        {slides.map((item, index) => (
          <div key={item.label} className={`hero-slide${index === active ? " is-active" : ""}${running ? "" : " is-still"}`} aria-hidden={index === active ? undefined : true}>
            {item.video ? (
              <video
                ref={(element) => { videoRefs.current[index] = element; }}
                className="hero-image"
                src={variant && !reduced ? clipFor(item.video, variant) : undefined}
                poster={item.image}
                muted
                playsInline
                loop
                preload={index === active || index === (active + 1) % slides.length ? "auto" : "none"}
                aria-label={item.alt}
              />
            ) : (
              <img className="hero-image" src={item.image} alt={item.alt} decoding="async" />
            )}
          </div>
        ))}
      </div>
      <div className="hero-readouts" aria-hidden="true" key={active}>
        {slide.readouts.map((readout, index) => (
          <div key={readout.text} className={`readout readout-${index + 1}${readout.alert ? " readout-alert" : ""}`} style={{ animationDelay: `${0.35 + index * 0.35}s` }}>
            {readout.alert ? <i /> : null}{readout.text}
          </div>
        ))}
        <span className="crosshair crosshair-one" /><span className="crosshair crosshair-two" />
      </div>
      <div className="hero-progress" role="group" aria-label="Plant scenes">
        {slides.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={index === active ? "is-active" : undefined}
            aria-label={`Show ${item.label.toLowerCase()} scene`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => show(index)}
          >
            <span className="hero-progress-label">{item.label}</span>
            <span className="hero-progress-bar"><b key={index === active ? `active-${running}` : "idle"} className={running ? undefined : "is-paused"} style={index === active ? { animationDuration: `${item.video ? VIDEO_MS : STILL_MS}ms` } : undefined} /></span>
          </button>
        ))}
        {!reduced ? (
          <button type="button" className="hero-pause" aria-label={paused ? "Play scenes" : "Pause scenes"} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        ) : null}
      </div>
    </>
  );
}
