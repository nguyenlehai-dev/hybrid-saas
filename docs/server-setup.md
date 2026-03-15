# Hướng dẫn cài đặt VM1 - Ubuntu Server 22.04

## Yêu cầu hệ thống
- Ubuntu Server 22.04 LTS (VMware Workstation)
- RAM: 16GB
- SSD: Samsung 1TB (NVMe khuyến nghị)
- Network: Bridge mode

## Bước 1: Tạo VM trên VMware

1. **File → New Virtual Machine → Custom**
2. Cấu hình:
   - OS: Ubuntu 64-bit
   - RAM: 16384 MB (16GB)
   - CPU: 4 cores
   - Disk: 200GB (Thin Provisioning trên SSD Samsung)
   - Network: **Bridged** (quan trọng!)

3. Cài Ubuntu Server từ ISO:
   - Chọn **OpenSSH Server** trong quá trình cài đặt
   - Partition: Dùng toàn bộ disk, format ext4

## Bước 2: Cấu hình IP tĩnh

Sau khi cài xong, đặt IP tĩnh để domain trỏ được stable:

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

```yaml
network:
  version: 2
  ethernets:
    ens33:  # Tên interface có thể khác
      dhcp4: no
      addresses:
        - 192.168.1.50/24  # IP tĩnh bạn chọn
      routes:
        - to: default
          via: 192.168.1.1  # Gateway router
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

```bash
sudo netplan apply
```

## Bước 3: Chạy Setup Script

```bash
# Tải project về
cd /opt
sudo git clone <repository_url> hybrid-saas
cd hybrid-saas

# Chạy script cài đặt
sudo bash scripts/setup.sh
```

Script sẽ tự động:
- ✅ Cập nhật hệ thống
- ✅ Cài Docker, PostgreSQL 15, Redis
- ✅ Cài aaPanel
- ✅ Cấu hình firewall
- ✅ Tạo database + schema
- ✅ Tạo file .env với random passwords

## Bước 4: Cấu hình Domain

1. **Trỏ DNS** tại nhà cung cấp domain:
   ```
   vpspanel.io.vn     → A Record → <IP_VM1>
   vpspanel.io.vn/api → A Record → <IP_VM1>
   ```

2. **Cài SSL** (sau khi DNS đã propagate):
   ```bash
   docker compose run certbot certonly \
     --webroot -w /var/www/certbot \
     -d vpspanel.io.vn \
     -d vpspanel.io.vn/api \
     --email admin@vpspanel.io.vn \
     --agree-tos
   ```

## Bước 5: Khởi động Services

```bash
cd /opt/hybrid-saas

# Sửa config
cp .env.example .env
nano .env  # Cập nhật AI_ENGINE_URL = IP của VM2

# Start
docker compose up -d

# Kiểm tra
docker compose ps
curl http://localhost:8000/health
```

## Bước 6: Cấu hình aaPanel

```bash
# Xem thông tin đăng nhập aaPanel
bt default
```

Truy cập aaPanel tại `http://<IP_VM1>:8888` và:
1. Cài Nginx, PHP, MySQL (nếu cần thêm)
2. Tạo website cho `vpspanel.io.vn`
3. Cấu hình SSL trong aaPanel

## Kiểm tra cuối cùng

```bash
# Test API
curl https://vpspanel.io.vn/api/health

# Test đăng ký
curl -X POST https://vpspanel.io.vn/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"Test123!"}'

# Xem logs
docker compose logs -f api-gateway
```
