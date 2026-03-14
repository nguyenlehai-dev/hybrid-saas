-- ============================================================
-- Hybrid SaaS - Database Schema
-- PostgreSQL 15
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    credits_balance DECIMAL(12, 2) DEFAULT 0.00,
    current_plan_id UUID,
    plan_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================================
-- PRICING PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price_vnd DECIMAL(12, 0) NOT NULL,
    credits_amount DECIMAL(12, 2) NOT NULL,
    features JSONB DEFAULT '{}',
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CREDIT TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,  -- positive = add, negative = deduct
    balance_after DECIMAL(12, 2) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'purchase', 'refund', 'usage', 'bonus', 'admin_adjust'
    )),
    description TEXT,
    reference_id UUID,  -- link to ai_task or payment
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_tx_created ON credit_transactions(created_at);

-- ============================================================
-- AI TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_type VARCHAR(50) NOT NULL CHECK (task_type IN (
        'review_product', 'multishots', 'inpaint',
        'skin_enhancer', 'upscale', 'crop',
        'text_to_image', 'image_to_image',
        'video_generate'
    )),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'queued', 'processing', 'completed', 'failed', 'cancelled'
    )),
    priority INTEGER DEFAULT 0,
    credits_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,

    -- Input parameters
    input_params JSONB NOT NULL DEFAULT '{}',
    input_image_url TEXT,

    -- Output
    output_image_url TEXT,
    output_metadata JSONB DEFAULT '{}',

    -- Processing info
    worker_id VARCHAR(100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    processing_time_ms INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_tasks_user ON ai_tasks(user_id);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX idx_ai_tasks_type ON ai_tasks(task_type);
CREATE INDEX idx_ai_tasks_created ON ai_tasks(created_at);

-- ============================================================
-- GENERATED IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ai_task_id UUID REFERENCES ai_tasks(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    format VARCHAR(10) DEFAULT 'png',
    prompt TEXT,
    negative_prompt TEXT,
    generation_params JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gen_images_user ON generated_images(user_id);
CREATE INDEX idx_gen_images_task ON generated_images(ai_task_id);

-- ============================================================
-- LANDING PAGES (Deploy feature)
-- ============================================================
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    template VARCHAR(50) DEFAULT 'basic',
    content JSONB DEFAULT '{}',
    images UUID[] DEFAULT '{}',  -- references to generated_images
    custom_domain VARCHAR(255),
    is_published BOOLEAN DEFAULT false,
    visit_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_landing_pages_user ON landing_pages(user_id);
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);

-- ============================================================
-- AI CREDITS PRICING (per task type)
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_type VARCHAR(50) UNIQUE NOT NULL,
    credits_cost DECIMAL(12, 2) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- API KEYS (for external integrations)
-- ============================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);

-- ============================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_ai_tasks_updated
    BEFORE UPDATE ON ai_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_landing_pages_updated
    BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
