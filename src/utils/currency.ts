/**
 * Syrian Pound (SYP / ل.س) Currency Formatter
 * Formats restaurant meal prices cleanly for both Arabic and English locales.
 */

export type LocaleCode = 'ar' | 'en';

export interface FormatPriceOptions {
  locale?: LocaleCode;
  showCurrency?: boolean;
  useArabicDigits?: boolean;
}

const ARABIC_DIGITS: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

export const toArabicDigits = (numStr: string): string => {
  return numStr.replace(/[0-9]/g, (w) => ARABIC_DIGITS[w] || w);
};

export const formatSYP = (amount: number, options: FormatPriceOptions = {}): string => {
  const { locale = 'ar', showCurrency = true, useArabicDigits = false } = options;

  // Format with thousands separator
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);

  const displayDigits = useArabicDigits && locale === 'ar' 
    ? toArabicDigits(formattedNumber)
    : formattedNumber;

  if (!showCurrency) {
    return displayDigits;
  }

  if (locale === 'ar') {
    return `${displayDigits} ل.س`;
  }

  return `${displayDigits} SYP`;
};

export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0 || discountedPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
