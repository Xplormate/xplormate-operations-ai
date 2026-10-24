"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";

export type Area = {
  id: string;
  label: string;
  index: string;
  title: string;
  image: string;
  icon: LucideIcon;
  code: string;
  friction: string;
  ai: string;
  human: string;
  measure: string;
  question: string;
};

/**
 * "Where AI fits" as a horizontal carousel of plant areas: the chosen area opens
 * wide with its photo, the rest stay as narrow strips you can click. The detail
 * for the chosen area sits underneath.
 */
export default function AreaCarousel({ areas }: { areas: Area[] }) {
  const [active, setActive] = useState(0);
  const area = areas[active];
  const trackRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(0);

  // On phones the photo row scrolls sideways: keep it and the chosen area in step.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth + 4) return;
    const card = track.children[active] as HTMLElement | undefined;
    if (!card) return;
    programmatic.current = window.setTimeout(() => { programmatic.current = 0; }, 700);
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let settle = 0;
    const onScroll = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (programmatic.current || track.scrollWidth <= track.clientWidth + 4) return;
        const cards = Array.from(track.children) as HTMLElement[];
        let nearest = 0;
        cards.forEach((card, index) => {
          if (Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[nearest].offsetLeft - track.scrollLeft)) nearest = index;
        });
        setActive(nearest);
      }, 140);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(settle);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const go = (index: number) => setActive((index + areas.length) % areas.length);

  const onTabKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = areas.length - 1;
    else return;
    event.preventDefault();
    const target = (next + areas.length) % areas.length;
    go(target);
    requestAnimationFrame(() => document.getElementById(`area-tab-${areas[target].id}`)?.focus());
  };

  return (
    <div className="areas">
      <div className="areas-bar">
        <span className="areas-kicker">IN THE PLANT</span>
        <div className="areas-tabs" role="tablist" aria-label="Plant areas">
          {areas.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`area-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-controls="area-panel"
                tabIndex={index === active ? 0 : -1}
                title={item.label}
                onClick={() => go(index)}
                onKeyDown={(event) => onTabKey(event, index)}
              >
                <Icon size={17} strokeWidth={1.6} /><span className="sr-only">{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="areas-arrows">
          <button type="button" aria-label="Previous area" onClick={() => go(active - 1)}><ArrowLeft size={18} /></button>
          <button type="button" aria-label="Next area" onClick={() => go(active + 1)}><ArrowRight size={18} /></button>
        </div>
      </div>

      <div className="areas-track" ref={trackRef}>
        {areas.map((item, index) => (
          <button
            key={item.id}
            type="button"
            tabIndex={-1}
            className={`area-card${index === active ? " is-active" : ""}`}
            onClick={() => go(index)}
            aria-hidden={index === active ? undefined : true}
          >
            <img src={item.image} alt="" loading="lazy" decoding="async" />
            <span className="area-card-shade" aria-hidden="true" />
            <span className="area-card-code" aria-hidden="true">{item.code}</span>
            <span className="area-card-corners" aria-hidden="true" />
            <span className="area-card-label"><ArrowRight size={14} /> {item.label.toUpperCase()}</span>
            <span className="area-card-title"><small>{item.label.toUpperCase()}</small>{item.title} <ArrowRight size={22} /></span>
          </button>
        ))}
      </div>

      <div className="area-panel" id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${area.id}`} key={area.id}>
        <div className="area-panel-head"><span>{area.index} / {String(areas.length).padStart(2, "0")}</span><h3>{area.title}</h3></div>
        <div className="area-facts">
          <div><small>WHERE IT SLOWS DOWN</small><p>{area.friction}</p></div>
          <div><small>HOW AI COULD HELP</small><p>{area.ai}</p></div>
          <div><small>WHAT YOUR TEAM DECIDES</small><p>{area.human}</p></div>
        </div>
        <div className="area-footer">
          <div><small>WHAT WE’D MEASURE</small><strong>{area.measure}</strong></div>
          <div><small>FIRST QUESTION WE’D ASK</small><strong>{area.question}</strong></div>
        </div>
      </div>
    </div>
  );
}
