import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
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
