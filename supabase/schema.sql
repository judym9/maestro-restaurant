-- ==============================================================================
-- MAESTRO RESTAURANT DATABASE SCHEMA & MIGRATIONS
-- Compatible with Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. MEALS TABLE
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

-- Indexes for performant filtering
CREATE INDEX IF NOT EXISTS idx_meals_category ON public.meals(category_id);
CREATE INDEX IF NOT EXISTS idx_meals_is_available ON public.meals(is_available);
CREATE INDEX IF NOT EXISTS idx_meals_is_promoted ON public.meals(is_promoted);

-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE
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

-- ------------------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    meal_id UUID REFERENCES public.meals(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC NOT NULL CHECK (unit_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public read access
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
    CREATE POLICY "Public can view categories" 
        ON public.categories FOR SELECT 
        TO anon, authenticated 
        USING (true);
END $$;

-- Meals: Public read access for available meals
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view available meals" ON public.meals;
    CREATE POLICY "Public can view available meals" 
        ON public.meals FOR SELECT 
        TO anon, authenticated 
        USING (is_available = true);
END $$;

-- Orders: Public can insert orders (Guest checkout)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can place orders" ON public.orders;
    CREATE POLICY "Public can place orders" 
        ON public.orders FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);

    -- Admin staff can read/manage orders
    DROP POLICY IF EXISTS "Admins can view and update orders" ON public.orders;
    CREATE POLICY "Admins can view and update orders" 
        ON public.orders FOR ALL 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
END $$;

-- Order Items: Public can insert order items
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
    CREATE POLICY "Public can insert order items" 
        ON public.order_items FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);

    -- Admin staff can view and manage order items
    DROP POLICY IF EXISTS "Admins can view order items" ON public.order_items;
    CREATE POLICY "Admins can view order items" 
        ON public.order_items FOR ALL 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
END $$;

-- ------------------------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKET CONFIGURATION
-- Bucket Name: restaurant-assets (Public read access)
-- Structure:
--   restaurant-assets/meals/
--   restaurant-assets/brand/
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Policy: Allow anyone to view images
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view restaurant assets" ON storage.objects;
    CREATE POLICY "Public can view restaurant assets" 
        ON storage.objects FOR SELECT 
        TO anon, authenticated 
        USING (bucket_id = 'restaurant-assets');
        
    -- Admin Storage Policy: Authenticated users can upload assets
    DROP POLICY IF EXISTS "Authenticated users can upload restaurant assets" ON storage.objects;
    CREATE POLICY "Authenticated users can upload restaurant assets" 
        ON storage.objects FOR INSERT 
        TO authenticated 
        WITH CHECK (bucket_id = 'restaurant-assets');
END $$;

-- ------------------------------------------------------------------------------
-- 7. IDEMPOTENT SEED DATA (AUTHENTIC MAESTRO SPECIALTIES)
-- ------------------------------------------------------------------------------
DO $$
DECLARE
    cat_shawarma UUID;
    cat_broasted UUID;
    cat_sandwiches UUID;
    cat_towers UUID;
    cat_drinks UUID;
BEGIN
    -- Insert or fetch categories
    INSERT INTO public.categories (name_ar, name_en, slug)
    VALUES ('شاورما مايسترو', 'Maestro Shawarma', 'shawarma')
    ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
    RETURNING id INTO cat_shawarma;

    INSERT INTO public.categories (name_ar, name_en, slug)
    VALUES ('بروستد ومقرمش', 'Broasted & Crispy', 'broasted')
    ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
    RETURNING id INTO cat_broasted;

    INSERT INTO public.categories (name_ar, name_en, slug)
    VALUES ('ساندوتشات وسوبريم', 'Subs & Supreme', 'sandwiches')
    ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
    RETURNING id INTO cat_sandwiches;

    INSERT INTO public.categories (name_ar, name_en, slug)
    VALUES ('أبراج وتورتات المناسبات', 'Celebration Towers', 'towers')
    ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
    RETURNING id INTO cat_towers;

    INSERT INTO public.categories (name_ar, name_en, slug)
    VALUES ('عصائر ومشروبات', 'Fresh Drinks', 'drinks')
    ON CONFLICT (slug) DO UPDATE SET name_ar = EXCLUDED.name_ar
    RETURNING id INTO cat_drinks;

    -- Clean old seed meals to avoid duplicate test records
    DELETE FROM public.meals WHERE name_en IN (
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

    -- Insert Authentic Meals
    INSERT INTO public.meals (category_id, name_ar, name_en, description_ar, description_en, price, image_url, is_promoted, is_available)
    VALUES
    (
        cat_towers,
        'برج شاورما مايسترو الملكي',
        'Maestro Royal Shawarma Tower',
        'تحفة فنية فاخرة من لفائف الشاورما المقطعة على عدة طبقات، مزينة بالخضار الطازجة، مخلل اللفت الوردي، الجزر، والليمون مع صوصات المايسترو الخاصة.',
        'A magnificent multi-tiered celebration tower of sliced toasted shawarma rolls, garnished with crisp arugula, pink pickled turnip roses, carrots, and signature toum dips.',
        240000,
        'shawarma-tower',
        true,
        true
    ),
    (
        cat_towers,
        'تورتة الشاورما لأعياد الميلاد',
        'Celebration Birthday Shawarma Cake',
        'كيكة شاورما مبتكرة مصممة خصيصاً للمناسبات وأعياد الميلاد مع شريطة حمراء وبطاقة تهنئة أنيقة، محشوة بألذ قطع الشاورما وتشكيلة المخللات.',
        'An inventive celebration shawarma cake designed for birthdays and milestones, adorned with a satin ribbon, floral greeting card, pickles, and carved veggie roses.',
        195000,
        'shawarma-cake',
        true,
        true
    ),
    (
        cat_shawarma,
        'صينية وجبات شاورما عربي مشكل',
        'Assorted Shawarma Arabi Platters',
        'صواني شاورما عربي مقطعة ومحمصة ببراعة، تقدم مع أصابع البطاطا المتبلة، صحن التومية، مخللات شامية وسلطة خضراء منعشة.',
        'Toasted Saj shawarma rolls sliced into bite-sized portions, served on generous platters with spiced golden fries, creamy toum garlic dip, Syrian pickles, and fresh salad.',
        75000,
        'shawarma-platters',
        false,
        true
    ),
    (
        cat_sandwiches,
        'وجبة برنسس الدجاج المقرمش',
        'Maestro Princess Crispy Meal',
        'الوجبة الحصرية الأكثر شهرة! قطع دجاج مقرمشة بتتبيلة خاصة مغطاة بصوص الكريمة والجبنة الذائب، مع بطاطا ذهبية وسلطة كول سلو.',
        'The famous house specialty! Crisp tender chicken breast layered with melted cheddar and rich cream-garlic drizzle, served with spiced fries and fresh coleslaw.',
        68000,
        'princess-meal',
        true,
        true
    ),
    (
        cat_sandwiches,
        'وجبة سوبريم مايسترو',
        'Maestro Supreme Chicken Meal',
        'فيليه دجاج سوبريم محضر بقرمشة لا تُقاوم مع طبقة جبنة شيدر غنية وصوص المايونيز بالثوم المميز، يقدم مع كول سلو وبطاطا مقلية.',
        'Supreme crispy fried chicken breast topped with a blanket of melted cheddar and garlic mayonnaise glaze, accompanied by crisp coleslaw and golden chips.',
        65000,
        'supreme-meal',
        false,
        true
    ),
    (
        cat_sandwiches,
        'ساندوتش كرسبي بالصمون الفرنسي',
        'Maestro French Baguette Crispy',
        'أصابع دجاج كرسبي ذهبية مقرمشة موضوعة بعناية داخل خبز الصمون الفرنسي الطازج، مع الخس المقرمش وصوص الثوم والمايونيز السري.',
        'Golden crisp chicken tenders nestled inside freshly baked French baguette bread, with crisp iceberg lettuce, pickles, and Maestro secret garlic sauce.',
        48000,
        'crispy-baguettes',
        false,
        true
    ),
    (
        cat_sandwiches,
        'ساندوتش فاهيتا مايسترو بالمشروم والجبن',
        'Maestro Sizzling Fajita & Mushroom Sub',
        'شرائح دجاج متبلة ومطهوة على الصاج مع الفطر الطازج، الفليفلة الملونة، الذرة الحلوة وجبنة الموزاريلا السائحة بنكهة مكسيكية شرقية فريدة.',
        'Tender chicken slices wok-sizzled with fresh mushrooms, bell peppers, sweet corn, melted mozzarella, and aromatic fajita herbs in a warm sub.',
        52000,
        'fajita-sub',
        false,
        true
    ),
    (
        cat_broasted,
        'وجبة بروستد مايسترو مع الشيبس المقرمش',
        'Maestro Broasted Chicken with Potato Crisps',
        'قطع الدجاج المقرمشة ذات القشرة الذهبية الهشة واللحم الطري المتبل، تقدم مع رقائق بطاطا الشيبس الدائرية المميزة و4 عبوات تومية وكاتشب.',
        'Deep golden crispy fried chicken with crunchy seasoned skin and juicy tender meat, served with Maestro round potato crisps, 4 creamy toum garlic pots, and ketchup.',
        85000,
        'broasted-chips',
        true,
        true
    ),
    (
        cat_shawarma,
        'وجبة سيخ شاورما مايسترو بالوزن',
        'Maestro Fresh Shawarma Spit by Weight',
        'شاورما دجاج مقطعة طازجة مباشرة من سيخ الشاورما العملاق، تقدم بالوزن مع مخللات، صوص الثوم، بطاطا مقلية وخبز ساخن.',
        'Fresh succulent chicken carved straight from our colossal shawarma rotisserie spit, packed with rich Levantine juices, warm flatbread, and toum.',
        60000,
        'shawarma-spit',
        false,
        true
    );
END $$;
