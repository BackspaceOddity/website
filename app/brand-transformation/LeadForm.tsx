"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

const EMPTY = {
  company: "",
  sell: "",
  customer: "",
  instead: "",
  challenges: "",
  fit: "3",
  email: "",
  website: "", // honeypot
};

const FIT_LABELS: Record<string, string> = {
  "1": "Barely — it's wide open",
  "2": "Poorly",
  "3": "So-so",
  "4": "Fairly well",
  "5": "Very well — it's crowded",
};

export function LeadForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bt-form__done">
        Thanks — we&apos;ll put together your diagnostic and email it to you shortly.
      </div>
    );
  }

  return (
    <form className="bt-form" onSubmit={submit}>
      <label className="bt-field">
        <span>Company / website</span>
        <input
          required
          value={form.company}
          onChange={set("company")}
          placeholder="company.com"
          autoComplete="url"
        />
      </label>

      <label className="bt-field">
        <span>What do you sell? — one sentence</span>
        <input
          required
          value={form.sell}
          onChange={set("sell")}
          placeholder="e.g. invoicing software for freelance designers"
        />
      </label>

      <label className="bt-field">
        <span>Who is your key customer? — role + type of company</span>
        <input
          required
          value={form.customer}
          onChange={set("customer")}
          placeholder="e.g. head of finance at a 50–200-person startup"
        />
      </label>

      <label className="bt-field">
        <span>What do people use instead of you? — 2–3 alternatives, or “they just put up with it”</span>
        <textarea
          rows={3}
          value={form.instead}
          onChange={set("instead")}
          placeholder="Direct rivals, a spreadsheet, a manual workaround, doing nothing…"
        />
      </label>

      <label className="bt-field">
        <span>What challenges are you facing right now?</span>
        <textarea
          rows={3}
          value={form.challenges}
          onChange={set("challenges")}
          placeholder="What's getting in the way — growth, positioning, a launch, fragmented brand…"
        />
      </label>

      <label className="bt-field bt-range">
        <span>How well do today&apos;s options solve this for your customers?</span>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={form.fit}
          onChange={set("fit")}
        />
        <div className="bt-range__scale" aria-hidden="true">
          <span>1</span>
          <span>5</span>
        </div>
        <em className="bt-range__val">{FIT_LABELS[form.fit]}</em>
      </label>

      <label className="bt-field">
        <span>Work email</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={set("email")}
          autoComplete="email"
          placeholder="you@company.com"
        />
        <small className="bt-field__hint">
          Please use your work email — that&apos;s where the diagnostic lands.
        </small>
      </label>

      {/* honeypot — hidden from humans, bots tend to fill it */}
      <input
        className="bt-hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={form.website}
        onChange={set("website")}
      />

      <button className="bt-pill" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send me the diagnostic"}
        <span className="bt-pill__arrow" aria-hidden="true">→</span>
      </button>

      {status === "error" && (
        <p className="bt-form__err">
          Something went wrong — try again, or email{" "}
          <a href="mailto:yegor@backspaceoddity.com">yegor@backspaceoddity.com</a>.
        </p>
      )}
    </form>
  );
}
