#!/usr/bin/env bash
set -euo pipefail

# Конфигурация
APP_DIR="/var/www/vipauto_161"
BRANCH="${1:-main}"
LOG_FILE="/var/log/deploy/vipauto161-deploy.log"

# Создаём директорию для логов
mkdir -p /var/log/deploy

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: $*" | tee -a "$LOG_FILE" >&2
}

log "=========================================="
log "Начало деплоя vipauto_161"
log "Ветка: $BRANCH"
log "=========================================="

cd "${APP_DIR}"

# Проверка окружения
log "Проверка окружения..."
if ! command -v node &> /dev/null; then
    error "Node.js не установлен"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm не установлен"
    exit 1
fi

if ! command -v pm2 &> /dev/null; then
    error "PM2 не установлен"
    exit 1
fi

log "✓ Node.js: $(node -v)"
log "✓ npm: $(npm -v)"
log "✓ PM2: $(pm2 -v)"

# Проверка .env.production
if [ ! -f ".env.production" ]; then
    error ".env.production не найден!"
    log "Создайте файл .env.production в ${APP_DIR}"
    exit 1
fi
log "✓ .env.production найден"

# Git pull
log "Получение последних изменений..."
git fetch origin
git checkout "${BRANCH}"

if ! git pull --ff-only origin "${BRANCH}" 2>&1 | tee -a "$LOG_FILE"; then
    error "Не удалось получить изменения из репозитория"
    exit 1
fi
log "✓ Код обновлён"

# Установка зависимостей
log "Установка зависимостей..."
if ! npm ci 2>&1 | tee -a "$LOG_FILE"; then
    error "Не удалось установить зависимости"
    # Попытка отката
    log "Попытка отката..."
    npm install 2>&1 | tee -a "$LOG_FILE" || true
fi
log "✓ Зависимости установлены"

# Сборка
log "Сборка приложения..."
if ! npm run build 2>&1 | tee -a "$LOG_FILE"; then
    error "Сборка не удалась!"
    log "Откат к предыдущей версии..."
    exit 1
fi
log "✓ Сборка завершена"

# Перезапуск PM2
log "Перезапуск приложения..."
if ! pm2 startOrReload ecosystem.config.cjs 2>&1 | tee -a "$LOG_FILE"; then
    error "Не удалось запустить PM2"
    exit 1
fi

pm2 save 2>&1 | tee -a "$LOG_FILE"
log "✓ PM2 перезапущен"

# Проверка статуса
log "Проверка статуса..."
pm2 status vipauto161 2>&1 | tee -a "$LOG_FILE"

# Проверка здоровья
log "Проверка здоровья приложения..."
sleep 2
if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
    log "✓ Приложение работает"
else
    error "Приложение не отвечает на 127.0.0.1:3000"
    pm2 logs vipauto161 --lines 50 --nostream 2>&1 | tee -a "$LOG_FILE"
    exit 1
fi

log "=========================================="
log "✅ Деплой завершён успешно!"
log "=========================================="
