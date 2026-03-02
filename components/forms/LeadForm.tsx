"use client";

import { FormEvent, useMemo, useState } from "react";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/siteConfig";

type FormState = "idle" | "loading" | "success" | "error";

type Errors = {
  name?: string;
  phone?: string;
};

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(services[0]?.title ?? "");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const phoneRaw = useMemo(() => phone.replace(/[^\d+]/g, ""), [phone]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Введите имя (минимум 2 символа).";
    if (!/^\+?\d{11,15}$/.test(phoneRaw)) next.phone = "Введите телефон в международном формате.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setFormState("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneRaw, service, message }),
      });

      if (!response.ok) {
        throw new Error("request failed");
      }

      setFormState("success");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setFormState("error");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 md:space-y-6" noValidate>
      <label htmlFor="lead-name" className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-300">Имя</span>
        <input
          id="lead-name"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
          placeholder="Как к вам обращаться"
        />
        {errors.name ? (
          <span id="lead-name-error" className="mt-2 block text-sm leading-normal text-red-500">
            {errors.name}
          </span>
        ) : null}
      </label>
      <label htmlFor="lead-phone" className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-300">Телефон</span>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lead-phone-error" : undefined}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
          placeholder="+7 (___) ___-__-__"
        />
        {errors.phone ? (
          <span id="lead-phone-error" className="mt-2 block text-sm leading-normal text-red-500">
            {errors.phone}
          </span>
        ) : null}
      </label>
      <label htmlFor="lead-service" className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-300">Услуга</span>
        <select
          id="lead-service"
          name="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
        >
          {services.map((item) => (
            <option key={item.id} value={item.title}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor="lead-message" className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-300">Комментарий</span>
        <textarea
          id="lead-message"
          name="message"
          autoComplete="off"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
          placeholder="Кратко опишите задачу"
        />
      </label>
      <button
        type="submit"
        disabled={formState === "loading"}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-500 disabled:opacity-75"
      >
        {formState === "loading" ? "Отправка..." : "Отправить заявку"}
      </button>
      {formState === "success" ? (
        <p className="text-sm leading-normal text-emerald-500" role="status" aria-live="polite">
          Заявка отправлена. Мы свяжемся с вами.
        </p>
      ) : null}
      {formState === "error" ? (
        <p className="text-sm leading-normal text-amber-500" role="alert">
          Не удалось отправить автоматически. Напишите нам в{" "}
          <a href={siteConfig.social.whatsapp} className="underline">
            WhatsApp
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
