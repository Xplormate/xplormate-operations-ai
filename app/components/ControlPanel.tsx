"use client";

import { useEffect, useRef, useState } from "react";

type Access = { system: string; scope: string; level: string; kind: "read" | "write" | "gated" };
type LogLine = { time: string; text: string; who: string; pending?: string };

// Sample data only: the access one materials agent would get, and its log for the shortage in the example above.
const access: Access[] = [
  { system: "SAP", scope: "Stock and open POs", level: "Read", kind: "read" },
  { system: "Shortage tracker", scope: "Google Sheets", level: "Read and update", kind: "write" },
  { system: "SAP", scope: "Production plan", level: "Suggest only", kind: "gated" },
  { system: "Email", scope: "Suppliers", level: "Draft only", kind: "gated" },
];

const log: LogLine[] = [
  { time: "14:33", text: "Read stock in 3 stores and 2 open POs", who: "Agent" },
  { time: "14:35", text: "Proposed a new run order for Line 2", who: "Agent" },
  { time: "15:10", text: "Planner approved it and updated the plan", who: "Planner", pending: "Waiting for planner" },
];

/** Section 03 visual: what one agent may touch, and the log of what it did. Plays once when it scrolls into view. */
export default function ControlPanel() {
  const [step, setStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = log.length + 1; // the last line shows "waiting" before it is approved

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setStep(total);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setStep(1);
    }, { threshold: 0.35 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [total]);

  useEffect(() => {
    if (step === 0 || step >= total) return;
    const timer = window.setTimeout(() => setStep((value) => Math.min(value + 1, total)), step === log.length ? 2200 : 1100);
    return () => window.clearTimeout(timer);
  }, [step, total]);

  const approved = step >= total;

  return (
    <div
      className="control-panel"
      ref={rootRef}
      role="img"
      aria-label="Sample data: a materials agent can read stock and open orders in SAP and update the shortage tracker. It can only suggest changes to the production plan and draft supplier emails. Its log shows it read stock, proposed a new run order, and the planner approved it."
    >
      <div className="control-head" aria-hidden="true">
        <span>Agent access · Materials</span>
        <span className="control-chip">SAMPLE DATA</span>
      </div>
      <ul className="control-access" aria-hidden="true">
        {access.map((row) => (
          <li key={`${row.system}-${row.scope}`}>
            <span className="control-system"><b>{row.system}</b>{row.scope}</span>
            <span className={`control-level is-${row.kind}`}>{row.level}</span>
          </li>
        ))}
      </ul>
      <div className="control-log-head" aria-hidden="true"><span>Log</span><span>The shortage from the example</span></div>
      <ol className="control-log" aria-hidden="true">
        {log.map((line, index) => {
          const isLast = index === log.length - 1;
          const shown = step > index;
          const waiting = isLast && !approved;
          return (
            <li key={line.time} className={`${shown ? "is-in" : ""}${waiting ? " is-waiting" : ""}${isLast && approved ? " is-approved" : ""}`}>
              <time>{waiting ? "" : line.time}</time>
              <span>{waiting ? "Run order sent for approval" : line.text}</span>
              <em>{waiting ? line.pending : line.who}</em>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
