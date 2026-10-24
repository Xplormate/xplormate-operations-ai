"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Tool = { brand: string; logo: string; area: string };
type ToolGroup = { id: string; label: string; tools: Tool[] };

const STEP_MS = 1900;
const SNAP_MS = 850;
const REPEATS = 4;

/**
 * Logo cards on a horizontal conveyor that steps left, one card at a time.
 * The category list on the left cycles through tool groups on its own until
 * the visitor picks one.
 */
export default function ToolConveyor({ groups }: { groups: ToolGroup[] }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [instant, setInstant] = useState(false);
  const [autoGroups, setAutoGroups] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [laps, setLaps] = useState(0);

  const group = groups[groupIndex];
  const cycle = group.tools.length;
  const track = Array.from({ length: REPEATS }, () => group.tools).flat();

  useEffect(() => {
    const still = requestAnimationFrame(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches));
    const root = rootRef.current;
    // No timers run while the conveyor is off screen.
    const observer = root ? new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting)) : null;
    if (root && observer) observer.observe(root);
    return () => {
      cancelAnimationFrame(still);
      observer?.disconnect();
    };
  }, []);

  const moving = !reduced && !paused && !hold && onScreen;

  useEffect(() => {
    if (!moving) return;
    // Three kinds of tick: a normal one-card step, a silent snap back to the
    // start once a full lap is shown (the track repeats, so nothing visibly
    // jumps), and the first step after a snap.
    if (instant) {
      const timer = window.setTimeout(() => {
        setInstant(false);
        setOffset(1);
      }, STEP_MS - SNAP_MS);
      return () => window.clearTimeout(timer);
    }
    if (offset >= cycle) {
      const timer = window.setTimeout(() => {
        setInstant(true);
        setOffset(0);
        if (autoGroups && laps + 1 >= 2) {
          setLaps(0);
          setGroupIndex((current) => (current + 1) % groups.length);
        } else {
          setLaps(laps + 1);
        }
      }, SNAP_MS);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setOffset(offset + 1), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [offset, cycle, moving, autoGroups, groups.length, instant, laps]);

  const choose = (index: number) => {
    setAutoGroups(false);
    setInstant(true);
    setOffset(0);
    setLaps(0);
    setGroupIndex(index);
  };

  const center = offset + 1;

  return (
    <div className="conveyor-layout" ref={rootRef} onPointerEnter={(event) => { if (event.pointerType === "mouse") setHold(true); }} onPointerLeave={() => setHold(false)}>
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
          <div key={group.id} className={`conveyor-track${instant ? " is-instant" : ""}`} style={{ "--offset": offset } as React.CSSProperties}>
            {track.map((tool, index) => (
              <div key={`${tool.logo}-${index}`} className={`conveyor-card${index === center ? " is-center" : ""}`}>
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
