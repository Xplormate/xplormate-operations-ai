import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev badge in the corner while reviewing locally. It never shows in production.
  devIndicators: false,
};

export default nextConfig;
