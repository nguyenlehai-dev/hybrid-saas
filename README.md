<![CDATA[<div align="center">

# VPS Panel AI

**Nền tảng AI xử lý ảnh thông minh cho doanh nghiệp**

[![CI](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/ci.yml/badge.svg)](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/ci.yml)
[![Deploy](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/deploy-production.yml)

[Website](https://vpspanel.io.vn) · [API Docs](https://api.vpspanel.io.vn/docs) · [Report Bug](https://github.com/nguyenlehai-dev/hybrid-saas/issues/new?template=bug_report.yml) · [Request Feature](https://github.com/nguyenlehai-dev/hybrid-saas/issues/new?template=feature_request.yml)

</div>

---

## Giới thiệu

VPS Panel AI là nền tảng SaaS cung cấp các công cụ AI xử lý ảnh cho doanh nghiệp. Hệ thống sử dụng kiến trúc hybrid gồm 2 server: Main Server (Ubuntu) chạy web application và AI Server (Windows + GPU) chạy Stable Diffusion.

**Các tính năng chính:**

- Tạo ảnh từ văn bản (Text-to-Image) với Stable Diffusion
- Tạo ảnh review sản phẩm chuyên nghiệp cho eCommerce
- Làm đẹp da và retouching ảnh chân dung bằng AI
- Nâng cấp độ phân giải ảnh lên 4K với Real-ESRGAN
- Chỉnh sửa ảnh: xóa nền, thay thế vùng chọn, inpainting
- Cắt ảnh thông minh, tạo video AI
- Hệ thống credits và thanh toán qua SePay

---

## Kiến trúc hệ thống

```
                         Cloudflare (CDN + Tunnel)
                                  |
                  ────────────────┼────────────────
                  |                                |
          VM1 - Main Server                VM2 - AI Server
            (Ubuntu Linux)              (Windows + RTX 3060)
                  |                                |
     ┌────────────┼────────────┐        ┌──────────┼──────────┐
     |            |            |        |                     |
   Nginx      Frontend     Backend    Stable Diffusion    Task API
   :80        Next.js      FastAPI     WebUI :7860       Node.js :7862
              :3000        :8000
                |            |
          ┌─────┼─────┐      |
          |           |      |
      PostgreSQL    Redis    |
        :5432       :6379    |
                             |
                    Internal Network
                   (192.168.100.x)
```

---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, React Icons |
| Backend | FastAPI, SQLAlchemy (Async), AsyncPG, Redis, JWT |
| AI Engine | Stable Diffusion WebUI, Real-ESRGAN, NVIDIA RTX 3060 |
| Database | PostgreSQL 16, Redis 7 |
| Infrastructure | Nginx, Cloudflare Tunnel, Docker, Systemd |
| CI/CD | GitHub Actions (CI, CD, Auto Release) |
| Payment | SePay Payment Gateway, Credit System |

---

## Cấu trúc dự án

```
hybrid-saas/
├── frontend/                     # Next.js Frontend
│   ├── src/app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Styles
│   │   ├── login/page.tsx        # Đăng nhập
│   │   ├── register/page.tsx     # Đăng ký
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard
│   │       ├── generate/page.tsx # Tạo ảnh AI
│   │       ├── gallery/page.tsx  # Thư viện ảnh
│   │       ├── credits/page.tsx  # Nạp credits
│   │       └── admin/page.tsx    # Quản trị
│   ├── public/                   # Static assets
│   ├── package.json
│   └── next.config.js
│
├── api-gateway/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py               # Entry point
│   │   ├── config.py             # Configuration
│   │   ├── database.py           # Database connection
│   │   ├── models.py             # SQLAlchemy models
│   │   ├── routers/
│   │   │   ├── auth.py           # Authentication
│   │   │   ├── admin.py          # Admin endpoints
│   │   │   ├── ai_tasks.py       # AI task management
│   │   │   ├── credits.py        # Credit management
│   │   │   ├── sepay_pg.py       # Payment gateway
│   │   │   ├── webhook.py        # Webhooks
│   │   │   └── landing_pages.py  # Landing pages
│   │   └── services/
│   │       ├── ai_dispatcher.py  # AI Engine dispatcher
│   │       └── credits_service.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── vm2-ai-engine/                # AI Engine (Windows VM)
│   ├── sd-webui/                 # Stable Diffusion
│   ├── task-api/server.js        # Task queue API
│   └── data/models/              # AI Models
│
├── database/
│   ├── init-db.sql               # Schema
│   └── seed-data.sql             # Seed data
│
├── nginx/                        # Nginx configs
├── scripts/                      # Deploy & setup scripts
├── docs/                         # Documentation
├── .github/workflows/            # CI/CD pipelines
├── .env.example                  # Environment template
└── docker-compose.yml
```

---

## Cài đặt

### Yêu cầu

- Node.js >= 20
- Python >= 3.12
- PostgreSQL >= 16
- Redis >= 7
- NVIDIA GPU RTX 3060+ (cho AI Engine)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local        # Sửa giá trị phù hợp
npm run dev                        # http://localhost:3000
```

### Backend

```bash
cd api-gateway
python -m venv venv
source venv/bin/activate           # Linux/Mac
pip install -r requirements.txt
cp ../.env.example .env            # Sửa giá trị phù hợp

# Khởi tạo database
psql -U postgres -f ../database/init-db.sql
psql -U postgres -d hybrid_saas -f ../database/seed-data.sql

uvicorn app.main:app --reload --port 8000   # http://localhost:8000
```

### AI Engine (VM2)

```powershell
cd vm2-ai-engine
.\RUN-SETUP.bat
```

Chi tiết xem tại [vm2-ai-engine/README.md](vm2-ai-engine/README.md).

---

## Biến môi trường

### Backend `.env`

```env
DOMAIN=vpspanel.io.vn
API_URL=https://api.vpspanel.io.vn
FRONTEND_URL=https://vpspanel.io.vn
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/hybrid_saas
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
AI_ENGINE_URL=http://192.168.100.107:7860
AI_ENGINE_TIMEOUT=120
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=https://api.vpspanel.io.vn
```

> **Lưu ý:** Không commit file `.env` lên Git. Chỉ commit `.env.example` với giá trị placeholder.

---

## API Endpoints

Swagger UI: [https://api.vpspanel.io.vn/docs](https://api.vpspanel.io.vn/docs)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập |
| GET | `/auth/me` | Thông tin user hiện tại |
| POST | `/ai-tasks/` | Tạo AI task mới |
| GET | `/ai-tasks/{id}` | Trạng thái task |
| GET | `/credits/balance` | Số dư credits |
| POST | `/credits/purchase` | Mua credits |
| POST | `/webhook/sepay` | SePay callback |
| GET | `/admin/users` | Danh sách users |
| GET | `/admin/stats` | Thống kê hệ thống |

---

## CI/CD

Hệ thống sử dụng GitHub Actions với 4 workflows:

**CI Pipeline** — chạy mỗi khi push/PR vào `main` hoặc `develop`
- Phát hiện thay đổi, chỉ kiểm tra phần bị ảnh hưởng
- Frontend: lint, build
- Backend: lint (ruff), test (pytest), import check
- Quét bảo mật với TruffleHog

**Deploy Production** — chạy khi merge vào `main`
- Sync code qua rsync + SSH
- Cài dependencies, build, restart service
- Health check tự động sau deploy

**Auto Release** — chạy khi PR merged vào `main`
- Tự động tăng version (semver)
- Tạo changelog từ commit history
- Publish GitHub Release

**PR Auto Label** — chạy khi PR được tạo
- Tự động gán label dựa trên file thay đổi

---

## Git Workflow

### Branching

```
main ← production, luôn stable
  └── develop ← tổng hợp features
        ├── feature/xxx ← tính năng mới
        ├── bugfix/xxx  ← sửa bug
        └── hotfix/xxx  ← sửa khẩn cấp
```

### Quy trình

```bash
# Cập nhật develop
git checkout develop
git pull origin develop

# Tạo feature branch
git checkout -b feature/ten-tinh-nang

# Code, commit theo convention
git commit -m "feat: thêm trang dashboard"
git commit -m "fix: sửa lỗi upload file"
git commit -m "docs: cập nhật API docs"

# Push và tạo PR
git push origin feature/ten-tinh-nang
```

Trên GitHub: tạo Pull Request vào `develop` → CI chạy → review → merge.

Khi `develop` đã stable: tạo PR từ `develop` vào `main` → merge → auto deploy.

### Commit Convention

| Prefix | Mô tả |
|--------|--------|
| `feat:` | Tính năng mới |
| `fix:` | Sửa bug |
| `docs:` | Documentation |
| `style:` | UI/CSS |
| `refactor:` | Tái cấu trúc code |
| `test:` | Tests |
| `chore:` | Dependencies, config |

---

## Deployment

### Tự động

Merge PR vào `main` → GitHub Actions deploy tự động.

### Thủ công

```bash
# Backend
cd /opt/hybrid-saas/api-gateway
source venv/bin/activate
git pull origin main
pip install -r requirements.txt
sudo systemctl restart saas-api

# Frontend
cd /path/to/frontend
git pull origin main
npm ci && npm run build
sudo systemctl restart saas-frontend

# Nginx
sudo nginx -s reload
```

### Kiểm tra service

```bash
sudo systemctl status saas-frontend
sudo systemctl status saas-api
journalctl -u saas-api -f      # Xem logs
```

---

## Hướng dẫn cho thành viên mới

1. Clone repo và cài đặt theo hướng dẫn ở trên
2. Luôn tạo branch từ `develop`, không code trực tiếp trên `main` hay `develop`
3. Mỗi PR chỉ làm 1 việc, viết mô tả rõ ràng
4. Chờ CI pass và ít nhất 1 người review trước khi merge
5. Không commit `.env`, `node_modules/`, `venv/`, `__pycache__/`
6. Dùng TypeScript (Frontend) và type hints (Backend)
7. Dùng [Issue Template](https://github.com/nguyenlehai-dev/hybrid-saas/issues/new/choose) để báo bug hoặc đề xuất feature

---

## FAQ

<details>
<summary>Làm sao để thêm thành viên mới?</summary>

Vào repo → Settings → Collaborators → Add people → nhập GitHub username.
</details>

<details>
<summary>CI failed thì làm gì?</summary>

Vào tab Actions trên GitHub, click workflow failed để xem log. Sửa lỗi, push lại, CI chạy lại tự động.
</details>

<details>
<summary>Làm sao rollback khi deploy lỗi?</summary>

```bash
git log --oneline -5
git revert <commit-hash>
git push origin main
```
CI/CD sẽ tự động deploy phiên bản đã revert.
</details>

<details>
<summary>Server setup từ đầu?</summary>

Xem [docs/server-setup.md](docs/server-setup.md).
</details>

---

<div align="center">

Made by [VPS Panel AI Team](https://vpspanel.io.vn)

</div>
]]>
