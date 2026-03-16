"""
Admin Router - Dashboard stats, user management, orders, vouchers, activity
"""

import uuid
from datetime import datetime, timezone, timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, func, case, and_, or_, desc, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User, AITask, CreditTransaction, PricingPlan
from app.routers.auth import require_admin, hash_password

router = APIRouter()


# ── Stats ──

@router.get("/stats")
async def get_stats(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get admin dashboard statistics."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Total users
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0

    # Active users today (logged in today)
    active_today = (await db.execute(
        select(func.count(User.id)).where(User.last_login_at >= today_start)
    )).scalar() or 0

    # Total tasks
    total_tasks = (await db.execute(select(func.count(AITask.id)))).scalar() or 0

    # Tasks today
    tasks_today = (await db.execute(
        select(func.count(AITask.id)).where(AITask.created_at >= today_start)
    )).scalar() or 0

    # Total credits spent
    total_credits = (await db.execute(
        select(func.coalesce(func.sum(AITask.credits_cost), 0))
        .where(AITask.status == "completed")
    )).scalar() or 0

    # Credits spent today
    credits_today = (await db.execute(
        select(func.coalesce(func.sum(AITask.credits_cost), 0))
        .where(and_(AITask.status == "completed", AITask.created_at >= today_start))
    )).scalar() or 0

    # Pending orders
    pending_orders = (await db.execute(
        text("SELECT COUNT(*) FROM purchase_orders WHERE status = 'pending'")
    )).scalar() or 0

    return {
        "total_users": total_users,
        "active_users_today": active_today,
        "total_tasks": total_tasks,
        "tasks_today": tasks_today,
        "total_credits_spent": float(total_credits),
        "credits_spent_today": float(credits_today),
        "pending_orders": pending_orders,
    }


# ── Spam/Scam Detection ──

async def detect_spam_flags(user: User, db: AsyncSession) -> dict:
    """Detect suspicious behavior for a user."""
    flags = []
    risk_score = 0
    now = datetime.now(timezone.utc)
    account_age_hours = (now - user.created_at).total_seconds() / 3600 if user.created_at else 999

    # Count tasks
    tasks_count = (await db.execute(
        select(func.count(AITask.id)).where(AITask.user_id == user.id)
    )).scalar() or 0

    # Failed tasks
    failed_tasks = (await db.execute(
        select(func.count(AITask.id)).where(
            and_(AITask.user_id == user.id, AITask.status == "failed")
        )
    )).scalar() or 0

    # Tasks in last 1 hour
    recent_tasks = (await db.execute(
        select(func.count(AITask.id)).where(
            and_(AITask.user_id == user.id, AITask.created_at >= now - timedelta(hours=1))
        )
    )).scalar() or 0

    # Tasks in last 24h
    daily_tasks = (await db.execute(
        select(func.count(AITask.id)).where(
            and_(AITask.user_id == user.id, AITask.created_at >= now - timedelta(hours=24))
        )
    )).scalar() or 0

    # 1. New account with high activity
    if account_age_hours < 24 and tasks_count > 20:
        flags.append("🆕 Tài khoản mới + hoạt động bất thường")
        risk_score += 30

    # 2. High failed task ratio
    if tasks_count > 5 and failed_tasks / tasks_count > 0.6:
        flags.append(f"❌ Tỉ lệ thất bại cao ({failed_tasks}/{tasks_count})")
        risk_score += 25

    # 3. Rapid task submission (>15 tasks/hour)
    if recent_tasks > 15:
        flags.append(f"⚡ Spam tasks ({recent_tasks} tasks/giờ)")
        risk_score += 35

    # 4. Excessive daily usage (>50 tasks/day)
    if daily_tasks > 50:
        flags.append(f"🔥 Usage quá cao ({daily_tasks} tasks/ngày)")
        risk_score += 20

    # 5. Zero balance but keeps trying
    if float(user.credits_balance) <= 0 and recent_tasks > 5:
        flags.append("💸 Hết credits nhưng vẫn spam")
        risk_score += 30

    # 6. Suspicious email patterns
    email = user.email.lower()
    disposable_domains = ["tempmail", "throwaway", "guerrillamail", "mailinator", "yopmail", "10minutemail", "trashmail"]
    if any(d in email for d in disposable_domains):
        flags.append("📧 Email tạm thời")
        risk_score += 40

    risk_level = "safe"
    if risk_score >= 50:
        risk_level = "danger"
    elif risk_score >= 25:
        risk_level = "warning"

    return {
        "risk_score": min(risk_score, 100),
        "risk_level": risk_level,
        "flags": flags,
        "tasks_count": tasks_count,
        "failed_tasks": failed_tasks,
        "recent_tasks_1h": recent_tasks,
        "daily_tasks_24h": daily_tasks,
    }


# ── Users ──

@router.get("/users")
async def list_users(
    search: str = "",
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=15, le=100),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all users with stats, pagination, and spam detection."""
    # Count total
    count_query = select(func.count(User.id))
    if search:
        count_query = count_query.where(
            User.email.ilike(f"%{search}%") | User.username.ilike(f"%{search}%")
        )
    total = (await db.execute(count_query)).scalar() or 0

    # Fetch page
    query = select(User)
    if search:
        query = query.where(
            User.email.ilike(f"%{search}%") | User.username.ilike(f"%{search}%")
        )
    offset = (page - 1) * per_page
    query = query.order_by(desc(User.created_at)).offset(offset).limit(per_page)
    result = await db.execute(query)
    users = result.scalars().all()

    user_list = []
    for u in users:
        spam_info = await detect_spam_flags(u, db)

        # Total credits spent
        total_spent = (await db.execute(
            select(func.coalesce(func.sum(AITask.credits_cost), 0))
            .where(and_(AITask.user_id == u.id, AITask.status == "completed"))
        )).scalar() or 0

        user_list.append({
            "id": str(u.id),
            "email": u.email,
            "username": u.username,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "credits_balance": float(u.credits_balance),
            "last_login_at": u.last_login_at.isoformat() if u.last_login_at else None,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "tasks_count": spam_info["tasks_count"],
            "total_spent": float(total_spent),
            "spam": spam_info,
        })

    total_pages = (total + per_page - 1) // per_page
    return {"users": user_list, "total": total, "page": page, "per_page": per_page, "total_pages": total_pages}


@router.post("/users/create")
async def create_user(
    body: dict,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new user account (admin)."""
    email = body.get("email", "").strip()
    username = body.get("username", "").strip()
    password = body.get("password", "").strip()
    full_name = body.get("full_name", "").strip() or None
    role = body.get("role", "user")
    credits = float(body.get("credits_balance", 10))

    if not email or not username or not password:
        raise HTTPException(status_code=400, detail="Email, username và password là bắt buộc")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Mật khẩu tối thiểu 6 ký tự")

    # Check duplicates
    existing = await db.execute(select(User).where(or_(User.email == email, User.username == username)))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email hoặc username đã tồn tại")

    user = User(
        email=email,
        username=username,
        password_hash=hash_password(password),
        full_name=full_name,
        role=role if role in ("user", "admin") else "user",
        is_active=True,
        is_verified=True,
        credits_balance=Decimal(str(credits)),
    )
    db.add(user)
    await db.commit()
    return {"message": f"Đã tạo tài khoản {username} ({email})", "user_id": str(user.id)}


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a user account."""
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Không thể xóa tài khoản admin")

    username = user.username
    await db.delete(user)
    await db.commit()
    return {"message": f"Đã xóa tài khoản {username}"}


@router.post("/users/{user_id}/toggle-active")
async def toggle_user_active(
    user_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Toggle user active status."""
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = not user.is_active
    await db.commit()
    status = "kích hoạt" if user.is_active else "khóa"
    return {"message": f"Đã {status} tài khoản {user.username}"}


@router.post("/users/{user_id}/add-credits")
async def add_credits(
    user_id: str,
    amount: float = Query(..., gt=0),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Add credits to a user."""
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.credits_balance = user.credits_balance + Decimal(str(amount))

    # Log transaction
    tx = CreditTransaction(
        user_id=user.id,
        amount=Decimal(str(amount)),
        balance_after=user.credits_balance,
        type="admin_add",
        description=f"Admin thêm {amount} credits",
    )
    db.add(tx)
    await db.commit()
    return {"message": f"Đã thêm {amount} credits cho {user.username}. Số dư: {float(user.credits_balance)}"}


@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    body: dict,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Update user info."""
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if "email" in body:
        user.email = body["email"]
    if "username" in body:
        user.username = body["username"]
    if "full_name" in body:
        user.full_name = body["full_name"]
    if "role" in body and body["role"] in ("user", "admin"):
        user.role = body["role"]
    if "credits_balance" in body:
        user.credits_balance = Decimal(str(body["credits_balance"]))

    await db.commit()
    return {"message": f"Đã cập nhật user {user.username}"}


# ── Orders ──

@router.get("/orders")
async def list_orders(
    status: str = "",
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List purchase orders."""
    query = """
        SELECT o.id, o.order_code, u.email as user_email, u.username,
               p.name as plan_name, o.amount_vnd, o.credits_amount,
               o.status, o.transfer_content, o.created_at
        FROM purchase_orders o
        JOIN users u ON o.user_id = u.id
        JOIN pricing_plans p ON o.plan_id = p.id
    """
    if status:
        query += f" WHERE o.status = '{status}'"
    query += " ORDER BY o.created_at DESC LIMIT 100"

    result = await db.execute(text(query))
    rows = result.fetchall()

    return [
        {
            "id": str(r[0]),
            "order_code": r[1],
            "user_email": r[2],
            "username": r[3],
            "plan_name": r[4],
            "amount_vnd": float(r[5]),
            "credits_amount": float(r[6]),
            "status": r[7],
            "transfer_content": r[8] or "",
            "created_at": r[9].isoformat() if r[9] else None,
        }
        for r in rows
    ]


@router.post("/orders/{order_id}/approve")
async def approve_order(
    order_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Approve a purchase order and add credits."""
    result = await db.execute(
        text("SELECT id, user_id, credits_amount, status FROM purchase_orders WHERE id = :oid"),
        {"oid": order_id},
    )
    order = result.fetchone()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order[3] != "pending":
        raise HTTPException(status_code=400, detail="Order already processed")

    # Update order status
    await db.execute(
        text("UPDATE purchase_orders SET status = 'approved', approved_by = :admin_id, approved_at = NOW() WHERE id = :oid"),
        {"admin_id": str(admin.id), "oid": order_id},
    )

    # Add credits to user
    user_result = await db.execute(select(User).where(User.id == order[1]))
    user = user_result.scalar_one()
    user.credits_balance = user.credits_balance + order[2]

    # Log transaction
    tx = CreditTransaction(
        user_id=user.id,
        amount=order[2],
        balance_after=user.credits_balance,
        type="purchase",
        description=f"Mua credits - Đơn hàng đã duyệt",
        reference_id=order[0],
    )
    db.add(tx)
    await db.commit()
    return {"message": f"Đã duyệt đơn hàng và cộng {float(order[2])} credits cho {user.username}"}


@router.post("/orders/{order_id}/reject")
async def reject_order(
    order_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Reject a purchase order."""
    result = await db.execute(
        text("SELECT id, status FROM purchase_orders WHERE id = :oid"),
        {"oid": order_id},
    )
    order = result.fetchone()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order[1] != "pending":
        raise HTTPException(status_code=400, detail="Order already processed")

    await db.execute(
        text("UPDATE purchase_orders SET status = 'rejected', approved_by = :admin_id, approved_at = NOW() WHERE id = :oid"),
        {"admin_id": str(admin.id), "oid": order_id},
    )
    await db.commit()
    return {"message": "Đã từ chối đơn hàng"}


# ── Activity ──

@router.get("/activity")
async def get_activity(
    limit: int = Query(default=50, le=200),
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Get recent AI task activity."""
    result = await db.execute(
        select(AITask, User.email, User.username)
        .join(User, AITask.user_id == User.id)
        .order_by(desc(AITask.created_at))
        .limit(limit)
    )
    rows = result.all()

    return [
        {
            "user_email": row[1],
            "username": row[2],
            "task_id": str(row[0].id),
            "task_type": row[0].task_type,
            "status": row[0].status,
            "credits_cost": float(row[0].credits_cost),
            "prompt": (row[0].input_params or {}).get("prompt"),
            "created_at": row[0].created_at.isoformat() if row[0].created_at else None,
        }
        for row in rows
    ]


# ── Vouchers ──

@router.get("/vouchers")
async def list_vouchers(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List all vouchers."""
    result = await db.execute(
        text("""
            SELECT v.id, v.code, v.credits_amount, v.description, v.is_used,
                   u.email as used_by_email, v.used_at, v.created_at
            FROM vouchers v
            LEFT JOIN users u ON v.used_by = u.id
            ORDER BY v.created_at DESC
        """)
    )
    rows = result.fetchall()
    return [
        {
            "id": str(r[0]),
            "code": r[1],
            "credits_amount": float(r[2]),
            "description": r[3],
            "is_used": r[4],
            "used_by_email": r[5],
            "used_at": r[6].isoformat() if r[6] else None,
            "created_at": r[7].isoformat() if r[7] else None,
        }
        for r in rows
    ]


@router.post("/vouchers")
async def create_voucher(
    body: dict,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Create a new voucher."""
    code = body.get("code", "").strip().upper()
    credits_amount = body.get("credits_amount", 0)
    description = body.get("description")

    if not code or not credits_amount:
        raise HTTPException(status_code=400, detail="Code và credits_amount là bắt buộc")

    # Check duplicate
    existing = await db.execute(text("SELECT id FROM vouchers WHERE code = :code"), {"code": code})
    if existing.fetchone():
        raise HTTPException(status_code=409, detail="Mã voucher đã tồn tại")

    await db.execute(
        text("""
            INSERT INTO vouchers (code, credits_amount, description, created_by)
            VALUES (:code, :credits, :desc, :admin_id)
        """),
        {"code": code, "credits": credits_amount, "desc": description, "admin_id": str(admin.id)},
    )
    await db.commit()
    return {"message": f"Đã tạo voucher {code} ({credits_amount} credits)"}


@router.delete("/vouchers/{voucher_id}")
async def delete_voucher(
    voucher_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Delete a voucher."""
    result = await db.execute(
        text("SELECT id FROM vouchers WHERE id = :vid"), {"vid": voucher_id}
    )
    if not result.fetchone():
        raise HTTPException(status_code=404, detail="Voucher not found")

    await db.execute(text("DELETE FROM vouchers WHERE id = :vid"), {"vid": voucher_id})
    await db.commit()
    return {"message": "Đã xóa voucher"}
