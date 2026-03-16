"""
AI Tasks Router - Generate images, check status, view history
Dispatches requests to VM2 AI Engine.
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import User, AITask, AIPricing, CreditTransaction, GeneratedImage
from app.routers.auth import get_current_user
from app.services.ai_dispatcher import AIDispatcher
from app.services.credits_service import deduct_credits

router = APIRouter()
ai_dispatcher = AIDispatcher()


# ── Schemas ──

class GenerateRequest(BaseModel):
    task_type: str  # review_product, multishots, inpaint, skin_enhancer, upscale, text_to_image, etc.
    prompt: str | None = None
    negative_prompt: str | None = None
    width: int = 512
    height: int = 512
    steps: int = 30
    cfg_scale: float = 7.0
    seed: int = -1
    model: str | None = None
    lora: str | None = None
    controlnet: str | None = None
    extra_params: dict = {}


class TaskResponse(BaseModel):
    task_id: str
    status: str
    task_type: str
    credits_cost: float
    message: str


class TaskStatus(BaseModel):
    id: str
    task_type: str
    status: str
    credits_cost: float
    input_params: dict
    output_image_url: str | None
    output_metadata: dict
    error_message: str | None
    processing_time_ms: int | None
    created_at: datetime
    completed_at: datetime | None


class TaskHistory(BaseModel):
    tasks: list[TaskStatus]
    total: int
    page: int
    per_page: int


class AIPricingItem(BaseModel):
    task_type: str
    credits_cost: float
    display_name: str
    description: str | None


# ── Endpoints ──

@router.get("/pricing", response_model=list[AIPricingItem])
async def get_ai_pricing(db: AsyncSession = Depends(get_db)):
    """Get pricing for each AI task type."""
    result = await db.execute(
        select(AIPricing).where(AIPricing.is_active == True)
    )
    items = result.scalars().all()
    return [
        AIPricingItem(
            task_type=p.task_type,
            credits_cost=float(p.credits_cost),
            display_name=p.display_name,
            description=p.description,
        )
        for p in items
    ]


@router.post("/generate", response_model=TaskResponse)
async def generate_image(
    req: GenerateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Submit an AI image generation task.
    Deducts credits and dispatches to VM2 AI Engine.
    """
    # Validate task type
    valid_types = [
        "review_product", "multishots", "inpaint",
        "skin_enhancer", "upscale", "crop",
        "text_to_image", "image_to_image", "video_generate",
    ]
    if req.task_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid task_type. Must be one of: {valid_types}")

    # Get pricing
    result = await db.execute(
        select(AIPricing).where(AIPricing.task_type == req.task_type)
    )
    pricing = result.scalar_one_or_none()
    if not pricing:
        raise HTTPException(status_code=400, detail=f"No pricing configured for task type: {req.task_type}")

    credits_cost = pricing.credits_cost

    # Check and deduct credits
    await deduct_credits(db, user, credits_cost, f"AI Generation: {pricing.display_name}")

    # Create task record
    task = AITask(
        user_id=user.id,
        task_type=req.task_type,
        status="queued",
        credits_cost=credits_cost,
        input_params={
            "prompt": req.prompt,
            "negative_prompt": req.negative_prompt,
            "width": req.width,
            "height": req.height,
            "steps": req.steps,
            "cfg_scale": req.cfg_scale,
            "seed": req.seed,
            "model": req.model,
            "lora": req.lora,
            "controlnet": req.controlnet,
            **req.extra_params,
        },
    )
    db.add(task)
    await db.flush()

    # Dispatch to VM2 AI Engine and process result
    try:
        result = await ai_dispatcher.dispatch(task)

        # SD WebUI returns base64 images in the response
        images = result.get("images", [])
        if images:
            import base64
            from pathlib import Path
            from app.config import settings as app_settings

            # Save first image
            img_data = base64.b64decode(images[0].split(",")[-1] if "," in images[0] else images[0])
            img_dir = Path(app_settings.UPLOAD_DIR) / "generated" / str(user.id)
            img_dir.mkdir(parents=True, exist_ok=True)
            img_filename = f"{task.id}.png"
            img_path = img_dir / img_filename
            img_path.write_bytes(img_data)

            # Build public URL
            output_url = f"/uploads/generated/{user.id}/{img_filename}"
            task.output_image_url = output_url
            task.status = "completed"
            task.completed_at = datetime.now(timezone.utc)

            # Save seed info from response
            info = result.get("info", "")
            task.output_metadata = {"seed": result.get("parameters", {}).get("seed", -1), "info": str(info)[:500]}

            # Also save to GeneratedImage table
            gen_img = GeneratedImage(
                user_id=user.id,
                ai_task_id=task.id,
                file_path=str(img_path),
                file_url=output_url,
                prompt=req.prompt or "",
                negative_prompt=req.negative_prompt or "",
                width=req.width,
                height=req.height,
                generation_params=task.output_metadata,
            )
            db.add(gen_img)
        else:
            # No images in response - keep as queued
            task.status = "processing"

        await db.flush()

    except Exception as e:
        # If dispatch fails, refund credits and mark task as failed
        user.credits_balance += credits_cost
        refund_tx = CreditTransaction(
            user_id=user.id,
            amount=credits_cost,
            balance_after=user.credits_balance,
            type="refund",
            description=f"Refund: AI dispatch failed - {str(e)}",
            reference_id=task.id,
        )
        db.add(refund_tx)
        task.status = "failed"
        task.error_message = str(e)
        await db.flush()
        raise HTTPException(status_code=503, detail={"error": f"AI Engine: {str(e)}"})

    return TaskResponse(
        task_id=str(task.id),
        status=task.status,
        task_type=req.task_type,
        credits_cost=float(credits_cost),
        message=f"Task {'completed' if task.status == 'completed' else 'queued'}. Cost: {credits_cost} credits.",
    )


@router.get("/tasks/{task_id}", response_model=TaskStatus)
async def get_task_status(
    task_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get status of a specific AI task."""
    result = await db.execute(
        select(AITask).where(
            AITask.id == uuid.UUID(task_id),
            AITask.user_id == user.id,
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # If task is still queued/processing, poll VM2 for update
    if task.status in ("queued", "processing"):
        updated_status = await ai_dispatcher.check_status(str(task.id))
        if updated_status:
            task.status = updated_status.get("status", task.status)
            if task.status == "completed":
                task.output_image_url = updated_status.get("output_image_url")
                task.output_metadata = updated_status.get("metadata", {})
                task.completed_at = datetime.now(timezone.utc)
                task.processing_time_ms = updated_status.get("processing_time_ms")
            elif task.status == "failed":
                task.error_message = updated_status.get("error")
            await db.flush()

    return TaskStatus(
        id=str(task.id),
        task_type=task.task_type,
        status=task.status,
        credits_cost=float(task.credits_cost),
        input_params=task.input_params or {},
        output_image_url=task.output_image_url,
        output_metadata=task.output_metadata or {},
        error_message=task.error_message,
        processing_time_ms=task.processing_time_ms,
        created_at=task.created_at,
        completed_at=task.completed_at,
    )


@router.get("/history", response_model=TaskHistory)
async def get_task_history(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    task_type: str | None = None,
    status: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get AI task history with filtering and pagination."""
    query = select(AITask).where(AITask.user_id == user.id)

    if task_type:
        query = query.where(AITask.task_type == task_type)
    if status:
        query = query.where(AITask.status == status)

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()

    # Fetch
    result = await db.execute(
        query.order_by(desc(AITask.created_at))
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    tasks = result.scalars().all()

    return TaskHistory(
        tasks=[
            TaskStatus(
                id=str(t.id),
                task_type=t.task_type,
                status=t.status,
                credits_cost=float(t.credits_cost),
                input_params=t.input_params or {},
                output_image_url=t.output_image_url,
                output_metadata=t.output_metadata or {},
                error_message=t.error_message,
                processing_time_ms=t.processing_time_ms,
                created_at=t.created_at,
                completed_at=t.completed_at,
            )
            for t in tasks
        ],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.post("/tasks/{task_id}/cancel")
async def cancel_task(
    task_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cancel a pending/queued task and refund credits."""
    result = await db.execute(
        select(AITask).where(
            AITask.id == uuid.UUID(task_id),
            AITask.user_id == user.id,
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status not in ("pending", "queued"):
        raise HTTPException(status_code=400, detail="Can only cancel pending or queued tasks")

    # Refund credits
    user.credits_balance += task.credits_cost
    refund_tx = CreditTransaction(
        user_id=user.id,
        amount=task.credits_cost,
        balance_after=user.credits_balance,
        type="refund",
        description=f"Refund: Cancelled {task.task_type} task",
        reference_id=task.id,
    )
    db.add(refund_tx)

    task.status = "cancelled"
    await db.flush()

    return {"message": "Task cancelled and credits refunded", "refunded": float(task.credits_cost)}
