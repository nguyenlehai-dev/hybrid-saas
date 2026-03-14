"""
SQLAlchemy ORM Models matching the PostgreSQL schema.
"""

import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean, Column, DateTime, ForeignKey, Integer, Numeric,
    String, Text, JSON, ARRAY, func
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    avatar_url = Column(Text)
    role = Column(String(20), default="user")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    credits_balance = Column(Numeric(12, 2), default=Decimal("0.00"))
    current_plan_id = Column(UUID(as_uuid=True))
    plan_expires_at = Column(DateTime(timezone=True))
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    credit_transactions = relationship("CreditTransaction", back_populates="user")
    ai_tasks = relationship("AITask", back_populates="user")
    generated_images = relationship("GeneratedImage", back_populates="user")
    landing_pages = relationship("LandingPage", back_populates="user")


class PricingPlan(Base):
    __tablename__ = "pricing_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    price_vnd = Column(Numeric(12, 0), nullable=False)
    credits_amount = Column(Numeric(12, 2), nullable=False)
    features = Column(JSON, default={})
    is_popular = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    balance_after = Column(Numeric(12, 2), nullable=False)
    type = Column(String(30), nullable=False)
    description = Column(Text)
    reference_id = Column(UUID(as_uuid=True))
    tx_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="credit_transactions")


class AITask(Base):
    __tablename__ = "ai_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    task_type = Column(String(50), nullable=False)
    status = Column(String(20), default="pending")
    priority = Column(Integer, default=0)
    credits_cost = Column(Numeric(12, 2), nullable=False, default=Decimal("0"))

    # Input
    input_params = Column(JSON, nullable=False, default={})
    input_image_url = Column(Text)

    # Output
    output_image_url = Column(Text)
    output_metadata = Column(JSON, default={})

    # Processing
    worker_id = Column(String(100))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    processing_time_ms = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="ai_tasks")
    generated_images = relationship("GeneratedImage", back_populates="ai_task")


class GeneratedImage(Base):
    __tablename__ = "generated_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ai_task_id = Column(UUID(as_uuid=True), ForeignKey("ai_tasks.id", ondelete="SET NULL"))
    file_path = Column(Text, nullable=False)
    file_url = Column(Text, nullable=False)
    file_size_bytes = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    format = Column(String(10), default="png")
    prompt = Column(Text)
    negative_prompt = Column(Text)
    generation_params = Column(JSON, default={})
    is_public = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    tags = Column(ARRAY(Text), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="generated_images")
    ai_task = relationship("AITask", back_populates="generated_images")


class LandingPage(Base):
    __tablename__ = "landing_pages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    template = Column(String(50), default="basic")
    content = Column(JSON, default={})
    images = Column(ARRAY(UUID(as_uuid=True)), default=[])
    custom_domain = Column(String(255))
    is_published = Column(Boolean, default=False)
    visit_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="landing_pages")


class AIPricing(Base):
    __tablename__ = "ai_pricing"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_type = Column(String(50), unique=True, nullable=False)
    credits_cost = Column(Numeric(12, 2), nullable=False)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    key_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    last_used_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
