-- ==============================================================================
-- MAESTRO RESTAURANT DATABASE MIGRATION: 20261005_realtime_admin_platform.sql
-- Step 1: Complete Schema & Realtime Setup for Maestro Restaurant Admin Platform
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- ------------------------------------------------------------------------------
-- 2. MENU ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title_ar TEXT,
    title_en TEXT,
    name_ar TEXT,
    name_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    price INT NOT NULL DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    badge TEXT,
    prep_time_minutes INT DEFAULT 20,
    preparation_time TEXT DEFAULT '15-20 دقيقة',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all requested columns exist
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS title_ar TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS name_ar TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS price INT NOT NULL DEFAULT 0;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS prep_time_minutes INT DEFAULT 20;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Automatically keep title_ar/title_en and name_ar/name_en synchronized
UPDATE public.menu_items SET title_ar = name_ar WHERE title_ar IS NULL AND name_ar IS NOT NULL;
UPDATE public.menu_items SET title_en = name_en WHERE title_en IS NULL AND name_en IS NOT NULL;
UPDATE public.menu_items SET name_ar = title_ar WHERE name_ar IS NULL AND title_ar IS NOT NULL;
UPDATE public.menu_items SET name_en = title_en WHERE name_en IS NULL AND title_en IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON public.menu_items(sort_order ASC);

-- ------------------------------------------------------------------------------
-- 3. PROMOTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    discount_percentage INT NOT NULL DEFAULT 0,
    badge TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS title_ar TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS description_ar TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS discount_percentage INT NOT NULL DEFAULT 0;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_promotions_is_active ON public.promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_sort_order ON public.promotions(sort_order ASC);

-- ------------------------------------------------------------------------------
-- 4. RESTAURANT SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id INT PRIMARY KEY DEFAULT 1,
    is_kitchen_open BOOLEAN NOT NULL DEFAULT TRUE,
    delivery_time_ar TEXT NOT NULL DEFAULT '30 - 45 دقيقة',
    delivery_time_en TEXT NOT NULL DEFAULT '30 - 45 mins',
    announcement_banner_active BOOLEAN NOT NULL DEFAULT FALSE,
    announcement_banner_text_ar TEXT NOT NULL DEFAULT 'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها',
    announcement_banner_text_en TEXT NOT NULL DEFAULT 'Now accepting orders with express delivery in Al-Nabek and surrounding areas',
    phone TEXT NOT NULL DEFAULT '7247721',
    whatsapp TEXT NOT NULL DEFAULT '0969697587',
    address_ar TEXT NOT NULL DEFAULT 'سوريا، النبك، شارع أمين',
    address_en TEXT NOT NULL DEFAULT 'Syria, Al-Nabek, Amin Street',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure defaults are locked to Al-Nabek official coordinates and contact numbers
INSERT INTO public.restaurant_settings (
    id,
    is_kitchen_open,
    delivery_time_ar,
    delivery_time_en,
    announcement_banner_active,
    announcement_banner_text_ar,
    announcement_banner_text_en,
    phone,
    whatsapp,
    address_ar,
    address_en,
    updated_at
)
VALUES (
    1,
    TRUE,
    '30 - 45 دقيقة',
    '30 - 45 mins',
    FALSE,
    'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها',
    'Now accepting orders with express delivery in Al-Nabek and surrounding areas',
    '7247721',
    '0969697587',
    'سوريا، النبك، شارع أمين',
    'Syria, Al-Nabek, Amin Street',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    phone = '7247721',
    whatsapp = '0969697587',
    address_ar = 'سوريا، النبك، شارع أمين',
    address_en = 'Syria, Al-Nabek, Amin Street',
    updated_at = NOW();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public permissive categories" ON public.categories;
CREATE POLICY "Public permissive categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public permissive menu_items" ON public.menu_items;
CREATE POLICY "Public permissive menu_items" ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public permissive promotions" ON public.promotions;
CREATE POLICY "Public permissive promotions" ON public.promotions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public permissive restaurant_settings" ON public.restaurant_settings;
CREATE POLICY "Public permissive restaurant_settings" ON public.restaurant_settings FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 6. REALTIME REPLICATION PUBLICATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.promotions;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_settings;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- ------------------------------------------------------------------------------
-- 7. SEED DATA FOR PROMOTIONS
-- ------------------------------------------------------------------------------
INSERT INTO public.promotions (
    id, title_ar, title_en, description_ar, description_en,
    discount_percentage, badge, image_url, is_active, sort_order
) VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'باقة برج الشاورما الملكي',
    'Maestro Royal Celebration Deal',
    'برج شاورما فاخر من عدة طبقات مع صوصات وتومية وبطاطا مقرمشة ومشروبات عائلية',
    'Grand multi-tiered celebration tower with signature dips, spiced fries, and drinks',
    25,
    'عرض التوفير الملكي',
    'shawarma-tower',
    true,
    1
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'بوكس البروستد الذهبي العائلي',
    'Family Golden Broasted Box',
    '12 قطعة بروستد ذهبي مقرمش مع 4 علب شيبس، 4 تومية وسلطة كول سلو',
    '12 pieces of crispy broasted chicken with 4 crisp boxes, toum dips, and coleslaw',
    20,
    'الأكثر طلباً',
    'broasted-chips',
    true,
    2
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'كومبو كرسبي وسوبريم الثنائي',
    'Duo Crispy & Supreme Combo',
    'ساندوتشين كرسبي بالصمون الفرنسي مع بطاطا متبلة ومشروبين غازيين',
    'Two French baguette crispy subs with seasoned fries and two beverages',
    30,
    'عرض الأسبوع',
    'crispy-baguettes',
    true,
    3
)
ON CONFLICT (id) DO NOTHING;
