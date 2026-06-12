import type { Metadata } from "next";
import { BrandTransformationClient } from "./BrandTransformationClient";
import "./brand-transformation.css";

export const metadata: Metadata = {
  title: "Brand Transformation — Backspace Oddity",
  description:
    "We turn a company into a brand that sells — from strategy and positioning to identity, website, and launch. Evidence-based, modular, AI-native. One continuous process, not five contractors.",
  openGraph: {
    type: "website",
    url: "https://backspaceoddity.com/brand-transformation",
    title: "Brand Transformation — Backspace Oddity",
    description:
      "We turn a company into a brand that sells — from strategy and positioning to identity, website, and launch. Evidence-based, modular, AI-native.",
  },
};

export default function BrandTransformationPage() {
  return <BrandTransformationClient />;
}
