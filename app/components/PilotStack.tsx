"use client";

import { useEffect, useRef } from "react";

type Step = { number: string; title: string; copy: string; art: "bottleneck" | "understand" | "measure" | "pilot" | "expand" };

/**
 * The five pilot steps as glass cards that tilt up into place as they scroll
 * in, each with a small animated line drawing.
 */
export default function PilotStack({ steps }: { steps: Step[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>(".pilot-card"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      cards.forEach((card) => {
        const top = card.getBoundingClientRect().top;
        const tilt = Math.min(1, Math.max(0, (top - viewport * 0.3) / (viewport * 0.62)));
        card.style.setProperty("--tilt", tilt.toFixed(3));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <ol className="pilot-stack" ref={listRef}>
      {steps.map((step) => (
        <li key={step.number} className="pilot-card">
          <span className="pilot-card-index">{step.number} · {step.title.toUpperCase()}</span>
          <div className="pilot-art" aria-hidden="true"><PilotArt kind={step.art} /></div>
          <div className="pilot-card-copy"><h3>{step.title}</h3><p>{step.copy}</p></div>
        </li>
      ))}
    </ol>
  );
}

const flowDot = (path: string, duration: number, begin: number, key: string) => (
  <circle key={key} className="flow-dot" r="2.6"><animateMotion dur={`${duration}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} /></circle>
);

function PilotArt({ kind }: { kind: Step["art"] }) {
  if (kind === "bottleneck") {
    const nodes = [40, 110, 180, 250, 320];
    return (
      <svg viewBox="0 0 400 140">
        <line className="art-line" x1="30" y1="76" x2="370" y2="76" />
        {nodes.map((x) => <circle key={x} className={x === 250 ? "art-node art-node-hot" : "art-node"} cx={x} cy="76" r="7" />)}
        <circle className="art-pulse" cx="250" cy="76" r="7" />
        {[0, 1, 2].map((i) => flowDot("M30 76 H241", 3.2, i * 1.05, `in-${i}`))}
        {flowDot("M259 76 H370", 6, 0.5, "out")}
        <text className="art-label art-label-hot" x="250" y="46" textAnchor="middle">WAITING ON A REPLY</text>
        <text className="art-label" x="40" y="112" textAnchor="middle">REPORTED</text>
        <text className="art-label" x="320" y="112" textAnchor="middle">CLOSED</text>
      </svg>
    );
  }
  if (kind === "understand") {
    const sources = [["EMAIL", 30], ["SHEET", 58], ["CALL", 86], ["ERP", 114]] as const;
    return (
      <svg viewBox="0 0 400 140">
        {sources.map(([label, y]) => (
          <g key={label}>
            <path className="art-line" d={`M78 ${y} C200 ${y} 220 72 330 72`} />
            <text className="art-label" x="30" y={y + 3}>{label}</text>
            {flowDot(`M78 ${y} C200 ${y} 220 72 330 72`, 3.6, (y / 30) * 0.7, `u-${label}`)}
          </g>
        ))}
        <rect className="art-pill" x="330" y="52" width="40" height="40" rx="20" />
        <rect className="art-scan" x="90" y="18" width="2" height="108" />
      </svg>
    );
  }
  if (kind === "measure") {
    return (
      <svg viewBox="0 0 400 140">
        <line className="art-axis" x1="40" y1="118" x2="372" y2="118" />
        <line className="art-axis" x1="40" y1="18" x2="40" y2="118" />
        <line className="art-dash" x1="40" y1="96" x2="372" y2="96" />
        <line className="art-dash art-dash-hot" x1="40" y1="42" x2="372" y2="42" />
        <text className="art-label" x="368" y="110" textAnchor="end">BASELINE</text>
        <text className="art-label art-label-hot" x="368" y="34" textAnchor="end">AGREED TARGET</text>
        <path className="art-draw" pathLength="100" d="M40 98 L90 94 L140 96 L190 78 L240 70 L290 56 L340 47 L372 44" />
      </svg>
    );
  }
  if (kind === "pilot") {
    const inputs = [42, 72, 102];
    return (
      <svg viewBox="0 0 400 140">
        {inputs.map((y) => <g key={y}><circle className="art-node" cx="60" cy={y} r="6" /><path className="art-line" d={`M66 ${y} C120 ${y} 140 72 186 72`} /></g>)}
        <rect className="art-pill art-pill-hot" x="186" y="36" width="34" height="72" rx="17" />
        <line className="art-line" x1="220" y1="72" x2="334" y2="72" />
        <circle className="art-node art-node-hot" cx="340" cy="72" r="7" />
        {inputs.map((y, i) => flowDot(`M66 ${y} C120 ${y} 140 72 186 72`, 2.8, i * 0.9, `p-${y}`))}
        {flowDot("M220 72 H334", 2.2, 0.4, "p-out")}
        <text className="art-label" x="203" y="128" textAnchor="middle">AI PREPARES · PEOPLE APPROVE</text>
      </svg>
    );
  }
  const branches = [[110, 30], [90, 72], [110, 114], [300, 30], [320, 72], [300, 114]];
  return (
    <svg viewBox="0 0 400 140">
      {branches.map(([x, y], i) => (
        <g key={`${x}-${y}`} style={{ "--i": i } as React.CSSProperties}>
          <line className="art-grow" pathLength="100" x1="200" y1="72" x2={x} y2={y} />
          <circle className="art-node art-node-late" cx={x} cy={y} r="6" />
        </g>
      ))}
      <circle className="art-node art-node-hot" cx="200" cy="72" r="9" />
      <circle className="art-pulse" cx="200" cy="72" r="9" />
      <text className="art-label art-label-hot" x="200" y="104" textAnchor="middle">PROVEN</text>
    </svg>
  );
}
