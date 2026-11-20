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

// Jobs an agent can start with. In the carousel: friction = what it watches, ai = what it does on its own, human = what waits for approval.
const agents: Area[] = [
  { id: "materials", label: "Material readiness", index: "01", icon: Package, image: "/media/area-materials.webp", code: "PO-7713\nETA · +2 DAYS\nORDERS · 3", title: "Material readiness agent", friction: "Production plan, stock, open POs and receipts in your ERP.", ai: "Flags shortages for the next 24–48 hours, checks other stores and PO dates, alerts the buyer and planner with the affected orders, and chases supplier dates.", human: "Changing the plan or placing an emergency purchase.", measure: "Time from shortage to an owned action", question: "Which orders were short on material last month, and how did you find out?" },
  { id: "quality", label: "Quality & CAPA", index: "02", icon: ShieldCheck, image: "/media/area-quality.webp", code: "NCR-0418\nCAPA · OPEN\nEVIDENCE 2/3", title: "Quality & CAPA closure agent", friction: "NCRs, CAPAs and audit findings in your quality system.", ai: "Assigns owners, collects evidence, reminds before due dates and flags overdue items ahead of audits.", human: "Closing a CAPA, and deciding what happens to held material.", measure: "Time from issue to verified closure", question: "Where are issues, actions and evidence recorded today?" },
  { id: "maintenance", label: "Maintenance", index: "03", icon: Wrench, image: "/media/area-maintenance.webp", code: "WR-2291\nPRIORITY · B\nSPARES ✓", title: "Maintenance escalation agent", friction: "Breakdowns and work orders in your maintenance system.", ai: "Updates work orders, checks spares, escalates when response time is missed, and tells planning which orders are at risk.", human: "Taking a machine down or buying spares.", measure: "Open-request age and repeat follow-ups", question: "How does a breakdown move from report to confirmed fix?" },
  { id: "handovers", label: "Shift handover", index: "04", icon: Repeat, image: "/media/area-handovers.webp", code: "SHIFT B → C\nOPEN ITEMS · 5\nACK 3/5", title: "Shift handover agent", friction: "Shift logs, open issues, and plan versus actual.", ai: "Builds the handover, carries open items to the next shift with owners, and chases acknowledgement.", human: "Marking an issue closed.", measure: "Open items missed or explained twice", question: "How is acknowledgement captured between shifts today?" },
  { id: "reporting", label: "Daily ops review", index: "05", icon: ChartColumn, image: "/media/area-reporting.webp", code: "DAILY · 07:30\nEXCEPTIONS · 3\nACTIONS · 7", title: "Daily ops review agent", friction: "Plan versus actual, downtime, quality and dispatch.", ai: "Prepares the morning review with exceptions and owners, and tracks every action point until it’s closed.", human: "Anything sent outside the plant.", measure: "Preparation time and open action points", question: "Which morning report takes the most manual work?" },
];

// Sample agent run for the example section.
const agentRun = [
  { number: "01", time: "14:32", title: "Shortage spotted", copy: "The agent sees a raw-material shortage in the ERP against tomorrow’s plan for Line 2.", icon: CircleAlert },
  { number: "02", time: "14:33", title: "Facts checked", copy: "It checks stock at the second store and open POs. One PO is two days late.", icon: Database },
  { number: "03", time: "14:35", title: "Owners asked", copy: "It flags three affected orders, proposes the next order for Line 2, and asks the buyer to confirm the supplier date by 17:00.", icon: Users },
  { number: "04", time: "15:10", title: "Planner approves", copy: "The planner approves the new sequence. The agent updates every owner.", icon: UserCheck },
  { number: "05", time: "17:00", title: "Closed and logged", copy: "The supplier date is confirmed. The agent closes the issue and logs every step with who approved it.", icon: Check },
];

const howItWorks = [
  { tag: "01 / PLUG IN", title: "Read from your systems.", copy: "We read from your systems first. Nothing is replaced, and we write back only where you approve it." },
  { tag: "02 / SHAPE", title: "Build around one job.", copy: "We map one job with the people who run it, and build the agent around how your plant really works." },
  { tag: "03 / APPROVE", title: "You decide what it may do.", copy: "You set what the agent can do alone and what needs a person. Every step it takes is logged." },
  { tag: "04 / LEARN", title: "Better with each correction.", copy: "We use your team’s corrections to improve how the agent works." },
];

const capabilities = [
  { icon: Workflow, copy: "Runs one job end to end across planning, production, quality and stores." },
  { icon: Database, copy: "Reads your ERP, MES, quality and maintenance records, plus email and sheets." },
  { icon: CircleAlert, copy: "Flags shortages, breakdowns and quality issues before the next shift." },
  { icon: Factory, copy: "Covers more lines and plants without adding people to chase updates." },
  { icon: ShieldCheck, copy: "Waits for approval on what matters, and logs every step it takes." },
];

// Examples of systems plants run on, shown on the animated conveyor. Not partners or customers.
const systemGroups: ToolGroup[] = [
  { id: "erp", label: "ERP & planning", tools: [{ brand: "SAP", logo: "sap", area: "ERP / orders" }, { brand: "Oracle", area: "ERP / supply" }, { brand: "Microsoft Dynamics", area: "ERP / finance" }, { brand: "Tally", area: "Stock / accounts" }, { brand: "Odoo", logo: "odoo", area: "Materials / dispatch" }] },
  { id: "production", label: "Production & shop floor", tools: [{ brand: "Siemens", logo: "siemens", area: "MES / shop floor" }, { brand: "Rockwell Automation", logo: "rockwellautomation", area: "Line data" }, { brand: "ABB", logo: "abb", area: "Drives / utilities" }] },
  { id: "quality", label: "Quality & maintenance", tools: [{ brand: "SAP", logo: "sap", area: "Quality / maintenance" }, { brand: "Google Forms", logo: "googleforms", area: "Inspections" }, { brand: "Jira", logo: "jira", area: "Work requests" }] },
  { id: "everyday", label: "Everyday work", tools: [{ brand: "Gmail", logo: "gmail", area: "Email" }, { brand: "Google Sheets", logo: "googlesheets", area: "Trackers" }, { brand: "Excel", area: "Plans / trackers" }, { brand: "Looker", logo: "looker", area: "Reports" }] },
];

const withYou = [
  { tag: "01 / FIND", title: "Find the job.", copy: "We walk through last month’s real cases with your team and pick the job that takes the most chasing." },
  { tag: "02 / BUILD", title: "Build it in your systems.", copy: "We connect the agent to the systems that job uses, read-only first, and shape it around how your plant works." },
  { tag: "03 / RUN", title: "Run it with your team.", copy: "We stay with your team while it runs, fix what’s wrong, and measure it against your own baseline." },
];

const controls = [
  { icon: UserCheck, title: "People approve critical steps", copy: "Anything that changes the plan, a record or leaves the plant waits for a person." },
  { icon: ScrollText, title: "Every action is logged", copy: "Each step the agent takes is recorded, with who approved it." },
  { icon: Lock, title: "Read-only to start", copy: "Write access comes later, and only where you agree." },
  { icon: Database, title: "Your data stays with your work", copy: "It is used only for your plant’s work." },
  { icon: Server, title: "Hosted in India", copy: "The agent and its data run in an India cloud region." },
  { icon: KeyRound, title: "Access you can remove", copy: "Agree access before anything connects, and remove it any time." },
];

const pilotSteps = [
  { number: "01", art: "bottleneck" as const, title: "Pick one job", copy: "The one that repeats and takes the most chasing. We set the baseline from your own records." },
  { number: "02", art: "pilot" as const, title: "Run it on your real data", copy: "One agent, one plant, read-only first, with your team approving what matters." },
  { number: "03", art: "measure" as const, title: "Use it every day", copy: "If the numbers move, the agent becomes part of daily work, with write access only where you agree." },
  { number: "04", art: "expand" as const, title: "Choose the next job", copy: "Then the next plant. Each step is a separate decision, based on what the pilot showed." },
];

const principles = [
  { title: "One job done properly", copy: "We finish one job well before starting the next." },
  { title: "Accountable for what we build", copy: "We stay with the agent we build until it works in your plant." },
  { title: "Numbers as they are", copy: "We report the results as they are, good or bad." },
  { title: "Simple pricing", copy: "A fixed pilot fee, agreed before we start. What comes next is agreed on the results." },
];

const faq = [
  ["Does it replace our ERP or MES?", "No. The agent works on top of them, and they stay the record."],
  ["Will this replace my people?", "No. The agent does the chasing and the routine steps. Your people decide and approve."],
  ["Which systems can it work with?", "The ones your chosen job uses. We confirm access on the first call, starting read-only."],
  ["Will it act without approval?", "Only on routine steps you agree up front. Anything that changes the plan, a record or leaves the plant waits for a person."],
  ["When does it write into our systems?", "Only after the pilot proves itself, and only where you approve it."],
  ["Which AI model does it use?", "We pick the model that fits each task and aren’t tied to one provider."],
  ["Where is our plant data?", "The agent and the plant data it uses run in an India cloud region, used only for your plant’s work."],
  ["What do you need from us?", "One person who owns the job, read access to the systems it touches, and an hour a week."],
  ["What does a pilot cost?", "A fixed fee in rupees, set after the first call once we know the job and the systems involved."],
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
      <nav className={`site-nav${navOpen ? " is-open" : ""}`} id="site-navigation" aria-label="Main navigation"><a href="#how" onClick={closeNav}>How it works</a><a href="#agents" onClick={closeNav}>Agents</a><a href="#security" onClick={closeNav}>Security</a><a href="#about" onClick={closeNav}>About</a></nav>
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
          <div className="hero-kicker"><span className="signal-pulse" /> AI AGENTS FOR MANUFACTURING OPERATIONS</div>
          <h1>AI agents that do the <em>chasing</em> in your plant.</h1>
          <div className="hero-actions">
            <p>They work on top of your ERP, MES, quality and maintenance systems. They spot what’s slipping, do the routine steps, and bring in the right person when a decision is needed.</p>
            <div className="hero-buttons"><a className="button button-amber" href="#contact">Book a 30-minute call <ArrowRight size={18} /></a><a className="button button-ghost" href="#example">See an example</a></div>
          </div>
          <div className="hero-meta"><span>NOW TAKING OUR FIRST PAID PILOTS</span><span>YOUR TEAM APPROVES</span></div>
        </div>
      </div>
    </section>

    <section className="glow-intro"><div className="shell">
      <div className="glow-card" data-reveal>
        <div className="glow-card-light" aria-hidden="true" />
        <DotField className="glow-card-dots" color="255,214,150" gap={16} density={0.22} />
        <div className="grain" aria-hidden="true" />
        <div className="glow-card-content">
          <h2>Your systems record the work. The follow-up still runs on calls and reminders.</h2>
          <p>Plug in · Shape · Approve · Learn</p>
          <a className="button button-cream" href="#how">See how it works <ArrowRight size={17} /></a>
        </div>
      </div>
    </div></section>

    <section className="capability-section" id="what-it-does"><div className="shell">
      <div className="section-topline" data-reveal><span>WHAT AN AGENT DOES</span><span>MANUFACTURING OPERATIONS</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Keep material, machines and quality moving,<br /><span className="dim">without the chasing.</span></h2><p>An agent connects the systems your plant already runs and takes on the follow-up work between them. Your team keeps the decisions.</p></div>
      <Capabilities items={capabilities} />
    </div></section>

    <PinnedStatement text="The update sits in one system. The action needs three people. The chasing happens on calls, outside any system, so issues close late and nobody can see why until the review." />

    <section className="transformation" id="how"><div className="shell">
      <div className="section-topline" data-reveal><span>01 / HOW IT WORKS</span><span>WHAT WE DO IN A PILOT</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Agents that work on top of<br /><span className="dim">what you already run.</span></h2><p>We connect an agent to the systems one job depends on, build it around how your plant really works, and keep your team in charge of every decision that matters.</p></div>
      <div className="transformation-flow flow-four">
        {howItWorks.map((step, index) => (
          <article className="bracketed" data-reveal key={step.tag}>
            {index === 1 ? <DotField className="card-dots" color="255,206,128" gap={13} density={0.2} /> : null}
            <span>{step.tag}</span><h3>{step.title}</h3><p>{step.copy}</p>
          </article>
        ))}
      </div>
      <div className="systems-map bracketed" data-reveal>
        <ToolConveyor groups={systemGroups} eyebrow="SYSTEMS WE WORK ON TOP OF" title="Works on top of what you already run." note="Examples of systems plants use. Not partners or customers." />
        <ul className="systems-points">
          <li><h4>Nothing replaced</h4><p>Your systems stay the record. The agent works alongside them.</p></li>
          <li><h4>Only what one job needs</h4><p>We connect the few sources one agent uses, not your whole estate.</p></li>
          <li><h4>Read-only first</h4><p>The agent starts by reading. Write access comes later, only if you agree.</p></li>
          <li><h4>Access agreed up front</h4><p>Nothing connects before you sign off on what the agent can see.</p></li>
        </ul>
      </div>
    </div></section>

    <span id="example" className="anchor-target" aria-hidden="true" />
    <OperatingLoop stages={agentRun} alertLabel="SAMPLE DATA · MATERIAL READINESS AGENT" alertTitle="Raw material short for Line 2 tomorrow" hint="SCROLL TO FOLLOW THE AGENT">
      <div className="section-topline"><span>02 / EXAMPLE AGENT RUN</span><span>SAMPLE DATA</span></div>
      <div className="section-heading split-heading signal-heading"><h2>One shortage.<br /><span className="dim">Handled before the next shift.</span></h2><p>Here is how a material readiness agent would handle a shortage, step by step. The agent does the chasing; your planner approves the change.</p></div>
    </OperatingLoop>

    <section className="explorer" id="agents"><div className="shell">
      <div className="section-topline" data-reveal><span>03 / AGENTS</span><span>JOBS WE CAN START WITH</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Start with one job.<br /><span className="dim">Add the next when it works.</span></h2><p>Each agent is built for one job in your plant. Pick a job to see what the agent would watch, what it would do on its own, and what would wait for your team.</p></div>
      <div data-reveal><AreaCarousel areas={agents} /></div>
    </div></section>

    <section className="with-you" id="with-you"><div className="shell">
      <div className="section-topline" data-reveal><span>04 / HOW WE WORK WITH YOU</span><span>ON SITE, IN YOUR SYSTEMS</span></div>
      <div className="section-heading split-heading" data-reveal><h2>We sit with the people<br /><span className="dim">who do the job.</span></h2><p>The person who scopes your pilot builds it, and stays with your team while it runs.</p></div>
      <div className="transformation-flow">
        {withYou.map((step, index) => (
          <article className="bracketed" data-reveal key={step.tag}>
            {index === 1 ? <DotField className="card-dots" color="255,206,128" gap={13} density={0.2} /> : null}
            <span>{step.tag}</span><h3>{step.title}</h3><p>{step.copy}</p>
          </article>
        ))}
      </div>
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
          <h2>Pick one job.<br /><span>See if it works.</span></h2>
          <p>A small paid pilot on one job at one plant, measured against your own records. A fixed fee in rupees, agreed before we start. Planned for 4–8 weeks.</p>
          <a className="button button-cream" href="#contact">Book a 30-minute call <ArrowUpRight size={17} /></a>
        </div>
        <PilotStack steps={pilotSteps} />
      </div>
    </div></section>

    <section className="about" id="about"><div className="shell">
      <div className="section-topline" data-reveal><span>07 / ABOUT XPLORMATE</span><span>AI AGENTS FOR MANUFACTURING</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Plant work stalls<br /><span className="dim">between systems and people.</span></h2><p>Xplormate builds AI agents for manufacturing operations: the follow-up work that falls between your systems and the people who run the plant.</p></div>
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
            <h2>Pick one job. <em>See if it works before you commit more.</em></h2>
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
                    <span>Which job should we start with? <i className="optional-mark">optional</i></span>
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
        <nav className="footer-col" aria-label="Sections"><h2>On this page</h2><a href="#how">How it works</a><a href="#example">Example agent run</a><a href="#agents">Agents</a><a href="#security">Security</a><a href="#pilot">How a pilot runs</a><a href="#about">About</a><a href="#questions">Questions</a></nav>
        <nav className="footer-col" aria-label="Contact"><h2>Contact</h2><a href={`mailto:${businessEmail}`}><Mail size={15} /> Email</a><a href={linkedinProfile} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} /></a></nav>
        <nav className="footer-col" aria-label="Legal"><h2>Legal</h2><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
      </div>
      <div className="footer-bar bracketed"><span suppressHydrationWarning>© {new Date().getFullYear()} XPLORMATE</span><span>AI AGENTS FOR MANUFACTURING OPERATIONS</span></div>
    </div></footer>
  </main>;
}
