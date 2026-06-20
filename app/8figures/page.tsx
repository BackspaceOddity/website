import type { Metadata } from "next";
import { EightFiguresClient } from "./EightFiguresClient";
import "./eightfigures.css";

export const metadata: Metadata = {
  title: "8FIGURES — Brand Sprint · Backspace Oddity",
  description:
    "A Brand Sprint for 8FIGURES: positioning, ICP through jobs, Messaging House, and a redesigned landing that looks like it's for people with real money. Fundable before the August Valley trip.",
  robots: { index: false, follow: false },
};

export default function EightFiguresPage() {
  return <EightFiguresClient />;
}
