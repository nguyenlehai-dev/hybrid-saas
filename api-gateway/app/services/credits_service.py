"""
Credits Service - Business logic for credits deduction and management.
"""

from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User, CreditTransaction


async def deduct_credits(
    db: AsyncSession,
    user: User,
    amount: Decimal | float,
    description: str,
    reference_id=None,
) -> CreditTransaction:
    """
    Deduct credits from user's balance.
    Raises HTTPException if insufficient balance.
    Returns the transaction record.
    """
    amount = Decimal(str(amount))

    if user.credits_balance < amount:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "Insufficient credits",
                "required": float(amount),
                "balance": float(user.credits_balance),
                "shortfall": float(amount - user.credits_balance),
            },
        )

    # Deduct
    user.credits_balance -= amount
    new_balance = user.credits_balance

    # Record transaction
    tx = CreditTransaction(
        user_id=user.id,
        amount=-amount,  # Negative for deduction
        balance_after=new_balance,
        type="usage",
        description=description,
        reference_id=reference_id,
    )
    db.add(tx)
    await db.flush()

    return tx


async def add_credits(
    db: AsyncSession,
    user: User,
    amount: Decimal | float,
    description: str,
    tx_type: str = "purchase",
    reference_id=None,
) -> CreditTransaction:
    """
    Add credits to user's balance.
    Returns the transaction record.
    """
    amount = Decimal(str(amount))

    user.credits_balance += amount
    new_balance = user.credits_balance

    tx = CreditTransaction(
        user_id=user.id,
        amount=amount,
        balance_after=new_balance,
        type=tx_type,
        description=description,
        reference_id=reference_id,
    )
    db.add(tx)
    await db.flush()

    return tx
