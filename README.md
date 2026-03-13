# vipauto_161

Production website for ВИПАВТО (Шахты), built with Next.js + TypeScript + Tailwind + GSAP.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Deploy (REG.RU VPS)

### Quick Start

1. **Setup server** — follow [`docs/server-setup.md`](docs/server-setup.md)
2. **Configure env** — copy `.env.example` to `.env.production` and fill in:
   - `TELEGRAM_BOT_TOKEN` — create bot via @BotFather
   - `TELEGRAM_CHAT_ID` — your chat ID for notifications
3. **Deploy** — run `./deploy/scripts/deploy.sh main`

### Documentation

- [`docs/quick-deploy.md`](docs/quick-deploy.md) — copy-paste commands
- [`docs/server-setup.md`](docs/server-setup.md) — full server setup guide
- [`docs/deploy-reg-ru.md`](docs/deploy-reg-ru.md) — detailed deployment guide

### Deployment Files

- `ecosystem.config.cjs` — PM2 process manager config
- `deploy/nginx/vipauto161.conf` — Nginx reverse proxy (HTTPS + security headers)
- `deploy/scripts/deploy.sh` — automated deploy script
- `.env.example` — environment variables template
- `app/api/health/route.ts` — health check endpoint

## Features

- 📱 Responsive design with dark premium theme
- ⚡ GSAP animations with reduced-motion support
- 📊 Yandex.Metrika analytics support
- 🔔 Telegram bot notifications for leads
- 📝 Lead form with rate limiting (3 requests / 10 min)
- 🔒 HTTPS with Let's Encrypt SSL
- 🚀 PM2 process manager for production

## Motion Debug And Rules

- Real mobile browsers can differ from desktop DevTools emulation for `prefers-reduced-motion` and compositor behavior.
- Project motion policy is centralized in `lib/motion.ts`.
- Global CSS reduce-motion hard-stop is applied only when `html[data-reduce-motion="true"]`.

### Runtime Debug Flag

- Force animations on: `?debug-motion=1` (also `true` or `on`).
- Force reduced-motion mode: `?debug-motion=0` (also `false` or `off`).
- Example: `https://vipauto161.ru/?debug-motion=1`

### Postmortem Notes (2026-03-06)

- Do not hide base content by default in CSS (`visibility: hidden`) unless there is a guaranteed no-JS fallback.
- Do not rely on a one-off boot class for first paint visibility.
- Avoid direct `window.matchMedia("(prefers-reduced-motion: reduce)")` checks scattered across components.
- For mobile text animations, avoid compositor conflicts (`translateZ(0)` and forced 3D where not needed).
