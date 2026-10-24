"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { track } from "@vercel/analytics";
import { ArrowRight, ArrowUpRight, ChartColumn, Check, ChevronDown, CircleAlert, Database, Factory, Mail, MapPin, Menu, MessageSquareText, Package, Repeat, ShieldCheck, Users, Wrench, X } from "lucide-react";
import AreaCarousel, { type Area } from "./components/AreaCarousel";
import DotField from "./components/DotField";
import HeroSequence, { type HeroSlide } from "./components/HeroSequence";
import OperatingLoop from "./components/OperatingLoop";
import PilotStack from "./components/PilotStack";
import PinnedStatement from "./components/PinnedStatement";
import ToolConveyor from "./components/ToolConveyor";

const linkedinProfile = "https://www.linkedin.com/in/jeetendra-yadav-4363457a/";
const businessEmail = "jeetendra@xplormate.com";

// Readouts are illustrative: they show the kind of signal each scene produces, not real data.
const heroSlides: HeroSlide[] = [
  { label: "Fabrication", image: "/media/hero-weld.webp", video: "/media/hero-weld.mp4", alt: "Welder at work, sparks lighting a dark fabrication bay", readouts: [{ text: "WELD CELL 2 · RUNNING" }, { text: "NEXT JOB · BRACKET B-118" }, { text: "MATERIAL CHECK · DUE 15:00", alert: true }] },
  { label: "Assembly", image: "/media/hero-assembly.webp", video: "/media/hero-assembly.mp4", alt: "Robot arm working on an automated assembly line", readouts: [{ text: "LINE 3 · PLAN VS ACTUAL −6%", alert: true }, { text: "CHANGEOVER · 15:10" }, { text: "OWNER · SHIFT LEAD" }] },
  { label: "Materials", image: "/media/hero-materials.webp", video: "/media/hero-materials.mp4", alt: "Forklift moving through warehouse racking", readouts: [{ text: "BIN A-14 · 40 PCS SHORT", alert: true }, { text: "ORDERS AFFECTED · 3" }, { text: "SUPPLIER ETA · TOMORROW" }] },
  { label: "Maintenance", image: "/media/hero-maintenance.webp", video: "/media/hero-maintenance.mp4", alt: "Cutting head moving over a metal sheet", readouts: [{ text: "CUTTER 2 · NOZZLE WEAR", alert: true }, { text: "REQUEST · RAISED 09:40" }, { text: "SPARES · IN STOCK" }] },
  { label: "Handover", image: "/media/hero-handover.webp", video: "/media/hero-handover.mp4", alt: "Shift team huddle on the warehouse floor, seen from above", readouts: [{ text: "SHIFT B → C · 5 OPEN ITEMS", alert: true }, { text: "ACKNOWLEDGED · 3 OF 5" }, { text: "OWNER · INCOMING LEAD" }] },
  { label: "Planning", image: "/media/hero-planning.webp", video: "/media/hero-planning.mp4", alt: "Operator pressing buttons on a lit machine control panel", readouts: [{ text: "DAILY REVIEW · 3 EXCEPTIONS", alert: true }, { text: "OPEN ACTIONS · 7" }, { text: "MISSING UPDATES · 2" }] },
];

const areas: Area[] = [
  { id: "production", label: "Production", index: "01", icon: Factory, image: "/media/area-production.webp", code: "PLAN · v4\nLINE 2 ▲\nLINE 3 ▼", title: "Production planning & execution", friction: "The plan changes, but the updated priority and its impact do not reach every owner at the same time.", ai: "Gather current context, highlight deviations, and prepare the next follow-up for review.", human: "Confirm the operational priority and approve changes that affect the plan.", measure: "Follow-up effort and response time", question: "Where do plan-versus-actual updates live today?" },
  { id: "quality", label: "Quality", index: "02", icon: ShieldCheck, image: "/media/area-quality.webp", code: "NCR-0418\nCAPA · OPEN\nEVIDENCE 2/3", title: "Quality management", friction: "Corrective actions require repeated follow-up, and closure evidence can be difficult to assemble.", ai: "Organise context, identify missing evidence, and support accountable owner follow-ups.", human: "Approve disposition, validate corrective action, and verify closure.", measure: "Time from issue detection to verified closure", question: "Where are issues, actions, and evidence currently recorded?" },
  { id: "maintenance", label: "Maintenance", index: "03", icon: Wrench, image: "/media/area-maintenance.webp", code: "WR-2291\nPRIORITY · B\nSPARES ✓", title: "Maintenance coordination", friction: "Requests, observations, spares, and production constraints arrive through different channels.", ai: "Connect the available context, surface missing inputs, and keep the next action visible.", human: "Set priority, approve safety-sensitive work, and confirm equipment readiness.", measure: "Open-request age and repeat follow-ups", question: "How does a maintenance request move from report to verified completion?" },
  { id: "materials", label: "Materials", index: "04", icon: Package, image: "/media/area-materials.webp", code: "PO-7713\nETA · +2 DAYS\nORDERS · 3", title: "Materials & procurement", friction: "A late component becomes urgent only after its effect on production is manually understood.", ai: "Relate material signals to orders, timing, and ownership, then prepare an exception summary.", human: "Validate the constraint and decide the supplier or planning response.", measure: "Time from risk signal to owned action", question: "Which sources are checked before material readiness is confirmed?" },
  { id: "handovers", label: "Handovers", index: "05", icon: Repeat, image: "/media/area-handovers.webp", code: "SHIFT B → C\nOPEN ITEMS · 5\nACK 3/5", title: "Shift handovers", friction: "The incoming team receives a list of issues without the full context, decision history, or clear owners.", ai: "Structure open items, carry forward context, and flag what still needs acknowledgement.", human: "Confirm what was handed over and accept responsibility for the next step.", measure: "Missed or repeatedly explained open items", question: "How is acknowledgement captured between shifts?" },
  { id: "reporting", label: "Reporting", index: "06", icon: ChartColumn, image: "/media/area-reporting.webp", code: "DAILY · 07:30\nEXCEPTIONS · 3\nMISSING · 2", title: "Operational reporting", friction: "Teams spend time collecting updates before leaders can understand what needs attention.", ai: "Compile updates, separate exceptions from routine activity, and make missing context explicit.", human: "Interpret trade-offs and decide where management attention is required.", measure: "Preparation time and missing-update rate", question: "Which recurring report depends most on manual consolidation?" },
];

const stages = [
  { number: "01", title: "Something happens", copy: "A material shortage is reported before the next shift.", icon: CircleAlert },
  { number: "02", title: "Facts pulled together", copy: "The affected orders, timing, messages, and stock on hand are gathered in one place.", icon: Database },
  { number: "03", title: "Right people told", copy: "The buyer and planner see the same clear picture at the same time.", icon: Users },
  { number: "04", title: "Follow-up drafted", copy: "AI drafts the follow-up and flags anything unusual for a person to check.", icon: MessageSquareText },
  { number: "05", title: "Closed properly", copy: "A person confirms the response, updates the plan, and marks it done.", icon: Check },
];

const toolGroups = [
  { id: "floor", label: "Shop floor & equipment", tools: [{ brand: "Siemens", logo: "siemens", area: "Shop floor" }, { brand: "Rockwell Automation", logo: "rockwellautomation", area: "Equipment" }, { brand: "ABB", logo: "abb", area: "Utilities" }, { brand: "Autodesk", logo: "autodesk", area: "Engineering" }] },
  { id: "erp", label: "ERP & planning", tools: [{ brand: "SAP", logo: "sap", area: "ERP / orders" }, { brand: "Odoo", logo: "odoo", area: "Materials / dispatch" }, { brand: "Google Sheets", logo: "googlesheets", area: "Planning" }] },
  { id: "quality", label: "Quality & maintenance", tools: [{ brand: "Google Forms", logo: "googleforms", area: "Quality / safety" }, { brand: "Jira", logo: "jira", area: "Maintenance" }, { brand: "Google Sheets", logo: "googlesheets", area: "Checklists" }] },
  { id: "comms", label: "Messages & reporting", tools: [{ brand: "Gmail", logo: "gmail", area: "Email" }, { brand: "WhatsApp", logo: "whatsapp", area: "Team updates" }, { brand: "Looker", logo: "looker", area: "Reporting" }] },
];

const pilotSteps = [
  { number: "01", art: "bottleneck" as const, title: "Choose a recurring bottleneck", copy: "Start with an operational workflow that costs time or delays action, such as material readiness or quality issue closure." },
  { number: "02", art: "understand" as const, title: "Understand the real work", copy: "Walk through recent examples with the people who run it, including the systems, messages, decisions and handovers." },
  { number: "03", art: "measure" as const, title: "Agree on the measure", copy: "Set a baseline and decide what would count as a useful improvement for your plant." },
  { number: "04", art: "pilot" as const, title: "Run a focused paid pilot", copy: "Apply AI to the routine coordination steps while your team reviews important decisions and verifies the outcome." },
  { number: "05", art: "expand" as const, title: "Expand what works", copy: "Review the evidence together. If the pilot proves useful, identify the next workflow or team where the approach could help." },
];

const faq = [
  ["Where can AI fit within manufacturing operations?", "A useful starting point is usually a recurring coordination task: gathering updates, connecting context, routing an exception, preparing a follow-up, or confirming closure. The workflow and its consequences determine what AI should support."],
  ["What if information is spread across different systems?", "That is common and part of the workflow assessment. We map where the information lives, who owns it, when it becomes available, and what can be accessed safely before suggesting an intervention."],
  ["Will AI make operational decisions independently?", "The level of autonomy depends on the task and its consequences. The workflow should explicitly define permissions, human approvals, exception handling, escalation rules, and a review trail."],
  ["What happens after the first conversation?", "We walk through one recent example together and see where the work slowed down. If AI can genuinely help, we suggest a focused paid pilot with a clear measure of success. If it can’t, we’ll tell you."],
  ["What happens after a successful pilot?", "We review the result with your team, decide what needs to change, and identify where the same approach could help next. Wider rollout is a separate decision, based on what the pilot actually proved."],
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
    const values = Object.fromEntries(new FormData(form).entries());
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

  return <main id="top">
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}><div className="header-inner">
      <a className="wordmark" href="#top" aria-label="Xplormate home"><img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" /><span>Xplormate<span className="brand-dot">.</span></span></a>
      <nav className={`site-nav${navOpen ? " is-open" : ""}`} id="site-navigation" aria-label="Main navigation"><a href="#transformation" onClick={() => setNavOpen(false)}>How we work</a><a href="#explorer" onClick={() => setNavOpen(false)}>Where AI fits</a><a href="#approach" onClick={() => setNavOpen(false)}>Start with a pilot</a></nav>
      <div className="header-actions">
        <a className="header-cta" href="#contact" onClick={() => setNavOpen(false)}>Talk to us <ArrowUpRight size={16} /></a>
        <button className="mobile-nav-toggle" type="button" aria-label={navOpen ? "Close navigation" : "Open navigation"} aria-expanded={navOpen} aria-controls="site-navigation" onClick={() => setNavOpen((open) => !open)}>{navOpen ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
    </div></header>

    <section className="hero">
      <div className="hero-frame">
        <HeroSequence slides={heroSlides} />
        <div className="hero-shade" />
        <DotField className="hero-dots" color="255,206,128" gap={15} density={0.26} />
        <div className="grain" aria-hidden="true" />
        <div className="hero-content shell">
          <div className="hero-kicker"><span className="signal-pulse" /> AI TRANSFORMATION FOR MANUFACTURING</div>
          <h1>Make the work that runs your plant <em>move.</em></h1>
          <div className="hero-actions">
            <p>We help manufacturers redesign core workflows across production, quality, maintenance and materials. AI brings the context together and moves routine follow-ups forward; your people make the decisions that matter.</p>
            <div className="hero-buttons"><a className="button button-amber" href="#contact">Discuss a workflow <ArrowRight size={18} /></a><a className="button button-ghost" href="#transformation">See how we work</a></div>
          </div>
          <div className="hero-meta"><span>START WITH ONE WORKFLOW</span><span>MEASURE THE RESULT</span><span>EXPAND WHAT WORKS</span></div>
        </div>
      </div>
    </section>

    <section className="glow-intro"><div className="shell">
      <div className="glow-card" data-reveal>
        <div className="glow-card-light" aria-hidden="true" />
        <DotField className="glow-card-dots" color="255,214,150" gap={16} density={0.22} />
        <div className="grain" aria-hidden="true" />
        <div className="glow-card-content">
          <h2>AI for the work that runs your plant.</h2>
          <p>Redesign · Apply AI · Keep control</p>
          <a className="button button-cream" href="#transformation">See how we work <ArrowRight size={17} /></a>
        </div>
      </div>
    </div></section>

    <PinnedStatement text="Your people keep command. AI does the chasing: it pulls the context together, drafts the follow-up and keeps the next owner visible, so issues close instead of circling." />

    <section className="transformation" id="transformation"><div className="shell">
      <div className="section-topline" data-reveal><span>01 / AI TRANSFORMATION</span><span>BUILT AROUND YOUR OPERATION</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Redesign the work.<br /><span className="dim">Then put AI to work.</span></h2><p>Transformation starts with how a plant actually runs: which signal matters, who owns the next action, and how the team knows an issue is closed. We shape AI around that operating flow.</p></div>
      <div className="transformation-flow">
        <article className="bracketed" data-reveal><span>01 / REDESIGN</span><h3>Redesign a core workflow.</h3><p>Clarify the steps, owners, handoffs and closure criteria around a recurring production, quality, maintenance or materials issue.</p></article>
        <article className="bracketed" data-reveal><DotField className="card-dots" color="255,206,128" gap={13} density={0.2} /><span>02 / APPLY AI</span><h3>Move routine work forward.</h3><p>Bring the available context together, identify exceptions, prepare follow-ups and keep the next owner visible.</p></article>
        <article className="bracketed" data-reveal><span>03 / KEEP CONTROL</span><h3>Let people decide.</h3><p>Plant teams review consequential actions, resolve trade-offs and verify closure. AI supports the workflow; responsibility stays clear.</p></article>
      </div>
      <div className="systems-map bracketed" aria-labelledby="systems-map-title" data-reveal>
        <ToolConveyor groups={toolGroups} />
        <ul className="systems-points">
          <li><h4>Keep your core systems</h4><p>We work alongside the tools your plant already runs on. Nothing is ripped out or replaced.</p></li>
          <li><h4>Map what one workflow needs</h4><p>We trace the few sources a chosen workflow actually depends on, not your whole estate.</p></li>
          <li><h4>Count messages and sheets too</h4><p>Updates often live in email, chat and spreadsheets, so they are part of the picture.</p></li>
          <li><h4>Agree access before the pilot</h4><p>We agree what can be accessed safely during a pilot before anything is connected.</p></li>
        </ul>
      </div>
    </div></section>

    <OperatingLoop stages={stages}>
      <div className="section-topline"><span>02 / THE OPERATING LOOP</span><span>ILLUSTRATIVE WORKFLOW</span></div>
      <div className="section-heading split-heading signal-heading"><h2>An update should lead<br /><span className="dim">to something happening.</span></h2><p>Knowing about a problem is only the start. What matters is what happens next, who owns it, and how everyone knows it’s done.</p></div>
    </OperatingLoop>

    <section className="explorer" id="explorer"><div className="shell">
      <div className="section-topline" data-reveal><span>03 / WHERE AI FITS</span><span>PICK AN AREA</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Where could work<br /><span className="dim">move differently?</span></h2><p>Even when information is available, work can stall because the next step isn’t clear. Pick an area to see where it slows down, how AI could help, and what your team would still decide.</p></div>
      <div data-reveal><AreaCarousel areas={areas} /></div>
    </div></section>

    <section className="approach" id="approach"><div className="shell">
      <div className="approach-panel">
        <div className="approach-glow" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <div className="approach-head" data-reveal>
          <span className="approach-eyebrow">04 / HOW WE START</span>
          <h2>Start with one workflow.<br /><span>Build from proof.</span></h2>
          <p>A focused paid pilot tests whether AI can improve work your plant already does. We agree on the measure before starting, review the result together, and only then decide what should expand.</p>
          <a className="button button-cream" href="#contact">Discuss a workflow <ArrowUpRight size={17} /></a>
        </div>
        <PilotStack steps={pilotSteps} />
      </div>
    </div></section>

    <section className="faq" id="questions"><div className="shell faq-grid"><div className="faq-intro" data-reveal><div className="section-topline"><span>05 / PRACTICAL QUESTIONS</span></div><h2>Before we talk.</h2><p>Clear expectations make the first conversation more useful.</p></div><div className="faq-items" data-reveal>{faq.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></div></section>

    <section className="contact" id="contact">
      <div className="contact-frame">
        <div className="contact-glow" aria-hidden="true" />
        <DotField className="contact-dots" color="255,206,128" gap={15} density={0.24} />
        <div className="grain" aria-hidden="true" />
        <div className="shell contact-grid">
          <div>
            <div className="section-topline"><span>06 / START THE CONVERSATION</span></div>
            <h2>Where is work getting <em>stuck in your plant?</em></h2>
          </div>
          <div className="contact-content">
            <p>Share a few details and we’ll reply personally.</p>
            {!leadSubmitted ? (
              <form className="lead-form" onSubmit={handleLeadSubmit}>
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
                    <span>Which workflow needs to move better? <i className="optional-mark">optional</i></span>
                    <textarea id="lead-challenge" name="challenge" rows={4} maxLength={2000} placeholder="e.g. Every morning we call suppliers and check Excel to find which orders are short on material." aria-invalid={Boolean(leadFieldErrors.challenge)} aria-describedby={leadFieldErrors.challenge ? "lead-challenge-error" : undefined} />
                    {leadFieldErrors.challenge ? <small className="field-error" id="lead-challenge-error">{leadFieldErrors.challenge}</small> : null}
                  </label>
                </div>
                {leadError ? <p className="form-error" role="alert">{leadError}</p> : null}
                <button className="button button-amber" type="submit" disabled={leadSubmitting} aria-busy={leadSubmitting}>
                  {leadSubmitting ? "Sending" : "Start a conversation"} <ArrowUpRight size={20} />
                </button>
                <small className="form-note">Name, email, company and role are required. We use your details to review and respond to your enquiry.</small>
              </form>
            ) : (
              <div className="lead-success" ref={successRef} tabIndex={-1} role="status">
                <p>Thanks, we’ve received your details and will get back to you personally.</p>
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
          <p>AI transformation for manufacturing operations.</p>
          <address className="footer-address"><MapPin size={15} strokeWidth={1.5} /><span>BTM, 2nd Stage,<br />Bengaluru, 560076</span></address>
        </div>
        <nav className="footer-col" aria-label="Sections"><h2>On this page</h2><a href="#transformation">How we work</a><a href="#signal-story">The operating loop</a><a href="#explorer">Where AI fits</a><a href="#approach">How we start</a><a href="#questions">Questions</a></nav>
        <nav className="footer-col" aria-label="Contact"><h2>Contact</h2><a href={`mailto:${businessEmail}`}><Mail size={15} /> Email</a><a href={linkedinProfile} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={15} /></a></nav>
        <nav className="footer-col" aria-label="Legal"><h2>Legal</h2><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav>
      </div>
      <div className="footer-bar bracketed"><span suppressHydrationWarning>© {new Date().getFullYear()} XPLORMATE</span><span>AI FOR MANUFACTURING OPERATIONS</span></div>
    </div></footer>
  </main>;
}
