import type { Metadata } from "next";
import { cookies } from "next/headers";
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
export default async function EightFiguresPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const accessKey = await getWorkspacePassword(SLUG);
  if (accessKey) {
    const jar = await cookies();
    const ok = jar.get(cookieName(SLUG))?.value === token(accessKey, SLUG);
    if (!ok) {
      const { e } = await searchParams;
      return <LoginGate err={e === "1"} />;
    }
  }
  return <EightFiguresClient />;
}

// Two-panel password splash — visually consistent with the /w workspace gate.
function LoginGate({ err = false }: { err?: boolean }) {
  return (
    <div className="ef-gate">
      <style>{`
        .ef-gate { min-height: 100vh; display: flex; font-family: var(--font-text), system-ui, sans-serif; }
        .ef-gate__left { flex: 1; background: #011C00 url('/images/hero-bg-magenta-green.webp') center / cover no-repeat; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .ef-gate__logo { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .ef-gate__logo img { width: 120px; height: 120px; }
        .ef-gate__logo span { color: #F2F2F0; font-size: 26px; font-weight: 500; line-height: 1.2; text-align: center; }
        .ef-gate__right { width: 520px; flex-shrink: 0; background: #FAFAF8; display: flex; flex-direction: column; justify-content: center; padding: 72px 64px; }
        .ef-gate__title { font-size: 30px; font-weight: 400; color: #011C00; line-height: 1.3; margin: 0 0 8px; }
        .ef-gate__sub { font-family: ui-monospace, Menlo, monospace; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #9A9A9A; margin: 0 0 40px; }
        .ef-gate input { display: block; width: 100%; padding: 16px 18px; font-size: 20px; background: #E8E8E6; border: 1.5px solid #E5E3DC; color: #011C00; outline: none; margin-bottom: 14px; appearance: none; }
        .ef-gate input:focus { border-color: #011C00; background: #FAFAF8; }
        .ef-gate button { display: block; width: 100%; padding: 18px 0; font-family: ui-monospace, Menlo, monospace; font-size: 13px; font-weight: 500; letter-spacing: 0.10em; text-transform: uppercase; background: #011C00; color: #FAFAF8; border: none; cursor: pointer; }
        .ef-gate button:hover { opacity: 0.78; }
        .ef-gate__err { font-size: 14px; color: rgba(26,26,26,0.5); font-style: italic; margin-top: 14px; }
        @media (max-width: 640px) { .ef-gate { flex-direction: column; } .ef-gate__left { flex: none; height: 220px; } .ef-gate__right { width: 100%; padding: 40px 24px 48px; } }
      `}</style>
      <div className="ef-gate__left">
        <div className="ef-gate__logo">
          <img src="/images/Logo Mark.svg" alt="Backspace Oddity" />
          <span>Backspace<br />Oddity</span>
        </div>
      </div>
      <div className="ef-gate__right">
        <p className="ef-gate__title">8FIGURES</p>
        <p className="ef-gate__sub">Backspace Oddity</p>
        <form method="POST" action="/8figures/login/">
          <input type="password" name="code" placeholder="Enter password" autoFocus autoComplete="current-password" />
          <button type="submit">Enter →</button>
          {err ? <p className="ef-gate__err">Incorrect password.</p> : null}
        </form>
      </div>
    </div>
  );
}
