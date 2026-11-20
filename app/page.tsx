"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { track } from "@vercel/analytics";
import { ArrowRight, ArrowUpRight, ChartColumn, Check, ChevronDown, CircleAlert, Database, Factory, KeyRound, Lock, Mail, MapPin, Menu, Package, Repeat, ScrollText, Server, ShieldCheck, UserCheck, Users, Workflow, Wrench, X } from "lucide-react";
import AgentPanel from "./components/AgentPanel";
import AreaCarousel, { type Area } from "./components/AreaCarousel";
import Capabilities from "./components/Capabilities";
import DotField from "./components/DotField";
import HeroSequence, { type HeroSlide } from "./components/HeroSequence";
import OperatingLoop from "./components/OperatingLoop";
import PilotStack from "./components/PilotStack";
import PinnedStatement from "./components/PinnedStatement";
import RotatingWord from "./components/RotatingWord";
import ToolConveyor, { type ToolGroup } from "./components/ToolConveyor";

const linkedinProfile = "https://www.linkedin.com/in/jeetendra-yadav-4363457a/";
const businessEmail = "jeetendra@xplormate.com";

// Readouts are sample data: they show what an agent would track in each scene, not real plant data.
const heroSlides: HeroSlide[] = [
  { label: "Fabrication", image: "/media/hero-weld.webp", video: "/media/hero-weld.mp4", alt: "Welder at work, sparks lighting a dark fabrication bay", readouts: [{ text: "AGENT · MATERIAL READINESS" }, { text: "BRACKET B-118 · STEEL SHORT", alert: true }, { text: "BUYER ASKED · DUE 17:00" }] },
  { label: "Assembly", image: "/media/hero-assembly.webp", video: "/media/hero-assembly.mp4", alt: "Robot arm working on an automated assembly line", readouts: [{ text: "LINE 3 · PLAN VS ACTUAL −6%", alert: true }, { text: "AGENT · DAILY OPS REVIEW" }, { text: "SHIFT LEAD · ASKED FOR REASON" }] },
  { label: "Materials", image: "/media/hero-materials.webp", video: "/media/hero-materials.mp4", alt: "Forklift moving through warehouse racking", readouts: [{ text: "BIN A-14 · 40 PCS SHORT", alert: true }, { text: "ORDERS AT RISK · 3" }, { text: "WAITING · PLANNER APPROVAL" }] },
  { label: "Maintenance", image: "/media/hero-maintenance.webp", video: "/media/hero-maintenance.mp4", alt: "Cutting head moving over a metal sheet", readouts: [{ text: "CUTTER 2 · NOZZLE WEAR", alert: true }, { text: "WORK ORDER · UPDATED 09:40" }, { text: "SPARES · CHECKED, IN STOCK" }] },
  { label: "Handover", image: "/media/hero-handover.webp", video: "/media/hero-handover.mp4", alt: "Shift team huddle on the warehouse floor, seen from above", readouts: [{ text: "SHIFT B → C · 5 OPEN ITEMS", alert: true }, { text: "ACKNOWLEDGED · 3 OF 5" }, { text: "AGENT · CHASING 2 OWNERS" }] },
  { label: "Planning", image: "/media/hero-planning.webp", video: "/media/hero-planning.mp4", alt: "Operator pressing buttons on a lit machine control panel", readouts: [{ text: "DAILY REVIEW · 3 EXCEPTIONS", alert: true }, { text: "ACTION POINTS · 7 OPEN" }, { text: "AGENT · OWNERS REMINDED" }] },
];

// Areas where agents help. In the carousel: friction = what it watches, ai = what it handles on its own, human = what waits for approval.
const agents: Area[] = [
  { id: "materials", label: "Materials", index: "01", icon: Package, image: "/media/area-materials.webp", code: "PO-7713\nETA · +2 DAYS\nORDERS · 3", title: "Material readiness", friction: "Production plan, stock, open POs and receipts in your ERP.", ai: "Flags shortages for the next 24–48 hours, checks other stores and PO dates, and tells the buyer and planner which orders are affected.", human: "Changing the plan or placing an emergency purchase.", measure: "Time from shortage to an owned action", question: "Which orders were short on material last month, and how did you find out?" },
  { id: "quality", label: "Quality", index: "02", icon: ShieldCheck, image: "/media/area-quality.webp", code: "NCR-0418\nCAPA · OPEN\nEVIDENCE 2/3", title: "Quality issues and CAPA", friction: "NCRs, CAPAs and audit findings in your quality system.", ai: "Assigns owners, collects evidence, reminds before due dates and flags overdue items ahead of audits.", human: "Closing a CAPA, and deciding what happens to held material.", measure: "Time from issue to verified closure", question: "Where are issues, actions and evidence recorded today?" },
  { id: "maintenance", label: "Maintenance", index: "03", icon: Wrench, image: "/media/area-maintenance.webp", code: "WR-2291\nPRIORITY · B\nSPARES ✓", title: "Maintenance escalation", friction: "Breakdowns and work orders in your maintenance system.", ai: "Updates work orders, checks spares, escalates when response time is missed, and tells planning which orders are at risk.", human: "Taking a machine down or buying spares.", measure: "Open-request age and repeat follow-ups", question: "How does a breakdown move from report to confirmed fix?" },
  { id: "handovers", label: "Shift handover", index: "04", icon: Repeat, image: "/media/area-handovers.webp", code: "SHIFT B → C\nOPEN ITEMS · 5\nACK 3/5", title: "Shift handover", friction: "Shift logs, open issues, and plan versus actual.", ai: "Builds the handover, carries open items to the next shift with owners, and asks for acknowledgement.", human: "Marking an issue closed.", measure: "Open items missed or explained twice", question: "How is acknowledgement captured between shifts today?" },
  { id: "reporting", label: "Daily review", index: "05", icon: ChartColumn, image: "/media/area-reporting.webp", code: "DAILY · 07:30\nEXCEPTIONS · 3\nACTIONS · 7", title: "Daily operations review", friction: "Plan versus actual, downtime, quality and dispatch.", ai: "Prepares the morning review with exceptions and owners, and tracks every action point until it’s closed.", human: "Anything sent outside the plant.", measure: "Preparation time and open action points", question: "Which morning report takes the most manual work?" },
];

// Sample agent run for the example section.
const agentRun = [
  { number: "01", time: "14:32", title: "Shortage spotted", copy: "The agent sees a raw-material shortage in the ERP against tomorrow’s plan for Line 2.", icon: CircleAlert },
  { number: "02", time: "14:33", title: "Facts checked", copy: "It checks stock at the second store and open POs. One PO is two days late.", icon: Database },
  { number: "03", time: "14:35", title: "Owners asked", copy: "It flags three affected orders, proposes the next order for Line 2, and asks the buyer to confirm the supplier date by 17:00.", icon: Users },
  { number: "04", time: "15:10", title: "Planner approves", copy: "The planner approves the new sequence. The agent updates every owner.", icon: UserCheck },
  { number: "05", time: "17:00", title: "Closed and logged", copy: "The supplier date is confirmed. The agent closes the issue and logs every step with who approved it.", icon: Check },
];

const capabilities = [
  { icon: Workflow, copy: "Follows one workflow end to end across planning, production, quality and stores." },
  { icon: Database, copy: "Reads your ERP, MES, quality and maintenance records, plus email and sheets." },
  { icon: CircleAlert, copy: "Spots shortages, breakdowns and quality issues before they hold up a shift." },
  { icon: Factory, copy: "Extends to more lines and plants once a pilot shows it works." },
  { icon: UserCheck, copy: "Leaves every decision that matters to your team." },
];

// Examples of systems plants run on, shown on the animated conveyor. Not partners or customers.
const systemGroups: ToolGroup[] = [
  { id: "erp", label: "ERP & planning", tools: [{ brand: "SAP", logo: "sap", area: "ERP / orders" }, { brand: "Oracle", area: "ERP / supply" }, { brand: "Microsoft Dynamics", area: "ERP / finance" }, { brand: "Tally", area: "Stock / accounts" }, { brand: "Odoo", logo: "odoo", area: "Materials / dispatch" }] },
  { id: "production", label: "Production & shop floor", tools: [{ brand: "Siemens", logo: "siemens", area: "MES / shop floor" }, { brand: "Rockwell Automation", logo: "rockwellautomation", area: "Line data" }, { brand: "ABB", logo: "abb", area: "Line data" }] },
  { id: "quality", label: "Quality & maintenance", tools: [{ brand: "SAP", logo: "sap", area: "Quality / maintenance" }, { brand: "Google Forms", logo: "googleforms", area: "Inspections" }, { brand: "Jira", logo: "jira", area: "Work requests" }] },
  { id: "everyday", label: "Everyday work", tools: [{ brand: "Gmail", logo: "gmail", area: "Email" }, { brand: "Google Sheets", logo: "googlesheets", area: "Trackers" }, { brand: "Excel", area: "Plans / trackers" }, { brand: "Looker", logo: "looker", area: "Reports" }] },
];

const controls = [
  { icon: UserCheck, title: "People approve critical steps", copy: "Anything that changes the plan, a record or leaves the plant waits for a person." },
  { icon: ScrollText, title: "Every step is logged", copy: "Each action the agent takes is recorded, with who approved it." },
  { icon: Lock, title: "Read-only to start", copy: "The agent starts by reading. Write access comes later, only where you agree." },
  { icon: KeyRound, title: "Access agreed up front", copy: "Nothing connects before you sign off, and you can remove access any time." },
  { icon: Database, title: "Your data, your work only", copy: "It is used only for your plant’s work." },
  { icon: Server, title: "Hosted in India", copy: "The agent and its data run in an India cloud region." },
];

const pilotSteps = [
  { number: "01", art: "understand" as const, title: "Map the real work", copy: "We walk through last month’s cases with the people who run the workflow, and set the baseline from your own records." },
  { number: "02", art: "pilot" as const, title: "Run it on your data", copy: "One agent, one workflow, one plant. Read-only first, with your team approving what matters." },
  { number: "03", art: "measure" as const, title: "Use it every day", copy: "If the numbers move, the agent becomes part of daily work." },
  { number: "04", art: "expand" as const, title: "Choose what’s next", copy: "The next workflow or the next plant, as a separate decision based on what the pilot showed." },
];

const principles = [
  { title: "One workflow done properly", copy: "We finish one well before starting the next." },
  { title: "Accountable for what we build", copy: "We stay with the agent we build until it works in your plant." },
  { title: "Numbers as they are", copy: "We report results as they are, good or bad." },
];

const faq = [
  ["Will this replace my people?", "No. The agent handles the routine steps. Your people decide and approve."],
  ["Which systems can it work with?", "The ones your chosen workflow uses. We confirm access on the first call."],
  ["What do you need from us?", "One person who owns the workflow, access to the systems it touches, and an hour a week."],
  ["What does a pilot cost?", "It depends on the workflow and systems involved. We agree a fixed fee before we start."],
  ["What happens after the pilot?", "You decide: stop, extend it, or add the next workflow, based on the numbers."],
  ["What if it won’t help?", "We’ll tell you after the first call."],
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
      setLeadError("We could not check those details right now. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const closeNav = () => setNavOpen(false);

  return <main id="top">
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}><div className="header-inner">
      <a className="wordmark" href="#top" aria-label="Xplormate home"><img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" /><span>Xplormate<span className="brand-dot">.</span></span></a>
      <nav className={`site-nav${navOpen ? " is-open" : ""}`} id="site-navigation" aria-label="Main navigation"><a href="#what-it-does" onClick={closeNav}>What agents do</a><a href="#example" onClick={closeNav}>Example</a><a href="#security" onClick={closeNav}>Security</a><a href="#pilot" onClick={closeNav}>Pilot</a></nav>
      <div className="header-actions">
        <a className="header-cta" href="#contact" onClick={closeNav}>Book a call <ArrowUpRight size={16} /></a>
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
          <div className="hero-kicker"><span className="signal-pulse" /> BUILT ON SITE WITH PLANT TEAMS</div>
          <h1>AI agents for <em>manufacturing</em> operations.</h1>
          <div className="hero-actions">
            <p>Agents that work on top of your ERP, MES, quality and maintenance systems. They handle the routine work across production, quality, maintenance and materials, and bring in your team for the decisions that matter.</p>
            <div className="hero-buttons"><a className="button button-amber" href="#contact">Book a 30-minute call <ArrowRight size={18} /></a><a className="button button-ghost" href="#example">See an example</a></div>
          </div>
          <div className="hero-meta"><span>PRODUCTION · QUALITY · MAINTENANCE · MATERIALS</span><span>SAMPLE DATA</span></div>
        </div>
      </div>
    </section>

    <section className="glow-intro"><div className="shell">
      <div className="glow-card" data-reveal>
        <div className="glow-card-light" aria-hidden="true" />
        <DotField className="glow-card-dots" color="255,214,150" gap={16} density={0.22} />
        <div className="grain" aria-hidden="true" />
        <div className="glow-card-content">
          <h2>Less time following up on <RotatingWord words={["shortages", "breakdowns", "quality issues", "handovers", "daily reviews"]} /></h2>
          <p>One workflow at a time, with your team in charge.</p>
          <a className="button button-cream" href="#what-it-does">See what agents can do <ArrowRight size={17} /></a>
        </div>
      </div>
    </div></section>

    <section className="capability-section" id="what-it-does"><div className="shell">
      <div className="section-topline" data-reveal><span>01 / WHAT AGENTS CAN DO</span><span>MANUFACTURING OPERATIONS</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Keep material, machines and quality<br /><span className="dim">moving on time.</span></h2><p>Agents connect the systems your plant already runs and handle the routine steps between them.</p></div>
      <Capabilities items={capabilities} />
    </div></section>

    <PinnedStatement text="Updates sit in one system. The action needs three people. The follow-up runs on calls and reminders outside any system, so issues close late and nobody sees why until the review." />

    <section className="transformation" id="systems"><div className="shell">
      <div className="section-topline" data-reveal><span>02 / YOUR SYSTEMS</span><span>NOTHING REPLACED</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Works on top of<br /><span className="dim">what you already run.</span></h2><p>Your ERP, MES, quality and maintenance systems stay the record. An agent connects only to the few sources one workflow needs.</p></div>
      <div className="systems-map bracketed" data-reveal>
        <ToolConveyor groups={systemGroups} eyebrow="EXAMPLE SYSTEMS" title="The tools plants already run on." note="Examples only. Not partners or customers." />
      </div>
    </div></section>

    <span id="example" className="anchor-target" aria-hidden="true" />
    <OperatingLoop stages={agentRun} alertLabel="SAMPLE DATA · MATERIALS" alertTitle="Raw material short for Line 2 tomorrow" hint="SCROLL TO FOLLOW THE AGENT">
      <div className="section-topline"><span>03 / EXAMPLE</span><span>ONE ISSUE, START TO FINISH</span></div>
      <div className="section-heading split-heading signal-heading"><h2>One shortage.<br /><span className="dim">Handled before the next shift.</span></h2><p>How an agent would handle a material shortage, step by step. The planner approves the change.</p></div>
    </OperatingLoop>

    <section className="explorer" id="agents"><div className="shell">
      <div className="section-topline" data-reveal><span>04 / WHERE AGENTS HELP</span><span>PICK AN AREA</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Where agents<br /><span className="dim">can help first.</span></h2><p>Pick an area to see what an agent would watch, what it would handle on its own, and what would wait for your team.</p></div>
      <div data-reveal><AreaCarousel areas={agents} /></div>
    </div></section>

    <section className="security" id="security"><div className="shell">
      <div className="section-topline" data-reveal><span>05 / SECURITY AND CONTROL</span><span>NO SURPRISES</span></div>
      <div className="section-heading split-heading" data-reveal><h2>You stay<br /><span className="dim">in control.</span></h2><p>An agent only does what your team has agreed it can do. Everything else waits for a person.</p></div>
      <ul className="security-grid" data-reveal>
        {controls.map((item) => {
          const Icon = item.icon;
          return <li key={item.title}><span className="security-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span><h3>{item.title}</h3><p>{item.copy}</p></li>;
        })}
      </ul>
      <p className="security-cta" data-reveal>IT team? <a href="#contact">Book a security call <ArrowUpRight size={15} /></a></p>
    </div></section>

    <section className="approach" id="pilot"><div className="shell">
      <div className="approach-panel">
        <div className="approach-glow" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="approach-head" data-reveal>
          <span className="approach-eyebrow">06 / HOW A PILOT RUNS</span>
          <h2>Pick one workflow.<br /><span>See if it works.</span></h2>
          <p>A small paid pilot on one workflow at one plant, measured against your own records. A fixed fee in rupees, agreed before we start. Planned for 4–8 weeks.</p>
        </div>
        <PilotStack steps={pilotSteps} />
      </div>
    </div></section>

    <section className="about" id="about"><div className="shell">
      <div className="section-topline" data-reveal><span>07 / ABOUT XPLORMATE</span><span>ON SITE, IN YOUR SYSTEMS</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Plant work stalls<br /><span className="dim">between systems and people.</span></h2><p>Xplormate builds AI agents for manufacturing operations. We work on site with your team, and the person who scopes your pilot builds it.</p></div>
      <ul className="systems-points principles" data-reveal>
        {principles.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></li>)}
      </ul>
    </div></section>

    <section className="faq" id="questions"><div className="shell faq-grid"><div className="faq-intro" data-reveal><div className="section-topline"><span>08 / QUESTIONS</span></div><h2>Before we talk.</h2><p>Straight answers to what plant teams usually ask first.</p></div><div className="faq-items" data-reveal>{faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="contact" id="contact">
      <div className="contact-frame">
        <div className="contact-glow" aria-hidden="true" />
        <DotField className="contact-dots" color="255,206,128" gap={15} density={0.24} />
        <div className="grain" aria-hidden="true" />
        <div className="shell contact-grid">
          <div>
            <div className="section-topline"><span>09 / BOOK A CALL</span></div>
            <h2>Tell us where work <em>gets stuck in your plant.</em></h2>
          </div>
          <div className="contact-content">
            <p>Tell us a little about your plant. We’ll reply personally to set up a 30-minute call.</p>
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
                  {leadSubmitting ? "Sending" : "Book a 30-minute call"} <ArrowUpRight size={20} />
                </button>
                <small className="form-note">Name, email, company and role are required. We use your details only to reply to your enquiry.</small>
              </form>
            ) : (
              <div className="lead-success" ref={successRef} tabIndex={-1} role="status">
                <p>Thanks. We’ve received your details and will reply personally to set up a call.</p>
                <button className="text-button" type="button" onClick={() => { setLeadSubmitted(false); setLeadError(""); setLeadFieldErrors({}); }}>Submit another response</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    <footer className="site-footer"><div className="shell">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="wordmark" href="#top" aria-label="Xplormate home"><img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" /><span>Xplormate<span className="brand-dot">.</span></span></a>
          <p>AI agents for manufacturing operations.</p>
          <address className="footer-address"><MapPin size={15} strokeWidth={1.5} /><span>BTM, 2nd Stage,<br />Bengaluru, 560076</span></address>
        </div>
        <nav className="footer-col" aria-label="Sections"><h2>On this page</h2><a href="#what-it-does">What agents do</a><a href="#systems">Your systems</a><a href="#example">Example</a><a href="#agents">Where agents help</a><a href="#security">Security</a><a href="#pilot">How a pilot runs</a><a href="#about">About</a><a href="#questions">Questions</a></nav>
        <nav className="footer-col" aria-label="Contact"><h2>Contact</h2><a href={`mailto:${businessEmail}`}><Mail size={15} /> Email</a><a href={linkedinProfile} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} /></a></nav>
        <nav className="footer-col" aria-label="Legal"><h2>Legal</h2><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
      </div>
      <div className="footer-bar bracketed"><span suppressHydrationWarning>© {new Date().getFullYear()} XPLORMATE</span><span>AI AGENTS FOR MANUFACTURING OPERATIONS</span></div>
    </div></footer>
  </main>;
}
