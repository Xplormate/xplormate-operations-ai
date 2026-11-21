import Script from "next/script";

// Optional visitor-insight tools. Each one loads only when its ID is set in
// Vercel environment variables, so nothing is tracked until you switch it on.
//   NEXT_PUBLIC_LINKEDIN_PARTNER_ID  -> LinkedIn Insight Tag (which companies / job titles visit)
//   NEXT_PUBLIC_CLARITY_ID           -> Microsoft Clarity (scroll maps and session recordings)
export const linkedinPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "";
export const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

export default function Trackers() {
  return (
    <>
      {linkedinPartnerId ? (
        <>
          <Script id="linkedin-insight" strategy="afterInteractive">{`
            window._linkedin_partner_id = "${linkedinPartnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
            (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
            var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");
            b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b,s);})(window.lintrk);
          `}</Script>
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://px.ads.linkedin.com/collect/?pid=${linkedinPartnerId}&fmt=gif`} />
          </noscript>
        </>
      ) : null}
      {clarityId ? (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");
        `}</Script>
      ) : null}
    </>
  );
}
