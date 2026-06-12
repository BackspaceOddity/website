"use client";

import { useState } from "react";
import type { Lang } from "./content";

type Status = "idle" | "sending" | "done" | "error";

const EMPTY = {
  name: "",
  company: "",
  sell: "",
  customer: "",
  instead: "",
  challenges: "",
  fit: "3",
  email: "",
  website: "", // honeypot
};

const STRINGS: Record<Lang, {
  name: string; namePh: string;
  company: string; companyPh: string;
  sell: string; sellPh: string;
  customer: string; customerPh: string;
  instead: string; insteadPh: string;
  challenges: string; challengesPh: string;
  fitQ: string; fit: Record<string, string>;
  email: string; emailPh: string; emailHint: string;
  send: string; sending: string;
  done: string;
  errPre: string; errPost: string;
}> = {
  en: {
    name: "Your name", namePh: "First and last",
    company: "Company / website", companyPh: "company.com",
    sell: "What do you sell? — one sentence", sellPh: "e.g. invoicing software for freelance designers",
    customer: "Who is your key customer? — role + type of company", customerPh: "e.g. head of finance at a 50–200-person startup",
    instead: "What do people use instead of you? — 2–3 alternatives, or “they just put up with it”", insteadPh: "Direct rivals, a spreadsheet, a manual workaround, doing nothing…",
    challenges: "What challenges are you facing right now?", challengesPh: "What's getting in the way — growth, positioning, a launch, fragmented brand…",
    fitQ: "How well do today's options solve this for your customers?",
    fit: { "1": "Barely — it's wide open", "2": "Poorly", "3": "So-so", "4": "Fairly well", "5": "Very well — it's crowded" },
    email: "Work email", emailPh: "you@company.com", emailHint: "Please use your work email — that's where the diagnostic lands.",
    send: "Send me the diagnostic", sending: "Sending…",
    done: "Thanks — we'll put together your diagnostic and email it to you shortly.",
    errPre: "Something went wrong — try again, or email ", errPost: ".",
  },
  ru: {
    name: "Ваше имя", namePh: "Имя и фамилия",
    company: "Компания / сайт", companyPh: "company.com",
    sell: "Что вы продаёте? — одним предложением", sellPh: "напр. софт для счетов фрилансерам-дизайнерам",
    customer: "Кто ваш ключевой клиент? — роль + тип компании", customerPh: "напр. финдиректор в стартапе на 50–200 человек",
    instead: "Чем пользуются вместо вас? — 2–3 альтернативы или «просто терпят»", insteadPh: "Прямые конкуренты, таблица, ручной костыль, ничего…",
    challenges: "Какие у вас вызовы прямо сейчас?", challengesPh: "Что мешает — рост, позиционирование, запуск, разрозненный бренд…",
    fitQ: "Насколько сегодняшние решения закрывают это для ваших клиентов?",
    fit: { "1": "Почти никак — поле открыто", "2": "Плохо", "3": "Так себе", "4": "Неплохо", "5": "Очень хорошо — тесно" },
    email: "Рабочий email", emailPh: "вы@company.com", emailHint: "Укажите рабочий email — туда придёт диагностика.",
    send: "Прислать диагностику", sending: "Отправляем…",
    done: "Спасибо — соберём вашу мини-диагностику и пришлём на почту в ближайшее время.",
    errPre: "Что-то пошло не так — попробуйте ещё раз или напишите на ", errPost: ".",
  },
};

export function LeadForm({ lang = "en" }: { lang?: Lang }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const t = STRINGS[lang];

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
    return <div className="bt-form__done">{t.done}</div>;
  }

  return (
    <form className="bt-form" onSubmit={submit}>
      <label className="bt-field">
        <span>{t.name}</span>
        <input required value={form.name} onChange={set("name")} placeholder={t.namePh} autoComplete="name" />
      </label>

      <label className="bt-field">
        <span>{t.company}</span>
        <input required value={form.company} onChange={set("company")} placeholder={t.companyPh} autoComplete="url" />
      </label>

      <label className="bt-field">
        <span>{t.sell}</span>
        <input required value={form.sell} onChange={set("sell")} placeholder={t.sellPh} />
      </label>

      <label className="bt-field">
        <span>{t.customer}</span>
        <input required value={form.customer} onChange={set("customer")} placeholder={t.customerPh} />
      </label>

      <label className="bt-field">
        <span>{t.instead}</span>
        <textarea rows={3} value={form.instead} onChange={set("instead")} placeholder={t.insteadPh} />
      </label>

      <label className="bt-field">
        <span>{t.challenges}</span>
        <textarea rows={3} value={form.challenges} onChange={set("challenges")} placeholder={t.challengesPh} />
      </label>

      <label className="bt-field bt-range">
        <span>{t.fitQ}</span>
        <input type="range" min="1" max="5" step="1" value={form.fit} onChange={set("fit")} />
        <div className="bt-range__scale" aria-hidden="true">
          <span>1</span>
          <span>5</span>
        </div>
        <em className="bt-range__val">{t.fit[form.fit]}</em>
      </label>

      <label className="bt-field">
        <span>{t.email}</span>
        <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder={t.emailPh} />
        <small className="bt-field__hint">{t.emailHint}</small>
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
        {status === "sending" ? t.sending : t.send}
        <span className="bt-pill__arrow" aria-hidden="true">→</span>
      </button>

      {status === "error" && (
        <p className="bt-form__err">
          {t.errPre}
          <a href="mailto:yegor@backspaceoddity.com">yegor@backspaceoddity.com</a>
          {t.errPost}
        </p>
      )}
    </form>
  );
}
