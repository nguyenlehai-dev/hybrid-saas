"""
Credits Router - Balance, Purchase, History
"""

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, CreditTransaction, PricingPlan
from app.routers.auth import get_current_user

router = APIRouter()


# ── Schemas ──

class BalanceResponse(BaseModel):
    credits_balance: float
    currency: str = "credits"


class PurchaseRequest(BaseModel):
    plan_slug: str


class PurchaseResponse(BaseModel):
    message: str
    credits_added: float
    new_balance: float
    transaction_id: str


class TransactionItem(BaseModel):
    id: str
    amount: float
    balance_after: float
    type: str
    description: str | None
    created_at: datetime


class TransactionHistory(BaseModel):
    transactions: list[TransactionItem]
    total: int
    page: int
    per_page: int


class PlanItem(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None
    price_vnd: float
    credits_amount: float
    features: dict
    is_popular: bool


# ── Endpoints ──

@router.get("/balance", response_model=BalanceResponse)
async def get_balance(user: User = Depends(get_current_user)):
    """Get current credits balance."""
    return BalanceResponse(credits_balance=float(user.credits_balance))


@router.get("/plans", response_model=list[PlanItem])
async def get_plans(db: AsyncSession = Depends(get_db)):
    """Get available pricing plans."""
    result = await db.execute(
        select(PricingPlan)
        .where(PricingPlan.is_active == True)
        .order_by(PricingPlan.sort_order)
    )
    plans = result.scalars().all()
    return [
        PlanItem(
            id=str(p.id),
            name=p.name,
            slug=p.slug,
            description=p.description,
            price_vnd=float(p.price_vnd),
            credits_amount=float(p.credits_amount),
            features=p.features or {},
            is_popular=p.is_popular,
        )
        for p in plans
    ]


@router.post("/purchase", response_model=PurchaseResponse)
async def purchase_credits(
    req: PurchaseRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Purchase credits by selecting a pricing plan.
    Note: In production, integrate with a payment gateway (VNPay, Momo, etc.)
    """
    # Find the plan
    result = await db.execute(
        select(PricingPlan).where(
            PricingPlan.slug == req.plan_slug,
            PricingPlan.is_active == True,
        )
    )
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    # Add credits
    new_balance = user.credits_balance + plan.credits_amount
    user.credits_balance = new_balance

    # Record transaction
    tx = CreditTransaction(
        user_id=user.id,
        amount=plan.credits_amount,
        balance_after=new_balance,
        type="purchase",
        description=f"Purchased {plan.name} plan ({plan.credits_amount} credits)",
        tx_metadata={"plan_slug": plan.slug, "plan_name": plan.name, "price_vnd": float(plan.price_vnd)},
    )
    db.add(tx)
    await db.flush()

    return PurchaseResponse(
        message=f"Successfully purchased {plan.name} plan",
        credits_added=float(plan.credits_amount),
        new_balance=float(new_balance),
        transaction_id=str(tx.id),
    )


@router.get("/history", response_model=TransactionHistory)
async def get_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get credits transaction history with pagination."""
    # Count total
    count_result = await db.execute(
        select(func.count(CreditTransaction.id)).where(
            CreditTransaction.user_id == user.id
        )
    )
    total = count_result.scalar()

    # Fetch page
    offset = (page - 1) * per_page
    result = await db.execute(
        select(CreditTransaction)
        .where(CreditTransaction.user_id == user.id)
        .order_by(desc(CreditTransaction.created_at))
        .offset(offset)
        .limit(per_page)
    )
    transactions = result.scalars().all()

    return TransactionHistory(
        transactions=[
            TransactionItem(
                id=str(tx.id),
                amount=float(tx.amount),
                balance_after=float(tx.balance_after),
                type=tx.type,
                description=tx.description,
                created_at=tx.created_at,
            )
            for tx in transactions
        ],
        total=total,
        page=page,
        per_page=per_page,
    )
