# Hướng dẫn cấu hình Network

## Tổng quan kiến trúc mạng

```
Internet
    │
    ▼
[Router/Modem] ──── 192.168.1.1
    │
    ├── Windows Host ──── 192.168.1.10 (DHCP hoặc tĩnh)
    │
    ├── VM1 (aaPanel) ──── 192.168.1.50 (Bridge - IP tĩnh)
    │       │
    │       └── Docker Network: 172.20.0.0/16 (Internal)
    │           ├── api-gateway ── 172.20.0.x
    │           ├── postgres ───── 172.20.0.x
    │           ├── redis ──────── 172.20.0.x
    │           └── nginx ──────── 172.20.0.x (ports 80, 443)
    │
    └── VM2 (Docker AI) ── 192.168.1.100 (Bridge - IP tĩnh)
            │
            └── Docker Network: 172.21.0.0/16 (Internal)
                ├── stable-diffusion ── port 7860
                ├── real-esrgan ─────── port 7861
                └── video-engine ────── port 7862
```

## VMware Network Modes

### VM1: Bridge Mode (BẮT BUỘC)
- **Tại sao Bridge?** VM1 cần IP thật trong mạng LAN để:
  - Trỏ domain DNS tới IP cố định
  - Cài SSL certificate (Certbot cần verify qua HTTP)
  - Truy cập được từ Internet

**Cấu hình trong VMware:**
1. VM Settings → Network Adapter → **Bridged**
2. Tick ✅ "Replicate physical network connection state"

### VM2: Bridge Mode (Khuyến nghị)
- Dùng Bridge để VM1 giao tiếp trực tiếp với VM2 qua LAN
- Không cần đi qua NAT → latency thấp hơn

## Firewall Rules (UFW trên VM1)

```bash
# Cho phép
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8888/tcp  # aaPanel

# Chặn truy cập trực tiếp DB từ bên ngoài
sudo ufw deny 5432/tcp   # PostgreSQL
sudo ufw deny 6379/tcp   # Redis

# Cho phép VM2 kết nối vào API
sudo ufw allow from 192.168.1.100 to any port 8000

# Kích hoạt
sudo ufw enable
```

## Kết nối VM1 ↔ VM2

### Từ VM1 gọi VM2 (AI dispatch):
```
AI_ENGINE_URL=http://192.168.1.100:7860
```

### Từ VM2 callback VM1 (task completion):
```
CALLBACK_URL=http://192.168.1.50:8000/ai/webhook/complete
```

### Test kết nối:
```bash
# Từ VM1, test VM2
curl http://192.168.1.100:7860/sdapi/v1/options

# Từ VM2, test VM1
curl http://192.168.1.50:8000/health
```

## Port Forwarding (Router)

Để truy cập từ Internet, forward ports trên router:

| Port External | Port Internal | Trỏ tới | Mô tả |
|---------------|---------------|---------|-------|
| 80 | 80 | 192.168.1.50 (VM1) | HTTP |
| 443 | 443 | 192.168.1.50 (VM1) | HTTPS |

> ⚠️ **KHÔNG** forward port 7860 (VM2) ra Internet. AI Engine chỉ nên truy cập từ VM1 qua LAN.

## SSL Certificate

```bash
# Cài certbot
sudo apt install -y certbot

# Lấy certificate
sudo certbot certonly --standalone \
  -d vpspanel.io.vn \
  -d api.vpspanel.io.vn \
  --email admin@vpspanel.io.vn \
  --agree-tos

# Auto-renew (cron)
echo "0 0 1 * * certbot renew --post-hook 'docker compose restart nginx'" | sudo crontab -
```

## Troubleshooting

| Vấn đề | Kiểm tra |
|--------|---------|
| VM1 không có IP | `ip a` → kiểm tra ens33 bridge |
| Không truy cập domain | DNS propagation, port forwarding |
| VM1 ↔ VM2 không kết nối | `ping 192.168.1.100`, firewall |
| SSL lỗi | Certbot logs, DNS phải trỏ đúng |
| Docker không start | `docker compose logs`, disk space |
