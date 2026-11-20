"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { track } from "@vercel/analytics";
import { ArrowRight, ArrowUp, ArrowUpRight, ChartColumn, Check, ChevronDown, CircleAlert, Database, Lock, Mail, Menu, Repeat, ScrollText, ShieldCheck, UserCheck, Users, Wrench, X } from "lucide-react";
import AgentPanel from "./components/AgentPanel";
import AreaCarousel, { type Area } from "./components/AreaCarousel";
import DotField from "./components/DotField";
import HeroSequence, { type HeroSlide } from "./components/HeroSequence";
import OperatingLoop from "./components/OperatingLoop";
import RotatingWord from "./components/RotatingWord";
import StickyCta from "./components/StickyCta";
import ToolConveyor, { type ToolGroup } from "./components/ToolConveyor";

const linkedinProfile = "https://www.linkedin.com/in/jeetendra-yadav-4363457a/";
const businessEmail = "jeetendra@xplormate.com";
const year = new Date().getFullYear();

const heroSlides: HeroSlide[] = [
  { label: "Fabrication", image: "/media/hero-weld.webp", video: "/media/hero-weld.mp4", alt: "Welder at work, sparks lighting a dark fabrication bay" },
  { label: "Assembly", image: "/media/hero-assembly.webp", video: "/media/hero-assembly.mp4", alt: "Robot arm working on an automated assembly line" },
  { label: "Materials", image: "/media/hero-materials.webp", video: "/media/hero-materials.mp4", alt: "Forklift moving through warehouse racking" },
  { label: "Maintenance", image: "/media/hero-maintenance.webp", video: "/media/hero-maintenance.mp4", alt: "Cutting head moving over a metal sheet" },
  { label: "Handover", image: "/media/hero-handover.webp", video: "/media/hero-handover.mp4", alt: "Shift team huddle on the warehouse floor, seen from above" },
  { label: "Planning", image: "/media/hero-planning.webp", video: "/media/hero-planning.mp4", alt: "Operator pressing buttons on a lit machine control panel" },
];

// Where agents help. In the carousel: friction = what it watches, ai = what it handles on its own, human = what waits for approval.
const agents: Area[] = [
  { id: "quality", label: "Quality", index: "01", icon: ShieldCheck, image: "/media/area-quality.webp", code: "NCR-0418\nCAPA · OPEN\nEVIDENCE 2/3", title: "CAPA agent", friction: "NCRs, CAPAs and audit findings in your quality system.", ai: "Assigns owners, collects evidence, reminds before due dates and flags overdue items ahead of audits.", human: "Closing a CAPA, and deciding what happens to held material.", measure: "Time from issue to verified closure", question: "Where are issues, actions and evidence recorded today?" },
  { id: "maintenance", label: "Maintenance", index: "02", icon: Wrench, image: "/media/area-maintenance.webp", code: "WR-2291\nPRIORITY · B\nSPARES ✓", title: "Breakdown agent", friction: "Breakdowns and work orders in your maintenance system.", ai: "Updates work orders, checks spares, escalates when response time is missed, and tells planning which orders are at risk.", human: "Taking a machine down or buying spares.", measure: "Open-request age and repeat follow-ups", question: "How does a breakdown move from report to confirmed fix?" },
  { id: "handovers", label: "Shift handover", index: "03", icon: Repeat, image: "/media/area-handovers.webp", code: "SHIFT B → C\nOPEN ITEMS · 5\nACK 3/5", title: "Handover agent", friction: "Shift logs and open issues.", ai: "Builds the handover, carries open items to the next shift with owners, and asks for acknowledgement.", human: "Marking an issue closed.", measure: "Open items missed or explained twice", question: "How is acknowledgement captured between shifts today?" },
  { id: "reporting", label: "Morning review", index: "04", icon: ChartColumn, image: "/media/area-reporting.webp", code: "DAILY · 07:30\nEXCEPTIONS · 3\nACTIONS · 7", title: "Morning review agent", friction: "Plan versus actual, downtime, quality and dispatch.", ai: "Prepares the morning review with exceptions and owners, and tracks every action point until it’s closed.", human: "Anything sent outside the plant.", measure: "Preparation time and open action points", question: "Which morning report takes the most manual work?" },
];

// Sample agent run for the example section.
const agentRun = [
  { number: "01", time: "14:32", title: "Shortage spotted", copy: "The agent sees a raw-material shortage in the ERP against tomorrow’s plan for Line 2.", icon: CircleAlert },
  { number: "02", time: "14:33", title: "Facts checked", copy: "It checks stock at another store and open POs. One PO is two days late.", icon: Database },
  { number: "03", time: "14:35", title: "Owners asked", copy: "It flags three affected orders, proposes a new run order for Line 2, and asks the buyer to confirm the supplier date by 17:00.", icon: Users },
  { number: "04", time: "15:10", title: "Planner approves", copy: "The planner approves the new sequence. The agent updates every owner.", icon: UserCheck },
  { number: "05", time: "17:00", title: "Closed and logged", copy: "The buyer confirms the supplier date and closes the issue. The agent logs every step.", icon: Check },
];

// Examples of systems plants run on, shown by category. Not partners or customers.
const systemGroups: ToolGroup[] = [
  { id: "erp", label: "ERP & planning", tools: [{ brand: "SAP", logo: "sap", area: "ERP / orders" }, { brand: "Oracle", area: "ERP / supply" }, { brand: "Microsoft Dynamics", area: "ERP / finance" }, { brand: "Tally", area: "Stock / accounts" }, { brand: "Odoo", logo: "odoo", area: "Materials / dispatch" }] },
  { id: "production", label: "Production & shop floor", tools: [{ brand: "Siemens", logo: "siemens", area: "MES / shop floor" }, { brand: "Rockwell Automation", logo: "rockwellautomation", area: "PLCs / line data" }, { brand: "ABB", logo: "abb", area: "Drives / robots" }] },
  { id: "quality", label: "Quality & maintenance", tools: [{ brand: "SAP", logo: "sap", area: "Quality / maintenance" }, { brand: "Google Forms", logo: "googleforms", area: "Inspections" }, { brand: "Jira", logo: "jira", area: "Work requests" }] },
  { id: "everyday", label: "Everyday work", tools: [{ brand: "Gmail", logo: "gmail", area: "Email" }, { brand: "Google Sheets", logo: "googlesheets", area: "Trackers" }, { brand: "Excel", area: "Plans" }, { brand: "Looker", logo: "looker", area: "Reports" }] },
];

const controls = [
  { icon: UserCheck, title: "People approve critical steps", copy: "Anything that changes the plan or a record, or leaves the plant, waits for a person." },
  { icon: ScrollText, title: "Every action recorded", copy: "Each action the agent takes is logged with who approved it." },
  { icon: Lock, title: "Read-only first", copy: "The agent starts by reading. Access begins only after your IT team’s security review, and you can remove it any time." },
  { icon: Database, title: "Your data stays yours", copy: "Used only for your plant’s work. Hosting is agreed with you, in India if you need it." },
];

const pilotPath = [
  { when: "1 week", title: "Map", copy: "We map the workflow with the people who run it, using last month’s real cases." },
  { when: "3 weeks", title: "Run", copy: "The agent runs that workflow on your systems, in daily use by your team." },
  { when: "3 months", title: "Expand", copy: "If it works, agents take on more workflows across your plant on the same connections. If not, we stop." },
];

const faq = [
  ["Will this replace my people?", "No. It takes the routine follow-up off them."],
  ["Have you done this before?", "We’re early. Your pilot would be one of our first, which is why it has a fixed scope and a fixed fee."],
  ["Who will we work with?", "The person who scopes your pilot builds it, and stays with it to the end of the pilot."],
  ["What do you need from us?", "One person who owns the workflow, access to the systems it touches and an hour a week."],
  ["What does a pilot cost?", "It depends on the workflow and systems involved. We agree a fixed fee before we start."],
  ["What if it won’t help?", "We’ll tell you on the first call."],
];

export default function Home() {
  // First hero frame: fetch it early so the hero is never empty.
  preload("/media/hero-weld.webp", { as: "image", fetchPriority: "high" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadFieldErrors, setLeadFieldErrors] = useState<Record<string, string>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  // When the form became usable; the server ignores submissions sent implausibly fast (bots).
  const formReadyAt = useRef(0);

  useEffect(() => {
    formReadyAt.current = Date.now();
  }, [leadSubmitted]);

  // After sending, move focus to the confirmation so it is read out.
  useEffect(() => {
    if (leadSubmitted) successRef.current?.focus();
  }, [leadSubmitted]);

  // Header switches from dark glass (over the hero) to light glass once the hero is behind us.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    const first = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Fade sections in as they arrive. Content stays visible if JS never runs.
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    // Anything already on screen stays put; only content further down fades in.
    targets.forEach((target) => {
      if (target.getBoundingClientRect().top < window.innerHeight) target.classList.add("is-visible");
    });
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const values = { ...Object.fromEntries(new FormData(form).entries()), elapsed: formReadyAt.current ? Date.now() - formReadyAt.current : undefined };
    setLeadSubmitting(true);
    setLeadError("");
    setLeadFieldErrors({});

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json() as { message?: string; fields?: Record<string, string>; lead?: { name: string; email: string; company: string; role: string } };

      if (!response.ok || !payload.lead) {
        setLeadError(payload.message ?? "Please check the required details.");
        setLeadFieldErrors(payload.fields ?? {});
        return;
      }

      setLeadSubmitted(true);
      track("lead_submitted");
      form.reset();
    } catch {
      setLeadError("We could not send your details right now. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const closeNav = () => setNavOpen(false);

  return <main id="top">
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}><div className="header-inner">
      <a className="wordmark" href="#top" aria-label="Xplormate home"><img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" /><span>Xplormate<span className="brand-dot">.</span></span></a>
      <nav className={`site-nav${navOpen ? " is-open" : ""}`} id="site-navigation" aria-label="Main navigation"><a href="#example" onClick={closeNav}>Example</a><a href="#agents" onClick={closeNav}>Where agents help</a><a href="#pilot" onClick={closeNav}>Pilot</a><a href="#questions" onClick={closeNav}>FAQ</a></nav>
      <div className="header-actions">
        <a className="header-cta" href="#contact" onClick={closeNav}>Book a 30-minute call <ArrowUpRight size={16} /></a>
        <button className="mobile-nav-toggle" type="button" aria-label={navOpen ? "Close navigation" : "Open navigation"} aria-expanded={navOpen} aria-controls="site-navigation" onClick={() => setNavOpen((open) => !open)}>{navOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div></header>

    <section className="hero">
      <div className="hero-frame">
        <HeroSequence slides={heroSlides} />
        <div className="hero-shade" />
        <DotField className="hero-dots" color="255,206,128" gap={15} density={0.26} />
        <div className="grain" aria-hidden="true" />
        <AgentPanel />
        <div className="hero-content shell">
          <div className="hero-kicker"><span className="signal-pulse" /> FOR PLANT HEADS, COOs AND MDs</div>
          <h1>AI agents for <em>manufacturing</em> operations.</h1>
          <div className="hero-actions">
            <p>Your team makes the decisions. Agents follow up on <RotatingWord words={["shortages", "breakdowns", "quality issues", "shift handovers"]} suffix="." /></p>
            <div className="hero-buttons"><a className="button button-amber" href="#contact">Book a 30-minute call <ArrowRight size={18} /></a><a className="button button-ghost" href="#example">See an example</a></div>
          </div>
        </div>
      </div>
    </section>

    <section className="manifesto"><div className="shell">
      <p data-reveal>Your systems already record the problem. Closing it still runs on <span>calls, reminders</span> and the morning meeting.</p>
    </div></section>

    <span id="example" className="anchor-target" aria-hidden="true" />
    <OperatingLoop stages={agentRun} alertLabel="SAMPLE DATA · MATERIALS" alertTitle="Raw material short for Line 2 tomorrow" hint="SCROLL TO FOLLOW THE AGENT">
      <div className="section-topline"><span>01 / EXAMPLE</span><span>ONE ISSUE, START TO FINISH</span></div>
      <div className="section-heading split-heading signal-heading"><h2>One shortage.<br /><span className="dim">Handled before the next shift.</span></h2><p>How an agent would handle a material shortage, step by step.</p></div>
    </OperatingLoop>

    <section className="explorer" id="agents"><div className="shell">
      <div className="section-topline" data-reveal><span>02 / WHERE AGENTS HELP</span><span>PICK AN AREA</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Four more places<br /><span className="dim">a pilot could start.</span></h2><p>Pick an area to see what its agent would watch, handle and leave to your team.</p></div>
      <div data-reveal><AreaCarousel areas={agents} /></div>
    </div></section>

    <section className="transformation" id="systems"><div className="shell">
      <div className="section-topline" data-reveal><span>03 / YOUR SYSTEMS</span><span>NOTHING REPLACED</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Works on what you already run.<br /><span className="dim">You stay in control.</span></h2><p>Your ERP, MES, quality and maintenance systems stay the record. An agent connects only to what its workflow needs.</p></div>
      <div className="systems-map bracketed" data-reveal>
        <ToolConveyor groups={systemGroups} eyebrow="EXAMPLE SYSTEMS" title="Systems an agent could read from." note="Not partners or customers." />
      </div>
      <ul className="security-grid" data-reveal>
        {controls.map((item) => {
          const Icon = item.icon;
          return <li key={item.title}><span className="security-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span><h3>{item.title}</h3><p>{item.copy}</p></li>;
        })}
      </ul>
    </div></section>

    <section className="approach" id="pilot"><div className="shell">
      <div className="approach-panel">
        <div className="approach-glow" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="approach-head" data-reveal>
          <span className="approach-eyebrow">04 / HOW A PILOT RUNS</span>
          <h2>Pick one workflow.<br /><span>See if it works.</span></h2>
          <p>A small paid pilot at one plant, measured against your own records.</p>
        </div>
        <ol className="pilot-path" data-reveal>
          {pilotPath.map((step, index) => (
            <li key={step.title} style={{ "--i": index } as React.CSSProperties}>
              <span className="pilot-path-node" aria-hidden="true" />
              <span className="pilot-path-when">{step.when}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
        <p className="pilot-path-note" data-reveal>Timings depend on when system access is ready.</p>
      </div>
    </div></section>

    <section className="faq" id="questions"><div className="shell faq-grid"><div className="faq-intro" data-reveal><div className="section-topline"><span>05 / QUESTIONS</span></div><h2>Before we talk.</h2></div><div className="faq-items" data-reveal>{faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="contact" id="contact">
      <div className="contact-frame">
        <div className="contact-glow" aria-hidden="true" />
        <DotField className="contact-dots" color="255,206,128" gap={15} density={0.24} />
        <div className="grain" aria-hidden="true" />
        <div className="shell contact-grid">
          <div>
            <div className="section-topline"><span>06 / CONTACT</span></div>
            <h2>Tell us where work <em>gets stuck in your plant.</em></h2>
          </div>
          <div className="contact-content">
            {!leadSubmitted ? (
              <form className="lead-form" onSubmit={handleLeadSubmit}>
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="lead-hp">Leave this field empty<input id="lead-hp" name="hp_extra" type="text" tabIndex={-1} autoComplete="off" /></label>
                </div>
                <div className="lead-form-grid">
                  <label className={leadFieldErrors.name ? "has-error" : undefined} htmlFor="lead-name">
                    <span>Name <i className="required-mark" aria-hidden="true">*</i></span>
                    <input id="lead-name" name="name" type="text" autoComplete="name" required aria-required="true" maxLength={120} aria-invalid={Boolean(leadFieldErrors.name)} aria-describedby={leadFieldErrors.name ? "lead-name-error" : undefined} />
                    {leadFieldErrors.name ? <small className="field-error" id="lead-name-error">{leadFieldErrors.name}</small> : null}
                  </label>
                  <label className={leadFieldErrors.email ? "has-error" : undefined} htmlFor="lead-email">
                    <span>Email <i className="required-mark" aria-hidden="true">*</i></span>
                    <input id="lead-email" name="email" type="email" autoComplete="email" required aria-required="true" maxLength={254} aria-invalid={Boolean(leadFieldErrors.email)} aria-describedby={leadFieldErrors.email ? "lead-email-error" : undefined} />
                    {leadFieldErrors.email ? <small className="field-error" id="lead-email-error">{leadFieldErrors.email}</small> : null}
                  </label>
                  <label className={leadFieldErrors.company ? "has-error" : undefined} htmlFor="lead-company">
                    <span>Company <i className="required-mark" aria-hidden="true">*</i></span>
                    <input id="lead-company" name="company" type="text" autoComplete="organization" required aria-required="true" maxLength={160} aria-invalid={Boolean(leadFieldErrors.company)} aria-describedby={leadFieldErrors.company ? "lead-company-error" : undefined} />
                    {leadFieldErrors.company ? <small className="field-error" id="lead-company-error">{leadFieldErrors.company}</small> : null}
                  </label>
                  <label className={leadFieldErrors.role ? "has-error" : undefined} htmlFor="lead-role">
                    <span>Role <i className="required-mark" aria-hidden="true">*</i></span>
                    <input id="lead-role" name="role" type="text" autoComplete="organization-title" required aria-required="true" maxLength={120} aria-invalid={Boolean(leadFieldErrors.role)} aria-describedby={leadFieldErrors.role ? "lead-role-error" : undefined} />
                    {leadFieldErrors.role ? <small className="field-error" id="lead-role-error">{leadFieldErrors.role}</small> : null}
                  </label>
                  <label className={`field-wide${leadFieldErrors.challenge ? " has-error" : ""}`} htmlFor="lead-challenge">
                    <span>Which workflow should we look at first? <i className="optional-mark">optional</i></span>
                    <textarea id="lead-challenge" name="challenge" rows={4} maxLength={2000} placeholder="e.g. Every morning our planner checks the ERP and calls suppliers to find which orders are short on material." aria-invalid={Boolean(leadFieldErrors.challenge)} aria-describedby={leadFieldErrors.challenge ? "lead-challenge-error" : undefined} />
                    {leadFieldErrors.challenge ? <small className="field-error" id="lead-challenge-error">{leadFieldErrors.challenge}</small> : null}
                  </label>
                </div>
                {leadError ? <p className="form-error" role="alert">{leadError}</p> : null}
                <button className="button button-amber" type="submit" disabled={leadSubmitting} aria-busy={leadSubmitting}>
                  {leadSubmitting ? "Sending…" : "Request a call"} <ArrowUpRight size={20} />
                </button>
                <small className="form-note">We use your details only to reply.</small>
              </form>
            ) : (
              <div className="lead-success" ref={successRef} tabIndex={-1} role="status">
                <p>Thanks. We’ll email you to fix a time for the 30-minute call.</p>
                <button className="text-button" type="button" onClick={() => { setLeadSubmitted(false); setLeadError(""); setLeadFieldErrors({}); }}>Send another enquiry</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    <StickyCta />

    <footer className="site-footer"><div className="shell">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="wordmark"><img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" /><span>Xplormate<span className="brand-dot">.</span></span></span>
          <address className="footer-address">BTM 2nd Stage, Bengaluru 560076</address>
        </div>
        <nav className="footer-col" aria-label="Contact"><h2>Contact</h2><a href={`mailto:${businessEmail}`}><Mail size={15} /> Email</a><a href={linkedinProfile} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} /></a></nav>
        <nav className="footer-col" aria-label="Legal"><h2>Legal</h2><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
      </div>
      <div className="footer-mark" aria-hidden="true" data-reveal>Xplormate<span>.</span></div>
      <div className="footer-bar bracketed"><span suppressHydrationWarning>© {year} XPLORMATE</span><a href="#top" className="footer-top-link">BACK TO TOP <ArrowUp size={13} /></a></div>
    </div></footer>
  </main>;
}
