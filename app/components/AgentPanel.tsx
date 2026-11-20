"use client";

import { useEffect, useRef, useState } from "react";

type Line = { name: string; status: string; level: number; alert?: boolean };
type Scene = { lines: Line[]; alert: string; action: string; resolved?: boolean };

const ok = (name: string, level: number): Line => ({ name, status: "ON TRACK", level });

// Sample data only: what an agent would show across one plant's day.
const scenes: Scene[] = [
  {
    lines: [{ name: "MATERIALS", status: "LINE 2 SHORT", level: 34, alert: true }, ok("QUALITY", 82), ok("MAINTENANCE", 76), ok("HANDOVER", 88)],
    alert: "Raw material short for Line 2 tomorrow",
    action: "Buyer and planner informed",
  },
  {
    lines: [ok("MATERIALS", 72), { name: "QUALITY", status: "CAPA 2/3", level: 45, alert: true }, ok("MAINTENANCE", 76), ok("HANDOVER", 88)],
    alert: "CAPA evidence missing before Friday",
    action: "Owner reminded · due Thursday",
  },
  {
    lines: [ok("MATERIALS", 74), ok("QUALITY", 70), { name: "MAINTENANCE", status: "PRESS 4 LATE", level: 30, alert: true }, ok("HANDOVER", 86)],
    alert: "Press 4 work order past response time",
    action: "Waiting for maintenance head",
  },
  {
    lines: [ok("MATERIALS", 78), ok("QUALITY", 74), ok("MAINTENANCE", 72), { name: "HANDOVER", status: "5/5 OWNED", level: 92 }],
    alert: "Shift B handover acknowledged",
    action: "Every open item has an owner",
    resolved: true,
  },
];

const SCENE_MS = 5200;

/** A sample-data agent card for the hero. It cycles through one plant's day across four areas, and holds while hovered. */
export default function AgentPanel() {
  const [index, setIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [held, setHeld] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Only cycle while the panel is visible, not hovered, and motion is allowed.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % scenes.length), SCENE_MS);
    return () => window.clearInterval(timer);
  }, [onScreen, held]);

  const scene = scenes[index];
  const resolved = Boolean(scene.resolved);

  return (
    <div
      className="agent-panel"
      ref={rootRef}
      role="img"
      aria-label="Sample data: an agent watching materials, quality, maintenance and shift handover in one plant, flagging the next issue for its owner."
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      <div className="agent-panel-head" aria-hidden="true">
        <span className="agent-live"><i />Plant operations agent</span>
      </div>
      <div className="agent-panel-sub" aria-hidden="true"><span>4 areas watched</span><span className="agent-live-chip">EXAMPLE</span></div>
      <ul className="agent-lines" aria-hidden="true" key={index}>
        {scene.lines.map((line, row) => (
          <li key={line.name} className={line.alert ? "is-alert" : undefined} style={{ "--row": row, "--level": `${line.level}%` } as React.CSSProperties}>
            <span>{line.name}</span>
            <b><i /></b>
            <em>{line.status}</em>
          </li>
        ))}
      </ul>
      <div className={`agent-alert${resolved ? " is-resolved" : ""}`} aria-hidden="true" key={`alert-${index}`}>
        <span className="agent-alert-dot">{resolved ? "✓" : "!"}</span>
        <div><strong>{scene.alert}</strong><small>{scene.action}</small></div>
        <span className="agent-review">{resolved ? "Done" : "Review"}</span>
      </div>
    </div>
  );
}
