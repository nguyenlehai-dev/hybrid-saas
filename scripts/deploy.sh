#!/bin/bash
# Deploy script for vpspanel.io.vn
# Run with: echo "123456789" | sudo -S bash deploy.sh

set -e

echo "=== Step 1: PostgreSQL Setup ==="
sudo -u postgres psql -c "ALTER USER saas_admin WITH PASSWORD 'SaasAdmin2026!';" 2>/dev/null || echo "User password may already be set"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hybrid_saas TO saas_admin;" 2>/dev/null || true
sudo -u postgres psql -d hybrid_saas -c "GRANT ALL ON SCHEMA public TO saas_admin;" 2>/dev/null || true
echo "DB user configured."

echo "=== Step 2: Import Schema ==="
sudo -u postgres psql -d hybrid_saas -f /home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/database/init-db.sql 2>&1
echo "Schema imported."

echo "=== Step 3: Import Seed Data ==="
sudo -u postgres psql -d hybrid_saas -f /home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/database/seed-data.sql 2>&1
echo "Seed data imported."

echo "=== Step 4: Create App Directory ==="
mkdir -p /opt/hybrid-saas/{api-gateway,uploads,landing-pages,logs}
cp -r /home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/api-gateway/* /opt/hybrid-saas/api-gateway/
chown -R vpsroot:vpsroot /opt/hybrid-saas

echo "=== Step 5: Python Virtual Environment ==="
cd /opt/hybrid-saas/api-gateway
python3 -m venv venv
source venv/bin/activate
pip install -q -r requirements.txt 2>&1 | tail -3
echo "Python deps installed."

echo "=== Step 6: Create .env ==="
cat > /opt/hybrid-saas/.env <<'ENVEOF'
DOMAIN=vpspanel.io.vn
API_URL=https://vpspanel.io.vn/api
FRONTEND_URL=https://vpspanel.io.vn
DATABASE_URL=postgresql+asyncpg://saas_admin:SaasAdmin2026!@localhost:5432/hybrid_saas
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=VpsPanelAI2026SuperSecretKeyForJWTTokenGeneration48ch
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
AI_ENGINE_URL=http://192.168.1.100:7860
AI_ENGINE_TIMEOUT=120
UPLOAD_DIR=/opt/hybrid-saas/uploads
LANDING_PAGES_DIR=/opt/hybrid-saas/landing-pages
MAX_UPLOAD_SIZE_MB=50
APP_NAME=VPS Panel AI
APP_ENV=production
DEBUG=false
LOG_LEVEL=info
WORKERS=4
ENVEOF
echo ".env created."

echo "=== Step 7: Build Frontend ==="
export NVM_DIR="/home/vpsroot/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/frontend
npm run build 2>&1 | tail -10
mkdir -p /opt/hybrid-saas/frontend
cp -r .next/standalone/* /opt/hybrid-saas/frontend/ 2>/dev/null || cp -r out/* /opt/hybrid-saas/frontend/ 2>/dev/null || cp -r .next /opt/hybrid-saas/frontend/
echo "Frontend built."

echo "=== Step 8: Configure Nginx (Unified Domain) ==="
# Unified site - vpspanel.io.vn handles both frontend and API
cat > /etc/nginx/sites-available/vpspanel.io.vn <<'NGINX1'
server {
    listen 80;
    server_name vpspanel.io.vn www.vpspanel.io.vn;

    client_max_body_size 50M;

    # API proxy - route /api/ requests to FastAPI backend
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
        proxy_send_timeout 60s;
    }

    # Upload files
    location /uploads/ {
        alias /opt/hybrid-saas/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend - Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX1

# Enable site
ln -sf /etc/nginx/sites-available/vpspanel.io.vn /etc/nginx/sites-enabled/
# Remove old api subdomain config and default
rm -f /etc/nginx/sites-enabled/api.vpspanel.io.vn
rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t && systemctl reload nginx
echo "Nginx configured (unified domain)."

echo "=== Step 9: Create Systemd Services ==="
# API Gateway service
cat > /etc/systemd/system/saas-api.service <<'SVC1'
[Unit]
Description=VPS Panel AI - API Gateway
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=vpsroot
WorkingDirectory=/opt/hybrid-saas/api-gateway
Environment=PATH=/opt/hybrid-saas/api-gateway/venv/bin:/usr/bin
EnvironmentFile=/opt/hybrid-saas/.env
ExecStart=/opt/hybrid-saas/api-gateway/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --proxy-headers
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVC1

# Frontend service
cat > /etc/systemd/system/saas-frontend.service <<'SVC2'
[Unit]
Description=VPS Panel AI - Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=vpsroot
WorkingDirectory=/home/vpsroot/.gemini/antigravity/scratch/hybrid-saas/frontend
Environment=PATH=/home/vpsroot/.nvm/versions/node/v20.20.1/bin:/usr/bin
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/home/vpsroot/.nvm/versions/node/v20.20.1/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SVC2

systemctl daemon-reload
echo "Systemd services created."

echo "=== Step 10: Start Services ==="
systemctl enable saas-api saas-frontend
systemctl start saas-api
systemctl start saas-frontend
echo "Services started."

echo ""
echo "============================================="
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "============================================="
echo "  Website:  http://vpspanel.io.vn"
echo "  API:      http://vpspanel.io.vn/api"  
echo "  Health:   curl http://localhost:8000/health"
echo "============================================="
