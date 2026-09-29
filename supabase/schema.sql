-- ==============================================================================
-- MAESTRO RESTAURANT DATABASE SCHEMA & MIGRATIONS
-- Comprehensive Production Schema with Site Settings, Categories, Menu Items,
-- Supabase Auth Admin Role Verification, and Supabase Storage Integration
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE & AUTH ROLE CHECK
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user has admin privileges
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

-- Admin Users Policies
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

-- ------------------------------------------------------------------------------
-- 2. SITE SETTINGS TABLE (Single-Row Dynamic Configuration)
-- ------------------------------------------------------------------------------
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

-- Site Settings Policies
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

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure newly added columns exist if table was previously created
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

-- ------------------------------------------------------------------------------
-- 4. MENU ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    image_url TEXT,
    badge TEXT, -- e.g. 'Best Seller', 'Signature', 'Special Offer'
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

-- ------------------------------------------------------------------------------
-- 5. MEALS TABLE (Backward Compatibility Layer)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_promoted BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view available meals" ON public.meals;
    CREATE POLICY "Public can view available meals"
        ON public.meals FOR SELECT
        TO anon, authenticated
        USING (is_available = true OR public.is_admin());

    DROP POLICY IF EXISTS "Admins can manage meals" ON public.meals;
    CREATE POLICY "Admins can manage meals"
        ON public.meals FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
END $$;

-- ------------------------------------------------------------------------------
-- 6. ORDERS & ORDER ITEMS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT,
    total_price NUMERIC NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    meal_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can place orders" ON public.orders;
    CREATE POLICY "Public can place orders" 
        ON public.orders FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins can view and update orders" ON public.orders;
    CREATE POLICY "Admins can view and update orders" 
        ON public.orders FOR ALL 
        TO authenticated 
        USING (public.is_admin()) 
        WITH CHECK (public.is_admin());

    DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
    CREATE POLICY "Public can insert order items" 
        ON public.order_items FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
    CREATE POLICY "Admins can manage order items" 
        ON public.order_items FOR ALL 
        TO authenticated 
        USING (public.is_admin()) 
        WITH CHECK (public.is_admin());
END $$;

-- ------------------------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKETS (menu-images & restaurant-assets)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('menu-images', 'menu-images', true),
    ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    -- Public read access for images
    DROP POLICY IF EXISTS "Public can view menu images" ON storage.objects;
    CREATE POLICY "Public can view menu images" 
        ON storage.objects FOR SELECT 
        TO anon, authenticated 
        USING (bucket_id IN ('menu-images', 'restaurant-assets'));

    -- Authenticated admin upload/modify access
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

-- ------------------------------------------------------------------------------
-- 8. IDEMPOTENT INITIAL SEED DATA
-- ------------------------------------------------------------------------------
-- Initialize Site Settings Single Row
INSERT INTO public.site_settings (
    id,
    restaurant_name_ar,
    restaurant_name_en,
    address_ar,
    address_en,
    primary_phone,
    whatsapp_number,
    working_hours_ar,
    working_hours_en,
    delivery_estimate_ar,
    delivery_estimate_en,
    is_restaurant_open,
    banner_enabled,
    banner_text_ar,
    banner_text_en,
    theme_palette
)
VALUES (
    'primary',
    'مطعم مايسترو',
    'MAESTRO Restaurant',
    'سوريا، النبك، شارع أمين',
    'Syria, Al-Nabek, Amin Street',
    '0969 697 587',
    '963969697587',
    'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل',
    'Daily: 12:00 PM - 02:00 AM',
    '30 - 45 دقيقة',
    '30 - 45 mins',
    true,
    false,
    'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها',
    'Now accepting orders with express delivery in Al-Nabek and surrounding areas',
    '{
        "primary_accent": "#F59E0B",
        "dark_bg": "#0B0F17",
        "dark_surface": "#1A1D24",
        "light_bg": "#FAF7F2",
        "light_surface": "#FFFFFF",
        "dark_border": "rgba(255, 255, 255, 0.08)",
        "light_border": "rgba(226, 232, 240, 0.8)"
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Initialize Categories
DO $$
DECLARE
    cat_towers UUID;
    cat_shawarma UUID;
    cat_broasted UUID;
    cat_sandwiches UUID;
    cat_drinks UUID;
BEGIN
    INSERT INTO public.categories (name_ar, name_en, slug, sort_order, is_active)
    VALUES ('أبراج وتورتات المناسبات', 'Celebration Towers', 'towers', 1, true)
    ON CONFLICT (slug) DO UPDATE SET sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active
    RETURNING id INTO cat_towers;

    INSERT INTO public.categories (name_ar, name_en, slug, sort_order, is_active)
    VALUES ('شاورما مايسترو', 'Maestro Shawarma', 'shawarma', 2, true)
    ON CONFLICT (slug) DO UPDATE SET sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active
    RETURNING id INTO cat_shawarma;

    INSERT INTO public.categories (name_ar, name_en, slug, sort_order, is_active)
    VALUES ('بروستد ومقرمش', 'Broasted & Crispy', 'broasted', 3, true)
    ON CONFLICT (slug) DO UPDATE SET sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active
    RETURNING id INTO cat_broasted;

    INSERT INTO public.categories (name_ar, name_en, slug, sort_order, is_active)
    VALUES ('ساندوتشات وسوبريم', 'Subs & Supreme', 'sandwiches', 4, true)
    ON CONFLICT (slug) DO UPDATE SET sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active
    RETURNING id INTO cat_sandwiches;

    INSERT INTO public.categories (name_ar, name_en, slug, sort_order, is_active)
    VALUES ('عصائر ومشروبات', 'Fresh Drinks', 'drinks', 5, true)
    ON CONFLICT (slug) DO UPDATE SET sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active
    RETURNING id INTO cat_drinks;

    -- Clean old test records if re-running
    DELETE FROM public.menu_items WHERE name_en IN (
        'Maestro Royal Shawarma Tower',
        'Celebration Birthday Shawarma Cake',
        'Assorted Shawarma Arabi Platters',
        'Maestro Princess Crispy Meal',
        'Maestro Supreme Chicken Meal',
        'Maestro French Baguette Crispy',
        'Maestro Sizzling Fajita & Mushroom Sub',
        'Maestro Broasted Chicken with Potato Crisps',
        'Maestro Fresh Shawarma Spit by Weight'
    );

    -- Insert Menu Items
    INSERT INTO public.menu_items (
        category_id, name_ar, name_en, description_ar, description_en, 
        price, image_url, badge, is_available, preparation_time, sort_order
    ) VALUES
    (
        cat_towers,
        'برج شاورما مايسترو الملكي',
        'Maestro Royal Shawarma Tower',
        'تحفة فنية فاخرة من لفائف الشاورما المقطعة على عدة طبقات، مزينة بالخضار الطازجة، مخلل اللفت الوردي، الجزر، والليمون مع صوصات المايسترو الخاصة.',
        'A magnificent multi-tiered celebration tower of sliced toasted shawarma rolls, garnished with crisp arugula, pink pickled turnip roses, carrots, and signature toum dips.',
        240000,
        'shawarma-tower',
        'Signature',
        true,
        '25-35 دقيقة',
        1
    ),
    (
        cat_towers,
        'تورتة الشاورما لأعياد الميلاد',
        'Celebration Birthday Shawarma Cake',
        'كيكة شاورما مبتكرة مصممة خصيصاً للمناسبات وأعياد الميلاد مع شريطة حمراء وبطاقة تهنئة أنيقة، محشوة بألذ قطع الشاورما وتشكيلة المخللات.',
        'An inventive celebration shawarma cake designed for birthdays and milestones, adorned with a satin ribbon, floral greeting card, pickles, and carved veggie roses.',
        195000,
        'shawarma-cake',
        'Popular',
        true,
        '30-40 دقيقة',
        2
    ),
    (
        cat_shawarma,
        'صينية وجبات شاورما عربي مشكل',
        'Assorted Shawarma Arabi Platters',
        'صواني شاورما عربي مقطعة ومحمصة ببراعة، تقدم مع أصابع البطاطا المتبلة، صحن التومية، مخللات شامية وسلطة خضراء منعشة.',
        'Toasted Saj shawarma rolls sliced into bite-sized portions, served on generous platters with spiced golden fries, creamy toum garlic dip, Syrian pickles, and fresh salad.',
        75000,
        'shawarma-platters',
        'Best Seller',
        true,
        '15-20 دقيقة',
        3
    ),
    (
        cat_sandwiches,
        'وجبة برنسس الدجاج المقرمش',
        'Maestro Princess Crispy Meal',
        'الوجبة الحصرية الأكثر شهرة! قطع دجاج مقرمشة بتتبيلة خاصة مغطاة بصوص الكريمة والجبنة الذائب، مع بطاطا ذهبية وسلطة كول سلو.',
        'The famous house specialty! Crisp tender chicken breast layered with melted cheddar and rich cream-garlic drizzle, served with spiced fries and fresh coleslaw.',
        68000,
        'princess-meal',
        'Signature',
        true,
        '15-20 دقيقة',
        4
    ),
    (
        cat_sandwiches,
        'وجبة سوبريم مايسترو',
        'Maestro Supreme Chicken Meal',
        'فيليه دجاج سوبريم محضر بقرمشة لا تُقاوم مع طبقة جبنة شيدر غنية وصوص المايونيز بالثوم المميز، يقدم مع كول سلو وبطاطا مقلية.',
        'Supreme crispy fried chicken breast topped with a blanket of melted cheddar and garlic mayonnaise glaze, accompanied by crisp coleslaw and golden chips.',
        65000,
        'supreme-meal',
        NULL,
        true,
        '15-20 دقيقة',
        5
    ),
    (
        cat_sandwiches,
        'ساندوتش كرسبي بالصمون الفرنسي',
        'Maestro French Baguette Crispy',
        'أصابع دجاج كرسبي ذهبية مقرمشة موضوعة بعناية داخل خبز الصمون الفرنسي الطازج، مع الخس المقرمش وصوص الثوم والمايونيز السري.',
        'Golden crisp chicken tenders nestled inside freshly baked French baguette bread, with crisp iceberg lettuce, pickles, and Maestro secret garlic sauce.',
        48000,
        'crispy-baguettes',
        NULL,
        true,
        '10-15 دقيقة',
        6
    ),
    (
        cat_sandwiches,
        'ساندوتش فاهيتا مايسترو بالمشروم والجبن',
        'Maestro Sizzling Fajita & Mushroom Sub',
        'شرائح دجاج متبلة ومطهوة على الصاج مع الفطر الطازج، الفليفلة الملونة، الذرة الحلوة وجبنة الموزاريلا السائحة بنكهة مكسيكية شرقية فريدة.',
        'Tender chicken slices wok-sizzled with fresh mushrooms, bell peppers, sweet corn, melted mozzarella, and aromatic fajita herbs in a warm sub.',
        52000,
        'fajita-sub',
        NULL,
        true,
        '12-18 دقيقة',
        7
    ),
    (
        cat_broasted,
        'وجبة بروستد مايسترو مع الشيبس المقرمش',
        'Maestro Broasted Chicken with Potato Crisps',
        'قطع الدجاج المقرمشة ذات القشرة الذهبية الهشة واللحم الطري المتبل، تقدم مع رقائق بطاطا الشيبس الدائرية المميزة و4 عبوات تومية وكاتشب.',
        'Deep golden crispy fried chicken with crunchy seasoned skin and juicy tender meat, served with Maestro round potato crisps, 4 creamy toum garlic pots, and ketchup.',
        85000,
        'broasted-chips',
        'Best Seller',
        true,
        '20-25 دقيقة',
        8
    ),
    (
        cat_shawarma,
        'وجبة سيخ شاورما مايسترو بالوزن',
        'Maestro Fresh Shawarma Spit by Weight',
        'شاورما دجاج مقطعة طازجة مباشرة من سيخ الشاورما العملاق، تقدم بالوزن مع مخللات، صوص الثوم، بطاطا مقلية وخبز ساخن.',
        'Fresh succulent chicken carved straight from our colossal shawarma rotisserie spit, packed with rich Levantine juices, warm flatbread, and toum.',
        60000,
        'shawarma-spit',
        NULL,
        true,
        '10-15 دقيقة',
        9
    );

    -- Sync meals table for backward compatibility
    INSERT INTO public.meals (id, category_id, name_ar, name_en, description_ar, description_en, price, image_url, is_promoted, is_available)
    SELECT id, category_id, name_ar, name_en, description_ar, description_en, price, image_url, (badge = 'Signature' OR badge = 'Best Seller'), is_available
    FROM public.menu_items
    ON CONFLICT (id) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        price = EXCLUDED.price,
        image_url = EXCLUDED.image_url,
        is_available = EXCLUDED.is_available;
END $$;
