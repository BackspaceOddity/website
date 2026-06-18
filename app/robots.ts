import type { MetadataRoute } from "next";

// Allow everything (the prior default), and name the AI answer-engine crawlers
// explicitly so they're unambiguously permitted (GEO/AEO).
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Amazonbot",
    "Meta-ExternalAgent",
    "CCBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiBots, allow: "/" },
    ],
    sitemap: "https://backspaceoddity.com/sitemap.xml",
    host: "https://backspaceoddity.com",
  };
}
