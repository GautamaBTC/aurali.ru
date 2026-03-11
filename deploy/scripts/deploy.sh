#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/vipauto_161"
BRANCH="${1:-main}"

echo "[deploy] App dir: ${APP_DIR}"
echo "[deploy] Branch: ${BRANCH}"

cd "${APP_DIR}"

echo "[deploy] Fetching latest code..."
git fetch origin
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

echo "[deploy] Installing dependencies..."
npm ci

echo "[deploy] Building app..."
npm run build

echo "[deploy] Restarting PM2 process..."
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

echo "[deploy] Done."

