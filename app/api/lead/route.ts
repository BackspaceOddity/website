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
          fields: [field("Company / website", company), field("Work email", email)],
        },
        {
          type: "section",
          fields: [field("What they sell", sell), field("Key customer", customer)],
        },
        {
          type: "section",
          fields: [field("Used instead", instead), field("Market solves it", fitLabel)],
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

  return NextResponse.json({ ok: true });
}
