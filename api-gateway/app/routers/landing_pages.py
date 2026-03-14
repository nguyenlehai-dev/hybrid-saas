"""
Landing Pages Router - Create, list, delete landing pages from AI-generated images.
"""

import uuid
import re
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import User, LandingPage
from app.routers.auth import get_current_user

router = APIRouter()


# ── Schemas ──

class CreatePageRequest(BaseModel):
    title: str
    template: str = "basic"  # basic, product, portfolio, gallery
    content: dict = {}
    image_ids: list[str] = []


class PageResponse(BaseModel):
    id: str
    title: str
    slug: str
    template: str
    url: str
    is_published: bool
    visit_count: int
    created_at: datetime


class PageDetail(PageResponse):
    content: dict
    images: list[str]
    custom_domain: str | None
    updated_at: datetime


class UpdatePageRequest(BaseModel):
    title: str | None = None
    content: dict | None = None
    is_published: bool | None = None
    custom_domain: str | None = None


# ── Helpers ──

def generate_slug(title: str) -> str:
    """Generate URL-safe slug from title."""
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug).strip('-')
    # Append short UUID for uniqueness
    short_id = uuid.uuid4().hex[:8]
    return f"{slug}-{short_id}"


# ── Endpoints ──

@router.post("/create", response_model=PageResponse, status_code=201)
async def create_page(
    req: CreatePageRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new landing page from AI-generated images."""
    slug = generate_slug(req.title)

    page = LandingPage(
        user_id=user.id,
        title=req.title,
        slug=slug,
        template=req.template,
        content=req.content,
        images=[uuid.UUID(img_id) for img_id in req.image_ids] if req.image_ids else [],
    )
    db.add(page)
    await db.flush()

    return PageResponse(
        id=str(page.id),
        title=page.title,
        slug=page.slug,
        template=page.template,
        url=f"https://{settings.DOMAIN}/p/{page.slug}",
        is_published=page.is_published,
        visit_count=0,
        created_at=page.created_at,
    )


@router.get("/list", response_model=list[PageResponse])
async def list_pages(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's landing pages."""
    result = await db.execute(
        select(LandingPage)
        .where(LandingPage.user_id == user.id)
        .order_by(desc(LandingPage.created_at))
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    pages = result.scalars().all()

    return [
        PageResponse(
            id=str(p.id),
            title=p.title,
            slug=p.slug,
            template=p.template,
            url=f"https://{settings.DOMAIN}/p/{p.slug}",
            is_published=p.is_published,
            visit_count=p.visit_count,
            created_at=p.created_at,
        )
        for p in pages
    ]


@router.get("/{page_id}", response_model=PageDetail)
async def get_page(
    page_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get landing page details."""
    result = await db.execute(
        select(LandingPage).where(
            LandingPage.id == uuid.UUID(page_id),
            LandingPage.user_id == user.id,
        )
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    return PageDetail(
        id=str(page.id),
        title=page.title,
        slug=page.slug,
        template=page.template,
        url=f"https://{settings.DOMAIN}/p/{page.slug}",
        is_published=page.is_published,
        visit_count=page.visit_count,
        content=page.content or {},
        images=[str(img) for img in (page.images or [])],
        custom_domain=page.custom_domain,
        created_at=page.created_at,
        updated_at=page.updated_at,
    )


@router.put("/{page_id}", response_model=PageDetail)
async def update_page(
    page_id: str,
    req: UpdatePageRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update landing page."""
    result = await db.execute(
        select(LandingPage).where(
            LandingPage.id == uuid.UUID(page_id),
            LandingPage.user_id == user.id,
        )
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    if req.title is not None:
        page.title = req.title
    if req.content is not None:
        page.content = req.content
    if req.is_published is not None:
        page.is_published = req.is_published
    if req.custom_domain is not None:
        page.custom_domain = req.custom_domain

    await db.flush()

    return PageDetail(
        id=str(page.id),
        title=page.title,
        slug=page.slug,
        template=page.template,
        url=f"https://{settings.DOMAIN}/p/{page.slug}",
        is_published=page.is_published,
        visit_count=page.visit_count,
        content=page.content or {},
        images=[str(img) for img in (page.images or [])],
        custom_domain=page.custom_domain,
        created_at=page.created_at,
        updated_at=page.updated_at,
    )


@router.delete("/{page_id}")
async def delete_page(
    page_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a landing page."""
    result = await db.execute(
        select(LandingPage).where(
            LandingPage.id == uuid.UUID(page_id),
            LandingPage.user_id == user.id,
        )
    )
    page = result.scalar_one_or_none()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    await db.delete(page)
    await db.flush()

    return {"message": "Page deleted successfully"}
