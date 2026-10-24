import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Trackers from "./trackers";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Xplormate | AI Transformation for Manufacturing Operations",
  description:
    "Xplormate helps manufacturers redesign core production, quality, maintenance and materials workflows with AI. Start with one focused paid pilot, measure the result and expand what works.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI transformation for core manufacturing operations | Xplormate",
    description:
      "Redesign the work that runs your plant. Start with one workflow, put AI to work on routine steps and keep your team in control.",
    url: "/",
    siteName: "Xplormate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI transformation for manufacturing operations | Xplormate",
    description:
      "Redesign core manufacturing workflows with AI. Start with one focused pilot and measure what improves.",
  },
  icons: {
    icon: "/xplormate-logo.jpg",
    shortcut: "/xplormate-logo.jpg",
    apple: "/xplormate-logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        {children}
        <Analytics />
        <Trackers />
      </body>
    </html>
  );
}
