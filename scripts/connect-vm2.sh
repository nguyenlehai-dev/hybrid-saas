#!/bin/bash
# ============================================================
# Connect VM1 to VM2 AI Engine
# Usage: sudo bash connect-vm2.sh <VM2_IP>
# Example: sudo bash connect-vm2.sh 192.168.100.120
# ============================================================

set -e

VM2_IP="${1}"

if [ -z "$VM2_IP" ]; then
    echo "❌ Usage: sudo bash connect-vm2.sh <VM2_IP>"
    echo "   Example: sudo bash connect-vm2.sh 192.168.100.120"
    exit 1
fi

echo "============================================================"
echo " Connecting VM1 to VM2 AI Engine"
echo " VM2 IP: $VM2_IP"
echo "============================================================"

# 1. Test connectivity to VM2
echo ""
echo "[1/4] Testing connection to VM2..."
if ping -c 1 -W 3 "$VM2_IP" > /dev/null 2>&1; then
    echo "   ✅ VM2 ($VM2_IP) reachable"
else
    echo "   ⚠️  VM2 ($VM2_IP) not responding to ping (may be firewall)"
    echo "   Continuing anyway..."
fi

# Test SD WebUI port
if curl -sf --connect-timeout 5 "http://$VM2_IP:7860/sdapi/v1/sd-models" > /dev/null 2>&1; then
    echo "   ✅ SD WebUI API reachable on port 7860"
else
    echo "   ⚠️  SD WebUI not reachable yet on port 7860"
    echo "   (Make sure Docker is running on VM2)"
fi

# 2. Update Nginx config
echo ""
echo "[2/4] Updating Nginx config..."
NGINX_CONF="/etc/nginx/sites-available/nulith.io.vn"

# Backup current config
cp "$NGINX_CONF" "${NGINX_CONF}.bak.$(date +%s)"

cat > "$NGINX_CONF" << 'NGINX_EOF'
server {
    listen 80;
    server_name nulith.io.vn www.nulith.io.vn;

    client_max_body_size 50M;

    # ── AI Engine Proxy (VM2 RTX 3060) ──
    # Stable Diffusion WebUI API
    location /ai-engine/ {
        rewrite ^/ai-engine/(.*) /$1 break;
        proxy_pass http://VM2_IP_PLACEHOLDER:7860;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_connect_timeout 10s;
        proxy_buffering off;
    }

    # VM2 Task API
    location /ai-tasks/ {
        rewrite ^/ai-tasks/(.*) /$1 break;
        proxy_pass http://VM2_IP_PLACEHOLDER:7862;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    # VM2 AI Generated Images
    location /ai-outputs/ {
        rewrite ^/ai-outputs/(.*) /outputs/$1 break;
        proxy_pass http://VM2_IP_PLACEHOLDER:7862;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

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
NGINX_EOF

# Replace placeholder with actual VM2 IP
sed -i "s/VM2_IP_PLACEHOLDER/$VM2_IP/g" "$NGINX_CONF"
echo "   ✅ Nginx config updated"

# 3. Update .env
echo ""
echo "[3/4] Updating API .env..."
ENV_FILE="/opt/hybrid-saas/.env"
if [ -f "$ENV_FILE" ]; then
    sed -i "s|AI_ENGINE_URL=.*|AI_ENGINE_URL=http://$VM2_IP:7860|g" "$ENV_FILE"
    echo "   ✅ AI_ENGINE_URL → http://$VM2_IP:7860"
else
    echo "   ⚠️  $ENV_FILE not found"
fi

# 4. Reload services
echo ""
echo "[4/4] Reloading services..."
nginx -t && systemctl reload nginx
echo "   ✅ Nginx reloaded"

if systemctl is-active --quiet saas-api; then
    systemctl restart saas-api
    echo "   ✅ saas-api restarted"
fi

echo ""
echo "============================================================"
echo " ✅ VM1 connected to VM2 ($VM2_IP)!"
echo ""
echo " Architecture:"
echo "   nulith.io.vn"
echo "     ├── /           → Frontend (VM1:3000)"
echo "     ├── /api/        → API Gateway (VM1:8000)"
echo "     ├── /ai-engine/  → SD WebUI (VM2:7860)"
echo "     ├── /ai-tasks/   → Task API (VM2:7862)"
echo "     └── /ai-outputs/ → AI Images (VM2:7862)"
echo ""
echo " Test: curl http://nulith.io.vn/ai-engine/sdapi/v1/sd-models"
echo "============================================================"
