"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

// `logo` is a file in /public/tool-logos; systems without one show as a wordmark tile.
export type Tool = { brand: string; logo?: string; area: string };
export type ToolGroup = { id: string; label: string; tools: Tool[] };

const GROUP_MS = 3600;
const keyOf = (tool: Tool) => `${tool.brand}-${tool.area}`;

/**
 * System cards gliding continuously right-to-left on a conveyor. The category
 * list on the left cycles on its own and lights up that category's systems as
 * they pass; clicking a category holds it. A pause button stops everything,
 * and nothing runs while the conveyor is off screen.
 */
export default function ToolConveyor({ groups, eyebrow, title, note }: { groups: ToolGroup[]; eyebrow: string; title: string; note: string }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [autoGroups, setAutoGroups] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const group = groups[groupIndex];
  const highlighted = new Set(group.tools.map(keyOf));
  // Every system once, in category order, then the same list again for a seamless loop.
  const tools = groups.flatMap((item) => item.tools).filter((tool, index, all) => all.findIndex((other) => keyOf(other) === keyOf(tool)) === index);
  const track = [...tools, ...tools];

  useEffect(() => {
    const still = requestAnimationFrame(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches));
    const root = rootRef.current;
    const observer = root ? new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting)) : null;
    if (root && observer) observer.observe(root);
    return () => {
      cancelAnimationFrame(still);
      observer?.disconnect();
    };
  }, []);

  const running = !reduced && !paused && onScreen;

  useEffect(() => {
    if (!running || !autoGroups) return;
    const timer = window.setInterval(() => setGroupIndex((current) => (current + 1) % groups.length), GROUP_MS);
    return () => window.clearInterval(timer);
  }, [running, autoGroups, groups.length]);

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
    <div className="conveyor-layout" ref={rootRef}>
      <div className="conveyor-intro">
        <span className="systems-eyebrow">{eyebrow}</span>
        <h3 id="systems-map-title">{title}</h3>
        <p className="conveyor-note">{note}</p>
        <div className="conveyor-groups" role="tablist" aria-label="System types">
          {groups.map((item, index) => (
            <button key={item.id} id={`tool-tab-${item.id}`} type="button" role="tab" tabIndex={index === groupIndex ? 0 : -1} aria-selected={index === groupIndex} aria-controls="tool-panel" onClick={() => choose(index)} onKeyDown={(event) => onTabKey(event, index)}>
              <span aria-hidden="true">{index === groupIndex ? ">" : ""}</span>{item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="conveyor-stage" id="tool-panel" role="tabpanel" tabIndex={0} aria-labelledby={`tool-tab-${group.id}`}>
        <span className="sr-only">{group.tools.map((tool) => tool.brand).join(", ")}</span>
        <span className="conveyor-ticks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</span>
        <div className="conveyor-window" aria-hidden="true">
          <div className={`conveyor-track${running ? "" : " is-paused"}`} style={{ "--count": tools.length } as React.CSSProperties}>
            {track.map((tool, index) => (
              <div key={`${keyOf(tool)}-${index}`} className={`conveyor-card${highlighted.has(keyOf(tool)) ? " is-lit" : ""}`}>
                {tool.logo ? <img src={`/tool-logos/${tool.logo}.svg`} width="44" height="44" alt="" /> : <b className="conveyor-wordmark">{tool.brand}</b>}
                <span>{tool.area}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="conveyor-foot">
          {!reduced ? (
            <button type="button" className="conveyor-pause" aria-label={paused ? "Play systems carousel" : "Pause systems carousel"} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
              {paused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
