import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "jetbrains.backspaceoddity.com" }],
        destination: "/w/jetbrains/",
      },
      // jetbrains.backspaceoddity.com/intelligence → staged Campaign Intelligence
      // demo (separate public Vercel deploy; same proxy pattern as /ai-skills).
      {
        source: "/intelligence/",
        has: [{ type: "host", value: "jetbrains.backspaceoddity.com" }],
        destination: "https://jbci-intelligence.vercel.app/",
      },
      {
        source: "/intelligence/:path*",
        has: [{ type: "host", value: "jetbrains.backspaceoddity.com" }],
        destination: "https://jbci-intelligence.vercel.app/:path*",
      },
      {
        source: "/ai-skills/",
        destination: "https://ai-skills-landing-wheat.vercel.app/",
      },
      {
        source: "/ai-skills/:path*",
        destination: "https://ai-skills-landing-wheat.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
