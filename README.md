# 🚀 VPS Panel AI (Hybrid SaaS)

Nền tảng AI SaaS - Tạo nội dung AI thông minh.

## 📁 Cấu trúc dự án

```
hybrid-saas/
├── frontend/     # Next.js 14 + TypeScript
├── backend/      # FastAPI + PostgreSQL
└── README.md
```

## ⚡ Cài đặt nhanh

### Frontend
```bash
cd frontend
npm install
npm run dev       # Chạy development tại http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Linux/Mac
pip install -r requirements.txt
cp .env.example .env        # Cấu hình biến môi trường
uvicorn app.main:app --reload --port 8000
```

## 🔧 Biến môi trường (Backend)

Tạo file `backend/.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/hybrid_saas
REDIS_URL=redis://localhost:6379/0
DOMAIN=vpspanel.io.vn
API_URL=https://api.vpspanel.io.vn
FRONTEND_URL=https://vpspanel.io.vn
```

## 🛠 Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Backend | FastAPI, SQLAlchemy, AsyncPG |
| Database | PostgreSQL |
| Cache | Redis |
| Proxy | Nginx + Cloudflare |

## 👥 Team

Liên hệ admin để được thêm vào dự án.
