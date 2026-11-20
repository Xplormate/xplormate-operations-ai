"use client";

import { useEffect, useRef, useState } from "react";

type Line = { name: string; status: string; level: number; alert?: boolean };
type Scene = { lines: Line[]; alert: string; action: string };

// Sample data only: what a material readiness agent would show while it works.
const scenes: Scene[] = [
  {
    lines: [
      { name: "LINE 1", status: "COVERED", level: 92 },
      { name: "LINE 2", status: "SHORT TOMORROW", level: 34, alert: true },
      { name: "LINE 3", status: "COVERED", level: 81 },
      { name: "LINE 4", status: "COVERED", level: 76 },
    ],
    alert: "Raw material short for Line 2 tomorrow",
    action: "Buyer asked · due 17:00",
  },
  {
    lines: [
      { name: "LINE 1", status: "COVERED", level: 90 },
      { name: "LINE 2", status: "PO 2 DAYS LATE", level: 34, alert: true },
      { name: "LINE 3", status: "COVERED", level: 79 },
      { name: "LINE 4", status: "CHECKING STORE B", level: 58 },
    ],
    alert: "3 orders at risk on Line 2",
    action: "Waiting for planner approval",
  },
  {
    lines: [
      { name: "LINE 1", status: "COVERED", level: 88 },
      { name: "LINE 2", status: "RESEQUENCED", level: 70 },
      { name: "LINE 3", status: "COVERED", level: 79 },
      { name: "LINE 4", status: "COVERED", level: 74 },
    ],
    alert: "Planner approved the new sequence",
    action: "Closed and logged",
  },
];

const SCENE_MS = 5200;

/** A sample-data agent card for the hero. It cycles through three moments of one shortage, and holds while hovered. */
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
  const resolved = index === scenes.length - 1;

  return (
    <div
      className="agent-panel"
      ref={rootRef}
      role="img"
      aria-label="Sample data: a material readiness agent watching four lines, flagging a shortage on Line 2 and waiting for planner approval."
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
    >
      <div className="agent-panel-head" aria-hidden="true">
        <span className="agent-live"><i />Material readiness agent</span>
      </div>
      <div className="agent-panel-sub" aria-hidden="true"><span>4 lines watched</span><span className="agent-live-chip">SAMPLE DATA</span></div>
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
