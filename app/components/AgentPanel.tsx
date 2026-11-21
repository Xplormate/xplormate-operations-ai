"use client";

import { forwardRef } from "react";

export type AgentEntry = { time: string; area: string; text: string; status: "done" | "waiting"; statusLabel: string };

type Props = {
  entries: AgentEntry[];
  /** How many entries are showing; the last one showing is the current scene. */
  shown: number;
};

/** Hero card: a sample agent log that fills in scene by scene, ending on the one step a person must approve. */
const AgentPanel = forwardRef<HTMLDivElement, Props>(function AgentPanel({ entries, shown }, ref) {
  const visible = entries.slice(0, shown);
  const done = visible.filter((entry) => entry.status === "done").length;
  const waiting = visible.filter((entry) => entry.status === "waiting").length;

  return (
    <div
      className="agent-panel"
      ref={ref}
      aria-hidden="true"
    >
      <div className="agent-panel-head" aria-hidden="true">
        <div className="agent-name">
          <span className="agent-live"><span className="agent-live-dot" />Plant follow-up agent</span>
          <span className="agent-sub">4 areas · one plant, one day</span>
        </div>
        <span className="agent-live-chip">SAMPLE DATA</span>
      </div>
      <ol className="agent-log" aria-hidden="true">
        {entries.map((entry, row) => (
          <li key={entry.time} data-row={row} className={`${row < shown ? "is-in" : ""}${row === shown - 1 ? " is-current" : ""} is-${entry.status}`}>
            <time>{entry.time}</time>
            <div><span className="agent-log-area">{entry.area}</span><p>{entry.text}</p></div>
            <span className="agent-log-status">{entry.statusLabel}</span>
          </li>
        ))}
      </ol>
      <div className="agent-panel-foot" aria-hidden="true">
        <span>{done} handled by the agent</span>
        <span className={waiting ? "is-waiting" : undefined}>{waiting} waiting for a person</span>
      </div>
    </div>
  );
});

export default AgentPanel;
