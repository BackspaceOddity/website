/**
 * Landing lead capture → Slack.
 *
 * Validates the diagnostic form, then posts a formatted message to a Slack
 * Incoming Webhook (channel #лид-джент). The webhook URL lives in
 * SLACK_LEAD_WEBHOOK_URL (.env.local locally, Vercel env in deploy).
 *
 * If the env var is missing we fall back to console.log so nothing breaks
 * (e.g. preview builds without the secret). The visitor always gets `ok`
 * once validation passes — we never block the UX on Slack delivery.
 */
import { NextResponse } from "next/server";

const FIT_LABELS: Record<string, string> = {
  "1": "Barely — it's wide open",
  "2": "Poorly",
  "3": "So-so",
  "4": "Fairly well",
  "5": "Very well — it's crowded",
};

function field(label: string, value: string) {
  return { type: "mrkdwn", text: `*${label}*\n${value || "—"}` };
}

async function sendConfirmationEmail(to: string, name: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[lead] RESEND_API_KEY unset — skipping confirmation email");
    return;
  }
  const from = process.env.LEAD_EMAIL_FROM || "Backspace Oddity <onboarding@resend.dev>";
  const firstName = name.split(/\s+/)[0] || "there";

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#F2F2F0;padding:32px 0;">
    <div style="max-width:520px;margin:0 auto;background:#FAFAF8;border-radius:14px;padding:36px 32px;color:#011C00;">
      <p style="font-size:17px;line-height:1.5;margin:0 0 18px;">Hi ${firstName},</p>
      <p style="font-size:17px;line-height:1.5;margin:0 0 18px;">
        Thanks — we&rsquo;ve got your details. We&rsquo;re putting together your mini brand diagnostic now.
      </p>
      <p style="font-size:17px;line-height:1.5;margin:0 0 18px;">
        It&rsquo;ll land in your inbox within a few hours.
      </p>
      <p style="font-size:17px;line-height:1.5;margin:24px 0 0;">— Backspace Oddity</p>
    </div>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: "We've got your details — your diagnostic is on the way",
      html,
    }),
  });
  if (!res.ok) {
    console.error("[lead] resend failed", res.status, await res.text().catch(() => ""));
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Honeypot: silently accept bots, don't forward.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const company = String(body.company || "").trim();
  const email = String(body.email || "").trim();
  if (!email || !company) {
    return NextResponse.json({ ok: false, error: "company and email are required" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const sell = String(body.sell || "").trim();
  const customer = String(body.customer || "").trim();
  const instead = String(body.instead || "").trim();
  const challenges = String(body.challenges || "").trim();
  const fit = String(body.fit || "").trim();
  const fitLabel = FIT_LABELS[fit] ? `${fit}/5 — ${FIT_LABELS[fit]}` : fit || "—";

  const webhook = process.env.SLACK_LEAD_WEBHOOK_URL;

  if (webhook) {
    const payload = {
      text: `New diagnostic lead — ${company}`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🩺 New diagnostic lead", emoji: true },
        },
        {
          type: "section",
          fields: [field("Name", name), field("Work email", email)],
        },
        {
          type: "section",
          fields: [field("Company / website", company), field("What they sell", sell)],
        },
        {
          type: "section",
          fields: [field("Key customer", customer), field("Used instead", instead)],
        },
        {
          type: "section",
          fields: [field("Market solves it", fitLabel)],
        },
        {
          type: "section",
          text: field("Challenges right now", challenges),
        },
      ],
    };

    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[lead] slack webhook failed", res.status, await res.text().catch(() => ""));
      }
    } catch (err) {
      console.error("[lead] slack webhook error", err);
    }
  } else {
    console.log("[lead]", JSON.stringify({ ...body, at: new Date().toISOString() }));
  }

  // Confirmation email to the lead — best-effort, never blocks the response.
  await sendConfirmationEmail(email, name).catch((err) =>
    console.error("[lead] confirmation email error", err),
  );

  return NextResponse.json({ ok: true });
}
