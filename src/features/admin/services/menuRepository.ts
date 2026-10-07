import type { AdminMealItem, CategoryItem, MealFormData, CategoryFormData } from '../types/menu.types';
import { MEALS_DATA } from '../../menu/mealsData';

export const MENU_UPDATED_EVENT = 'maestro:admin-menu-updated';

const STORAGE_CATEGORIES_KEY = 'maestro_admin_categories';
const STORAGE_DISHES_KEY = 'maestro_admin_dishes';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-grills', nameAr: 'المشاوي الملكية والكباب', nameEn: 'Royal Grills & Kebabs', slug: 'grills', icon: 'Flame', isActive: true, sortOrder: 1 },
  { id: 'cat-shawarma', nameAr: 'شاورما مايسترو الأصيلة', nameEn: 'Maestro Shawarma', slug: 'shawarma', icon: 'Flame', isActive: true, sortOrder: 2 },
  { id: 'cat-broasted', nameAr: 'بروستد كرسبي ذهبي', nameEn: 'Crispy Broasted', slug: 'broasted', icon: 'Utensils', isActive: true, sortOrder: 3 },
  { id: 'cat-burgers', nameAr: 'البرغر والوجبات الغربية', nameEn: 'Burgers & Western Subs', slug: 'burgers', icon: 'Sandwich', isActive: true, sortOrder: 4 },
  { id: 'cat-appetizers', nameAr: 'المقبلات والمازة الشامية', nameEn: 'Levantine Mezza & Sides', slug: 'appetizers', icon: 'Sparkles', isActive: true, sortOrder: 5 },
  { id: 'cat-towers', nameAr: 'أبراج وتورتات المناسبات', nameEn: 'Celebration Towers', slug: 'towers', icon: 'Crown', isActive: true, sortOrder: 6 },
  { id: 'cat-drinks', nameAr: 'المشروبات والكوكتيلات الملكية', nameEn: 'Royal Drinks & Cocktails', slug: 'drinks', icon: 'Coffee', isActive: true, sortOrder: 7 },
];

// Rich base catalog with 18 realistic items spanning all categories
const BASE_DISHES_DATA: AdminMealItem[] = [
  // 1. Grills
  {
    id: 'grill-mixed-1kg',
    imageKey: 'shawarma-platters',
    categoryId: 'cat-grills',
    nameAr: 'مشكل مشاوي مايسترو كيلو ملكي',
    nameEn: 'Imperial Mixed Grill 1KG Platter',
    descriptionAr: 'تشكيلة فاخرة مشوية على الفحم: كباب غنم بلدي، شقف هبرة، شيش طاووق، وريش متبلة، تقدم مع البواز الشامي، الخبز المحمر وصوصات المايسترو.',
    descriptionEn: 'Charcoal-grilled premium medley: Lamb kebab, tender steak cubes, shish tawook, and spiced chops served with Levantine biwaz and seasoned flatbread.',
    price: 260000,
    originalPrice: 295000,
    isAvailable: true,
    isSignature: true,
    isBestseller: true,
    isSpicy: false,
    isNew: false,
    prepTimeMinutes: 30,
    rating: 4.98,
    reviewsCount: 240,
    ingredientsAr: ['لحم غنم بلدي نعيمي', 'شيش طاووق دجاج طازج', 'خبز تركي محمر', 'طماطم وبصل مشوي', 'سرفيس مخللات'],
    ingredientsEn: ['Fresh Local Lamb', 'Farm Fresh Shish Tawook', 'Spiced Toasted Bread', 'Charred Veggies', 'Pickles Selection'],
    options: [
      { id: 'standard', nameAr: 'مع الخبز المحمر والسرفيس', nameEn: 'With Spiced Bread & Sides', priceDiff: 0 },
      { id: 'with-rice', nameAr: 'مع أرز بسمتي بالزعفران والمكسرات', nameEn: 'With Saffron Basmati Rice & Nuts', priceDiff: 25000 },
    ],
  },
  {
    id: 'kebab-halabi',
    imageKey: 'shawarma-spit',
    categoryId: 'cat-grills',
    nameAr: 'كباب حلبي بالباذنجان والفستق',
    nameEn: 'Aleppo Pistachio & Eggplant Kebab',
    descriptionAr: 'أسياخ كباب حلبي غنم متبل بخلطة التوابل السبع، متداخل مع حلقات الباذنجان المشوي ومزين برشة فستق حلبي محمص.',
    descriptionEn: 'Juicy minced lamb skewers blended with 7 Aleppo spices, layered with charred baby eggplants and topped with toasted roasted pistachios.',
    price: 95000,
    isAvailable: true,
    isSignature: true,
    isBestseller: false,
    isSpicy: false,
    isNew: true,
    prepTimeMinutes: 22,
    rating: 4.9,
    reviewsCount: 88,
    ingredientsAr: ['لحم غنم مفروم ناعم', 'باذنجان مشوي', 'فستق حلبي سوري', 'تتبيلة حلبية أصيلة'],
    ingredientsEn: ['Minced Lamb', 'Charred Eggplant', 'Syrian Pistachios', 'Authentic Aleppo Spice Blend'],
    options: [
      { id: 'half-kg', nameAr: 'وجبة 4 أسياخ (نصف كيلو)', nameEn: '4 Skewers (Half KG)', priceDiff: 0 },
      { id: 'full-kg', nameAr: 'وجبة 8 أسياخ (كيلو كامل)', nameEn: '8 Skewers (Full KG)', priceDiff: 85000 },
    ],
  },
  // 2. Shawarma
  {
    id: 'shawarma-arabic-super',
    imageKey: 'supreme-meal',
    categoryId: 'cat-shawarma',
    nameAr: 'وجبة شاورما عربي سوبر دبل',
    nameEn: 'Super Double Arabic Shawarma Meal',
    descriptionAr: 'سندويشتان شاورما دجاج بخبز الصاج مقطعة بمهارة، مع صحن بطاطا مقرمشة، مخلل، وصوص ثومية مايسترو الكريمية الغنية.',
    descriptionEn: 'Two toasted chicken saj rolls sliced into bite-size pieces, served with golden fries, pickled pickles, and signature velvet toum dip.',
    price: 45000,
    originalPrice: 50000,
    isAvailable: true,
    isSignature: false,
    isBestseller: true,
    isSpicy: false,
    isNew: false,
    prepTimeMinutes: 12,
    rating: 4.92,
    reviewsCount: 310,
    ingredientsAr: ['دجاج شاورما متبل', 'خبز صاج سوري', 'ثومية أصلية', 'بطاطا ذهبية', 'مخلل خيار ولفت'],
    ingredientsEn: ['Spiced Chicken Shawarma', 'Saj Bread', 'Garlic Toum', 'Crispy Fries', 'Pickles'],
    options: [
      { id: 'classic', nameAr: 'ثومية عادية ومخلل', nameEn: 'Classic Toum & Pickles', priceDiff: 0 },
      { id: 'spicy', nameAr: 'ثومية حارة إكسترا ودبس رمان', nameEn: 'Spicy Toum & Pomegranate Glaze', priceDiff: 4000 },
      { id: 'cheese', nameAr: 'إضافة جبنة موتزاريلا ذائبة', nameEn: 'Melted Mozzarella Cheese', priceDiff: 8000 },
    ],
  },
  {
    id: 'shawarma-rocket-sub',
    imageKey: 'crispy-baguettes',
    categoryId: 'cat-shawarma',
    nameAr: 'ساندويش شاورما صاروخ إكسترا',
    nameEn: 'Rocket Shawarma Sub Extra (Large)',
    descriptionAr: 'ساندويش شاورما عملاق بحجم 35 سم بخبز الصاج المقرمش، مشبع بقطع الدجاج المتبل، الثومية والمخلل.',
    descriptionEn: 'Giant 35cm toasted saj wrap packed with generous layers of juicy chicken shawarma, garlic toum, and tart pickles.',
    price: 28000,
    isAvailable: true,
    isSignature: false,
    isBestseller: true,
    isSpicy: false,
    isNew: false,
    prepTimeMinutes: 8,
    rating: 4.88,
    reviewsCount: 420,
    ingredientsAr: ['دجاج شاورما', 'خبز صاج كبير', 'ثومية', 'مخلل خيار'],
    ingredientsEn: ['Chicken Shawarma', 'Large Saj Flatbread', 'Toum Dip', 'Cucumber Pickles'],
    options: [
      { id: 'normal', nameAr: 'عادي', nameEn: 'Regular', priceDiff: 0 },
      { id: 'double-meat', nameAr: 'لحم دجاج مضاعف (دبل)', nameEn: 'Double Meat', priceDiff: 12000 },
    ],
  },
  // 3. Broasted & Crispy
  {
    id: 'broasted-family-box',
    imageKey: 'broasted-pieces',
    categoryId: 'cat-broasted',
    nameAr: 'وجبة بروستد مايسترو العائلية (8 قطع)',
    nameEn: 'Maestro Family Broasted Feast (8 Pcs)',
    descriptionAr: 'ثماني قطع دجاج طازجة مقرمشة بالتتبيلة السرية الذهبية، تقدم مع بطاطا عائلية، 2 ثومية، 2 كول سلو، و4 خبز مقمر.',
    descriptionEn: '8 pieces of golden crispy broasted chicken with secret herb marinade, family fries, 2 garlic dips, 2 coleslaw, and 4 warm breads.',
    price: 135000,
    originalPrice: 155000,
    isAvailable: true,
    isSignature: true,
    isBestseller: true,
    isSpicy: false,
    isNew: false,
    prepTimeMinutes: 20,
    rating: 4.94,
    reviewsCount: 195,
    ingredientsAr: ['دجاج طازج 8 قطع', 'تتبيلة بروستد سرية', 'سلطة كول سلو', 'ثومية مايسترو', 'بطاطا ودجز'],
    ingredientsEn: ['8 Pcs Fresh Chicken', 'Secret Broasted Seasoning', 'Coleslaw', 'Garlic Toum', 'Golden Wedges'],
    options: [
      { id: 'mild', nameAr: 'عادي مقرمش ذهبي', nameEn: 'Crispy Mild Gold', priceDiff: 0 },
      { id: 'spicy', nameAr: 'حار سبايسي حريف', nameEn: 'Extra Hot & Spicy', priceDiff: 0 },
      { id: 'mixed', nameAr: 'نصف عادي ونصف حار', nameEn: 'Half Mild / Half Spicy', priceDiff: 0 },
    ],
  },
  // 4. Burgers & Western
  {
    id: 'black-angus-burger',
    imageKey: 'fajita-sub',
    categoryId: 'cat-burgers',
    nameAr: 'برغر مايسترو بلاك أنغوس الفاخر',
    nameEn: 'Maestro Black Angus Luxury Burger',
    descriptionAr: 'قطعة لحم أنغوس صافي 200غ مشوية، جبن شيدر إنجليزي معتق، بصل مكرمل، مخلل، وصوص المايسترو المدخن في خبز بريوش طري.',
    descriptionEn: '200g prime Angus beef patty, melted aged English cheddar, caramelized onions, crisp pickles, and smoked secret sauce in a golden brioche bun.',
    price: 58000,
    isAvailable: true,
    isSignature: true,
    isBestseller: true,
    isSpicy: false,
    isNew: true,
    prepTimeMinutes: 18,
    rating: 4.96,
    reviewsCount: 165,
    ingredientsAr: ['لحم بقري بلاك أنغوس', 'خبز بريوش بالزبدة', 'جبنة شيدر حمراء', 'بصل مكرمل', 'صوص مدخن'],
    ingredientsEn: ['Black Angus Beef', 'Brioche Bun', 'Red Cheddar Cheese', 'Caramelized Onion', 'Smoked Sauce'],
    options: [
      { id: 'single', nameAr: 'سنجل 200 غرام', nameEn: 'Single 200g Patty', priceDiff: 0 },
      { id: 'double', nameAr: 'دبل باتي 400 غرام', nameEn: 'Double 400g Patty', priceDiff: 28000 },
    ],
  },
  {
    id: 'zinger-crispy-burger',
    imageKey: 'crispy-meal',
    categoryId: 'cat-burgers',
    nameAr: 'برغر زينجر دجاج كرسبي مدخن',
    nameEn: 'Smoked Crispy Chicken Zinger Burger',
    descriptionAr: 'صدر دجاج كرسبي مقرمش حار ومقلي بإتقان، مغطى بالخس الطازج، صوص الشيدر الذائب، وصوص مايونيز بالثوم.',
    descriptionEn: 'Crispy fried spicy chicken breast fillet loaded with iceberg lettuce, melted cheddar cheese drizzle, and garlic mayo in a brioche bun.',
    price: 48000,
    isAvailable: true,
    isSignature: false,
    isBestseller: true,
    isSpicy: true,
    isNew: false,
    prepTimeMinutes: 15,
    rating: 4.89,
    reviewsCount: 220,
    ingredientsAr: ['صدر دجاج مقرمش', 'جبنة شيدر ذائبة', 'خس آيسبيرغ', 'صوص مايونيز وثوم'],
    ingredientsEn: ['Crispy Chicken Breast', 'Melted Cheddar', 'Iceberg Lettuce', 'Garlic Mayo Sauce'],
    options: [
      { id: 'regular', nameAr: 'عادي مع بطاطا', nameEn: 'With Fries', priceDiff: 0 },
      { id: 'combo', nameAr: 'كومبو مع بطاطا ومشروب غازي', nameEn: 'Combo with Fries & Soft Drink', priceDiff: 10000 },
    ],
  },
  // 5. Appetizers
  {
    id: 'mezza-trio-platter',
    imageKey: 'broasted-chips',
    categoryId: 'cat-appetizers',
    nameAr: 'تشكيلة المازة الشامية والفتوش الملكي',
    nameEn: 'Royal Levantine Mezza Trio & Fattoush',
    descriptionAr: 'صحن مقبلات راقي يجمع: حمص شامي بالطحينة وزيت الزيتون، متبل باذنجان مدخن، وسلطة فتوش بالرمان والخبز المحمص.',
    descriptionEn: 'A pristine appetizer platter featuring creamy Damascus hummus, smoked eggplant mutabbal, and fresh pomegranate fattoush salad.',
    price: 35000,
    isAvailable: true,
    isSignature: false,
    isBestseller: false,
    isSpicy: false,
    isNew: false,
    isVegetarian: true,
    prepTimeMinutes: 10,
    rating: 4.85,
    reviewsCount: 110,
    ingredientsAr: ['حمص بالطحينة', 'متبل باذنجان', 'فتوش بدبس الرمان', 'زيت زيتون بكر'],
    ingredientsEn: ['Hummus Tahini', 'Smoked Mutabbal', 'Pomegranate Fattoush', 'Extra Virgin Olive Oil'],
    options: [
      { id: 'regular', nameAr: 'الحجم العادي', nameEn: 'Regular Portion', priceDiff: 0 },
      { id: 'large', nameAr: 'حجم عائلي مضاعف', nameEn: 'Family Large Portion', priceDiff: 20000 },
    ],
  },
  {
    id: 'spiced-potato-wedges',
    imageKey: 'broasted-chips',
    categoryId: 'cat-appetizers',
    nameAr: 'بطاطا ودجز بتوابل المايسترو الخاصة',
    nameEn: 'Maestro Spiced Crispy Potato Wedges',
    descriptionAr: 'قوارب بطاطا طبيعية ذهبية مقرمشة من الخارج وهشة من الداخل، متبلة ببهارات الأعشاب الشامية والبابريكا المدخنة.',
    descriptionEn: 'Chunky golden potato wedges tossed with smoked paprika, wild mountain herbs, and served with signature garlic mayo.',
    price: 22000,
    isAvailable: true,
    isSignature: false,
    isBestseller: true,
    isSpicy: false,
    isNew: false,
    isVegetarian: true,
    isGlutenFree: true,
    prepTimeMinutes: 10,
    rating: 4.9,
    reviewsCount: 340,
    ingredientsAr: ['بطاطا طازجة', 'بابريكا مدخنة', 'توابل أعشاب مايسترو', 'صوص ثومية'],
    ingredientsEn: ['Fresh Potatoes', 'Smoked Paprika', 'Maestro Herb Blend', 'Toum Garlic Sauce'],
    options: [
      { id: 'solo', nameAr: 'حجم فردي', nameEn: 'Solo Portion', priceDiff: 0 },
      { id: 'cheddar-melt', nameAr: 'مع صوص جبنة الشيدر الذائبة', nameEn: 'With Melted Cheddar Sauce', priceDiff: 8000 },
    ],
  },
  // 6. Drinks & Desserts
  {
    id: 'royal-fruit-cocktail',
    imageKey: 'crispy-baguettes',
    categoryId: 'cat-drinks',
    nameAr: 'كوكتيل مايسترو الملكي بالقشطة والمكسرات',
    nameEn: 'Maestro Royal Fruit Cocktail with Ashta',
    descriptionAr: 'طبقات من عصير المانجو والأفوكادو والفراولة الطبيعية، تعلوها قطع فواكه طازجة، قشطة عربية بلدية، عسل جبلي، وفستق حلبي.',
    descriptionEn: 'Layered fresh mango, strawberry, and avocado smoothie crowned with fresh fruit chunks, clotted Ashta cream, pure honey, and crushed pistachios.',
    price: 30000,
    isAvailable: true,
    isSignature: true,
    isBestseller: true,
    isSpicy: false,
    isNew: false,
    prepTimeMinutes: 8,
    rating: 4.97,
    reviewsCount: 280,
    ingredientsAr: ['مانجو وأفوكادو وفراولة', 'قشطة بلدية طازجة', 'عسل طبيعي', 'فستق حلبي وكاجو'],
    ingredientsEn: ['Mango, Avocado & Strawberry', 'Fresh Clotted Cream', 'Pure Mountain Honey', 'Pistachios & Cashews'],
    options: [
      { id: 'medium', nameAr: 'حجم وسط 400 مل', nameEn: 'Medium 400ml', priceDiff: 0 },
      { id: 'large', nameAr: 'حجم كبير سوبر 650 مل', nameEn: 'Large 650ml', priceDiff: 12000 },
    ],
  },
  {
    id: 'wild-berry-mojito',
    imageKey: 'crispy-meal',
    categoryId: 'cat-drinks',
    nameAr: 'موهيتو التوت البري والنعناع المثلج',
    nameEn: 'Refreshing Iced Wild Berry Mojito',
    descriptionAr: 'مزيج منعش من التوت البري، أوراق النعناع الطازجة، شرائح الليمون الأخضر والثلج المجروش مع الصودا الفوارة.',
    descriptionEn: 'A vibrant fizzy blend of muddled wild berries, fresh garden mint, tangy lime wedges, and sparkling soda over crushed ice.',
    price: 24000,
    isAvailable: true,
    isSignature: false,
    isBestseller: false,
    isSpicy: false,
    isNew: true,
    prepTimeMinutes: 5,
    rating: 4.86,
    reviewsCount: 95,
    ingredientsAr: ['توت بري أزرق', 'نعناع طازج', 'ليمون أخضر لايم', 'صودا فوارة', 'ثلج مجروش'],
    ingredientsEn: ['Wild Blueberries', 'Fresh Mint', 'Lime Wedges', 'Sparkling Soda', 'Crushed Ice'],
    options: [
      { id: 'standard', nameAr: 'حجم عادي 500 مل', nameEn: 'Standard 500ml', priceDiff: 0 },
    ],
  },
];

// Helper to seed dishes from MEALS_DATA + BASE_DISHES_DATA
const SEED_MEALS_DATA: AdminMealItem[] = [
  ...BASE_DISHES_DATA,
  ...MEALS_DATA.map((meal) => {
    let categoryId = 'cat-shawarma';
    if (meal.category === 'towers') categoryId = 'cat-towers';
    else if (meal.category === 'broasted') categoryId = 'cat-broasted';
    else if (meal.category === 'sandwiches') categoryId = 'cat-burgers';
    else if (meal.category === 'drinks') categoryId = 'cat-drinks';

    return {
      id: meal.id,
      imageKey: meal.imageKey,
      categoryId,
      nameAr: meal.nameAr,
      nameEn: meal.nameEn,
      descriptionAr: meal.descriptionAr,
      descriptionEn: meal.descriptionEn,
      price: meal.price,
      originalPrice: meal.originalPrice,
      isAvailable: true,
      isSignature: Boolean(meal.isSignature),
      isBestseller: Boolean(meal.isBestseller),
      isSpicy: Boolean(meal.isSpicy),
      isNew: Boolean(meal.isNew),
      prepTimeMinutes: 15,
      rating: meal.rating || 4.9,
      reviewsCount: meal.reviewsCount || 120,
      ingredientsAr: meal.ingredientsAr || ['دجاج بلدي طازج', 'بهارات شامية عريقة'],
      ingredientsEn: meal.ingredientsEn || ['Fresh Farm Chicken', 'Levantine Spices'],
      options: meal.options || [],
    };
  }),
];

// Deduplicate meals by id
const uniqueMealsMap = new Map<string, AdminMealItem>();
for (const item of SEED_MEALS_DATA) {
  uniqueMealsMap.set(item.id, item);
}
export const INITIAL_DISHES: AdminMealItem[] = Array.from(uniqueMealsMap.values());

export interface IMenuRepository {
  getCategories(): CategoryItem[];
  saveCategory(formData: CategoryFormData): CategoryItem;
  deleteCategory(id: string): boolean;
  reorderCategories(orderedIds: string[]): CategoryItem[];
  getDishes(): AdminMealItem[];
  saveDish(formData: MealFormData): AdminMealItem;
  deleteDish(id: string): boolean;
  toggleDishAvailability(id: string, isAvailable?: boolean): AdminMealItem | null;
}

class LocalStorageMenuRepository implements IMenuRepository {
  public getCategories(): CategoryItem[] {
    if (typeof window === 'undefined') return INITIAL_CATEGORIES;
    try {
      const stored = localStorage.getItem(STORAGE_CATEGORIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[menuRepository] Failed to read categories from localStorage:', e);
    }
    this.saveCategoriesToStorage(INITIAL_CATEGORIES);
    return INITIAL_CATEGORIES;
  }

  private saveCategoriesToStorage(categories: CategoryItem[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
        window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
      } catch (e) {
        console.warn('[menuRepository] Failed to write categories to localStorage:', e);
      }
    }
  }

  public saveCategory(formData: CategoryFormData): CategoryItem {
    const list = this.getCategories();
    let result: CategoryItem;

    if (formData.id) {
      // Edit
      const index = list.findIndex((c) => c.id === formData.id);
      if (index >= 0) {
        result = {
          ...list[index],
          ...formData,
        };
        list[index] = result;
      } else {
        result = {
          id: formData.id,
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          slug: formData.slug || `cat-${Date.now()}`,
          icon: formData.icon || 'Utensils',
          isActive: formData.isActive,
          sortOrder: formData.sortOrder || list.length + 1,
        };
        list.push(result);
      }
    } else {
      // New
      result = {
        id: `cat-${Date.now()}`,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        slug: formData.slug || `cat-${Date.now()}`,
        icon: formData.icon || 'Utensils',
        isActive: formData.isActive,
        sortOrder: formData.sortOrder || list.length + 1,
      };
      list.push(result);
    }

    this.saveCategoriesToStorage(list);
    return result;
  }

  public deleteCategory(id: string): boolean {
    const list = this.getCategories();
    const updated = list.filter((c) => c.id !== id);
    if (updated.length !== list.length) {
      this.saveCategoriesToStorage(updated);
      return true;
    }
    return false;
  }

  public reorderCategories(orderedIds: string[]): CategoryItem[] {
    const list = this.getCategories();
    const reordered: CategoryItem[] = [];

    orderedIds.forEach((id, idx) => {
      const item = list.find((c) => c.id === id);
      if (item) {
        reordered.push({ ...item, sortOrder: idx + 1 });
      }
    });

    // Append any missing items
    list.forEach((item) => {
      if (!orderedIds.includes(item.id)) {
        reordered.push({ ...item, sortOrder: reordered.length + 1 });
      }
    });

    this.saveCategoriesToStorage(reordered);
    return reordered;
  }

  public getDishes(): AdminMealItem[] {
    if (typeof window === 'undefined') return INITIAL_DISHES;
    try {
      const stored = localStorage.getItem(STORAGE_DISHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          const hasSignatureOrBestseller = parsed.some((d: AdminMealItem) => d.isSignature || d.isBestseller);
          const sanitized = parsed.map((item: AdminMealItem, idx: number) => ({
            ...item,
            isAvailable: item.isAvailable ?? true,
            isSignature: hasSignatureOrBestseller ? Boolean(item.isSignature) : (idx % 3 === 0),
            isBestseller: hasSignatureOrBestseller ? Boolean(item.isBestseller) : (idx % 2 === 0),
          }));
          return sanitized;
        }
      }
    } catch (e) {
      console.warn('[menuRepository] Failed to read dishes from localStorage:', e);
    }
    this.saveDishesToStorage(INITIAL_DISHES);
    return INITIAL_DISHES;
  }

  private saveDishesToStorage(dishes: AdminMealItem[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_DISHES_KEY, JSON.stringify(dishes));
        window.dispatchEvent(new CustomEvent(MENU_UPDATED_EVENT));
      } catch (e) {
        console.warn('[menuRepository] Failed to write dishes to localStorage:', e);
      }
    }
  }

  public saveDish(formData: MealFormData): AdminMealItem {
    const list = this.getDishes();
    let result: AdminMealItem;

    const ingredientsAr = formData.ingredientsArText
      ? formData.ingredientsArText.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const ingredientsEn = formData.ingredientsEnText
      ? formData.ingredientsEnText.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (formData.id) {
      // Edit
      const index = list.findIndex((d) => d.id === formData.id);
      if (index >= 0) {
        result = {
          ...list[index],
          ...formData,
          ingredientsAr,
          ingredientsEn,
          options: formData.options || [],
        };
        list[index] = result;
      } else {
        result = {
          id: formData.id,
          imageKey: formData.imageKey || 'shawarma-tower',
          categoryId: formData.categoryId,
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          descriptionAr: formData.descriptionAr,
          descriptionEn: formData.descriptionEn,
          price: Number(formData.price) || 0,
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
          isAvailable: formData.isAvailable,
          isSignature: formData.isSignature,
          isBestseller: formData.isBestseller,
          isSpicy: formData.isSpicy,
          isNew: formData.isNew,
          isVegetarian: formData.isVegetarian,
          isGlutenFree: formData.isGlutenFree,
          prepTimeMinutes: formData.prepTimeMinutes,
          rating: 4.9,
          reviewsCount: 1,
          ingredientsAr,
          ingredientsEn,
          options: formData.options || [],
        };
        list.push(result);
      }
    } else {
      // New
      result = {
        id: `dish-${Date.now()}`,
        imageKey: formData.imageKey || 'shawarma-tower',
        categoryId: formData.categoryId,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        descriptionAr: formData.descriptionAr,
        descriptionEn: formData.descriptionEn,
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        isAvailable: formData.isAvailable,
        isSignature: formData.isSignature,
        isBestseller: formData.isBestseller,
        isSpicy: formData.isSpicy,
        isNew: formData.isNew,
        isVegetarian: formData.isVegetarian,
        isGlutenFree: formData.isGlutenFree,
        prepTimeMinutes: formData.prepTimeMinutes,
        rating: 5.0,
        reviewsCount: 0,
        ingredientsAr,
        ingredientsEn,
        options: formData.options || [],
      };
      list.push(result);
    }

    this.saveDishesToStorage(list);
    return result;
  }

  public deleteDish(id: string): boolean {
    const list = this.getDishes();
    const updated = list.filter((d) => d.id !== id);
    if (updated.length !== list.length) {
      this.saveDishesToStorage(updated);
      return true;
    }
    return false;
  }

  public toggleDishAvailability(id: string, isAvailable?: boolean): AdminMealItem | null {
    const list = this.getDishes();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const current = list[index];
    const newStatus = isAvailable !== undefined ? isAvailable : !current.isAvailable;
    const updated = { ...current, isAvailable: newStatus };
    list[index] = updated;

    this.saveDishesToStorage(list);
    return updated;
  }
}

export const menuRepository: IMenuRepository = new LocalStorageMenuRepository();
