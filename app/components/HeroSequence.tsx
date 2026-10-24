"use client";

import { useEffect, useRef, useState } from "react";

export type HeroSlide = {
  label: string;
  image: string;
  /** Optional short muted loop shown instead of the still (the still is its poster). */
  video?: string;
  alt: string;
  readouts: { text: string; alert?: boolean }[];
};

const STILL_MS = 6500;
const VIDEO_MS = 9000;

/**
 * The hero's background: a slow crossfading sequence of plant scenes, each with
 * its own illustrative data readouts, plus a progress indicator. Reduced-motion
 * visitors get the first scene, still.
 */
export default function HeroSequence({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const still = requestAnimationFrame(() => setAnimate(false));
      return () => cancelAnimationFrame(still);
    }
  }, []);

  useEffect(() => {
    if (!animate) return;
    const duration = slides[active].video ? VIDEO_MS : STILL_MS;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % slides.length), duration);
    return () => window.clearTimeout(timer);
  }, [active, animate, slides]);

  // Only the visible clip plays.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && animate) {
        video.currentTime = 0;
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [active, animate]);

  const slide = slides[active];

  return (
    <>
      <div className="hero-slides">
        {slides.map((item, index) => (
          <div key={item.label} className={`hero-slide${index === active ? " is-active" : ""}`} aria-hidden={index === active ? undefined : true}>
            {item.video ? (
              <video
                ref={(element) => { videoRefs.current[index] = element; }}
                className="hero-image"
                src={item.video}
                poster={item.image}
                muted
                playsInline
                loop
                preload={index === 0 ? "auto" : "metadata"}
                aria-label={item.alt}
              />
            ) : (
              <img className="hero-image" src={item.image} alt={item.alt} fetchPriority={index === 0 ? "high" : undefined} decoding="async" />
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
            onClick={() => setActive(index)}
          >
            <span className="hero-progress-label">{item.label}</span>
            <span className="hero-progress-bar"><b key={index === active ? "running" : "idle"} style={index === active && animate ? { animationDuration: `${item.video ? VIDEO_MS : STILL_MS}ms` } : undefined} /></span>
          </button>
        ))}
      </div>
    </>
  );
}
