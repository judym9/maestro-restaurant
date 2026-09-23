export interface PromoDeal {
  id: string;
  imageKey: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  remainingDays: number;
  featured?: boolean;
}

export const PROMOS_DATA: PromoDeal[] = [
  {
    id: 'promo-royal-tower',
    imageKey: 'shawarma-tower',
    badgeAr: 'عرض التوفير الملكي',
    badgeEn: 'Royal Celebration Deal',
    titleAr: 'باقة برج الشاورما الملكي + تومية وبطاطا عائلية',
    titleEn: 'Royal Shawarma Tower + Family Fries & Toum',
    descriptionAr: 'احتفل بأروع اللحظات مع برج الشاورما الفاخر المكون من 3 طبقات، بالإضافة لسرفيس بطاطا عائلي، 4 عبوات تومية ومخللات مشكلة.',
    descriptionEn: 'Celebrate life with our 3-tier shawarma tower, accompanied by a family-sized fries platter, 4 toum dips, and Damascus pickles.',
    price: 210000,
    originalPrice: 280000,
    discountPercent: 25,
    remainingDays: 4,
    featured: true,
  },
  {
    id: 'promo-princess-combo',
    imageKey: 'princess-meal',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Top Deal',
    titleAr: 'كومبو وجبتين برنسس دجاج كرسبي مع كول سلو وبطاطا',
    titleEn: 'Twin Princess Crispy Meal Combo with Slaw & Fries',
    descriptionAr: 'استمتع بوجبتين برنسس متكاملتين مع صوص الجبنة الكريمي الذائب، قطعتين بطاطا مقلية، علبتين كول سلو ومشروبين.',
    descriptionEn: 'Indulge in two complete Princess meals layered with molten cream cheese sauce, double fries, two coleslaws, and beverages.',
    price: 115000,
    originalPrice: 145000,
    discountPercent: 21,
    remainingDays: 2,
    featured: true,
  },
  {
    id: 'promo-family-broasted',
    imageKey: 'broasted-chips',
    badgeAr: 'وليمة العائلة',
    badgeEn: 'Family Feast',
    titleAr: 'بوكس بروستد مايسترو العملاق (12 قطعة + شيبس وتومية)',
    titleEn: 'Mega Broasted Box (12 Crispy Pieces + Chips & Toum)',
    descriptionAr: '12 قطعة دجاج بروستد ذهبي مقرمش بتتبيلة مايسترو السرية، مع سدر رقائق شيبس مايسترو، 6 عبوات تومية شامية وخبز طازج.',
    descriptionEn: '12 pieces of golden broasted fried chicken, extra platter of round potato crisps, 6 artisan garlic toum pots, and fresh buns.',
    price: 180000,
    originalPrice: 230000,
    discountPercent: 22,
    remainingDays: 5,
  },
  {
    id: 'promo-shawarma-birthday',
    imageKey: 'shawarma-cake',
    badgeAr: 'حفلات وأعياد ميلاد',
    badgeEn: 'Birthday Special',
    titleAr: 'تورتة الشاورما الاحتفالية مع بطاقة وشريطة هدية',
    titleEn: 'Celebration Birthday Shawarma Cake with Gift Card',
    descriptionAr: 'فاجئ أحبابك في عيد ميلادهم بتورتة شاورما دورين فاخرة مزينة بالورود والخضار مع شريطة حمراء وبطاقة إهداء مخصصة.',
    descriptionEn: 'Surprise your loved ones with a two-tier birthday shawarma cake adorned with carved roses, satin bow, and personalized card.',
    price: 170000,
    originalPrice: 210000,
    discountPercent: 19,
    remainingDays: 7,
  },
];
