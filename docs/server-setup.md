# Настройка сервера REG.RU для vipauto_161

Пошаговая инструкция по настройке VPS на REG.RU для развёртывания Next.js приложения.

## Требования

- VPS на Ubuntu 22.04 или 24.04
- Домен `vipauto161.ru` с A-записью на IP сервера
- SSH доступ с правами sudo

---

## Шаг 1: Подключение к серверу

```bash
ssh root@<IP-адрес-сервера>
```

---

## Шаг 2: Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Шаг 3: Установка необходимых пакетов

```bash
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx
```

---

## Шаг 4: Установка Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Проверка
node -v  # должно быть v20.x.x
npm -v   # должно быть 10.x.x
```

---

## Шаг 5: Установка PM2 глобально

```bash
sudo npm i -g pm2
pm2 -v
```

---

## Шаг 6: Настройка брандмауэра (UFW)

```bash
# Разрешить SSH
sudo ufw allow OpenSSH

# Разрешить HTTP и HTTPS
sudo ufw allow 'Nginx Full'

# Включить брандмауэр
sudo ufw --force enable

# Проверить статус
sudo ufw status
```

Ожидаемый вывод:
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

---

## Шаг 7: Создание пользователя для деплоя (опционально, но рекомендуется)

```bash
# Создать пользователя
sudo adduser deploy

# Добавить в группу sudo
sudo usermod -aG sudo deploy

# Переключиться на пользователя
su - deploy
```

---

## Шаг 8: Настройка SSH-ключей (рекомендуется)

На локальном компьютере:
```bash
# Скопировать SSH ключ на сервер
ssh-copy-id deploy@<IP-адрес-сервера>
```

---

## Шаг 9: Клонирование репозитория

```bash
cd /var/www
sudo chown -R $USER:$USER /var/www

git clone <URL-репозитория> vipauto_161
cd vipauto_161
```

---

## Шаг 10: Настройка переменных окружения

```bash
# Скопировать шаблон
cp .env.example .env.production

# Отредактировать (вставить реальные токены)
nano .env.production
```

Проверить, что установлены:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

---

## Шаг 11: Установка зависимостей и сборка

```bash
npm ci
npm run build
```

---

## Шаг 12: Запуск приложения через PM2

```bash
# Создать директорию для логов PM2
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Запустить приложение
pm2 start ecosystem.config.cjs

# Сохранить список процессов
pm2 save

# Настроить автозапуск при загрузке
pm2 startup
```

Выполнить команду, которую выведет `pm2 startup` (с sudo).

Проверить статус:
```bash
pm2 status
```

---

## Шаг 13: Настройка Nginx

```bash
# Скопировать конфиг
sudo cp deploy/nginx/vipauto161.conf /etc/nginx/sites-available/vipauto161.conf

# Создать симлинк
sudo ln -sf /etc/nginx/sites-available/vipauto161.conf /etc/nginx/sites-enabled/vipauto161.conf

# Удалить дефолтный сайт (если есть)
sudo rm -f /etc/nginx/sites-enabled/default

# Проверить конфиг
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx
```

---

## Шаг 14: Настройка SSL (Let's Encrypt)

```bash
# Получить сертификат
sudo certbot --nginx -d vipauto161.ru -d www.vipauto161.ru

# Проверить автообновление
sudo certbot renew --dry-run
```

---

## Шаг 15: Проверка работы

```bash
# Проверка локально
curl -I http://127.0.0.1:3000

# Проверка через домен
curl -I https://vipauto161.ru

# Проверка health endpoint
curl https://vipauto161.ru/api/health

# Логи PM2
pm2 logs vipauto161 --lines 50

# Логи Nginx
sudo tail -n 50 /var/log/nginx/vipauto161.error.log
```

---

## Шаг 16: Настройка деплоя

```bash
# Сделать скрипт исполняемым
chmod +x deploy/scripts/deploy.sh

# Создать директорию для логов деплоя
sudo mkdir -p /var/log/deploy
sudo chown -R $USER:$USER /var/log/deploy

# Запустить деплой
./deploy/scripts/deploy.sh main
```

---

## Быстрые команды для управления

```bash
# Статус приложения
pm2 status

# Логи в реальном времени
pm2 logs vipauto161

# Перезапуск
pm2 restart vipauto161

# Остановка
pm2 stop vipauto161

# Удаление
pm2 delete vipauto161

# Перезагрузка Nginx
sudo systemctl reload nginx

# Статус Nginx
sudo systemctl status nginx
```

---

## Решение проблем

### Приложение не запускается

```bash
# Проверить логи PM2
pm2 logs vipauto161 --lines 100

# Проверить порт
netstat -tlnp | grep 3000

# Проверить переменные окружения
pm2 show vipauto161
```

### Ошибка 502 Bad Gateway

```bash
# Проверить, работает ли приложение
curl -I http://127.0.0.1:3000

# Проверить логи Nginx
sudo tail -f /var/log/nginx/vipauto161.error.log
```

### Проблемы с SSL

```bash
# Обновить сертификат
sudo certbot renew

# Проверить статус
sudo certbot certificates
```

---

## Контакты для экстренных случаев

- REG.RU техподдержка: https://www.reg.ru/support/
- Telegram бот для заявок: @BotFather
