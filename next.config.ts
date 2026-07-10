import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      // AHM naming brief moved to the proposal framework (ahm.backspaceoddity.com).
      {
        source: "/ajtbd-naming-brief/:path*",
        destination: "https://ahm.backspaceoddity.com/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
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
