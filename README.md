<![CDATA[<div align="center">

# ⚡ VPS Panel AI — Hybrid SaaS Platform

### Nền tảng AI xử lý ảnh thông minh cho doanh nghiệp

[![CI](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/ci.yml/badge.svg)](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/ci.yml)
[![Deploy](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/nguyenlehai-dev/hybrid-saas/actions/workflows/deploy-production.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 [vpspanel.io.vn](https://vpspanel.io.vn) · 📖 [API Docs](https://api.vpspanel.io.vn/docs) · 🐛 [Report Bug](https://github.com/nguyenlehai-dev/hybrid-saas/issues/new?template=bug_report.yml) · ✨ [Request Feature](https://github.com/nguyenlehai-dev/hybrid-saas/issues/new?template=feature_request.yml)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Git Workflow](#-git-workflow)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Team Guidelines](#-team-guidelines)
- [FAQ](#-faq)

---

## 🎯 Giới thiệu

**VPS Panel AI** là nền tảng SaaS cung cấp các công cụ AI xử lý ảnh thông minh cho doanh nghiệp, bao gồm:

| Tính năng | Mô tả |
|-----------|--------|
| 🖼️ **Tạo ảnh từ văn bản** | Text-to-Image với Stable Diffusion |
| 📸 **Ảnh review sản phẩm** | Tạo ảnh eCommerce chuyên nghiệp |
| ✨ **Làm đẹp da AI** | Retouching ảnh chân dung tự động |
| 🔍 **Nâng cấp 4K** | Super-resolution với Real-ESRGAN |
| 🎨 **Chỉnh sửa ảnh** | Inpainting, xóa nền, thay thế vùng chọn |
| ✂️ **Cắt ảnh thông minh** | Auto-crop thông minh |
| 🎬 **Tạo video AI** | Text-to-Video generation |
| 💳 **Hệ thống credits** | Thanh toán qua SePay, quản lý gói dịch vụ |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    CLOUDFLARE CDN                        │
│               (DNS + DDoS Protection)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Cloudflare Tunnel
┌──────────────────────▼──────────────────────────────────┐
│                 VM1 - Main Server (Ubuntu)               │
│                                                          │
│  ┌─────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │  Nginx   │──▶│   Frontend   │   │    PostgreSQL    │  │
│  │ (Proxy)  │   │  (Next.js)   │   │   (Database)     │  │
│  │  :80     │   │   :3000      │   │    :5432         │  │
│  └────┬─────┘   └──────────────┘   └──────────────────┘  │
│       │                                                   │
│       │         ┌──────────────┐   ┌──────────────────┐  │
│       └────────▶│   Backend    │   │      Redis       │  │
│                 │  (FastAPI)   │──▶│    (Cache)       │  │
│                 │   :8000      │   │    :6379         │  │
│                 └──────┬───────┘   └──────────────────┘  │
└────────────────────────┼────────────────────────────────┘
                         │ Internal Network (192.168.100.x)
┌────────────────────────▼────────────────────────────────┐
│           VM2 - AI Engine (Windows + RTX 3060)           │
│                                                          │
│  ┌──────────────────┐   ┌────────────────────────────┐  │
│  │  Stable Diffusion │   │     Task API (Node.js)    │  │
│  │  WebUI (A1111)    │   │   Job Queue + Processing  │  │
│  │     :7860         │   │        :7862              │  │
│  └──────────────────┘   └────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="33%">

### 🎨 Frontend
- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **React Icons** (Phosphor)
- **CSS Modules**

</td>
<td align="center" width="33%">

### ⚙️ Backend
- **FastAPI** (Python 3.12)
- **SQLAlchemy** (Async ORM)
- **AsyncPG** (PostgreSQL)
- **Redis** (Caching/Queue)
- **JWT** (Authentication)

</td>
<td align="center" width="33%">

### 🤖 AI Engine
- **Stable Diffusion** WebUI
- **Real-ESRGAN** (Upscaling)
- **NVIDIA RTX 3060** (GPU)
- **Node.js** Task API

</td>
</tr>
<tr>
<td align="center">

### 🏗 Infrastructure
- **Nginx** (Reverse Proxy)
- **Cloudflare** (CDN + Tunnel)
- **Docker** (Containerization)
- **Systemd** (Service Manager)

</td>
<td align="center">

### 🔄 CI/CD
- **GitHub Actions**
- **Auto Release**
- **Branch Protection**

</td>
<td align="center">

### 💳 Payments
- **SePay** Payment Gateway
- **Credit System**
- **Webhook Integration**

</td>
</tr>
</table>

---

## 📁 Cấu trúc dự án

```
hybrid-saas/
│
├── 🎨 frontend/                    # Next.js Frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx             # Landing page (Home)
│   │       ├── layout.tsx           # Root layout
│   │       ├── globals.css          # Global styles
│   │       ├── login/page.tsx       # Đăng nhập
│   │       ├── register/page.tsx    # Đăng ký
│   │       └── dashboard/
│   │           ├── page.tsx         # Dashboard chính
│   │           ├── layout.tsx       # Dashboard layout
│   │           ├── generate/page.tsx # Tạo ảnh AI
│   │           ├── gallery/page.tsx  # Thư viện ảnh
│   │           ├── credits/page.tsx  # Nạp credits
│   │           └── admin/page.tsx    # Quản trị hệ thống
│   ├── public/                      # Static files (images, videos)
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
│
├── ⚙️ api-gateway/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py                  # Entry point, middleware, CORS
│   │   ├── config.py                # App configuration
│   │   ├── database.py              # Database connection (AsyncPG)
│   │   ├── models.py                # SQLAlchemy models
│   │   ├── routers/
│   │   │   ├── auth.py              # 🔐 Authentication (JWT)
│   │   │   ├── admin.py             # 👑 Admin endpoints
│   │   │   ├── ai_tasks.py          # 🤖 AI task management
│   │   │   ├── credits.py           # 💰 Credit management
│   │   │   ├── sepay_pg.py          # 💳 SePay payment gateway
│   │   │   ├── webhook.py           # 🔗 Webhook handlers
│   │   │   └── landing_pages.py     # 📄 Landing page management
│   │   └── services/
│   │       ├── ai_dispatcher.py     # 🚀 AI Engine dispatcher
│   │       └── credits_service.py   # 💰 Credit business logic
│   ├── requirements.txt
│   └── Dockerfile
│
├── 🤖 vm2-ai-engine/                # AI Engine (VM2 Windows)
│   ├── sd-webui/                    # Stable Diffusion WebUI
│   ├── task-api/server.js           # Task API server
│   ├── data/models/                 # AI Models (ESRGAN, etc.)
│   ├── SETUP-VM2.ps1                # Auto setup script
│   └── docker-compose.yml
│
├── 🗄 database/                     # Database scripts
│   ├── init-db.sql                  # Schema initialization
│   └── seed-data.sql                # Seed data
│
├── 🌐 nginx/                        # Nginx configuration
│   ├── nginx.conf                   # Main config
│   └── sites/                       # Virtual hosts
│       ├── vpspanel-unified.conf    # Main site config
│       ├── api.conf                 # API subdomain
│       └── frontend.conf            # Frontend config
│
├── 📜 scripts/                      # Utility scripts
│   ├── setup.sh                     # Server setup
│   ├── deploy.sh                    # Deployment script
│   └── connect-vm2.sh               # Connect to VM2
│
├── 📚 docs/                         # Documentation
│   ├── server-setup.md              # Server setup guide
│   └── network-guide.md             # Network configuration
│
├── 🔄 .github/                      # CI/CD & Templates
│   ├── workflows/
│   │   ├── ci.yml                   # CI Pipeline
│   │   ├── deploy-production.yml    # Auto deploy
│   │   ├── auto-release.yml         # Auto versioning
│   │   └── pr-label.yml             # PR auto labeling
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   └── pull_request_template.md     # PR template
│
├── .env.example                     # Environment template
├── .gitignore
├── docker-compose.yml
└── README.md                        # 📖 You are here!
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu hệ thống

| Yêu cầu | Phiên bản |
|----------|-----------|
| Node.js | >= 20.x |
| Python | >= 3.12 |
| PostgreSQL | >= 16 |
| Redis | >= 7 |
| NVIDIA GPU | RTX 3060+ (cho AI Engine) |

### 1. Clone Repository

```bash
git clone https://github.com/nguyenlehai-dev/hybrid-saas.git
cd hybrid-saas
```

### 2. Cài đặt Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Tạo file environment
cp .env.example .env.local
# Sửa .env.local với giá trị phù hợp

# Chạy development
npm run dev
# → http://localhost:3000

# Build production
npm run build
npm start
```

### 3. Cài đặt Backend

```bash
cd api-gateway

# Tạo virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Cài dependencies
pip install -r requirements.txt

# Tạo file environment
cp ../.env.example .env
# Sửa .env với giá trị phù hợp

# Khởi tạo database
psql -U postgres -f ../database/init-db.sql
psql -U postgres -d hybrid_saas -f ../database/seed-data.sql

# Chạy development
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
# → API Docs: http://localhost:8000/docs
```

### 4. Cài đặt AI Engine (VM2 - Windows)

```powershell
# Chạy trên máy Windows có GPU
cd vm2-ai-engine

# Auto setup
.\RUN-SETUP.bat

# Hoặc setup thủ công
.\SETUP-VM2.ps1
```

---

## 🔐 Biến môi trường

### Backend (`.env`)

```env
# Domain
DOMAIN=vpspanel.io.vn
API_URL=https://api.vpspanel.io.vn
FRONTEND_URL=https://vpspanel.io.vn

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/hybrid_saas

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# AI Engine (VM2)
AI_ENGINE_URL=http://192.168.100.107:7860
AI_ENGINE_TIMEOUT=120
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.vpspanel.io.vn
```

> ⚠️ **QUAN TRỌNG**: KHÔNG BAO GIỜ commit file `.env` lên Git. Chỉ commit `.env.example` với giá trị placeholder.

---

## 🔄 CI/CD Pipeline

### Pipeline tổng quan

```
Push Code ──▶ CI (Lint + Test + Build) ──▶ PR Review ──▶ Merge ──▶ Auto Deploy
```

### Workflows

| Workflow | Trigger | Chức năng |
|----------|---------|-----------|
| `ci.yml` | Push/PR → `main`, `develop` | Lint, Test, Build, Security Scan |
| `deploy-production.yml` | Merge → `main` | Auto deploy Frontend + Backend |
| `auto-release.yml` | PR merged → `main` | Tạo version tag + changelog |
| `pr-label.yml` | PR opened | Auto gán label (frontend/backend/infra) |

### CI chi tiết

```
CI Pipeline
├── 🔎 Detect Changes (chỉ test phần thay đổi)
├── 🎨 Frontend CI
│   ├── npm ci
│   ├── npm run lint
│   └── npm run build
├── ⚙️ Backend CI
│   ├── pip install
│   ├── ruff check (lint)
│   ├── ruff format (format check)
│   ├── pytest (tests)
│   └── Import check
├── 🔒 Security Scan
│   ├── TruffleHog (secret detection)
│   └── .env file check
└── ✅ CI Gate (all must pass)
```

---

## 🌿 Git Workflow

### Branching Strategy

```
main (production)
  └── develop (development)
        ├── feature/login-page
        ├── feature/ai-generate
        ├── bugfix/fix-upload
        └── hotfix/critical-fix
```

| Branch | Mục đích | Merge vào |
|--------|----------|-----------|
| `main` | Production code, luôn stable | — |
| `develop` | Development, tổng hợp features | `main` (qua PR) |
| `feature/*` | Tính năng mới | `develop` (qua PR) |
| `bugfix/*` | Sửa bug | `develop` (qua PR) |
| `hotfix/*` | Sửa bug khẩn cấp | `main` + `develop` |

### Quy trình làm việc

```bash
# 1. Cập nhật develop mới nhất
git checkout develop
git pull origin develop

# 2. Tạo feature branch
git checkout -b feature/ten-tinh-nang

# 3. Code và commit (theo Conventional Commits)
git add .
git commit -m "feat: thêm trang dashboard mới"

# 4. Push lên remote
git push origin feature/ten-tinh-nang

# 5. Tạo Pull Request trên GitHub
# → CI tự động chạy
# → Chờ review + approve
# → Merge vào develop
```

### Commit Message Convention

```
<type>: <description>

Ví dụ:
feat: thêm chức năng tạo ảnh AI
fix: sửa lỗi upload file > 10MB
docs: cập nhật README
style: chỉnh CSS trang login
refactor: tái cấu trúc auth middleware
test: thêm unit test cho credit service
chore: cập nhật dependencies
```

---

## 📡 API Documentation

API tự động tạo docs với **Swagger UI**:
- **Production**: [https://api.vpspanel.io.vn/docs](https://api.vpspanel.io.vn/docs)
- **Local**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Endpoints chính

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `POST` | `/auth/register` | Đăng ký tài khoản |
| `POST` | `/auth/login` | Đăng nhập, nhận JWT |
| `GET` | `/auth/me` | Thông tin user hiện tại |
| `POST` | `/ai-tasks/` | Tạo AI task mới |
| `GET` | `/ai-tasks/{id}` | Kiểm tra trạng thái task |
| `GET` | `/credits/balance` | Xem số dư credits |
| `POST` | `/credits/purchase` | Mua credits |
| `POST` | `/webhook/sepay` | SePay payment webhook |
| `GET` | `/admin/users` | (Admin) Danh sách users |
| `GET` | `/admin/stats` | (Admin) Thống kê hệ thống |

---

## 🚢 Deployment

### Cách 1: Tự động qua CI/CD

Merge PR vào `main` → GitHub Actions tự động deploy!

### Cách 2: Deploy thủ công

```bash
# Trên server
cd /opt/hybrid-saas

# Deploy Backend
cd api-gateway
source venv/bin/activate
git pull origin main
pip install -r requirements.txt
sudo systemctl restart saas-api

# Deploy Frontend
cd ../frontend
git pull origin main
npm ci
npm run build
sudo systemctl restart saas-frontend

# Reload Nginx
sudo nginx -s reload
```

### Systemd Services

```bash
# Kiểm tra trạng thái
sudo systemctl status saas-frontend
sudo systemctl status saas-api

# Restart
sudo systemctl restart saas-frontend
sudo systemctl restart saas-api

# Xem logs
journalctl -u saas-frontend -f
journalctl -u saas-api -f
```

---

## 👥 Team Guidelines

### Cho thành viên mới

1. **Clone repo** và đọc README này
2. Cài đặt Frontend + Backend theo hướng dẫn
3. Tạo branch từ `develop`, KHÔNG code trực tiếp trên `main` hay `develop`
4. Luôn tạo PR và chờ review trước khi merge
5. Viết commit message theo convention

### Quy tắc code

- **Frontend**: Dùng TypeScript, không `any`
- **Backend**: Dùng type hints, docstrings cho mỗi endpoint
- **Không commit**: `.env`, `node_modules/`, `venv/`, `__pycache__/`
- **PR nhỏ**: Mỗi PR chỉ làm 1 việc, dễ review

### Issue & Bug Report

- Dùng [Issue Template](https://github.com/nguyenlehai-dev/hybrid-saas/issues/new/choose) để báo bug hoặc đề xuất feature
- Gán label phù hợp: `bug`, `enhancement`, `frontend`, `backend`
- Assign cho người phụ trách

---

## ❓ FAQ

<details>
<summary><b>Làm sao để thêm thành viên mới vào team?</b></summary>

Vào repo → **Settings** → **Collaborators** → **Add people** → nhập GitHub username

</details>

<details>
<summary><b>Tại sao CI failed?</b></summary>

1. Kiểm tra tab **Actions** trên GitHub
2. Click vào workflow failed để xem log chi tiết
3. Sửa lỗi lint/test/build tương ứng
4. Push lại, CI sẽ chạy lại tự động

</details>

<details>
<summary><b>Làm sao để rollback khi deploy lỗi?</b></summary>

```bash
# Xem các commit gần nhất
git log --oneline -5

# Revert commit lỗi
git revert <commit-hash>
git push origin main
# → CI/CD sẽ tự động deploy phiên bản đã revert
```

</details>

<details>
<summary><b>Cấu hình AI Engine (VM2) như thế nào?</b></summary>

Xem chi tiết tại [`vm2-ai-engine/README.md`](vm2-ai-engine/README.md)

</details>

<details>
<summary><b>Server setup từ đầu như thế nào?</b></summary>

Xem chi tiết tại [`docs/server-setup.md`](docs/server-setup.md)

</details>

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ by [VPS Panel AI Team](https://vpspanel.io.vn)**

</div>
]]>
