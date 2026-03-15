-- ============================================================
-- Hybrid SaaS - Seed Data
-- ============================================================

-- Pricing Plans
INSERT INTO pricing_plans (name, slug, description, price_vnd, credits_amount, features, is_popular, sort_order) VALUES
('Starter', 'starter', 'Gói khởi đầu cho cá nhân', 99000, 50.00, 
 '{"max_images_per_day": 20, "max_resolution": "512x512", "features": ["text_to_image", "upscale"]}', 
 false, 1),

('Pro', 'pro', 'Gói chuyên nghiệp cho freelancer', 299000, 200.00,
 '{"max_images_per_day": 100, "max_resolution": "1024x1024", "features": ["text_to_image", "image_to_image", "upscale", "inpaint", "skin_enhancer"]}',
 true, 2),

('Business', 'business', 'Gói doanh nghiệp không giới hạn', 799000, 600.00,
 '{"max_images_per_day": -1, "max_resolution": "2048x2048", "features": ["all"], "priority_queue": true, "api_access": true}',
 false, 3),

('Enterprise', 'enterprise', 'Gói tùy chỉnh cho doanh nghiệp lớn', 2499000, 2500.00,
 '{"max_images_per_day": -1, "max_resolution": "4096x4096", "features": ["all"], "priority_queue": true, "api_access": true, "dedicated_worker": true, "landing_pages": true}',
 false, 4)
ON CONFLICT (slug) DO NOTHING;

-- AI Pricing (credits per task)
INSERT INTO ai_pricing (task_type, credits_cost, display_name, description) VALUES
('text_to_image',   1.00, 'Text to Image',     'Tạo ảnh từ mô tả văn bản'),
('image_to_image',  1.50, 'Image to Image',    'Chuyển đổi ảnh theo prompt'),
('review_product',  2.00, 'Review Product',    'Tạo ảnh review sản phẩm chuyên nghiệp'),
('multishots',      3.00, 'Multishots',        'Tạo nhiều góc chụp sản phẩm'),
('inpaint',         1.50, 'Inpaint/Edit',      'Chỉnh sửa vùng chọn trên ảnh'),
('skin_enhancer',   2.00, 'Skin Enhancer',     'Làm đẹp da và retouching'),
('upscale',         0.50, 'Upscale',           'Nâng cấp độ phân giải ảnh'),
('crop',            0.25, 'Smart Crop',        'Cắt ảnh thông minh'),
('video_generate',  5.00, 'Video Generate',    'Tạo video từ ảnh/prompt')
ON CONFLICT (task_type) DO NOTHING;

-- Admin User (password: admin123 - CHANGE THIS!)
INSERT INTO users (email, username, password_hash, full_name, role, is_active, is_verified, credits_balance) VALUES
('admin@nulith.io.vn', 'admin', 
 crypt('admin123', gen_salt('bf', 10)),
 'System Admin', 'admin', true, true, 99999.00)
ON CONFLICT (email) DO NOTHING;
