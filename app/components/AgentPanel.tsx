"use client";

import { useEffect, useRef, useState } from "react";

type Entry = { time: string; area: string; text: string; status: "done" | "waiting"; statusLabel: string };

// Sample data only: one agent's activity log across a plant's day.
const entries: Entry[] = [
  { time: "07:30", area: "Reporting", text: "Morning review sent: 3 exceptions, 7 actions with owners", status: "done", statusLabel: "Done" },
  { time: "09:12", area: "Quality", text: "CAPA evidence missing. Owner reminded, due Thursday", status: "done", statusLabel: "Done" },
  { time: "11:40", area: "Maintenance", text: "Press 4 work order past response time. Escalated", status: "done", statusLabel: "Done" },
  { time: "14:05", area: "Materials", text: "Packing film short for Friday. Order to backup supplier drafted", status: "waiting", statusLabel: "Needs approval" },
];

const STEP_MS = 1900;

/** Hero card: a sample agent log that fills in once, ending on the one step a person must approve. */
export default function AgentPanel() {
  const [shown, setShown] = useState(1);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setShown(entries.length));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onScreen || shown >= entries.length) return;
    const timer = window.setTimeout(() => setShown((count) => Math.min(count + 1, entries.length)), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [onScreen, shown]);

  const done = entries.slice(0, shown).filter((entry) => entry.status === "done").length;
  const waiting = entries.slice(0, shown).filter((entry) => entry.status === "waiting").length;

  return (
    <div
      className="agent-panel"
      ref={rootRef}
      role="img"
      aria-label="Sample data: one day of agent activity at a plant. It sent the morning review, reminded a CAPA owner and escalated a late work order on its own. An order to a backup supplier for packing film waits for a person to approve."
    >
      <div className="agent-panel-head" aria-hidden="true">
        <span className="agent-live"><span className="agent-live-dot" />Agent activity · today</span>
        <span className="agent-live-chip">SAMPLE DATA</span>
      </div>
      <ol className="agent-log" aria-hidden="true">
        {entries.map((entry, row) => (
          <li key={entry.time} className={`${row < shown ? "is-in" : ""} is-${entry.status}`}>
            <time>{entry.time}</time>
            <div><span className="agent-log-area">{entry.area}</span><p>{entry.text}</p></div>
            <span className="agent-log-status">{entry.statusLabel}</span>
          </li>
        ))}
      </ol>
      <div className="agent-panel-foot" aria-hidden="true">
        <span>{done} handled by agents</span>
        <span className={waiting ? "is-waiting" : undefined}>{waiting} waiting for a person</span>
      </div>
    </div>
  );
}
