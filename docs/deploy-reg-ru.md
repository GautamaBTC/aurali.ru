# Deploy on REG.RU (VPS) for `vipauto_161`

This guide prepares a Next.js app for production on a REG.RU VPS with:
- Ubuntu 22.04+
- Node.js 20 LTS
- PM2 process manager
- Nginx reverse proxy
- Let's Encrypt SSL

## 1. What you need

- REG.RU Cloud VPS (Ubuntu 22.04 or 24.04)
- Domain pointing to VPS IP (`A` record), e.g. `vipauto161.ru` and `www`
- SSH access with sudo
- Repository access on server

## 2. Initial server setup

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw certbot python3-certbot-nginx
```

Enable firewall:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

Install Node.js 20 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Install PM2 globally:

```bash
sudo npm i -g pm2
pm2 -v
```

## 3. Deploy project files

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <YOUR_REPO_URL> vipauto_161
cd vipauto_161
```

Copy env template and set real values:

```bash
cp .env.production.example .env.production
nano .env.production
```

Install and build:

```bash
npm ci
npm run build
```

## 4. Start app with PM2

Use included PM2 config (`ecosystem.config.cjs`):

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup` (with sudo), then:

```bash
pm2 status
```

App should run on `127.0.0.1:3000`.

## 5. Configure Nginx

Copy provided config:

```bash
sudo cp deploy/nginx/vipauto161.conf /etc/nginx/sites-available/vipauto161.conf
```

Edit domain names if needed:

```bash
sudo nano /etc/nginx/sites-available/vipauto161.conf
```

Enable site:

```bash
sudo ln -sf /etc/nginx/sites-available/vipauto161.conf /etc/nginx/sites-enabled/vipauto161.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Enable SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d vipauto161.ru -d www.vipauto161.ru
```

Check auto-renew:

```bash
sudo certbot renew --dry-run
```

## 7. Update workflow (next deploys)

Use provided script:

```bash
chmod +x deploy/scripts/deploy.sh
./deploy/scripts/deploy.sh main
```

What it does:
- `git pull`
- `npm ci`
- `npm run build`
- `pm2 startOrReload ecosystem.config.cjs`

## 8. Health checks

```bash
curl -I http://127.0.0.1:3000
curl -I https://vipauto161.ru
pm2 logs vipauto161 --lines 100
sudo tail -n 100 /var/log/nginx/vipauto161.error.log
```

## 9. Rollback quick steps

```bash
cd /var/www/vipauto_161
git log --oneline -n 10
git checkout <KNOWN_GOOD_COMMIT>
npm ci
npm run build
pm2 restart vipauto161
```

## 10. Notes for REG.RU shared hosting

This Next.js app needs a Node.js runtime. Shared hosting without persistent Node processes is not suitable.
Use REG.RU VPS/Cloud server for stable production deployment.

