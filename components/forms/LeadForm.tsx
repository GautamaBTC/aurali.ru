"use client";

import { ChangeEvent, FormEvent, KeyboardEvent, useMemo, useRef, useState } from "react";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/siteConfig";

type FormState = "idle" | "loading" | "success" | "error";

type Errors = {
  name?: string;
  phone?: string;
};

const PHONE_PREFIX = "+7 (";
const PHONE_START_CURSOR = 4;
const PHONE_MASK_PLACEHOLDER = "+7 (___) ___-__-__";
const DIGIT_TO_CURSOR = [4, 5, 6, 9, 10, 11, 13, 14, 16, 17, 18] as const;

function normalizeLocalDigits(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("8") || digits.startsWith("7")) {
    return digits.slice(1, 11);
  }

  if (digits.startsWith("9")) {
    return digits.slice(0, 10);
  }

  return digits.slice(0, 10);
}

function formatPhone(localDigits: string) {
  if (!localDigits) {
    return PHONE_PREFIX;
  }

  const area = localDigits.slice(0, 3);
  const first = localDigits.slice(3, 6);
  const second = localDigits.slice(6, 8);
  const third = localDigits.slice(8, 10);

  let result = PHONE_PREFIX + area;

  if (localDigits.length >= 3) {
    result += ")";
  }

  if (first) {
    result += ` ${first}`;
  }

  if (second) {
    result += `-${second}`;
  }

  if (third) {
    result += `-${third}`;
  }

  return result;
}

function getCursorFromDigitsCount(count: number) {
  if (count <= 0) {
    return PHONE_START_CURSOR;
  }

  if (count >= 10) {
    return DIGIT_TO_CURSOR[10];
  }

  return DIGIT_TO_CURSOR[count];
}

export function LeadForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastKeyRef = useRef<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(services[0]?.title ?? "");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const localDigits = useMemo(() => normalizeLocalDigits(phone), [phone]);
  const cleanPhone = useMemo(() => (localDigits.length === 10 ? `7${localDigits}` : ""), [localDigits]);

  const setCaret = (position: number) => {
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      input.setSelectionRange(position, position);
    });
  };

  const validate = () => {
    const nextErrors: Errors = {};

    if (name.trim().length < 2) {
      nextErrors.name = "Введите имя, минимум 2 символа.";
    }

    if (localDigits.length !== 10) {
      nextErrors.phone = "Введите номер полностью в формате +7 (___) ___-__-__.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePhoneFocus = () => {
    if (!phone) {
      setPhone(PHONE_PREFIX);
      setCaret(PHONE_START_CURSOR);
      return;
    }

    if (phone === PHONE_PREFIX) {
      setCaret(PHONE_START_CURSOR);
    }
  };

  const handlePhoneBlur = () => {
    if (normalizeLocalDigits(phone).length < 10) {
      setPhone("");
    }
  };

  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    lastKeyRef.current = event.key;
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const selectionStart = event.target.selectionStart ?? rawValue.length;
    const typedLocalDigits = normalizeLocalDigits(rawValue);
    const digitsBeforeCursor = normalizeLocalDigits(rawValue.slice(0, selectionStart)).length;
    const previousValue = phone;
    const previousDigits = normalizeLocalDigits(previousValue);
    const lastKey = lastKeyRef.current;

    if (!typedLocalDigits) {
      if (lastKey === "Backspace" || lastKey === "Delete" || rawValue === "") {
        setPhone("");
        return;
      }

      if (rawValue.includes("7") || rawValue.includes("8") || rawValue.includes("9") || rawValue.includes("+")) {
        setPhone(PHONE_PREFIX);
        setCaret(PHONE_START_CURSOR);
        return;
      }

      setPhone("");
      return;
    }

    const formatted = formatPhone(typedLocalDigits);
    setPhone(formatted);

    const nextDigitsCount = Math.min(digitsBeforeCursor, typedLocalDigits.length);
    const nextCursor = getCursorFromDigitsCount(nextDigitsCount);

    if (
      lastKey === "Backspace" &&
      previousValue === PHONE_PREFIX &&
      selectionStart <= PHONE_START_CURSOR &&
      previousDigits.length === 0
    ) {
      setPhone("");
      return;
    }

    setCaret(nextCursor);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setFormState("loading");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: cleanPhone,
          service,
          message,
        }),
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
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
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
          className="input-field"
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
          ref={inputRef}
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onFocus={handlePhoneFocus}
          onBlur={handlePhoneBlur}
          onKeyDown={handlePhoneKeyDown}
          onChange={handlePhoneChange}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "lead-phone-error lead-phone-hint" : "lead-phone-hint"}
          className="input-field font-mono tracking-[0.04em]"
          inputMode="tel"
          placeholder={PHONE_MASK_PLACEHOLDER}
        />
        <span id="lead-phone-hint" className="mt-2 block text-xs leading-normal text-zinc-500">
          {PHONE_MASK_PLACEHOLDER}
        </span>
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
          className="input-field"
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
          className="input-field"
          placeholder="Кратко опишите задачу"
        />
      </label>

      <button
        type="submit"
        disabled={formState === "loading"}
        className="hero-btn-primary inline-flex h-12 w-full items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-base font-semibold text-[#0b0b0b] shadow-[0_0_22px_rgba(204,255,0,0.28)] transition-all duration-200 disabled:opacity-75"
        style={{ color: "#0b0b0b", WebkitTextFillColor: "#0b0b0b" }}
      >
        {formState === "loading" ? "Отправка..." : "Оставить заявку"}
      </button>

      {formState === "success" ? (
        <p className="text-sm leading-normal text-[var(--accent)]" role="status" aria-live="polite">
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
