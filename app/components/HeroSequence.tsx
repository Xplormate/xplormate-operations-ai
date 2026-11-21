"use client";

import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";

export type HeroSlide = {
  label: string;
  /** Still frame: the poster shown before (and instead of) the clip. */
  image: string;
  /** Short muted clip. A lighter "-m.mp4" version is used on phones. */
  video?: string;
  alt: string;
};

const clipFor = (video: string, variant: "desktop" | "mobile") => (variant === "mobile" ? video.replace(/\.mp4$/, "-m.mp4") : video);

type Props = {
  slides: HeroSlide[];
  active: number;
  /** Whether the scene timer is running (drives the progress bar). */
  running: boolean;
  paused: boolean;
  reduced: boolean;
  variant: "desktop" | "mobile" | null;
  durationMs: number;
  /** The last scene has played through; its bar stays full. */
  ended: boolean;
  onSelect: (index: number) => void;
  onTogglePause: () => void;
};

/**
 * The hero's background clips, crossfading scene to scene, with scene buttons and a pause control.
 * The parent (HeroStory) owns the timing so the clips stay in step with the agent card.
 * Only the visible clip plays and only the next one preloads; phones get lighter files.
 */
export default function HeroSequence({ slides, active, running, paused, reduced, variant, durationMs, ended, onSelect, onTogglePause }: Props) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Only the visible clip plays. It keeps looping on the last scene even after the timer stops.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && !paused && !reduced && variant) {
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [active, paused, reduced, variant]);

  // Restart each clip from the top when its scene comes round again.
  useEffect(() => {
    const video = videoRefs.current[active];
    if (video && video.currentTime > 0.5) video.currentTime = 0;
  }, [active]);

  return (
    <>
      <div className="hero-slides">
        {slides.map((item, index) => (
          <div key={item.label} className={`hero-slide${index === active ? " is-active" : ""}`} aria-hidden={index === active ? undefined : true}>
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
      <div className="hero-progress" role="group" aria-label="Plant scenes">
        {slides.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`${index === active ? "is-active" : ""}${index < active || (ended && index === active) ? " is-done" : ""}`}
            aria-label={`Show ${item.label.toLowerCase()} scene`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => onSelect(index)}
          >
            <span className="hero-progress-label">{item.label}</span>
            <span className="hero-progress-bar"><b key={index === active ? `active-${active}-${running}` : "idle"} className={running ? undefined : "is-paused"} style={index === active ? { animationDuration: `${durationMs}ms` } : undefined} /></span>
          </button>
        ))}
        {!reduced ? (
          <button type="button" className="hero-pause" aria-label="Pause scenes" aria-pressed={paused} onClick={onTogglePause}>
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        ) : null}
      </div>
    </>
  );
}
