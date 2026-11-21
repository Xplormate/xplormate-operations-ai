"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { useScrollProgress } from "./useScrollProgress";

type Stage = { number: string; title: string; copy: string; icon: LucideIcon; time?: string };

type Props = {
  stages: Stage[];
  children: React.ReactNode;
  alertLabel?: string;
  alertTitle?: string;
  hint?: string;
};

/**
 * The example agent run, told one step at a time. The section pins while
 * the visitor scrolls; each step lights up in turn and the amber trace draws
 * itself to it. On phones (and for reduced motion) every step is simply shown.
 */
export default function OperatingLoop({ stages, children, alertLabel = "NEW ISSUE", alertTitle = "Material shortage before next shift", hint = "SCROLL TO FOLLOW THE ISSUE" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const active = Math.min(stages.length - 1, Math.floor(progress * (stages.length + 0.4)));
  const trace = stages.length > 1 ? (active / (stages.length - 1)) * 100 : 100;

  return (
    <section className="signal-story" id="signal-story" ref={ref}>
      <div className="signal-sticky">
        <div className="shell">
          {children}
          <div className="signal-visual" data-step={active}>
            <img src="/operational-signal.webp" alt="Close-up of factory machinery and an active sensor" loading="lazy" decoding="async" />
            <div className="grain" aria-hidden="true" />
            <div className="signal-overlay">
              <div className="signal-alert">
                <span className="alert-icon">!</span>
                <div><small>{alertLabel} · STEP {stages[active].number} OF {String(stages.length).padStart(2, "0")}</small><strong>{alertTitle}</strong></div>
                <span className="signal-time">{stages[active].time ?? stages[0].time ?? ""}</span>
              </div>
              <div className="signal-trace" aria-hidden="true" style={{ "--trace": `${trace}%` } as React.CSSProperties}>
                <span className="signal-trace-fill" />
                {stages.map((stage, index) => <span key={stage.number} className={`signal-node${index <= active ? " is-on" : ""}`} style={{ left: `${stages.length > 1 ? (index / (stages.length - 1)) * 100 : 0}%` }} />)}
              </div>
              <ol className="stage-grid">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;
                  const state = index < active ? " is-done" : index === active ? " is-active" : "";
                  return (
                    <li key={stage.title} className={`stage-card${state}`} aria-current={index === active ? "step" : undefined}>
                      <div className="stage-head"><span>{stage.time ? `${stage.number} · ${stage.time}` : stage.number}</span><Icon size={20} strokeWidth={1.5} /></div>
                      <h3>{stage.title}</h3>
                      <p>{stage.copy}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <div className="signal-scroll-hint" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} />{hint}</div>
        </div>
      </div>
    </section>
  );
}
