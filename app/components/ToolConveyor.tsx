"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// `logo` is a file in /public/tool-logos (the brand's own mark, in its colours); systems without one show a two-letter badge.
export type Tool = { brand: string; logo?: string; area: string };
export type ToolGroup = { id: string; label: string; tools: Tool[] };

const GROUP_MS = 4200;

// Two-letter badge for systems without a logo file, e.g. "Microsoft Dynamics" -> "MD", "Tally" -> "TA".
const monogram = (brand: string) => {
  const words = brand.split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : brand.slice(0, 2)).toUpperCase();
};

/**
 * Example systems by category. The categories cycle on their own while the panel
 * is on screen (a line under the active one shows the time left); the systems of
 * the active category animate in on the right. Clicking a category holds it, and
 * a pause button stops the cycle. Reduced motion holds the first category.
 */
export default function ToolConveyor({ groups, eyebrow, title, note }: { groups: ToolGroup[]; eyebrow?: string; title: string; note?: string }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [autoGroups, setAutoGroups] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const group = groups[groupIndex];

  useEffect(() => {
    const still = requestAnimationFrame(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches));
    const root = rootRef.current;
    const observer = root ? new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.3 }) : null;
    if (root && observer) observer.observe(root);
    return () => {
      cancelAnimationFrame(still);
      observer?.disconnect();
    };
  }, []);

  const running = !reduced && !paused && onScreen && autoGroups;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setGroupIndex((current) => (current + 1) % groups.length), GROUP_MS);
    return () => window.clearTimeout(timer);
  }, [running, groupIndex, groups.length]);

  const choose = (index: number) => {
    setAutoGroups(false);
    setGroupIndex(index);
  };

  const onTabKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next += 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next -= 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = groups.length - 1;
    else return;
    event.preventDefault();
    const target = (next + groups.length) % groups.length;
    choose(target);
    document.getElementById(`tool-tab-${groups[target].id}`)?.focus();
  };

  return (
    <div className="systems-layout" ref={rootRef}>
      <div className="systems-intro">
        {eyebrow ? <span className="systems-eyebrow">{eyebrow}</span> : null}
        <h3 id="systems-map-title">{title}</h3>
        {note ? <p className="systems-note">{note}</p> : null}
        <div className="systems-tabs" role="tablist" aria-label="System types" aria-orientation="vertical" onFocus={() => setAutoGroups(false)}>
          {groups.map((item, index) => (
            <button key={item.id} id={`tool-tab-${item.id}`} type="button" role="tab" tabIndex={index === groupIndex ? 0 : -1} aria-selected={index === groupIndex} aria-controls="tool-panel" onClick={() => choose(index)} onKeyDown={(event) => onTabKey(event, index)}>
              <span className="systems-tab-index">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
              {index === groupIndex ? <i className={`systems-tab-timer${running ? " is-running" : ""}`} key={`${item.id}-${groupIndex}`} style={{ "--ms": `${GROUP_MS}ms` } as React.CSSProperties} aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      </div>
      <div className="systems-stage" id="tool-panel" role="tabpanel" tabIndex={0} aria-labelledby={`tool-tab-${group.id}`}>
        <ul className="systems-tiles" key={group.id}>
          {group.tools.map((tool, index) => (
            <li key={`${tool.brand}-${tool.area}`} style={{ "--i": index } as React.CSSProperties}>
              <span className="systems-tile-logo">{tool.logo ? <img src={`/tool-logos/${tool.logo}.svg`} width="40" height="40" alt="" /> : <b aria-hidden="true">{monogram(tool.brand)}</b>}</span>
              <span className="systems-tile-name">{tool.brand}</span>
              <span className="systems-tile-area">{tool.area}</span>
            </li>
          ))}
        </ul>
        {!reduced && autoGroups ? (
          <button type="button" className="systems-pause" aria-label="Pause system categories" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
