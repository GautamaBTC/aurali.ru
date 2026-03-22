# 🚀 Быстрый старт деплоя на REG.RU

## Чеклист перед деплоем

- [ ] VPS на REG.RU (Ubuntu 22.04/24.04)
- [ ] Домен настроен (A-запись на IP сервера)
- [ ] SSH доступ есть
- [ ] Бот Telegram создан (@BotFather)
- [ ] `.env.production` заполнен

---

## Команды для копирования

### 1. Подготовка сервера

```bash
# Обновление и установка пакетов
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2
sudo npm i -g pm2

# Firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 2. Развёртывание приложения

```bash
# Клонирование
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <URL-репозитория> vipauto_161
cd vipauto_161

# Переменные окружения
cp .env.example .env.production
nano .env.production  # вставить TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID

# Установка и сборка
npm ci
npm run build

# PM2
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # выполнить команду из вывода!
```

### 3. Настройка Nginx

```bash
sudo cp deploy/nginx/vipauto161.conf /etc/nginx/sites-available/vipauto161.conf
sudo ln -sf /etc/nginx/sites-available/vipauto161.conf /etc/nginx/sites-enabled/vipauto161.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL сертификат

```bash
sudo certbot --nginx -d vipauto161.ru -d www.vipauto161.ru
```

### 5. Деплой

```bash
chmod +x deploy/scripts/deploy.sh
./deploy/scripts/deploy.sh main
```

---

## Проверка

```bash
# Статус
pm2 status

# Логи
pm2 logs vipauto161

# Health check
curl http://127.0.0.1:3000/api/health

# Сайт
curl -I https://vipauto161.ru
```

---

## Следующие деплои

```bash
./deploy/scripts/deploy.sh main
```

Или кратко:
```bash
git pull && npm ci && npm run build && pm2 restart vipauto161
```
