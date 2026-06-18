import type { MetadataRoute } from "next";

// Public marketing pages. Auth-gated / client workspace routes are intentionally
// excluded. Extend this list as new public pages ship.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://backspaceoddity.com";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/brand-transformation`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
