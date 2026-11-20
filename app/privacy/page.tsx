import type { Metadata } from "next";
import Link from "next/link";
import { clarityId, linkedinPartnerId } from "../trackers";

export const metadata: Metadata = {
  title: "Privacy Policy | Xplormate",
  description: "How Xplormate handles enquiry details, aggregate analytics, and privacy requests.",
};

const businessEmail = "jeetendra@xplormate.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-shell legal-header-inner">
          <Link className="wordmark" href="/" aria-label="Xplormate home">
            <img className="brand-logo" src="/xplormate-logo.jpg" alt="" width="44" height="44" />
            <span>Xplormate<span className="brand-dot">.</span></span>
          </Link>
          <Link className="legal-back" href="/">Back to Xplormate <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <article className="legal-shell legal-content">
        <p className="legal-kicker">POLICY / LAST UPDATED 30 SEPTEMBER 2026</p>
        <h1>Privacy Policy</h1>
        <p className="legal-lede">This policy explains what Xplormate collects through this website, why we use it, and the choices available to you.</p>

        <section>
          <h2>Information you provide</h2>
          <p>When you submit the contact form, we collect your name, email address, company, and role. These fields are required so we can understand who is reaching out and respond to the enquiry. You can also choose to share a short description of the work your team keeps chasing. This is optional.</p>
        </section>

        <section>
          <h2>Information collected automatically</h2>
          <p>The website may collect basic technical and aggregate usage information, such as pages viewed, referring source, approximate location, browser, device, and operating system. We use privacy-focused analytics to understand how the site is used and improve it.</p>
          {linkedinPartnerId || clarityId ? (
            <p>
              We also use {[linkedinPartnerId ? "the LinkedIn Insight Tag, which shows us aggregate information such as the companies, industries and job functions of visitors" : "", clarityId ? "Microsoft Clarity, which helps us see how visitors scroll and use the page" : ""].filter(Boolean).join(", and ")}. These services may set cookies. We do not receive your name or contact details from them, and they are kept separate from the details you submit through the form.
            </p>
          ) : (
            <p>Our current analytics do not use advertising cookies or cross-site identifiers to identify you. Analytics are kept separate from the contact details you submit.</p>
          )}
        </section>

        <section>
          <h2>How we use information</h2>
          <ul>
            <li>To review and respond to an enquiry.</li>
            <li>To understand which parts of the site are useful and improve the experience.</li>
            <li>To protect, maintain, and troubleshoot the website.</li>
            <li>To meet legal, security, or fraud-prevention requirements when necessary.</li>
          </ul>
        </section>

        <section>
          <h2>Sharing and service providers</h2>
          <p>We use trusted service providers for website hosting, secure database storage, aggregate analytics, and basic security. They process information only as needed to provide services for Xplormate. Form submissions are kept separate from anonymous website analytics.</p>
          <p>We may share information when required by law, to protect the website and its users, or to respond to a valid legal request. We do not sell or rent the personal information submitted through this form.</p>
        </section>

        <section>
          <h2>Storage and retention</h2>
          <p>Form submissions are stored in a hosted database that the website server and authorised Xplormate administrators can access. We keep enquiry details while they are useful for reviewing and managing the conversation, then delete or anonymise them when they are no longer needed.</p>
        </section>

        <section>
          <h2>Security and international processing</h2>
          <p>We use reasonable technical and organisational safeguards to protect the information we hold. No online service or transmission can be guaranteed completely secure.</p>
          <p>Our service providers may process or store information in countries where they or their infrastructure operate. We take reasonable steps to use providers with appropriate security and privacy safeguards.</p>
        </section>

        <section>
          <h2>Your requests</h2>
          <p>You may ask us to explain, correct, or delete the personal information you submitted through the form. Contact us at <a href={`mailto:${businessEmail}`}>{businessEmail}</a>. We may need to verify a request before acting on it.</p>
        </section>

        <section>
          <h2>Updates to this policy</h2>
          <p>We may update this policy when the website or its data practices change. The date at the top of this page shows when it was last revised.</p>
        </section>
      </article>

      <footer className="legal-footer">
        <div className="legal-shell"><Link href="/">Xplormate<span className="brand-dot">.</span></Link><span>AI agents for manufacturing operations.</span></div>
      </footer>
    </main>
  );
}
