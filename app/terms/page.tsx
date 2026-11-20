import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Xplormate",
  description: "Terms for using the Xplormate website and submitting an enquiry.",
};

const businessEmail = "jeetendra@xplormate.com";

export default function TermsPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-shell legal-header-inner">
          <Link className="wordmark" href="/" aria-label="Xplormate home">
            <img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" />
            <span>Xplormate<span className="brand-dot">.</span></span>
          </Link>
          <Link className="legal-back" href="/"><span aria-hidden="true">←</span> Back to Xplormate</Link>
        </div>
      </header>

      <article className="legal-shell legal-content">
        <p className="legal-kicker">TERMS / LAST UPDATED 10 SEPTEMBER 2026</p>
        <h1>Terms of Service</h1>
        <p className="legal-lede">These terms describe the basic rules for using the Xplormate website and submitting an enquiry.</p>

        <section>
          <h2>About the website</h2>
          <p>Xplormate builds AI agents for manufacturing operations. The agents, workflows, sample data, examples, and questions on this site are illustrative and support early discovery. They are not a promise of a specific product, result, or pilot.</p>
        </section>

        <section>
          <h2>Using the site</h2>
          <p>You may use the site for lawful, personal, or business evaluation. Do not use it to interfere with the site, attempt unauthorised access, submit misleading information, or introduce malicious code.</p>
        </section>

        <section>
          <h2>Submitting an enquiry</h2>
          <p>If you use the contact form, provide information that is accurate and belongs to you or that you are authorised to share. Submitting your details starts an inbound conversation; it does not create a contract, proposal, pilot, or obligation for either side. Xplormate may decide whether and how to respond.</p>
        </section>

        <section>
          <h2>Information and decisions</h2>
          <p>The site is provided for general information and early-stage discovery. It is not operational, legal, financial, security, or engineering advice. We do not promise that any page will always be available, error-free, or suitable for a particular decision. Review and validate any proposed workflow carefully before applying it to live operations.</p>
        </section>

        <section>
          <h2>Content and availability</h2>
          <p>Xplormate names, copy, visual design, and other original content belong to Xplormate unless stated otherwise. You may view and share the site for its intended purpose, but do not copy or republish it as your own.</p>
          <p>We may update, suspend, or remove parts of the website as the work evolves. We do not guarantee uninterrupted availability.</p>
        </section>

        <section>
          <h2>External links</h2>
          <p>The site may link to third-party services such as LinkedIn. Those services have their own terms and privacy practices, which apply when you use them.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>Questions about these terms can be sent to <a href={`mailto:${businessEmail}`}>{businessEmail}</a>.</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-shell"><Link href="/">Xplormate<span className="brand-dot">.</span></Link><span>AI agents for manufacturing operations.</span></div>
      </footer>
    </main>
  );
}
