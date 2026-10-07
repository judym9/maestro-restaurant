# Maestro Restaurant — Admin Platform Pure Specification (`ADMIN_SPEC.md`)

> **Notice:** This document contains the pure functional specification, domain logic, data models, state architectures, workflows, and backend contracts of the Maestro Restaurant Administration Platform. All visual styling, Tailwind utility classes, CSS animations, and layout presentation details have been strictly stripped away so the entire frontend interface can be rebuilt from scratch with clean, modern UI components.

---

## 1. Architecture & Scope

### 1.1 Module Inventory & Pages

The administration platform is structured into five core operational modules, accessible through a master management shell:

| Module Identifier | Screen / Page Component | Primary Responsibilities |
| :--- | :--- | :--- |
| **Authentication** | `AdminLoginPage` (`/admin/login`) | Admin credential entry, session validation, password visibility toggling, demo authentication shortcut, and redirection back to protected routes. |
| **Dashboard** | `AdminDashboardPage` (`/admin`, tab: `'dashboard'`) | High-level executive KPI telemetry (total dishes, active categories, active promos, live kitchen open/closed status), quick kitchen status toggle, branch operational summary, menu category breakdown, active promo deals overview, and signature dish roster. |
| **Menu Management** | `AdminMenuPage` (`/admin`, tab: `'menu'`) | Catalog management for food items and categories. Real-time text search, category filtering tabs, availability filters, tag filters, meal creation/edit modal with portion options, category creation/edit modal, availability toggle switches, and deletion confirmations. |
| **Promotions & Royal Deals** | Promotions View (`/admin`, tab: `'promotions'`) | Royal celebration deals, discount percentage automation, package savings computation, multi-item package title parsing (`+` delimiter), expiration day countdowns, active deal toggling, deal creation/edit modal, deletion confirmations, and client-side pagination. |
| **Branch Settings** | `AdminSettingsPage` (`/admin`, tab: `'settings'`) | Operational master status, branch contact details, Google Maps integration, 7-day weekly opening/closing schedule table, bulk schedule replication, Friday off-day toggling, 12h/24h time format conversion, delivery speed estimates, minimum order thresholds, delivery fees, and emergency announcement banner toggle. |
| **Theme & Visual Customizer** | Theme View (`/admin`, tab: `'theme'`) | Color token editor (HEX pickers and native input swatches), 5 curated regional presets, typography selection (4 Google Arabic fonts), restaurant logo upload (PNG validation & Base64 FileReader), live multi-mode simulator preview canvas (dark/light toggle), and dynamic DOM CSS variable injection. |

### 1.2 Route Definitions & RBAC Protection Rules

#### Routes
1. **Public Route**: `/` — Customer-facing storefront home page.
2. **Authentication Route**: `/admin/login` — Public login portal.
   - If an authenticated session already exists, user is immediately redirected to either the requested redirect target (`location.state.from.pathname`) or `/admin`.
3. **Protected Route**: `/admin` — Master Administration Platform root.
   - Guarded by `AdminRouteGuard`.
   - Any unauthenticated access intercepts the request and redirects to `/admin/login`, preserving the requested URL in `location.state.from`.
4. **Catch-All Fallback**: `*` — Redirects unknown paths to `/`.

#### Role-Based Access Control (RBAC) & Authorization Engine
- **Supported User Roles**:
  - `admin`: Full unrestricted control across site settings, catalog, pricing, promotions, themes, and staff.
  - `manager`: Operational management (can modify operating hours, order settings, meal availability, and promotions).
  - `editor`: Content updater (can modify dish descriptions, categories, and promo texts).
- **Database Role Enforcement**:
  - Checked via the PostgreSQL security-definer function `public.is_admin()`, querying `public.admin_users WHERE id = auth.uid() AND role = 'admin'`.
  - Supabase Row Level Security (RLS) restricts `INSERT`, `UPDATE`, and `DELETE` on `site_settings`, `categories`, `menu_items`, `meals`, `promotions`, and `storage.objects` strictly to users passing `public.is_admin()`.
- **Resilient Fallback Mode (Offline / Unconfigured Supabase)**:
  - If Supabase environment variables are missing or point to placeholders, the client operates in an offline-resilient local mode using `localStorage`.
  - Built-in fallback accounts accept:
    - Username / Email: `admin`, `admin@maestro.com`, `manager@maestro.com`
    - Passwords: `maestro`, `admin123`, `maestro2026`, `admin`
    - Any valid email address paired with a password length $\ge 6$ characters (for rapid developer testing).

---

## 2. Data Entities & Schema

### 2.1 Entity Definitions & Field Specifications

#### Entity: `AdminUser` (Database table: `admin_users`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | No | Primary Key, references `auth.users(id)` ON DELETE CASCADE | Auto-generated UUID |
| `email` | `string` | No | Valid email format, unique constraint | — |
| `name` | `string` | Yes | Virtual display name from `user_metadata.name` | `'مدير النظام'` |
| `role` | `'admin' \| 'manager' \| 'editor'` | No | Restricted to admin, manager, or editor | `'admin'` |
| `created_at` | `string` (ISO 8601) | No | Server timestamp | `NOW()` |
| `lastLoginAt` | `string` (ISO 8601) | Yes | Client runtime session timestamp | Current ISO timestamp |

---

#### Entity: `CategoryItem` / `CategoryFormData` (Database table: `categories`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | No | Primary Key | `uuid_generate_v4()` or `cat-${Date.now()}` |
| `name_ar` (`nameAr`) | `string` | No | Arabic label, min length 1, trimmed | Required input |
| `name_en` (`nameEn`) | `string` | No | English label, min length 1, trimmed | Required input |
| `slug` | `string` | No | Unique slug, lowercase, URL-safe | Auto-generated from timestamp if blank |
| `sort_order` (`sortOrder`) | `number` (integer) | No | Sorting index $\ge 0$ | Incremental index or `0` |
| `is_active` (`isActive`) | `boolean` | No | Visibility flag in menu listings | `true` |
| `itemCount` | `number` (integer) | Yes | Computed client-side count of associated dishes | `0` |
| `created_at` | `string` (ISO 8601) | No | Creation timestamp | `NOW()` |

---

#### Entity: `AdminMealItem` / `MealFormData` (Database table: `menu_items`, mirrors `meals`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | No | Primary Key | `uuid_generate_v4()` or `dish-${Date.now()}` |
| `category_id` (`categoryId`) | `UUID` / `string` | Yes | Foreign Key referencing `categories(id)` ON DELETE SET NULL | First available category ID |
| `name_ar` (`nameAr`) | `string` | No | Arabic meal title, required, trimmed | Required input |
| `name_en` (`nameEn`) | `string` | No | English meal title, required, trimmed | Required input |
| `title_ar` / `title_en` | `string` | Yes | Mirrored columns kept in sync with `name_ar`/`name_en` | Same as `name_ar`/`name_en` |
| `description_ar` (`descriptionAr`) | `string` | Yes | Arabic ingredients & preparation description | `''` |
| `description_en` (`descriptionEn`) | `string` | Yes | English description | `''` |
| `price` | `number` (numeric) | No | Price in Syrian Pounds (SYP), $\ge 0$, rounded | `150000` |
| `original_price` (`originalPrice`) | `number` (numeric) | Yes | Pre-discount reference price, $\ge 0$ | `undefined` |
| `image_url` (`imageKey`) | `string` | No | Key referencing asset registry (e.g. `'shawarma-tower'`, `'broasted-chips'`) | `'shawarma-tower'` |
| `badge` | `string` | Yes | Badge text: `'Signature'`, `'Best Seller'`, `'Popular'` | `null` |
| `is_available` (`isAvailable`) | `boolean` | No | Live availability switch for customer orders | `true` |
| `is_signature` (`isSignature`) | `boolean` | No | Royal signature meal flag | `false` |
| `is_bestseller` (`isBestseller`) | `boolean` | No | High-volume popular meal flag | `false` |
| `is_spicy` (`isSpicy`) | `boolean` | No | Spicy culinary item indicator | `false` |
| `is_new` (`isNew`) | `boolean` | No | Newly added item flag | `false` |
| `rating` | `number` | No | Customer review rating (1.0 to 5.0) | `4.9` (default seed: `5.0`) |
| `reviews_count` (`reviewsCount`) | `number` | No | Total review count tally | `120` (new items: `1`) |
| `preparation_time` | `string` | Yes | Human-readable preparation window | `'15-20 دقيقة'` |
| `prep_time_minutes` | `number` | Yes | Estimated preparation duration in minutes | `20` |
| `sort_order` (`sortOrder`) | `number` | No | Display sorting sequence | `0` |
| `ingredients_ar` (`ingredientsAr`) | `string[]` | No | Array of Arabic ingredient tags (parsed from comma text) | `['مكونات مايسترو الفاخرة']` |
| `ingredients_en` (`ingredientsEn`) | `string[]` | No | Array of English ingredient tags | `['Fresh Maestro Ingredients']` |
| `options` | `MealOption[]` | No | Array of portion options & add-ons | `[]` |
| `created_at` | `string` (ISO 8601) | No | Creation timestamp | `NOW()` |

---

#### Entity: `MealOption` (Embedded child entity within meal items)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | No | Unique identifier for option | `opt-${Date.now()}` |
| `nameAr` | `string` | No | Arabic option name (e.g., `'حجم كبير'`, `'إضافة جبنة'`) | Required input |
| `nameEn` | `string` | No | English option name (e.g., `'Large Size'`, `'Extra Cheese'`) | Required input |
| `priceDiff` | `number` | No | Price difference delta in SYP ($0$ if included, positive if surcharge) | `0` |

---

#### Entity: `AdminPromoDeal` / `PromoFormData` (Database table: `promotions`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` / `string` | No | Primary Key | `gen_random_uuid()` or `promo-${Date.now()}` |
| `title_ar` (`titleAr`) | `string` | No | Arabic offer title. Can use `+` delimiter for multi-item breakdown | Required input |
| `title_en` (`titleEn`) | `string` | No | English offer title | Required input |
| `description_ar` (`descriptionAr`) | `string` | Yes | Arabic offer contents summary | `''` |
| `description_en` (`descriptionEn`) | `string` | Yes | English offer contents summary | `''` |
| `badge` (`badgeAr` / `badgeEn`) | `string` | Yes | Promotional badge (e.g., `'عرض التوفير الملكي'`) | `'عرض خاص'` |
| `image_url` (`imageKey`) | `string` | No | Asset key referencing promotional media | `'shawarma-tower'` |
| `price` | `number` | No | Discounted bundle offer price in SYP | `210000` |
| `original_price` (`originalPrice`) | `number` | No | Strikethrough regular price in SYP | `280000` |
| `discount_percentage` (`discountPercent`) | `number` (integer) | No | Discount percentage (0–100), automated or overridden | `25` |
| `remaining_days` (`remainingDays`) | `number` (integer) | No | Days left before offer expiration | `7` |
| `expiration_date` (`expirationDate`) | `string` (ISO 8601) | Yes | Optional fixed date of expiration | `undefined` |
| `featured` | `boolean` | No | Highlighted hero bundle flag | `false` |
| `is_active` (`isActive`) | `boolean` | No | Active publication status | `true` |
| `sort_order` (`sortOrder`) | `number` (integer) | No | Presentation order index | `0` |
| `created_at` | `string` (ISO 8601) | No | Creation timestamp | `NOW()` |

---

#### Entity: `RestaurantSettings` (Database tables: `restaurant_settings` & `site_settings`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `number` / `string` | No | Primary Key (`1` for `restaurant_settings`, `'primary'` for `site_settings`) | `1` / `'primary'` |
| `is_kitchen_open` (`isKitchenOpen` / `is_restaurant_open`) | `boolean` | No | Master operational toggle: accepting customer orders vs paused | `true` |
| `delivery_time_ar` (`deliveryTimeAr`) | `string` | No | Estimated preparation & delivery time in Arabic | `'30 - 45 دقيقة'` |
| `delivery_time_en` (`deliveryTimeEn`) | `string` | No | Estimated preparation & delivery time in English | `'30 - 45 mins'` |
| `announcement_banner_active` (`announcementBannerActive` / `banner_enabled`) | `boolean` | No | Flag indicating if top site-wide announcement banner is displayed | `false` |
| `announcement_banner_text_ar` (`announcementBannerTextAr` / `banner_text_ar`) | `string` | No | Top announcement text in Arabic | `'نستقبل طلباتكم الآن مع خدمة التوصيل السريع في النبك وما حولها'` |
| `announcement_banner_text_en` (`announcementBannerTextEn` / `banner_text_en`) | `string` | No | Top announcement text in English | `'Now accepting orders with express delivery in Al-Nabek and surrounding areas'` |
| `phone` (`primary_phone` / `phonePrimary`) | `string` | No | Official branch telephone | `'0969 697 587'` |
| `phoneSecondary` | `string` | Yes | Landline or auxiliary backup phone | `'011 722 0000'` |
| `whatsapp` (`whatsapp_number` / `whatsappNumber`) | `string` | No | Digits-only WhatsApp direct ordering channel | `'963969697587'` |
| `address_ar` (`addressAr`) | `string` | No | Physical branch address in Arabic | `'سوريا، النبك، شارع أمين'` |
| `address_en` (`addressEn`) | `string` | No | Physical branch address in English | `'Syria, Al-Nabek, Amin Street'` |
| `googleMapsUrl` (`maps_embed_url`) | `string` | No | URL to Google Maps pin | Official Al-Nabek Maps URL |
| `working_hours_ar` (`workingHoursAr`) | `string` | No | Text description of business hours in Arabic | `'يومياً: 12:00 ظهراً - 02:00 بعد منتصف الليل'` |
| `working_hours_en` (`workingHoursEn`) | `string` | No | Text description of business hours in English | `'Daily: 12:00 PM - 02:00 AM'` |
| `openingTime` | `string` | No | Daily master opening time (24h format `'HH:mm'`) | `'12:00'` |
| `closingTime` | `string` | No | Daily master closing time (24h format `'HH:mm'`) | `'02:00'` |
| `minOrderAmount` | `number` | Yes | Minimum order requirement in SYP | `50000` |
| `deliveryFee` | `number` | Yes | Delivery fee surcharge in SYP | `15000` |
| `weeklySchedule` | `DaySchedule[]` | No | 7-day schedule array (Saturday through Friday) | 7-day default array |
| `updated_at` (`updatedAt`) | `string` (ISO 8601) | No | Last modification timestamp | Current ISO timestamp |

---

#### Entity: `DaySchedule` (Day item in `weeklySchedule`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `dayId` | `'saturday' \| 'sunday' \| 'monday' \| 'tuesday' \| 'wednesday' \| 'thursday' \| 'friday'` | No | Immutable day identifier | Required key |
| `nameAr` | `string` | No | Day label in Arabic (السبت .. الجمعة) | Assigned per day |
| `nameEn` | `string` | No | Day label in English (Saturday .. Friday) | Assigned per day |
| `isOpen` | `boolean` | No | Whether the branch operates on this day | `true` |
| `openTime` | `string` | No | 24-hour time `'HH:mm'` | `'12:00'` |
| `closeTime` | `string` | No | 24-hour time `'HH:mm'` | `'02:00'` |

---

#### Entity: `ThemeTokens` (Database JSONB: `site_settings.theme_palette`)
| Field Name | Data Type | Nullable | Validation Rules / Notes | Default Value |
| :--- | :--- | :--- | :--- | :--- |
| `primaryAccent` | `string` (HEX) | No | Primary brand gold / highlight color | `'#D97706'` (or `'#F59E0B'`) |
| `secondaryAccent` | `string` (HEX) | Yes | Secondary badge and promo accent | `'#F59E0B'` |
| `darkBg` | `string` (HEX) | No | Dark mode page canvas background | `'#0B0F17'` |
| `darkSurface` | `string` (HEX) | No | Dark mode component/card background | `'#1A1D24'` |
| `darkBorder` | `string` (CSS Color) | No | Dark mode border color | `'rgba(255, 255, 255, 0.1)'` |
| `lightBg` | `string` (HEX) | No | Light mode page canvas background | `'#FAF7F2'` |
| `lightSurface` | `string` (HEX) | No | Light mode component/card background | `'#FFFFFF'` |
| `lightBorder` | `string` (CSS Color) | No | Light mode border color | `'rgba(226, 232, 240, 0.8)'` |
| `fontFamily` | `string` | Yes | Google Font family (`'Cairo'`, `'Readex Pro'`, `'Tajawal'`, `'IBM Plex Sans Arabic'`) | `'Cairo'` |
| `successColor` | `string` (HEX) | Yes | Positive operational/status color | `'#10B981'` |
| `dangerColor` | `string` (HEX) | Yes | Destructive alert/closed status color | `'#F43F5E'` |
| `logoUrl` | `string` | Yes | Custom logo Base64 or URL override | `''` (uses default asset) |
| `bannerUrl` | `string` | Yes | Custom promotional header asset URL | `''` |

---

#### Entity: `Order` & `OrderItem` (Database tables: `orders` & `order_items`)
| Field Name | Data Type | Nullable | Validation Rules / Notes |
| :--- | :--- | :--- | :--- |
| `orders.id` | `UUID` | No | Primary Key |
| `orders.customer_name` | `string` | No | Customer full name |
| `orders.customer_phone` | `string` | No | Customer telephone number |
| `orders.delivery_address` | `string` | Yes | Physical delivery destination |
| `orders.total_price` | `number` | No | Final order total in SYP ($\ge 0$) |
| `orders.status` | `'pending' \| 'confirmed' \| 'delivered' \| 'cancelled'` | No | Order lifecycle status (default: `'pending'`) |
| `orders.created_at` | `string` | No | Order placement timestamp |
| `order_items.id` | `UUID` | No | Primary Key |
| `order_items.order_id` | `UUID` | No | Foreign Key referencing `orders(id)` ON DELETE CASCADE |
| `order_items.meal_id` | `UUID` | Yes | Foreign Key referencing `menu_items(id)` ON DELETE SET NULL |
| `order_items.quantity` | `number` | No | Quantity ordered ($> 0$) |
| `order_items.unit_price` | `number` | No | Price per unit at purchase time ($\ge 0$) |

### 2.2 Entity Relationships

```
┌─────────────────┐       1 : N       ┌───────────────────┐
│   categories    ├───────────────────┤    menu_items     │
└────────┬────────┘                   └─────────┬─────────┘
         │                                      │
         │ (ON DELETE SET NULL)                 │ 1 : N (Embedded)
         │                                      ▼
         │                            ┌───────────────────┐
         │                            │    MealOption     │
         │                            └───────────────────┘
         │                                      │
         │                                      │ 1 : N
         │                                      ▼
┌────────┴────────┐       1 : N       ┌───────────────────┐
│     orders      ├───────────────────┤    order_items    │
└─────────────────┘ (ON DELETE CASCADE)└───────────────────┘

┌────────────────────────┐            ┌────────────────────────┐
│  restaurant_settings   │            │       promotions       │
│  (Single-Row Config)   │            │   (Independent Deals)  │
└────────────────────────┘            └────────────────────────┘
```

---

## 3. State Management & Stores

### 3.1 Global & Domain Context Architecture

The admin module is organized into five specialized React Context providers:

```
AdminDataProvider (Master Data Synchronization & Supabase Realtime Hub)
 ├── AdminThemeProvider (Light/Dark Theme Mode, CSS Token Injection)
 └── AdminSettingsProvider (Operational State, Hours, Contacts, Delivery)
      └── AdminMenuProvider (Menu Dishes, Categories, Filters, Search)
```

#### 1. `AdminAuthContext`
- **Managed State**:
  - `user: AdminUser | null` — Current authenticated user object.
  - `isAuthenticated: boolean` — Boolean flag derived from `Boolean(user)`.
  - `isLoading: boolean` — True during initial session verification.
- **Methods**:
  - `login({ emailOrUsername, password }): Promise<{ success: boolean; error?: string }>`
  - `logout(): Promise<void>`
- **Persistence**: `localStorage.getItem('maestro_admin_auth_session')`.

#### 2. `AdminDataContext`
- **Managed State**:
  - `categories: CategoryItem[]` — Global category list.
  - `dishes: AdminMealItem[]` — Global dish items.
  - `promotions: AdminPromoDeal[]` — Global promotional bundles.
  - `restaurantSettings: AdminRestaurantSettings` — Live restaurant operational configuration.
  - `isLoading: boolean` — Collective data fetching status.
  - `error: string | null` — Last synchronization error message.
- **Methods**:
  - CRUD delegators for categories, dishes, promotions, and settings.
  - `refreshAll(): Promise<void>` — Triggers parallel re-fetch of all domain datasets.

#### 3. `AdminMenuContext`
- **Managed State**:
  - `dishes: AdminMealItem[]` — Raw catalog dishes.
  - `categories: CategoryItem[]` — Categories augmented with computed `itemCount`.
  - `selectedCategoryId: string` — Active category tab (`'all'` or category ID).
  - `searchQuery: string` — Query text for meal search.
  - `statusFilter: 'all' | 'available' | 'unavailable'` — Availability filter flag.
  - `tagFilter: 'all' | 'signature' | 'spicy' | 'bestseller'` — Feature tag filter flag.
  - `filteredDishes: AdminMealItem[]` — Derived filtered meal list.
  - `totalDishesCount: number` — Total dishes count.
  - `availableDishesCount: number` — Available dishes count.
  - `categoriesCount: number` — Total categories count.
- **Methods**:
  - `saveDish(formData)`, `deleteDish(id)`, `toggleDishAvailability(id)`
  - `saveCategory(formData)`, `deleteCategory(id)`

#### 4. `AdminSettingsContext`
- **Managed State**:
  - `contactInfo: BranchContactInfo` — Official phone, address, WhatsApp, Google Maps link.
  - `operatingSchedule: OperatingSchedule` — Master open status, daily times, weekly schedule, delivery fee, announcement alert banner.
  - `isSaving: boolean` — Status flag during async save.
  - `lastSavedAt: Date | null` — Timestamp of last successful write.
- **Methods**:
  - `updateContactInfo(partial)`
  - `updateOperatingSchedule(partial)`
  - `toggleOpenStatus()`

#### 5. `AdminThemeContext`
- **Managed State**:
  - `mode: 'dark' | 'light'` — Active application theme mode.
  - `tokens: ThemeTokens` — Active CSS token object.
- **Methods**:
  - `toggleMode(): void`
  - `setMode(mode): void`
  - `updateTokens(partial): void`
  - `resetTokens(): void`

---

### 3.2 Filter, Sort, Pagination & Search States

#### Menu Management Filtering Logic
The derived `filteredDishes` array in `AdminMenuContext` enforces a 4-stage filter pipeline:
1. **Category Filter**:
   - If `selectedCategoryId !== 'all'`, reject any dish where `dish.categoryId !== selectedCategoryId`.
2. **Status Filter**:
   - If `statusFilter === 'available'`, reject any dish where `dish.isAvailable === false`.
   - If `statusFilter === 'unavailable'`, reject any dish where `dish.isAvailable === true`.
3. **Tag Filter**:
   - If `tagFilter === 'signature'`, reject any dish where `dish.isSignature !== true`.
   - If `tagFilter === 'spicy'`, reject any dish where `dish.isSpicy !== true`.
   - If `tagFilter === 'bestseller'`, reject any dish where `dish.isBestseller !== true`.
4. **Search Query**:
   - Query is trimmed and converted to lowercase: `q = searchQuery.toLowerCase().trim()`.
   - Checks both languages across title and description:
     $$\text{matchAr} = \text{dish.nameAr}.\text{includes}(q) \lor \text{dish.descriptionAr}.\text{includes}(q)$$
     $$\text{matchEn} = \text{dish.nameEn}.\text{includes}(q) \lor \text{dish.descriptionEn}.\text{includes}(q)$$
   - Rejects item if $\neg\text{matchAr} \land \neg\text{matchEn}$.

#### Promotions Pagination Logic
- Controlled by `usePromotions(pageSize = 6)`.
- **States**:
  - `currentPage`: Current active page index (1-based, default `1`).
  - `pageSize`: Items per page (default `6`).
  - `totalPages`: Computed via $\max(1, \lceil \text{promos.length} / \text{pageSize} \rceil)$.
  - `paginatedPromos`: Computed slice from $\text{promos.slice}((\text{currentPage} - 1) \times \text{pageSize}, \text{start} + \text{pageSize})$.
- **Navigation Controls**:
  - `goToPage(page)`: Clamps $1 \le \text{page} \le \text{totalPages}$.
  - `nextPage()`: Increments `currentPage` if $< \text{totalPages}$.
  - `prevPage()`: Decrements `currentPage` if $> 1$.

---

## 4. Business Logic & Workflows

### 4.1 Step-by-Step CRUD Workflows

#### 1. Meal Item Creation & Modification
```
[User submits MealFormModal]
   │
   ├─► Validate nameAr & nameEn (Required non-empty string)
   ├─► Convert numeric inputs: price = Number(price), originalPrice = Number(originalPrice)
   ├─► Parse ingredients text:
   │     ingredientsAr = ingredientsArText.split(',').map(s => s.trim()).filter(Boolean)
   │     ingredientsEn = ingredientsEnText.split(',').map(s => s.trim()).filter(Boolean)
   ├─► Resolve badge attribute:
   │     badge = isSignature ? 'Signature' : (isBestseller ? 'Best Seller' : null)
   ├─► Save to Local Repository:
   │     Write to localStorage['maestro_admin_dishes']
   │     Emit window.dispatchEvent('maestro:admin-menu-updated')
   ├─► Asynchronous Supabase Persistence:
   │     UPSERT into public.menu_items
   │     Synchronize public.meals table (for backward-compatibility)
   └─► Re-fetch dishes list & close modal
```

#### 2. Meal Item Deletion
1. User clicks the delete button on `AdminMealCard`.
2. Triggers `confirmDeleteDish(id)`, storing the target meal ID in `deleteConfirmId` and opening `Modal` (size `'sm'`).
3. If confirmed via `executeDeleteDish()`:
   - Removes item from `localStorage['maestro_admin_dishes']`.
   - Sends `DELETE FROM public.menu_items WHERE id = :id` to Supabase.
   - Clears `deleteConfirmId` and emits `MENU_UPDATED_EVENT`.

#### 3. Meal Availability Toggle
1. User clicks the status switch on `AdminMealCard`.
2. Triggers `toggleDishAvailability(id)`.
3. Inverts current `isAvailable` boolean.
4. Executes optimistic local repository update and emits `MENU_UPDATED_EVENT`.
5. Sends async update query: `UPDATE public.menu_items SET is_available = :newStatus WHERE id = :id`.

#### 4. Category Creation & Modification
1. User submits `CategoryFormModal`.
2. Validates `nameAr` and `nameEn`.
3. Resolves slug: if `slug` is empty, generates `cat-${Date.now()}`.
4. If updating existing category: matches by `id` and updates fields.
5. If creating new category: appends new object with `sortOrder = categories.length + 1`.
6. Saves to localStorage, triggers update event, and executes Supabase `UPSERT into public.categories`.

#### 5. Category Deletion
1. Prompts confirmation dialog.
2. If confirmed: removes category from `localStorage` and sends `DELETE FROM public.categories WHERE id = :id`.
3. If the currently selected category tab matches the deleted category ID, automatically resets `selectedCategoryId` to `'all'`.
4. Dishes previously referencing this category have their `categoryId` set to `null` (matching database `ON DELETE SET NULL`).

#### 6. Promotion Creation & Modification
1. User submits `PromoFormModal`.
2. Automated discount calculation:
   $$\text{discountPercent} = \text{round}\left( \frac{\text{originalPrice} - \text{price}}{\text{originalPrice}} \times 100 \right)$$
3. User may manually override `discountPercent` or `remainingDays`.
4. Saves to `localStorage['maestro_admin_promos']`, triggers `PROMOTIONS_UPDATED_EVENT`, and executes Supabase `UPSERT into public.promotions`.

---

### 4.2 Custom Calculations & Formulas

#### 1. Promotion Savings & Discount Formula
$$\text{savingsAmount} = \max(0, \text{originalPrice} - \text{price})$$
$$\text{discountPercentage} = \begin{cases} 
\text{round}\left( \frac{\text{originalPrice} - \text{price}}{\text{originalPrice}} \times 100 \right) & \text{if } \text{originalPrice} > \text{price} > 0 \\
0 & \text{otherwise}
\end{cases}$$

#### 2. Promo Title Multi-Item Deconstruction
When displaying promo cards, title strings containing the `+` character are parsed into discrete product chips:
$$\text{bundleItems} = \text{deal.title}.\text{split}('+').\text{map}(s \Rightarrow s.\text{trim}()).\text{filter}(\text{Boolean})$$

#### 3. Category Dish Counting
$$\text{category.itemCount} = \sum_{d \in \text{dishes}} [d.\text{categoryId} = \text{category.id}]$$

#### 4. 24-Hour to 12-Hour Time Format Converter
Given a 24-hour time string `HH:mm`:
- Parse hours $H \in [0, 23]$ and minutes $M$.
- $\text{isPm} = (H \ge 12)$
- Display hour:
  $$H_{12} = \begin{cases} 12 & \text{if } H = 0 \\ H - 12 & \text{if } H > 12 \\ H & \text{otherwise} \end{cases}$$
- Suffix: `'م'` / `'PM'` if $\text{isPm}$ else `'ص'` / `'AM'`.

#### 5. Color Luminance & Contrast Formula (YIQ Standard)
Used in live preview components to automatically determine whether button text should be dark or light over a customized accent color:
$$\text{YIQ} = \frac{(R \times 299) + (G \times 587) + (B \times 114)}{1000}$$
$$\text{TextColor} = \begin{cases} 
\text{Dark } (\texttt{\#090d16}) & \text{if } \text{YIQ} \ge 145 \\
\text{Light } (\texttt{\#ffffff}) & \text{if } \text{YIQ} < 145
\end{cases}$$

---

### 4.3 Validation Rules & Edge Cases

| Trigger / Field | Validation Rule | Edge Case Handling |
| :--- | :--- | :--- |
| **Dish Arabic/English Name** | Must be non-empty string. | Form submission is blocked if empty or only whitespace. |
| **Dish Price** | Must be positive numeric value ($\ge 1000$ SYP). | Clamped to non-negative; `Math.round()` applied before database write. |
| **Dish Ingredients** | Comma-delimited text. | Empty items stripped via `.filter(Boolean)`. Defaults to standard text if empty. |
| **Category Slug** | Unique alphanumeric string. | If omitted, automatically generated as `cat-${Date.now()}`. |
| **Category Deletion** | Prevents dangling filter state. | If active filter was deleted category, resets `selectedCategoryId` to `'all'`. |
| **WhatsApp Number** | Syrian or international phone format. | Cleansed using `.replace(/[^0-9]/g, '')` before generating `wa.me/` URLs. |
| **Promo Expiration** | `remainingDays` countdown. | If `remainingDays <= 0`, flagged as expired ("ينتهي اليوم" / "Ends today"). |
| **Theme Logo Upload** | Image format (`PNG`, `JPEG`, `WEBP`). | File size checked; rejects if $> 2\text{MB}$ with user alert dialog. |
| **Theme HEX Input** | Valid 6-digit hex code with `#`. | Length capped at 7 characters. Native color picker falls back to default if invalid. |
| **Sidebar Resizing** | Width bounded between 240px and 420px. | Clamp formula: $\min(420, \max(240, \text{width}))$. Persisted in `localStorage`. Double-click resets to 320px. |

---

## 5. API / Backend Integration

### 5.1 Backend Operations & Data Access Layer

The data layer uses Supabase as primary persistent database with dual-write to `localStorage` and a custom browser event bus for cross-component synchronization.

#### Supabase Database Queries & Operations

```typescript
// 1. Categories
supabase.from('categories').select('*').order('sort_order', { ascending: true })
supabase.from('categories').upsert({ id, name_ar, name_en, slug, sort_order, is_active })
supabase.from('categories').delete().eq('id', id)

// 2. Menu Items
supabase.from('menu_items').select('*').order('sort_order', { ascending: true })
supabase.from('menu_items').upsert({ id, name_ar, name_en, title_ar, title_en, description_ar, description_en, price, image_url, category_id, is_available, badge, prep_time_minutes })
supabase.from('menu_items').update({ is_available }).eq('id', id)
supabase.from('menu_items').delete().eq('id', id)

// 3. Promotions
supabase.from('promotions').select('*').order('sort_order', { ascending: true })
supabase.from('promotions').upsert({ id, title_ar, title_en, description_ar, description_en, discount_percentage, badge, image_url, is_active, sort_order })
supabase.from('promotions').update({ is_active }).eq('id', id)
supabase.from('promotions').delete().eq('id', id)

// 4. Restaurant & Site Settings
supabase.from('restaurant_settings').select('*').eq('id', 1).maybeSingle()
supabase.from('restaurant_settings').upsert({ id: 1, is_kitchen_open, delivery_time_ar, delivery_time_en, announcement_banner_active, announcement_banner_text_ar, announcement_banner_text_en, phone, whatsapp, address_ar, address_en, updated_at })
supabase.from('site_settings').update({ is_restaurant_open, banner_enabled, banner_text_ar, banner_text_en, primary_phone, whatsapp_number, address_ar, address_en, delivery_estimate_ar, delivery_estimate_en }).eq('id', 'primary')
```

---

### 5.2 Supabase Realtime Subscriptions

Real-time changes published via PostgreSQL publication `supabase_realtime` are listened to by `useRealtimeSync`:

```typescript
// Channel: maestro_admin_realtime_sync
channel
  .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => callbacks.onMenuItemsChange())
  .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => callbacks.onCategoriesChange())
  .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, () => callbacks.onPromotionsChange())
  .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_settings' }, () => callbacks.onSettingsChange())
  .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => callbacks.onSettingsChange())
  .subscribe();
```

---

### 5.3 Storage Buckets & Policies

1. **Bucket `menu-images`**:
   - Stores meal photography assets.
   - Public read access for anonymous and authenticated clients.
   - Authenticated admin upload, update, and delete access (`public.is_admin()`).
2. **Bucket `restaurant-assets`**:
   - Stores logo files and promotional graphics.
   - Public read access; authenticated admin write access.

---

### 5.4 Event-Driven Cache Invalidation Keys

Cross-component synchronization is maintained via browser `CustomEvent` dispatchers:

| Event Name | Dispatched When | Consumers / Actions Triggered |
| :--- | :--- | :--- |
| `maestro:admin-menu-updated` | Category or dish is saved, edited, or deleted | Re-reads dishes and categories in `AdminMenuContext` and `useAdminMenu` |
| `maestro:menu-service-updated` | `menuService` completes Supabase sync | Refreshes menu state across open tabs and storefront components |
| `maestro:admin-promotions-updated` | Promo is added, modified, toggled, or deleted | `usePromotions` hook refetches and recalculates pagination |
| `maestro:promotions-service-updated` | `promotionsService` completes remote sync | Synchronizes storefront promotions section |
| `maestro:admin-settings-updated` | Contact details, hours, or kitchen status change | Updates `AdminSettingsContext` and KPI cards |
| `maestro:settings-service-updated` | `settingsService` updates remote rows | Broadcasts new settings object across application contexts |
| `maestro:admin-theme-updated` | Theme tokens saved or reset | `AdminThemeContext` re-renders and re-injects dynamic stylesheet |
| `maestro:settings-updated` | `SiteSettingsContext` updates | Synchronizes storefront customer-facing header, banner, and footer |

---

## 6. Action Checklist for New UI

Every interactive button, trigger, form submission, and switch in the admin platform:

### 1. Authentication & Session
- [ ] **Login Submit Button**: Authenticates credentials, displays loading spinner, persists session on success, displays error banner on rejection.
- [ ] **Demo Account Filler**: Auto-populates credentials (`admin@maestro.com` / `maestro`).
- [ ] **Password Visibility Toggle**: Switches between plain text and masked password input.
- [ ] **Back to Storefront Link**: Navigates from login screen back to `/`.
- [ ] **Logout Trigger Button**: Opens logout confirmation modal.
- [ ] **Logout Confirmation Dialog**:
  - [ ] **Cancel Button**: Dismisses modal.
  - [ ] **Confirm Logout Button**: Calls `logout()` and redirects to `/admin/login`.

### 2. Navigation & Layout Shell
- [ ] **Tab Switchers**: Navigates between `'dashboard'`, `'menu'`, `'promotions'`, `'settings'`, and `'theme'`.
- [ ] **Mobile Sidebar Drawer Toggle**: Opens and closes off-canvas drawer on mobile devices.
- [ ] **Language Switcher**: Toggles between Arabic (`'ar'`) and English (`'en'`).
- [ ] **Theme Mode Switcher**: Toggles between Dark Mode and Light Mode.
- [ ] **Storefront External Link**: Direct link to `/` (customer storefront).
- [ ] **Resizable Sidebar Handle**:
  - [ ] Drag handle left/right to resize sidebar ($240\text{px} \dots 420\text{px}$).
  - [ ] Double-click handle to reset width to $320\text{px}$.
  - [ ] Keyboard arrows (Left / Right) to increment/decrement width by $12\text{px}$.

### 3. Executive Dashboard / Telemetry
- [ ] **Total Dishes KPI Card Click**: Jumps directly to `'menu'` tab.
- [ ] **Categories KPI Card Click**: Jumps directly to `'menu'` tab.
- [ ] **Active Promos KPI Card Click**: Jumps directly to `'promotions'` tab.
- [ ] **Master Kitchen Switch**: Instant one-click toggle between OPEN and CLOSED.
- [ ] **Manage Branch Info Action**: Jumps to `'settings'` tab.
- [ ] **Open Menu & Dish Manager Action**: Jumps to `'menu'` tab.
- [ ] **Manage Royal Deals Action**: Jumps to `'promotions'` tab.
- [ ] **Manage Signature Dishes Action**: Jumps to `'menu'` tab.

### 4. Menu & Dish Management
- [ ] **Category Selector Tabs**: Filters dishes by clicked category; includes `'All'` tab.
- [ ] **Search Input Box**: Real-time filtering by dish name or description.
- [ ] **Search Clear Button (`X`)**: Clears search text query.
- [ ] **Status Filter Segment**: Toggles between `'All'`, `'Available'`, and `'Unavailable'`.
- [ ] **Tag Filter Badges**: Toggles filters for `'Signature'`, `'Spicy'`, and `'Bestseller'`.
- [ ] **Reset All Filters Button**: Clears search, resets category to `'all'`, and resets status/tags to `'all'`.
- [ ] **Add New Meal Button**: Opens `MealFormModal` in creation mode.
- [ ] **Meal Card Quick Edit Button**: Opens `MealFormModal` populated with target meal data.
- [ ] **Meal Card Delete Button**: Opens deletion confirmation modal for target dish.
- [ ] **Meal Card Availability Switch**: Instantly toggles `isAvailable` boolean for target dish.
- [ ] **Dish Form Modal (`MealFormModal`)**:
  - [ ] `nameAr` text input.
  - [ ] `nameEn` text input.
  - [ ] `categoryId` dropdown selection.
  - [ ] `imageKey` dropdown selection.
  - [ ] `price` numeric input.
  - [ ] `originalPrice` optional numeric input.
  - [ ] `descriptionAr` textarea.
  - [ ] `descriptionEn` textarea.
  - [ ] `isAvailable` checkbox.
  - [ ] `isSignature` checkbox.
  - [ ] `isSpicy` checkbox.
  - [ ] `isBestseller` checkbox.
  - [ ] **Add Option Button**: Appends new custom option (`newOptNameAr`, `newOptNameEn`, `newOptPriceDiff`).
  - [ ] **Delete Option Button**: Removes target option row from meal options list.
  - [ ] **Cancel Button / Backdrop Click / Escape Key**: Closes modal without saving.
  - [ ] **Save Changes Button**: Validates inputs, saves meal, closes modal.
- [ ] **Dish Deletion Modal**:
  - [ ] **Cancel Button**: Closes modal and clears `deleteConfirmId`.
  - [ ] **Confirm Delete Button**: Executes deletion and updates state.

### 5. Category Management
- [ ] **Add Category Button**: Opens `CategoryFormModal` in creation mode.
- [ ] **Category Tab Edit Icon**: Opens `CategoryFormModal` populated with target category data.
- [ ] **Category Tab Delete Icon**: Prompts confirmation and deletes category if confirmed.
- [ ] **Category Form Modal (`CategoryFormModal`)**:
  - [ ] `nameAr` text input.
  - [ ] `nameEn` text input.
  - [ ] `slug` text input (optional).
  - [ ] **Cancel Button / Escape Key**: Closes modal.
  - [ ] **Save Category Button**: Saves category, updates counts, closes modal.

### 6. Promotions & Royal Bundles
- [ ] **Add New Bundle Button**: Opens `PromoFormModal` in creation mode.
- [ ] **Promo Card Edit Button**: Opens `PromoFormModal` populated with target deal data.
- [ ] **Promo Card Delete Button**: Opens deletion confirmation modal for target bundle.
- [ ] **Promo Card Active Switch**: Toggles `isActive` status for target deal.
- [ ] **Pagination Controls**:
  - [ ] **Previous Page Button**: Moves to previous page (disabled on page 1).
  - [ ] **Page Number Buttons**: Jumps directly to clicked page number.
  - [ ] **Next Page Button**: Moves to next page (disabled on final page).
- [ ] **Promo Form Modal (`PromoFormModal`)**:
  - [ ] `titleAr` text input (supports `+` delimiter).
  - [ ] `titleEn` text input.
  - [ ] `badgeAr` & `badgeEn` text inputs.
  - [ ] `originalPrice` input (auto-calculates discount percentage).
  - [ ] `price` input (auto-calculates discount percentage).
  - [ ] `discountPercent` manual override input.
  - [ ] `remainingDays` numeric input.
  - [ ] `imageKey` dropdown selection.
  - [ ] `isActive` checkbox.
  - [ ] `descriptionAr` & `descriptionEn` textareas.
  - [ ] **Cancel Button / Escape Key**: Closes modal.
  - [ ] **Save Promotion Button**: Validates inputs, saves bundle, closes modal.
- [ ] **Promo Deletion Modal**:
  - [ ] **Cancel Button**: Dismisses modal.
  - [ ] **Confirm Delete Button**: Permanently deletes bundle.

### 7. Branch Settings & Operations
- [ ] **Sub-Tab Filters**: Filters between `'all'`, `'contact'`, `'schedule'`, and `'delivery'`.
- [ ] **Operational Status Master Switch**: Inverts open/closed status with feedback toast.
- [ ] **Contact Info Form**:
  - [ ] `restaurantNameAr` & `restaurantNameEn` text inputs.
  - [ ] `addressAr` & `addressEn` text inputs.
  - [ ] `googleMapsUrl` URL input.
  - [ ] `phonePrimary`, `phoneSecondary`, and `whatsappNumber` inputs.
  - [ ] `workingHoursAr` & `workingHoursEn` text inputs.
  - [ ] **Test Dial Phone Button**: Opens `tel:` link.
  - [ ] **Test WhatsApp Button**: Opens `wa.me/` link in new tab.
  - [ ] **Test Google Maps Button**: Opens Maps link in new tab.
  - [ ] **Copy Address Button**: Copies address to clipboard with temporary feedback badge.
  - [ ] **Save Branch Info Button**: Persists contact details.

### 8. Weekly Schedules & Business Hours
- [ ] **Master Opening Time Input**: 24-hour time picker (`HH:mm`).
- [ ] **Master Closing Time Input**: 24-hour time picker (`HH:mm`).
- [ ] **Apply Times to All Days Button**: Copies master times across all 7 days.
- [ ] **Toggle Friday Off Button**: Inverts Friday open/close boolean.
- [ ] **Reset Schedule Defaults Button**: Restores standard 12:00 to 02:00 daily hours.
- [ ] **Per-Day Row Controls (Saturday .. Friday)**:
  - [ ] Day open/close switch.
  - [ ] Day `openTime` input.
  - [ ] Day `closeTime` input.
  - [ ] Copy day times to all days icon button.
- [ ] **Save Working Hours Button**: Persists weekly operating hours.

### 9. Delivery & Announcement Alerts
- [ ] **Estimated Delivery Time Inputs**: Arabic and English text inputs.
- [ ] **Minimum Order Amount Input**: Numeric currency input.
- [ ] **Delivery Fee Input**: Numeric currency input.
- [ ] **Top Announcement Banner Switch**: Toggles banner visibility for customers.
- [ ] **Announcement Text Inputs**: Arabic and English announcement banner text.
- [ ] **Save Delivery & Alerts Button**: Persists delivery settings and announcement banner.

### 10. Theme & Visual Customizer
- [ ] **Preset Buttons (5 Regional Presets)**: Applies full token dictionary on click.
- [ ] **Primary Accent Pickers**: Native color picker swatch + HEX text input.
- [ ] **Secondary Accent Pickers**: Native color picker swatch + HEX text input.
- [ ] **Dark Background & Surface Pickers**: Native color picker swatches + HEX text inputs.
- [ ] **Light Background & Surface Pickers**: Native color picker swatches + HEX text inputs.
- [ ] **Semantic Status Color Pickers**: Success and danger color pickers + HEX text inputs.
- [ ] **Curated Accent Quick-Swatches**: Fast 1-click palette selectors.
- [ ] **Font Family Buttons (Cairo, Readex Pro, Tajawal, IBM Plex)**: Updates active font.
- [ ] **Logo File Upload Dropzone**: Triggers file input, validates size $\le 2\text{MB}$, converts to Base64.
- [ ] **Reset Logo Button**: Clears uploaded custom logo and restores default transparent PNG.
- [ ] **Live Preview Simulator Mode Switch**: Toggles simulator between Dark and Light mode.
- [ ] **Reset Theme Defaults Button**: Opens confirmation dialog before restoring default tokens.
- [ ] **Save & Publish Theme Button**: Injects CSS variables, saves tokens, emits update event.
