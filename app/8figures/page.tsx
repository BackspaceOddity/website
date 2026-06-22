import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EightFiguresClient } from "./EightFiguresClient";
import { token, cookieName } from "@/lib/proposal-workspace/chrome";
import { getWorkspacePassword } from "@/lib/proposal-workspace/auth";
import "./eightfigures.css";

const SLUG = "8figures";

// Force per-request rendering: the password gate reads cookies() + Supabase at
// request time. Without this, an empty build-time password prerenders the page
// statically and the gate never runs in production.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "8FIGURES — Growth Foundations Sprint · Backspace Oddity",
  description:
    "A Growth Foundations Sprint for 8FIGURES: positioning, ICP through jobs, brand system, and a redesigned site — ready before the Silicon Valley trip.",
  robots: { index: false, follow: false },
};

// Same gate as the /w/<slug> proposal workspace: password lives in Supabase
// (`workspaces` row, slug "8figures") with a WS_PW_8FIGURES env fallback for
// local dev. Empty password → ungated. Reusing token()/cookieName() keeps the
// cookie identical to the /w system, so migrating the render to /w/8figures
// later needs no re-login and no URL change (seamless for the client).
//
// The LOGIN SCREEN is the canonical loginHtml() served by app/8figures/login
// (GET) — byte-identical to the Urembo gate. We never re-implement it here.
export default async function EightFiguresPage() {
  const accessKey = await getWorkspacePassword(SLUG);
  if (accessKey) {
    const jar = await cookies();
    const ok = jar.get(cookieName(SLUG))?.value === token(accessKey, SLUG);
    if (!ok) redirect("/8figures/login");
  }
  return <EightFiguresClient />;
}
