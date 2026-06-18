import type { Metadata } from "next";
import { BrandTransformationClient } from "./BrandTransformationClient";
import "./brand-transformation.css";

export const metadata: Metadata = {
  title: "Brand Transformation — Backspace Oddity",
  description:
    "We turn a company into a brand that sells — from strategy and positioning to identity, website, and launch. Evidence-based, modular, AI-native. One continuous process, not five contractors.",
  alternates: {
    canonical: "/brand-transformation",
  },
  openGraph: {
    type: "website",
    url: "https://backspaceoddity.com/brand-transformation",
    title: "Brand Transformation — Backspace Oddity",
    description:
      "We turn a company into a brand that sells — from strategy and positioning to identity, website, and launch. Evidence-based, modular, AI-native.",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Brand transformation & rebranding",
  name: "Brand transformation & rebranding",
  description:
    "End-to-end rebrand and repositioning — strategy and brand platform, brand system, production, migration, and launch. Evidence-based, modular, AI-native. Includes a free brand diagnostic by email.",
  url: "https://backspaceoddity.com/brand-transformation",
  areaServed: "Worldwide",
  provider: {
    "@type": "Organization",
    name: "Backspace Oddity",
    url: "https://backspaceoddity.com",
  },
};

export default function BrandTransformationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <BrandTransformationClient />
    </>
  );
}
