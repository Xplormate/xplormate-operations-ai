"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import DotField from "./components/DotField";
import ScrollText from "./components/ScrollText";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleAlert, Database, Mail, MapPin, Menu, MessageSquareText, Users, X } from "lucide-react";

const linkedinProfile = "https://www.linkedin.com/in/jeetendra-yadav-4363457a/";
const businessEmail = "jeetendra@xplormate.com";


const opportunities = [
  { id: "production", label: "Production", index: "01", title: "Production planning & execution", friction: "The plan changes, but the updated priority and its impact do not reach every owner at the same time.", ai: "Gather current context, highlight deviations, and prepare the next follow-up for review.", human: "Confirm the operational priority and approve changes that affect the plan.", measure: "Follow-up effort and response time", question: "Where do plan-versus-actual updates live today?" },
  { id: "quality", label: "Quality", index: "02", title: "Quality management", friction: "Corrective actions require repeated follow-up, and closure evidence can be difficult to assemble.", ai: "Organise context, identify missing evidence, and support accountable owner follow-ups.", human: "Approve disposition, validate corrective action, and verify closure.", measure: "Time from issue detection to verified closure", question: "Where are issues, actions, and evidence currently recorded?" },
  { id: "maintenance", label: "Maintenance", index: "03", title: "Maintenance coordination", friction: "Requests, observations, spares, and production constraints arrive through different channels.", ai: "Connect the available context, surface missing inputs, and keep the next action visible.", human: "Set priority, approve safety-sensitive work, and confirm equipment readiness.", measure: "Open-request age and repeat follow-ups", question: "How does a maintenance request move from report to verified completion?" },
  { id: "materials", label: "Materials", index: "04", title: "Materials & procurement", friction: "A late component becomes urgent only after its effect on production is manually understood.", ai: "Relate material signals to orders, timing, and ownership, then prepare an exception summary.", human: "Validate the constraint and decide the supplier or planning response.", measure: "Time from risk signal to owned action", question: "Which sources are checked before material readiness is confirmed?" },
  { id: "handovers", label: "Handovers", index: "05", title: "Shift handovers", friction: "The incoming team receives a list of issues without the full context, decision history, or clear owners.", ai: "Structure open items, carry forward context, and flag what still needs acknowledgement.", human: "Confirm what was handed over and accept responsibility for the next step.", measure: "Missed or repeatedly explained open items", question: "How is acknowledgement captured between shifts?" },
  { id: "reporting", label: "Reporting", index: "06", title: "Operational reporting", friction: "Teams spend time collecting updates before leaders can understand what needs attention.", ai: "Compile updates, separate exceptions from routine activity, and make missing context explicit.", human: "Interpret trade-offs and decide where management attention is required.", measure: "Preparation time and missing-update rate", question: "Which recurring report depends most on manual consolidation?" },
];

const stages = [
  { number: "01", title: "Something happens", copy: "A material shortage is reported before the next shift.", icon: CircleAlert },
  { number: "02", title: "Facts pulled together", copy: "The affected orders, timing, messages, and stock on hand are gathered in one place.", icon: Database },
  { number: "03", title: "Right people told", copy: "The buyer and planner see the same clear picture at the same time.", icon: Users },
  { number: "04", title: "Follow-up drafted", copy: "AI drafts the follow-up and flags anything unusual for a person to check.", icon: MessageSquareText },
  { number: "05", title: "Closed properly", copy: "A person confirms the response, updates the plan, and marks it done.", icon: Check },
];

const operationSources = [
  { area: "Engineering", brand: "Autodesk", logo: "autodesk", x: 50, y: 7 },
  { area: "ERP / orders", brand: "SAP", logo: "sap", x: 70, y: 13 },
  { area: "Planning", brand: "Google Sheets", logo: "googlesheets", x: 85, y: 29 },
  { area: "Materials / dispatch", brand: "Odoo", logo: "odoo", x: 90, y: 50 },
  { area: "Shop floor", brand: "Siemens", logo: "siemens", x: 82, y: 72 },
  { area: "Equipment", brand: "Rockwell Automation", logo: "rockwellautomation", x: 67, y: 87 },
  { area: "Quality / safety", brand: "Google Forms", logo: "googleforms", x: 50, y: 93 },
  { area: "Maintenance", brand: "Jira", logo: "jira", x: 33, y: 87 },
  { area: "Utilities", brand: "ABB", logo: "abb", x: 18, y: 72 },
  { area: "Email", brand: "Gmail", logo: "gmail", x: 10, y: 50 },
  { area: "Team updates", brand: "WhatsApp", logo: "whatsapp", x: 15, y: 29 },
  { area: "Reporting", brand: "Looker", logo: "looker", x: 30, y: 13 },
];

const faq = [
  ["Where can AI fit within manufacturing operations?", "A useful starting point is usually a recurring coordination task: gathering updates, connecting context, routing an exception, preparing a follow-up, or confirming closure. The workflow and its consequences determine what AI should support."],
  ["What if information is spread across different systems?", "That is common and part of the workflow assessment. We map where the information lives, who owns it, when it becomes available, and what can be accessed safely before suggesting an intervention."],
  ["Will AI make operational decisions independently?", "The level of autonomy depends on the task and its consequences. The workflow should explicitly define permissions, human approvals, exception handling, escalation rules, and a review trail."],
  ["What happens after the first conversation?", "We walk through one recent example together and see where the work slowed down. If AI can genuinely help, we suggest a focused paid pilot with a clear measure of success. If it can’t, we’ll tell you."],
  ["What happens after a successful pilot?", "We review the result with your team, decide what needs to change, and identify where the same approach could help next. Wider rollout is a separate decision, based on what the pilot actually proved."],
];

export default function Home() {
  const [activeOpportunity, setActiveOpportunity] = useState(0);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadFieldErrors, setLeadFieldErrors] = useState<Record<string, string>>({});
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = opportunities[activeOpportunity];

  // Header switches from dark glass (over the hero) to light glass once the hero is behind us.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fade sections in as they arrive. Content stays visible if JS never runs.
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
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

  const selectOpportunityFromKeyboard = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % opportunities.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + opportunities.length) % opportunities.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = opportunities.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveOpportunity(nextIndex);
    requestAnimationFrame(() => {
      document.getElementById(`opportunity-tab-${opportunities[nextIndex].id}`)?.focus();
    });
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
        <img className="hero-image" src="/xplormate-hero.webp" alt="Modern manufacturing floor during an active shift" fetchPriority="high" decoding="async" />
        <div className="hero-shade" />
        <DotField className="hero-dots" color="255,206,128" gap={15} density={0.26} />
        <div className="grain" aria-hidden="true" />
        <div className="hero-readouts" aria-hidden="true">
          <div className="readout readout-codes"><span>WO-4471</span><span>WO-4475</span><span>WO-4480</span></div>
          <div className="readout readout-alert"><i />SHORTAGE FLAGGED · 14:32</div>
          <div className="readout readout-owner"><b>OWNER</b> PLANNER · BUYER</div>
          <div className="readout readout-status"><b>STATUS</b> FOLLOW-UP DRAFTED</div>
          <span className="crosshair crosshair-one" /><span className="crosshair crosshair-two" />
        </div>
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

    <section className="statement">
      <div className="shell statement-inner">
        <span className="statement-rail" aria-hidden="true"><i /><i /><i /></span>
        <ScrollText text="Your people keep command. AI does the chasing: it pulls the context together, drafts the follow-up and keeps the next owner visible, so issues close instead of circling." />
      </div>
    </section>

    <section className="transformation" id="transformation"><div className="shell">
      <div className="section-topline" data-reveal><span>01 / AI TRANSFORMATION</span><span>BUILT AROUND YOUR OPERATION</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Redesign the work.<br /><span className="dim">Then put AI to work.</span></h2><p>Transformation starts with how a plant actually runs: which signal matters, who owns the next action, and how the team knows an issue is closed. We shape AI around that operating flow.</p></div>
      <div className="transformation-flow">
        <article className="bracketed" data-reveal><span>01 / REDESIGN</span><h3>Redesign a core workflow.</h3><p>Clarify the steps, owners, handoffs and closure criteria around a recurring production, quality, maintenance or materials issue.</p></article>
        <article className="bracketed" data-reveal><DotField className="card-dots" color="255,206,128" gap={13} density={0.2} /><span>02 / APPLY AI</span><h3>Move routine work forward.</h3><p>Bring the available context together, identify exceptions, prepare follow-ups and keep the next owner visible.</p></article>
        <article className="bracketed" data-reveal><span>03 / KEEP CONTROL</span><h3>Let people decide.</h3><p>Plant teams review consequential actions, resolve trade-offs and verify closure. AI supports the workflow; responsibility stays clear.</p></article>
      </div>
      <div className="systems-map" aria-labelledby="systems-map-title" data-reveal>
        <div className="grain" aria-hidden="true" />
        <div className="systems-map-heading"><div><span className="systems-eyebrow">YOUR EXISTING OPERATION</span><h3 id="systems-map-title">Work with the systems you already use.</h3></div><span className="systems-example">Illustrative tools</span></div>
        <div className="systems-orbit" role="img" aria-label="Examples of manufacturing tools around one workflow: Autodesk for engineering, SAP for ERP and orders, Google Sheets for planning, Odoo for materials and dispatch, Siemens for shop floor, Rockwell Automation for equipment, Google Forms for quality and safety, Jira for maintenance, ABB for utilities, Gmail for email, WhatsApp for team updates, and Looker for reporting.">
          <span className="orbit-haze orbit-haze-one" aria-hidden="true" /><span className="orbit-haze orbit-haze-two" aria-hidden="true" />
          <span className="orbit-ring orbit-ring-outer" aria-hidden="true" />
          <svg className="orbit-energy" viewBox="0 0 1000 660" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="orbit-flow-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb629" stopOpacity="0" /><stop offset="0.34" stopColor="#ffcf7a" stopOpacity="0.7" /><stop offset="0.68" stopColor="#ff9d3c" stopOpacity="0.7" /><stop offset="1" stopColor="#ffb629" stopOpacity="0" /></linearGradient></defs>
            <path className="orbit-energy-glow" d="M85 400 C250 170 350 505 530 326 S755 150 915 355" />
            <path className="orbit-energy-glow orbit-energy-glow-second" d="M155 150 C350 380 360 150 565 350 S760 485 860 515" />
            <path className="orbit-energy-line" d="M85 400 C250 170 350 505 530 326 S755 150 915 355" />
            <path className="orbit-energy-line orbit-energy-line-second" d="M155 150 C350 380 360 150 565 350 S760 485 860 515" />
          </svg>
          {operationSources.map((source, index) => <div className="orbit-source" key={source.brand} style={{ left: `${source.x}%`, top: `${source.y}%`, animationDelay: `${index * -0.4}s` }} aria-hidden="true"><span className="orbit-logo"><img src={`/tool-logos/${source.logo}.svg`} width="34" height="34" alt="" /></span><span className="orbit-area">{source.area}</span></div>)}
        </div>
        <p className="systems-note">Keep your core systems. We map the sources a chosen workflow needs, then agree what can be accessed safely during a pilot.</p>
      </div>
    </div></section>

    <section className="signal-story" id="signal-story"><div className="shell">
      <div className="section-topline" data-reveal><span>02 / THE OPERATING LOOP</span><span>ILLUSTRATIVE WORKFLOW</span></div>
      <div className="section-heading split-heading" data-reveal><h2>An update should lead<br /><span className="dim">to something happening.</span></h2><p>Knowing about a problem is only the start. What matters is what happens next, who owns it, and how everyone knows it’s done.</p></div>
      <div className="signal-visual" data-reveal><img src="/operational-signal.webp" alt="Close-up of industrial machinery and an active sensor" loading="lazy" decoding="async" /><div className="grain" aria-hidden="true" /><div className="signal-overlay">
        <div className="signal-alert"><span className="alert-icon">!</span><div><small>NEW ISSUE</small><strong>Material shortage before next shift</strong></div><span className="signal-time">14:32</span></div>
        <div className="signal-trace" aria-hidden="true"><span /><span /><span /><span /><span /></div>
        <div className="stage-grid">{stages.map((stage) => { const Icon = stage.icon; return <article key={stage.title} className="stage-card"><div className="stage-head"><span>{stage.number}</span><Icon size={20} strokeWidth={1.5} /></div><h3>{stage.title}</h3><p>{stage.copy}</p></article>; })}</div>
      </div></div>
    </div></section>

    <section className="explorer" id="explorer"><div className="shell">
      <div className="section-topline" data-reveal><span>03 / WHERE AI FITS</span><span>PICK AN AREA</span></div>
      <div className="section-heading split-heading" data-reveal><h2>Where could work<br /><span className="dim">move differently?</span></h2><p>Even when information is available, work can stall because the next step isn’t clear. Pick an area to see where it slows down, how AI could help, and what your team would still decide.</p></div>
      <div className="explorer-grid" data-reveal><div className="explorer-tabs" role="tablist" aria-label="Manufacturing operating areas">{opportunities.map((item, index) => <button key={item.id} id={`opportunity-tab-${item.id}`} role="tab" aria-selected={activeOpportunity === index} aria-controls="opportunity-panel" tabIndex={activeOpportunity === index ? 0 : -1} onClick={() => setActiveOpportunity(index)} onKeyDown={(event) => selectOpportunityFromKeyboard(event, index)}><span>{item.index}</span>{item.label}<ArrowRight size={18} /></button>)}</div>
        <div className="explorer-panel" id="opportunity-panel" role="tabpanel" aria-labelledby={`opportunity-tab-${active.id}`}><div className="grain" aria-hidden="true" /><div className="panel-orbit" aria-hidden="true"><span /><span /><span /></div><div className="panel-index">{active.index}</div><h3 key={active.id} className="panel-title">{active.title}</h3><div className="panel-facts"><div><small>WHERE IT SLOWS DOWN</small><p>{active.friction}</p></div><div><small>HOW AI COULD HELP</small><p>{active.ai}</p></div><div><small>WHAT YOUR TEAM DECIDES</small><p>{active.human}</p></div></div><div className="panel-footer"><div><small>WHAT WE’D MEASURE</small><strong>{active.measure}</strong></div><div><small>FIRST QUESTION WE’D ASK</small><strong>{active.question}</strong></div></div></div>
      </div>
    </div></section>

    <section className="approach" id="approach"><div className="shell">
      <div className="section-topline" data-reveal><span>04 / HOW WE START</span><span>ONE WORKFLOW AT A TIME</span></div>
      <div className="approach-layout"><div className="approach-intro" data-reveal><h2>Start with one workflow. <span className="dim">Build from proof.</span></h2><p>A focused paid pilot tests whether AI can improve work your plant already does. We agree on the measure before starting, review the result together, and only then decide what should expand.</p><a href="#contact">Discuss a workflow <ArrowUpRight size={18} /></a></div><div className="approach-steps">{[["01", "Choose a recurring bottleneck", "Start with an operational workflow that costs time or delays action, such as material readiness or quality issue closure."], ["02", "Understand the real work", "Walk through recent examples with the people who run it, including the systems, messages, decisions and handovers."], ["03", "Agree on the measure", "Set a baseline and decide what would count as a useful improvement for your plant."], ["04", "Run a focused paid pilot", "Apply AI to the routine coordination steps while your team reviews important decisions and verifies the outcome."], ["05", "Expand what works", "Review the evidence together. If the pilot proves useful, identify the next workflow or team where the approach could help."]].map(([n, title, copy]) => <article key={n} data-reveal><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div>
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
                {leadError ? <p className="form-error" role="alert" aria-live="polite">{leadError}</p> : null}
                <button className="button button-amber" type="submit" disabled={leadSubmitting} aria-busy={leadSubmitting}>
                  {leadSubmitting ? "Sending" : "Start a conversation"} <ArrowUpRight size={20} />
                </button>
                <small className="form-note">Name, email, company and role are required. We use your details to review and respond to your enquiry.</small>
              </form>
            ) : (
              <div className="lead-success" aria-live="polite">
                <p>Thanks, we’ve received your details and will get back to you personally.</p>
                <button className="text-button" type="button" onClick={() => { setLeadSubmitted(false); setLeadError(""); setLeadFieldErrors({}); }}>Submit another response</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    <footer className="site-footer"><div className="shell">
      <div className="footer-grid"><a className="wordmark" href="#top" aria-label="Xplormate home"><img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" /><span>Xplormate<span className="brand-dot">.</span></span></a><address className="footer-address"><MapPin size={15} strokeWidth={1.5} /><span>BTM, 2nd Stage,<br />Bengaluru, 560076</span></address><div className="footer-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href={`mailto:${businessEmail}`}><Mail size={15} /> Email</a><a href={linkedinProfile} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={16} /></a></div></div>
      <div className="footer-bar bracketed"><span>© {new Date().getFullYear()} XPLORMATE</span><img className="footer-mark" src="/xplormate-logo.jpg" alt="" width="28" height="28" /><span>AI FOR MANUFACTURING OPERATIONS</span></div>
    </div></footer>
  </main>;
}
