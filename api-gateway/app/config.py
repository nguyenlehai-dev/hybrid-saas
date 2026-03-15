"""
Application configuration via environment variables.
"""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Domain
    DOMAIN: str = "vpspanel.io.vn"
    API_URL: str = "https://vpspanel.io.vn/api"
    FRONTEND_URL: str = "https://vpspanel.io.vn"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://saas_admin:password@localhost:5432/hybrid_saas"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    JWT_SECRET: str = "change-me-to-a-very-long-random-string"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24

    # VM2 AI Engine
    AI_ENGINE_URL: str = "http://192.168.1.100:7860"
    AI_ENGINE_TIMEOUT: int = 120

    # File Storage
    UPLOAD_DIR: str = "/opt/hybrid-saas/uploads"
    LANDING_PAGES_DIR: str = "/opt/hybrid-saas/landing-pages"
    MAX_UPLOAD_SIZE_MB: int = 50

    # App
    APP_NAME: str = "Hybrid SaaS AI Platform"
    APP_ENV: str = "production"
    DEBUG: bool = False
    LOG_LEVEL: str = "info"
    WORKERS: int = 4

    # aaPanel
    AAPANEL_URL: str = "http://localhost:8888"
    AAPANEL_API_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Ensure upload directories exist
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.LANDING_PAGES_DIR).mkdir(parents=True, exist_ok=True)
