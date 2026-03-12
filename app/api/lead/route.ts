import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/siteConfig";
import type { LeadPayload } from "@/types";

const limitMap = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 3;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const history = limitMap.get(ip) ?? [];
  const actual = history.filter((item) => now - item < WINDOW_MS);
  if (actual.length >= LIMIT) {
    limitMap.set(ip, actual);
    return true;
  }
  actual.push(now);
  limitMap.set(ip, actual);
  return false;
}

function formatTelegramMessage(payload: LeadPayload): string {
  return [
    "🔌 *Новая заявка с сайта ВИПАВТО*",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    `Услуга: ${payload.service}`,
    `Комментарий: ${payload.message || "-"}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip = getClientIp(request);
  if (isRateLimited(ip, now)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Partial<LeadPayload>;
  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const service = body.service?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2 || !/^\+?\d{11,15}$/.test(phone) || service.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: true, fallback: siteConfig.social.whatsapp });
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage({ name, phone, service, message }),
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ ok: true, fallback: siteConfig.social.whatsapp });
  }

  return NextResponse.json({ ok: true });
}
