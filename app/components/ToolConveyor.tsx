"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Tool = { brand: string; logo: string; area: string };
type ToolGroup = { id: string; label: string; tools: Tool[] };

const GROUP_MS = 3600;

/**
 * Logo cards gliding continuously right-to-left on a horizontal conveyor.
 * The category list on the left cycles on its own and lights up that
 * category's tools as they pass; clicking a category holds it. A pause button
 * stops everything, and nothing runs while the conveyor is off screen.
 */
export default function ToolConveyor({ groups }: { groups: ToolGroup[] }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [autoGroups, setAutoGroups] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const group = groups[groupIndex];
  const highlighted = new Set(group.tools.map((tool) => `${tool.logo}-${tool.area}`));
  // Every tool once, in category order, then the same list again for a seamless loop.
  const tools = groups.flatMap((item) => item.tools).filter((tool, index, all) => all.findIndex((other) => other.logo === tool.logo && other.area === tool.area) === index);
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

  return (
    <div className="conveyor-layout" ref={rootRef}>
      <div className="conveyor-intro">
        <span className="systems-eyebrow">YOUR EXISTING OPERATION</span>
        <h3 id="systems-map-title">Work with the systems you already use.</h3>
        <p className="conveyor-note">Examples of tools plants commonly run on. They are not our partners or customers.</p>
        <div className="conveyor-groups" role="tablist" aria-label="Tool categories">
          {groups.map((item, index) => (
            <button key={item.id} type="button" role="tab" aria-selected={index === groupIndex} onClick={() => choose(index)}>
              <span aria-hidden="true">{index === groupIndex ? ">" : ""}</span>{item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="conveyor-stage" role="tabpanel" aria-label={`${group.label}: ${group.tools.map((tool) => tool.brand).join(", ")}`}>
        <span className="conveyor-ticks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</span>
        <div className="conveyor-window" aria-hidden="true">
          <div className={`conveyor-track${running ? "" : " is-paused"}`} style={{ "--count": tools.length } as React.CSSProperties}>
            {track.map((tool, index) => (
              <div key={`${tool.logo}-${tool.area}-${index}`} className={`conveyor-card${highlighted.has(`${tool.logo}-${tool.area}`) ? " is-lit" : ""}`}>
                <img src={`/tool-logos/${tool.logo}.svg`} width="44" height="44" alt="" />
                <span>{tool.area}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="conveyor-foot">
          <span className="systems-example">Illustrative examples only</span>
          {!reduced ? (
            <button type="button" className="conveyor-pause" aria-label={paused ? "Play tool carousel" : "Pause tool carousel"} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
              {paused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
