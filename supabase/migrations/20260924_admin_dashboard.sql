-- ==============================================================================
-- Migration: 20260924_admin_dashboard.sql
-- Description: Adds site_settings, categories enhancements, menu_items, admin_users,
--              storage bucket menu-images, and RLS policies for Maestro Admin Dashboard.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE id = auth.uid() 
      AND role = 'admin'
  );
$$;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
    CREATE POLICY "Admins can view admin_users"
        ON public.admin_users FOR SELECT
        TO authenticated
        USING (auth.uid() = id OR public.is_admin());

    DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
    CREATE POLICY "Super admins can manage admin_users"
        ON public.admin_users FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
END $$;

-- 2. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    restaurant_name_ar TEXT NOT NULL DEFAULT 'مطعم مايسترو',
    restaurant_name_en TEXT NOT NULL DEFAULT 'MAESTRO Restaurant',
    address_ar TEXT NOT NULL DEFAULT 'سوريا، النبك، شارع أمين',
    address_en TEXT NOT NULL DEFAULT 'Syria, Al-Nabek, Amin Street',
    maps_embed_url TEXT NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13145.4!2d36.726!3d34.024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518000000000000%3A0x0!2sAmin%20St%2C%20Al-Nabek%2C%20Syria!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s',
    primary_phone TEXT NOT NULL DEFAULT '0969 697 587',
    whatsapp_number TEXT NOT NULL DEFAULT '963969697587',
    working_hours_ar TEXT NOT NULL DEFAULT 'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل',
    working_hours_en TEXT NOT NULL DEFAULT 'Daily: 12:00 PM - 02:00 AM',
    delivery_estimate_ar TEXT NOT NULL DEFAULT '30 - 45 دقيقة',
    delivery_estimate_en TEXT NOT NULL DEFAULT '30 - 45 mins',
    is_restaurant_open BOOLEAN NOT NULL DEFAULT TRUE,
    banner_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    banner_text_ar TEXT NOT NULL DEFAULT 'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها',
    banner_text_en TEXT NOT NULL DEFAULT 'Now accepting orders with express delivery in Al-Nabek and surrounding areas',
    theme_palette JSONB NOT NULL DEFAULT '{
        "primary_accent": "#F59E0B",
        "dark_bg": "#0B0F17",
        "dark_surface": "#1A1D24",
        "light_bg": "#FAF7F2",
        "light_surface": "#FFFFFF",
        "dark_border": "rgba(255, 255, 255, 0.08)",
        "light_border": "rgba(226, 232, 240, 0.8)"
    }'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
    CREATE POLICY "Public can view site settings"
        ON public.site_settings FOR SELECT
        TO anon, authenticated
        USING (true);

    DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
    CREATE POLICY "Admins can update site settings"
        ON public.site_settings FOR UPDATE
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

    DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
    CREATE POLICY "Admins can insert site settings"
        ON public.site_settings FOR INSERT
        TO authenticated
        WITH CHECK (public.is_admin());
END $$;

-- 3. CATEGORIES ENHANCEMENTS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
    CREATE POLICY "Public can view active categories"
        ON public.categories FOR SELECT
        TO anon, authenticated
        USING (is_active = true OR public.is_admin());

    DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
    CREATE POLICY "Admins can manage categories"
        ON public.categories FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
END $$;

-- 4. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    image_url TEXT,
    badge TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    preparation_time TEXT DEFAULT '15-20 دقيقة',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON public.menu_items(sort_order ASC);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view available menu items" ON public.menu_items;
    CREATE POLICY "Public can view available menu items"
        ON public.menu_items FOR SELECT
        TO anon, authenticated
        USING (is_available = true OR public.is_admin());

    DROP POLICY IF EXISTS "Admins can manage menu items" ON public.menu_items;
    CREATE POLICY "Admins can manage menu items"
        ON public.menu_items FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
END $$;

-- 5. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('menu-images', 'menu-images', true),
    ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view menu images" ON storage.objects;
    CREATE POLICY "Public can view menu images" 
        ON storage.objects FOR SELECT 
        TO anon, authenticated 
        USING (bucket_id IN ('menu-images', 'restaurant-assets'));

    DROP POLICY IF EXISTS "Admins can upload menu images" ON storage.objects;
    CREATE POLICY "Admins can upload menu images" 
        ON storage.objects FOR INSERT 
        TO authenticated 
        WITH CHECK (bucket_id IN ('menu-images', 'restaurant-assets'));

    DROP POLICY IF EXISTS "Admins can update menu images" ON storage.objects;
    CREATE POLICY "Admins can update menu images" 
        ON storage.objects FOR UPDATE 
        TO authenticated 
        USING (bucket_id IN ('menu-images', 'restaurant-assets'));

    DROP POLICY IF EXISTS "Admins can delete menu images" ON storage.objects;
    CREATE POLICY "Admins can delete menu images" 
        ON storage.objects FOR DELETE 
        TO authenticated 
        USING (bucket_id IN ('menu-images', 'restaurant-assets'));
END $$;
