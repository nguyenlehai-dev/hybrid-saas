"""
Hybrid SaaS AI Platform - FastAPI API Gateway
Main application entry point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.routers import auth, credits, ai_tasks, landing_pages


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # Startup
    async with engine.begin() as conn:
        # Create tables if they don't exist (dev only; use migrations in prod)
        if settings.APP_ENV == "development":
            await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    description="Hybrid SaaS AI Platform - API Gateway for AI Image Generation & Server Management",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",  # dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(credits.router, prefix="/credits", tags=["Credits"])
app.include_router(ai_tasks.router, prefix="/ai", tags=["AI Tasks"])
app.include_router(landing_pages.router, prefix="/pages", tags=["Landing Pages"])

# ── Static Files ──
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "api-gateway",
        "version": "1.0.0",
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs" if settings.DEBUG else "disabled",
        "domain": settings.DOMAIN,
    }
