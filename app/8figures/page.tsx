import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EightFiguresClient } from "./EightFiguresClient";
import { token, cookieName } from "@/lib/proposal-workspace/chrome";
import { getWorkspacePassword } from "@/lib/proposal-workspace/auth";
import { supabase } from "@/lib/supabase";
import PublishedView from "../published/[slug]/PublishedView";
import "./eightfigures.css";

const SLUG = "8figures";

// BSO-684 step 5/6: render the live page from the canonical DB row instead of the
// bespoke EightFiguresClient + content.ts. Gated by the page row's `render_from_db`
// flag (default false → inert). Flipping it (a one-row UPDATE) is the deliberate
// switch and setting it back is the instant rollback — no env change, no redeploy,
// read per-request (the route is force-dynamic). AC#0: the live page must not change
// without a verified, reversible switch. The DB render matches the live page:
// identical bt- markup (Bt* components mirror EightFiguresClient) and p8fig.css is a
// strict superset of eightfigures.css. If the flag is off or the row is missing/empty,
// fall through to the code render.
async function renderFromDb() {
  if (!supabase) return null;
  const { data: page } = await supabase
    .from("builder_pages")
    .select("render_from_db, published_version_id, published_blocks, published_styles, published_css_key, css_key")
    .eq("id", "p8fig")
    .maybeSingle();
  if (!page || !page.render_from_db) return null;
  let ver: { blocks?: unknown; styles?: unknown; css_key?: string | null } | null = null;
  if (page.published_version_id) {
    const { data: v } = await supabase
      .from("builder_page_versions")
      .select("blocks, styles, css_key")
      .eq("id", page.published_version_id)
      .maybeSingle();
    ver = v ?? null;
  }
  const blocks = Array.isArray(ver?.blocks) ? (ver!.blocks as any[])
    : (Array.isArray(page.published_blocks) ? (page.published_blocks as any[]) : []);
  if (!blocks.length) return null;
  const styles = (ver?.styles ?? page.published_styles) as any;
  const cssId = (ver?.css_key as string | null) || (page.published_css_key as string | null)
    || (page.css_key as string | null) || "p8fig";
  return (
    <>
      <link rel="stylesheet" href={"/builder-css/" + cssId + ".css"} />
      <PublishedView blocks={blocks} styles={styles} slug={SLUG} seed={{ matrix: {}, lock: undefined, questions: undefined } as any} />
    </>
  );
}

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
  const fromDb = await renderFromDb();
  if (fromDb) return fromDb;
  return <EightFiguresClient />;
}
