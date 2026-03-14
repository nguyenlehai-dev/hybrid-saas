# VM2 - Docker AI Engine - Hướng Dẫn Deploy

## Tổng Quan

VM2 chạy trên **Windows + Docker Desktop** với GPU NVIDIA, cung cấp:
- **Stable Diffusion WebUI** (AUTOMATIC1111) — tạo ảnh AI qua API
- **Task API** — theo dõi trạng thái task

## Yêu Cầu

| Yêu cầu | Chi tiết |
|----------|----------|
| OS | Windows 10/11 |
| Docker | Docker Desktop với **WSL2 backend** |
| GPU | NVIDIA GPU (RTX 3060+ khuyến nghị) |
| NVIDIA Driver | Phiên bản 535+ |
| RAM | 16GB+ (khuyến nghị 32GB) |
| Disk | 30GB+ trống (cho models + Docker images) |

---

## Bước 1: Chuẩn Bị Docker Desktop

### 1.1. Bật WSL2 Backend
- Docker Desktop → Settings → General → ✅ "Use the WSL 2 based engine"

### 1.2. Bật GPU Support
- Docker Desktop → Settings → Resources → WSL Integration → ✅ Enable

### 1.3. Kiểm tra GPU trong Docker
```cmd
docker run --rm --gpus all nvidia/cuda:12.1.1-base-ubuntu22.04 nvidia-smi
```
**Phải thấy thông tin GPU.** Nếu lỗi → cài lại NVIDIA Driver mới nhất.

---

## Bước 2: Copy Files VM2

Copy toàn bộ thư mục `vm2-ai-engine` vào VM2 Windows, ví dụ `D:\vm2-ai-engine\`

Cấu trúc:
```
D:\vm2-ai-engine\
├── docker-compose.yml
├── .env.example
├── setup.bat
├── sd-webui/
│   └── Dockerfile
├── sd-config/
│   └── config.json
└── task-api/
    └── server.js
```

---

## Bước 3: Chạy Setup

```cmd
cd D:\vm2-ai-engine
setup.bat
```

Script sẽ tạo các thư mục cần thiết và kiểm tra Docker + GPU.

---

## Bước 4: Tải AI Models

### Model bắt buộc (chọn 1):

**SD 1.5 (~4GB, nhanh, ít VRAM):**
```cmd
cd D:\vm2-ai-engine\data\models\Stable-diffusion
curl -L -o v1-5-pruned-emaonly.safetensors "https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors"
```

**SDXL (~6.5GB, chất lượng cao, cần 10GB+ VRAM):**
```cmd
curl -L -o sd_xl_base_1.0.safetensors "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors"
```

### Model tùy chọn:
- **LoRA** → Đặt vào `data\models\Lora\`
- **ControlNet** → Đặt vào `data\models\ControlNet\`
- **VAE** → Đặt vào `data\models\VAE\`

---

## Bước 5: Cấu Hình

```cmd
copy .env.example .env
notepad .env
```

Đổi `SD_API_PASSWORD` thành mật khẩu mạnh:
```
SD_API_PASSWORD=MyStr0ngP@ssw0rd
VM1_API_URL=http://192.168.100.110:8000
```

---

## Bước 6: Build & Khởi Động

```cmd
cd D:\vm2-ai-engine

REM Build image (lần đầu mất 15-30 phút)
docker compose build

REM Khởi động
docker compose up -d

REM Xem logs
docker compose logs -f stable-diffusion
```

⚠️ **Lần đầu khởi động** SD WebUI sẽ tải thêm dependencies, mất thêm 5-10 phút.

---

## Bước 7: Kiểm Tra

### Test SD WebUI API:
```cmd
REM Health check
curl http://localhost:7860/sdapi/v1/sd-models

REM Test generate (đơn giản)
curl -X POST http://localhost:7860/sdapi/v1/txt2img ^
  -u apiuser:MyStr0ngP@ssw0rd ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\": \"a cat\", \"width\": 512, \"height\": 512, \"steps\": 20}"
```

### Test Task API:
```cmd
curl http://localhost:7862/health
```

### Giao diện Web SD (tùy chọn):
Mở browser: `http://localhost:7860`

---

## Bước 8: Kết Nối VM1 ↔ VM2

### Tìm IP của VM2:
```cmd
ipconfig
```
Ghi lại IPv4 Address (ví dụ: `192.168.100.120`)

### Trên VM1 (Ubuntu), cập nhật .env:
```bash
sudo nano /opt/hybrid-saas/.env
# Đổi: AI_ENGINE_URL=http://192.168.100.120:7860
# Restart API:
sudo systemctl restart saas-api
```

### Test kết nối từ VM1:
```bash
curl http://192.168.100.120:7860/sdapi/v1/sd-models
```

---

## Troubleshoot

| Lỗi | Giải pháp |
|-----|-----------|
| `nvidia-smi` không chạy | Cài NVIDIA Driver mới nhất |
| Docker GPU error | Docker Desktop → Settings → bật WSL2 backend |
| Out of memory | Dùng SD 1.5 thay SDXL, thêm `--medvram` vào CLI_ARGS |
| Build quá lâu | Kiểm tra internet, dùng ethernet thay WiFi |
| Port 7860 bị chặn | Tắt firewall hoặc mở port trong Windows Firewall |

---

## VRAM Tips (RTX 3060 = 12GB)

- `--xformers` → giảm VRAM ~30%
- `--no-half-vae` → tránh lỗi NaN
- `--medvram` → nếu bị Out of Memory
- Batch size = 1 cho an toàn
- SD 1.5 dùng ~4GB VRAM, SDXL dùng ~8-10GB
