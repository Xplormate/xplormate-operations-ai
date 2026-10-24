"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { useScrollProgress } from "./useScrollProgress";

type Stage = { number: string; title: string; copy: string; icon: LucideIcon };

/**
 * The material-shortage story, told one step at a time. The section pins while
 * the visitor scrolls; each step lights up in turn and the amber trace draws
 * itself to it. On phones (and for reduced motion) every step is simply shown.
 */
export default function OperatingLoop({ stages, children }: { stages: Stage[]; children: React.ReactNode }) {
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
            <img src="/operational-signal.webp" alt="Close-up of industrial machinery and an active sensor" loading="lazy" decoding="async" />
            <div className="grain" aria-hidden="true" />
            <div className="signal-overlay">
              <div className="signal-alert">
                <span className="alert-icon">!</span>
                <div><small>NEW ISSUE · STEP {stages[active].number} OF {String(stages.length).padStart(2, "0")}</small><strong>Material shortage before next shift</strong></div>
                <span className="signal-time">14:32</span>
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
                      <div className="stage-head"><span>{stage.number}</span><Icon size={20} strokeWidth={1.5} /></div>
                      <h3>{stage.title}</h3>
                      <p>{stage.copy}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <div className="signal-scroll-hint" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} />SCROLL TO FOLLOW THE ISSUE</div>
        </div>
      </div>
    </section>
  );
}
