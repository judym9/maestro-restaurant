/**
 * Centralized Asset & Image Registry
 * Maps local assets imported from C:\Users\judym\Desktop\photo
 * Provides WebP, Fallback formats, and safe default placeholders.
 */

// Brand assets (Transparent PNG / WebP)
import maestroLogoWebp from '../assets/images/brand/maestro-logo.webp';
import maestroLogoPng from '../assets/images/brand/maestro-logo.png';
import maestroHeroBannerWebp from '../assets/images/brand/maestro-hero-banner.webp';
import maestroHeroBannerPng from '../assets/images/brand/maestro-hero-banner.png';

// Meals assets
import shawarmaSpitWebp from '../assets/images/meals/shawarma-spit.webp';
import shawarmaSpitJpg from '../assets/images/meals/shawarma-spit.jpg';

import shawarmaTowerWebp from '../assets/images/meals/shawarma-tower.webp';
import shawarmaTowerJpg from '../assets/images/meals/shawarma-tower.jpg';

import shawarmaCakeWebp from '../assets/images/meals/shawarma-cake.webp';
import shawarmaCakeJpg from '../assets/images/meals/shawarma-cake.jpg';

import shawarmaPlattersWebp from '../assets/images/meals/shawarma-platters.webp';
import shawarmaPlattersJpg from '../assets/images/meals/shawarma-platters.jpg';

import crispyBaguettesWebp from '../assets/images/meals/crispy-baguettes.webp';
import crispyBaguettesJpg from '../assets/images/meals/crispy-baguettes.jpg';

import princessMealWebp from '../assets/images/meals/princess-meal.webp';
import princessMealJpg from '../assets/images/meals/princess-meal.jpg';

import supremeMealWebp from '../assets/images/meals/supreme-meal.webp';
import supremeMealJpg from '../assets/images/meals/supreme-meal.jpg';

import fajitaSubWebp from '../assets/images/meals/fajita-sub.webp';
import fajitaSubJpg from '../assets/images/meals/fajita-sub.jpg';

import broastedChipsWebp from '../assets/images/meals/broasted-chips.webp';
import broastedChipsJpg from '../assets/images/meals/broasted-chips.jpg';

import crispyMealWebp from '../assets/images/meals/crispy-meal.webp';
import crispyMealJpg from '../assets/images/meals/crispy-meal.jpg';

import broastedPiecesWebp from '../assets/images/meals/broasted-pieces.webp';
import broastedPiecesJpg from '../assets/images/meals/broasted-pieces.jpg';

import fallbackMealSvg from '../assets/images/fallback-meal.svg';

export interface ImageAsset {
  src: string;
  webp?: string;
  altAr: string;
  altEn: string;
}

export const BrandAssets = {
  logo: {
    src: maestroLogoPng,
    webp: maestroLogoWebp,
    altAr: 'شعار مطعم مايسترو',
    altEn: 'Maestro Restaurant Logo',
  },
  heroBanner: {
    src: maestroHeroBannerPng,
    webp: maestroHeroBannerWebp,
    altAr: 'بانر مطعم مايسترو الشامل للمأكولات',
    altEn: 'Maestro Signature Menu Banner',
  },
  fallback: {
    src: fallbackMealSvg,
    altAr: 'طبق مطعم مايسترو',
    altEn: 'Maestro Dish Placeholder',
  },
} as const;

export const MealAssets: Record<string, ImageAsset> = {
  'shawarma-spit': {
    src: shawarmaSpitJpg,
    webp: shawarmaSpitWebp,
    altAr: 'سيخ شاورما مايسترو الدجاج الأصلي',
    altEn: 'Maestro Signature Shawarma Rotisserie Spit',
  },
  'shawarma-tower': {
    src: shawarmaTowerJpg,
    webp: shawarmaTowerWebp,
    altAr: 'برج شاورما مايسترو الملكي للمناسبات',
    altEn: 'Maestro Royal Shawarma Celebration Tower',
  },
  'shawarma-cake': {
    src: shawarmaCakeJpg,
    webp: shawarmaCakeWebp,
    altAr: 'كيكة شاورما مايسترو لأعياد الميلاد',
    altEn: 'Maestro Celebration Birthday Shawarma Cake',
  },
  'shawarma-platters': {
    src: shawarmaPlattersJpg,
    webp: shawarmaPlattersWebp,
    altAr: 'صواني وجبات شاورما عربي مشكلة',
    altEn: 'Assorted Shawarma Arabi Feast Platters',
  },
  'crispy-baguettes': {
    src: crispyBaguettesJpg,
    webp: crispyBaguettesWebp,
    altAr: 'ساندوتشات كرسبي مايسترو بالصمون الفرنسي',
    altEn: 'Maestro Golden Crispy French Baguettes',
  },
  'princess-meal': {
    src: princessMealJpg,
    webp: princessMealWebp,
    altAr: 'وجبة برنسس مايسترو مع الصوص الغني والبطاطا',
    altEn: 'Maestro Princess Meal with Cream Garlic Sauce & Slaw',
  },
  'supreme-meal': {
    src: supremeMealJpg,
    webp: supremeMealWebp,
    altAr: 'وجبة سوبريم مايسترو المقرمشة مع الجبنة الذائبة',
    altEn: 'Maestro Supreme Crispy Meal with Melted Cheddar',
  },
  'fajita-sub': {
    src: fajitaSubJpg,
    webp: fajitaSubWebp,
    altAr: 'ساندوتش فاهيتا مايسترو بالمشروم والجبن',
    altEn: 'Maestro Sizzling Fajita Sub with Mushrooms & Peppers',
  },
  'broasted-chips': {
    src: broastedChipsJpg,
    webp: broastedChipsWebp,
    altAr: 'وجبة بروستد كرسبي مع رقائق الشيبس والتومية',
    altEn: 'Maestro Crispy Broasted Chicken with Potato Chips & Toum',
  },
  'crispy-meal': {
    src: crispyMealJpg,
    webp: crispyMealWebp,
    altAr: 'وجبة كريسبي مايسترو العائلية مع البطاطا والصلصات',
    altEn: 'Maestro Family Crispy Tenders Meal with Fries & Dips',
  },
  'broasted-pieces': {
    src: broastedPiecesJpg,
    webp: broastedPiecesWebp,
    altAr: 'قطع دجاج بروستد كرسبي ذهبي مقرمش',
    altEn: 'Maestro Crispy Golden Broasted Chicken Pieces',
  },
};

/**
 * Returns image asset by key or default fallback
 */
export const getMealImage = (key: string): ImageAsset => {
  return MealAssets[key] || BrandAssets.fallback;
};
