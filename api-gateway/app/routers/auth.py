"""
Authentication Router - Register, Login, Profile
"""

import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import User

router = APIRouter()


def hash_password(password: str) -> str:
    """Hash password using bcrypt, truncating to 72 bytes."""
    pw_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against bcrypt hash."""
    pw_bytes = password.encode('utf-8')[:72]
    return bcrypt.checkpw(pw_bytes, hashed.encode('utf-8'))


# ── Schemas ──

class RegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


class UserProfile(BaseModel):
    id: str
    email: str
    username: str
    full_name: str | None
    avatar_url: str | None
    role: str
    credits_balance: float
    is_verified: bool
    created_at: datetime


# ── Helpers ──

def create_access_token(user_id: str) -> tuple[str, int]:
    """Create JWT access token."""
    expires_delta = timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    expire = datetime.now(timezone.utc) + expires_delta
    payload = {
        "sub": user_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token, int(expires_delta.total_seconds())


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(lambda: None),  # Will be overridden below
) -> User:
    """Dependency to extract current user from JWT token."""
    raise HTTPException(status_code=401, detail="Not implemented in this dependency directly")


def decode_token(token: str) -> str:
    """Decode JWT and return user_id."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ── Auth Dependency (used by other routers) ──

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate current user from JWT Bearer token."""
    user_id = decode_token(credentials.credentials)
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    """Require admin role."""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ── Endpoints ──

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check existing email
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    # Check existing username
    existing = await db.execute(select(User).where(User.username == req.username))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Username already taken")

    # Create user
    user = User(
        email=req.email,
        username=req.username,
        password_hash=hash_password(req.password),
        full_name=req.full_name,
        credits_balance=10.00,  # Welcome bonus
    )
    db.add(user)
    await db.flush()

    token, expires_in = create_access_token(str(user.id))

    return TokenResponse(
        access_token=token,
        expires_in=expires_in,
        user={
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "credits_balance": float(user.credits_balance),
        },
    )


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login with email and password."""
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    # Update last login
    user.last_login_at = datetime.now(timezone.utc)

    token, expires_in = create_access_token(str(user.id))

    return TokenResponse(
        access_token=token,
        expires_in=expires_in,
        user={
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "credits_balance": float(user.credits_balance),
        },
    )


@router.get("/me", response_model=UserProfile)
async def get_profile(user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserProfile(
        id=str(user.id),
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        avatar_url=user.avatar_url,
        role=user.role,
        credits_balance=float(user.credits_balance),
        is_verified=user.is_verified,
        created_at=user.created_at,
    )
