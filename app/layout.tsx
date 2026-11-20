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
  title: "Xplormate | AI agents for manufacturing operations",
  description:
    "Xplormate builds AI agents for manufacturing operations that work on top of your ERP, MES, quality and maintenance systems. Start with one workflow in a small paid pilot.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI agents for manufacturing operations | Xplormate",
    description:
      "AI agents for manufacturing operations, on top of the systems your plant already runs. Your team keeps the decisions.",
    url: "/",
    siteName: "Xplormate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI agents for manufacturing operations | Xplormate",
    description:
      "AI agents for manufacturing operations. Start with one workflow in a small paid pilot.",
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
