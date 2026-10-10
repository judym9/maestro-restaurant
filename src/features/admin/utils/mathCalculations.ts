/**
 * Pure Mathematical and Formatting Functions
 * Strict adherence to business formulas documented in dashboard_spec.md Section 3.3
 */

/**
 * 1. Discount Percentage Formula:
 * round(((originalPrice - price) / originalPrice) * 100) if originalPrice > price > 0
 */
export function calculateDiscountPercentage(
  originalPrice?: number | null,
  price?: number | null
): number {
  if (
    typeof originalPrice === 'number' &&
    typeof price === 'number' &&
    originalPrice > price &&
    price > 0
  ) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
  return 0;
}

/**
 * 2. Customer Savings Amount:
 * max(0, originalPrice - price)
 */
export function calculateSavings(
  originalPrice?: number | null,
  price?: number | null
): number {
  if (
    typeof originalPrice === 'number' &&
    typeof price === 'number' &&
    originalPrice > price
  ) {
    return Math.max(0, originalPrice - price);
  }
  return 0;
}

/**
 * 3. Bundle Item Parsing:
 * titleAr.split('+').map(s => s.trim()).filter(Boolean)
 */
export function parseBundleItems(titleAr?: string | null): string[] {
  if (!titleAr) return [];
  return titleAr
    .split('+')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * 4. Syrian Currency (SYP) Formatter
 */
export function formatCurrencySYP(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0 ل.س';
  }
  return `${Math.round(amount).toLocaleString('ar-SY')} ل.س`;
}

/**
 * 5. Phone string sanitization for direct tel: and WhatsApp wa.me links
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * 6. Generate Clean URL slug for category
 */
export function generateCategorySlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
