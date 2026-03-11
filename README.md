# vipauto_161

Production website for VIPАвто (Шахты), built with Next.js + TypeScript + Tailwind + GSAP.

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

Production deployment instructions are in:

- `docs/deploy-reg-ru.md`

Ready-to-use deployment files:

- `ecosystem.config.cjs` (PM2)
- `deploy/nginx/vipauto161.conf` (Nginx reverse proxy)
- `deploy/scripts/deploy.sh` (pull + build + reload)
- `.env.production.example`

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
