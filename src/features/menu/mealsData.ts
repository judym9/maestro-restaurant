export type MealCategory = 'shawarma' | 'broasted' | 'sandwiches' | 'towers' | 'drinks';

export interface MealOption {
  id: string;
  nameAr: string;
  nameEn: string;
  priceDiff: number;
}

export interface MealItem {
  id: string;
  imageKey: string;
  category: MealCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice?: number;
  isSignature?: boolean;
  isBestseller?: boolean;
  isSpicy?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  ingredientsAr: string[];
  ingredientsEn: string[];
  options: MealOption[];
}

export const MEALS_DATA: MealItem[] = [
  {
    id: 'shawarma-tower',
    imageKey: 'shawarma-tower',
    category: 'towers',
    nameAr: 'برج شاورما مايسترو الملكي',
    nameEn: 'Maestro Royal Shawarma Tower',
    descriptionAr: 'تحفة فنية فاخرة من لفائف الشاورما المقطعة على عدة طبقات، مزينة بالخضار الطازجة، مخلل اللفت الوردي، الجزر، والليمون مع صوصات المايسترو الخاصة.',
    descriptionEn: 'A magnificent multi-tiered celebration tower of sliced toasted shawarma rolls, garnished with crisp arugula, pink pickled turnip roses, carrots, and signature toum dips.',
    price: 240000,
    originalPrice: 280000,
    isSignature: true,
    isBestseller: true,
    rating: 4.95,
    reviewsCount: 184,
    ingredientsAr: ['شاورما دجاج متبلة', 'خبز صاج مقمر', 'تومية أصلية', 'مخلل خيار ولفت', 'خضار موسمية طازجة'],
    ingredientsEn: ['Marinated Chicken Shawarma', 'Toasted Saj Bread', 'Authentic Toum Garlic Dip', 'Pickled Turnip & Cucumber', 'Seasonal Greens'],
    options: [
      { id: 'standard', nameAr: 'برج 3 طبقات (تكفي 4-6 أشخاص)', nameEn: '3-Tier Tower (4-6 Persons)', priceDiff: 0 },
      { id: 'large', nameAr: 'برج ملكي 5 طبقات (تكفي 8-10 أشخاص)', nameEn: '5-Tier Royal Tower (8-10 Persons)', priceDiff: 110000 },
    ],
  },
  {
    id: 'shawarma-cake',
    imageKey: 'shawarma-cake',
    category: 'towers',
    nameAr: 'تورتة الشاورما لأعياد الميلاد',
    nameEn: 'Celebration Birthday Shawarma Cake',
    descriptionAr: 'كيكة شاورما مبتكرة مصممة خصيصاً للمناسبات وأعياد الميلاد مع شريطة حمراء وبطاقة تهنئة أنيقة، محشوة بألذ قطع الشاورما وتشكيلة المخللات.',
    descriptionEn: 'An inventive celebration shawarma cake designed for birthdays and milestones, adorned with a satin ribbon, floral greeting card, pickles, and carved veggie roses.',
    price: 195000,
    originalPrice: 230000,
    isSignature: true,
    rating: 4.9,
    reviewsCount: 96,
    ingredientsAr: ['لفائف شاورما عربية', 'تومية مايسترو', 'شريطة وزينة احتفالية', 'مخللات مشكلة', 'بطاقة تهنئة مخصصة'],
    ingredientsEn: ['Arabic Shawarma Bites', 'Maestro Toum Dip', 'Celebration Ribbon Decor', 'Mixed Pickles', 'Custom Greeting Card'],
    options: [
      { id: 'classic', nameAr: 'تورتة دورين مع بطاقة تهنئة', nameEn: 'Double-tier with Greeting Card', priceDiff: 0 },
      { id: 'vip', nameAr: 'تورتة VIP مع إضافات جبنة وبطاطا', nameEn: 'VIP Cake with Extra Cheese & Fries', priceDiff: 45000 },
    ],
  },
  {
    id: 'shawarma-platters',
    imageKey: 'shawarma-platters',
    category: 'shawarma',
    nameAr: 'صينية وجبات شاورما عربي مشكل',
    nameEn: 'Assorted Shawarma Arabi Platters',
    descriptionAr: 'صواني شاورما عربي مقطعة ومحمصة ببراعة، تقدم مع أصابع البطاطا المتبلة، صحن التومية، مخللات شامية وسلطة خضراء منعشة.',
    descriptionEn: 'Toasted Saj shawarma rolls sliced into bite-sized portions, served on generous platters with spiced golden fries, creamy toum garlic dip, Syrian pickles, and fresh salad.',
    price: 75000,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 340,
    ingredientsAr: ['شاورما دجاج ممتازة', 'خبز صاج مقرمش', 'تومية فاخرة', 'بطاطا مقلية', 'مخلل خيار سوري'],
    ingredientsEn: ['Premium Chicken Shawarma', 'Crispy Saj Flatbread', 'Signature Garlic Toum', 'Golden Fries', 'Damascene Pickles'],
    options: [
      { id: 'single-platter', nameAr: 'وجبة عربي عادي (ساندوتش ونص)', nameEn: 'Regular Arabi (1.5 Sandwiches)', priceDiff: 0 },
      { id: 'double-platter', nameAr: 'وجبة عربي دبل (2 ساندوتش)', nameEn: 'Double Arabi (2 Sandwiches)', priceDiff: 25000 },
      { id: 'family-tray', nameAr: 'سدر عائلي كبير (4 ساندوتشات)', nameEn: 'Family Arabi Tray (4 Sandwiches)', priceDiff: 95000 },
    ],
  },
  {
    id: 'princess-meal',
    imageKey: 'princess-meal',
    category: 'sandwiches',
    nameAr: 'وجبة برنسس الدجاج المقرمش',
    nameEn: 'Maestro Princess Crispy Meal',
    descriptionAr: 'الوجبة الحصرية الأكثر شهرة! قطع دجاج مقرمشة بتتبيلة خاصة مغطاة بصوص الكريمة والجبنة الذائب، مع بطاطا ذهبية وسلطة كول سلو.',
    descriptionEn: 'The famous house specialty! Crisp tender chicken breast layered with melted cheddar and rich cream-garlic drizzle, served with spiced fries and fresh coleslaw.',
    price: 68000,
    isSignature: true,
    isBestseller: true,
    rating: 4.88,
    reviewsCount: 228,
    ingredientsAr: ['صدر دجاج كرسبي مقرمش', 'صوص البرنسس الكريمي', 'جبنة شيدر ذائبة', 'سلطة كول سلو', 'بطاطا مقلية'],
    ingredientsEn: ['Crisp Breaded Chicken Breast', 'Princess Cream Sauce', 'Melted Cheddar Slice', 'Fresh Coleslaw', 'Spiced Fries'],
    options: [
      { id: 'single', nameAr: 'ساندوتش برنسس منفرد', nameEn: 'Single Princess Sandwich', priceDiff: -15000 },
      { id: 'meal', nameAr: 'وجبة كاملة مع بطاطا وكول سلو ومشروب', nameEn: 'Full Meal with Fries, Slaw & Drink', priceDiff: 0 },
      { id: 'double', nameAr: 'وجبة برنسس دبل إكسترا جبنة', nameEn: 'Double Chicken & Extra Cheese', priceDiff: 22000 },
    ],
  },
  {
    id: 'supreme-meal',
    imageKey: 'supreme-meal',
    category: 'sandwiches',
    nameAr: 'وجبة سوبريم مايسترو',
    nameEn: 'Maestro Supreme Chicken Meal',
    descriptionAr: 'فيليه دجاج سوبريم محضر بقرمشة لا تُقاوم مع طبقة جبنة شيدر غنية وصوص المايونيز بالثوم المميز، يقدم مع كول سلو وبطاطا مقلية.',
    descriptionEn: 'Supreme crispy fried chicken breast topped with a blanket of melted cheddar and garlic mayonnaise glaze, accompanied by crisp coleslaw and golden chips.',
    price: 65000,
    rating: 4.85,
    reviewsCount: 162,
    ingredientsAr: ['دجاج سوبريم مقرمش', 'جبنة شيدر صفراء', 'صوص مايونيز وثوم', 'خبز صمون طري', 'كول سلو'],
    ingredientsEn: ['Crispy Supreme Chicken Fillet', 'Cheddar Cheese', 'Garlic Mayonnaise', 'Fresh Brioche Sub', 'Coleslaw'],
    options: [
      { id: 'regular', nameAr: 'وجبة سوبريم نظامية', nameEn: 'Regular Supreme Meal', priceDiff: 0 },
      { id: 'spicy-supreme', nameAr: 'سوبريم حار سبايسي مع هالبينو', nameEn: 'Spicy Supreme with Jalapenos', priceDiff: 5000 },
    ],
  },
  {
    id: 'crispy-baguettes',
    imageKey: 'crispy-baguettes',
    category: 'sandwiches',
    nameAr: 'ساندوتش كرسبي بالصمون الفرنسي',
    nameEn: 'Maestro French Baguette Crispy',
    descriptionAr: 'أصابع دجاج كرسبي ذهبية مقرمشة موضوعة بعناية داخل خبز الصمون الفرنسي الطازج، مع الخس المقرمش وصوص الثوم والمايونيز السري.',
    descriptionEn: 'Golden crisp chicken tenders nestled inside freshly baked French baguette bread, with crisp iceberg lettuce, pickles, and Maestro secret garlic sauce.',
    price: 48000,
    rating: 4.8,
    reviewsCount: 195,
    ingredientsAr: ['دجاج كرسبي طازج', 'صمون فرنسي محمص', 'خس طازج', 'تومية مايسترو', 'مخلل'],
    ingredientsEn: ['Fresh Crispy Tenders', 'Toasted French Baguette', 'Crisp Lettuce', 'Maestro Toum', 'Dill Pickles'],
    options: [
      { id: 'single', nameAr: 'ساندوتش فقط', nameEn: 'Sandwich Only', priceDiff: 0 },
      { id: 'combo', nameAr: 'وجبة مع بطاطا ومشروب غازي', nameEn: 'Combo with Fries & Soft Drink', priceDiff: 18000 },
    ],
  },
  {
    id: 'fajita-sub',
    imageKey: 'fajita-sub',
    category: 'sandwiches',
    nameAr: 'ساندوتش فاهيتا مايسترو بالمشروم والجبن',
    nameEn: 'Maestro Sizzling Fajita & Mushroom Sub',
    descriptionAr: 'شرائح دجاج متبلة ومطهوة على الصاج مع الفطر الطازج، الفليفلة الملونة، الذرة الحلوة وجبنة الموزاريلا السائحة بنكهة مكسيكية شرقية فريدة.',
    descriptionEn: 'Tender chicken slices wok-sizzled with fresh mushrooms, bell peppers, sweet corn, melted mozzarella, and aromatic fajita herbs in a warm sub.',
    price: 52000,
    isSpicy: true,
    rating: 4.87,
    reviewsCount: 140,
    ingredientsAr: ['دجاج فاهيتا مشوح', 'فطر طازج', 'فليفلة حلوة وذرة', 'جبنة موزاريلا', 'بهارات فاهيتا خاصة'],
    ingredientsEn: ['Sauteed Fajita Chicken', 'Fresh Sliced Mushrooms', 'Sweet Peppers & Corn', 'Melted Mozzarella', 'Fajita Spices'],
    options: [
      { id: 'regular', nameAr: 'فاهيتا معتدلة', nameEn: 'Regular Mild Fajita', priceDiff: 0 },
      { id: 'mexican-hot', nameAr: 'مكسيكانو حار ناري مع فلفل حار', nameEn: 'Fiery Mexicano Hot with Chilis', priceDiff: 3000 },
    ],
  },
  {
    id: 'broasted-chips',
    imageKey: 'broasted-chips',
    category: 'broasted',
    nameAr: 'وجبة بروستد مايسترو مع الشيبس المقرمش',
    nameEn: 'Maestro Broasted Chicken with Potato Crisps',
    descriptionAr: 'قطع الدجاج المقرمشة ذات القشرة الذهبية الهشة واللحم الطري المتبل، تقدم مع رقائق بطاطا الشيبس الدائرية المميزة و4 عبوات تومية وكاتشب.',
    descriptionEn: 'Deep golden crispy fried chicken with crunchy seasoned skin and juicy tender meat, served with Maestro round potato crisps, 4 creamy toum garlic pots, and ketchup.',
    price: 85000,
    originalPrice: 98000,
    isSignature: true,
    isBestseller: true,
    rating: 4.92,
    reviewsCount: 310,
    ingredientsAr: ['دجاج بروستد طازج مقرمش', 'رقائق بطاطا شيبس دائرية', '4 عبوات تومية أصلية', 'أظرف كاتشب', 'خبز طازج'],
    ingredientsEn: ['Crisp Golden Broasted Chicken', 'Round Seasoned Potato Crisps', '4 Creamy Toum Pots', 'Ketchup Sachets', 'Fresh Buns'],
    options: [
      { id: 'half', nameAr: 'وجبة نصف دجاجة (4 قطع)', nameEn: 'Half Chicken (4 Pieces)', priceDiff: 0 },
      { id: 'whole', nameAr: 'وجبة دجاجة كاملة (8 قطع) مع شيبس مضاعف', nameEn: 'Whole Chicken (8 Pieces) Double Chips', priceDiff: 75000 },
      { id: 'spicy', nameAr: 'بروستد حار سبايسي', nameEn: 'Spicy Hot Seasoning', priceDiff: 4000 },
    ],
  },
  {
    id: 'shawarma-spit-meal',
    imageKey: 'shawarma-spit',
    category: 'shawarma',
    nameAr: 'وجبة سيخ شاورما مايسترو بالوزن',
    nameEn: 'Maestro Fresh Shawarma Spit by Weight',
    descriptionAr: 'شاورما دجاج مقطعة طازجة مباشرة من سيخ الشاورما العملاق، تقدم بالوزن مع مخللات، صوص الثوم، بطاطا مقلية وخبز ساخن.',
    descriptionEn: 'Fresh succulent chicken carved straight from our colossal shawarma rotisserie spit, packed with rich Levantine juices, warm flatbread, and toum.',
    price: 60000,
    isSignature: true,
    rating: 4.94,
    reviewsCount: 420,
    ingredientsAr: ['دجاج شاورما مشوي على السيخ', 'تومية مايسترو', 'مخلل خيار شامي', 'خبز صاج'],
    ingredientsEn: ['Slow-Roasted Chicken Shawarma', 'Maestro Toum', 'Damascus Pickles', 'Fresh Flatbread'],
    options: [
      { id: 'quarter', nameAr: 'صحن ربع كيلو (250 غ)', nameEn: 'Quarter Kilo (250g)', priceDiff: 0 },
      { id: 'half-kg', nameAr: 'صحن نصف كيلو (500 غ)', nameEn: 'Half Kilo (500g)', priceDiff: 55000 },
      { id: 'kilo', nameAr: 'سرفيس كيلو كامل (1000 غ) مع المقبلات', nameEn: 'Full Kilo (1000g) with Full Sides', priceDiff: 165000 },
    ],
  },
  {
    id: 'crispy-meal',
    imageKey: 'crispy-meal',
    category: 'sandwiches',
    nameAr: 'وجبة كريسبي مايسترو العائلية',
    nameEn: 'Maestro Crispy Tenders Platter',
    descriptionAr: 'شرائح فيليه دجاج مقرمشة كرسبي ذهبية بتتبيلة خاصة، تقدم مع سرفيس بطاطا مقلية وصلصات المايسترو المتنوعة.',
    descriptionEn: 'Golden crispy chicken tenders seasoned to perfection, served over hot spiced fries with artisanal garlic toum and dips.',
    price: 72000,
    isBestseller: true,
    isNew: true,
    rating: 4.93,
    reviewsCount: 145,
    ingredientsAr: ['شرائح صدر دجاج كرسبي', 'بطاطا مقلية ذهبية', 'تومية مايسترو', 'صوص باربيكيو', 'سلطة كول سلو'],
    ingredientsEn: ['Crispy Chicken Breast Tenders', 'Golden Fries', 'Maestro Toum', 'Barbecue Dip', 'Coleslaw'],
    options: [
      { id: 'regular', nameAr: 'وجبة كريسبي نظامية (5 قطع)', nameEn: 'Regular Tenders (5 Pcs)', priceDiff: 0 },
      { id: 'large', nameAr: 'وجبة كريسبي سوبر (8 قطع)', nameEn: 'Super Tenders (8 Pcs)', priceDiff: 28000 },
    ],
  },
  {
    id: 'broasted-pieces',
    imageKey: 'broasted-pieces',
    category: 'broasted',
    nameAr: 'قطع دجاج بروستد كرسبي مقرمش',
    nameEn: 'Crispy Golden Broasted Chicken Pieces',
    descriptionAr: 'قطع دجاج بروستد طازجة مقلية حتى القرمشة الذهبية مع لحم طري وعصيري ونكهة بهارات المايسترو الحصرية.',
    descriptionEn: 'Golden crispy broasted chicken portions fried to perfection with juicy tender meat and house Levantine spice marinade.',
    price: 78000,
    rating: 4.91,
    reviewsCount: 178,
    ingredientsAr: ['دجاج بروستد طازج', 'تتبيلة المايسترو السرية', 'تومية شامية', 'مخللات مشكلة'],
    ingredientsEn: ['Fresh Broasted Chicken', 'Maestro Secret Marinade', 'Damascus Toum', 'Mixed Pickles'],
    options: [
      { id: '4pcs', nameAr: 'وجبة 4 قطع مع بطاطا وتومية', nameEn: '4 Pieces with Fries & Toum', priceDiff: 0 },
      { id: '8pcs', nameAr: 'وليمة 8 قطع مع سرفيس بطاطا وتومية دبل', nameEn: '8 Pieces Feast with Double Sides', priceDiff: 68000 },
    ],
  },
];

