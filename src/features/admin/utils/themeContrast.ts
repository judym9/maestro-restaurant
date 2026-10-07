/**
 * Color and WCAG Contrast Accessibility Calculation Utility
 * Compliant with WCAG 2.1 Level AA & AAA specifications and YIQ color luminance.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface WcagEvaluation {
  ratio: number;
  ratioFormatted: string;
  level: 'AAA' | 'AA' | 'FAIL';
  labelAr: string;
  labelEn: string;
  isAccessible: boolean;
  textColor: '#0B0F17' | '#FFFFFF';
}

/**
 * Normalizes a hex string (handles 3-digit and 6-digit hex, with or without '#').
 */
export const normalizeHex = (hex: string): string => {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((char) => char + char).join('');
  }
  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
    return '#F59E0B'; // fallback
  }
  return `#${clean.toUpperCase()}`;
};

/**
 * Converts a hex color string to RGB.
 */
export const hexToRgb = (hex: string): RgbColor => {
  const normalized = normalizeHex(hex).replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return { r, g, b };
};

/**
 * Calculates YIQ perceptual luminance (0 - 255).
 * >= 128 indicates a light color; < 128 indicates a dark color.
 */
export const getYiqLuminance = (hex: string): number => {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

/**
 * Calculates WCAG 2.1 relative luminance (0 - 1).
 */
export const getRelativeLuminance = (hex: string): number => {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculates the WCAG contrast ratio between two hex colors (1:1 to 21:1).
 */
export const getContrastRatio = (hex1: string, hex2: string): number => {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Determines whether dark (#0B0F17) or light (#FFFFFF) text provides higher contrast.
 */
export const getOptimalButtonTextColor = (bgHex: string): '#0B0F17' | '#FFFFFF' => {
  const ratioDark = getContrastRatio(bgHex, '#0B0F17');
  const ratioLight = getContrastRatio(bgHex, '#FFFFFF');
  return ratioDark >= ratioLight ? '#0B0F17' : '#FFFFFF';
};

/**
 * Evaluates accessibility compliance for a button background against its optimal text.
 */
export const evaluateContrast = (bgHex: string): WcagEvaluation => {
  const safeHex = normalizeHex(bgHex);
  const textColor = getOptimalButtonTextColor(safeHex);
  const ratio = getContrastRatio(safeHex, textColor);
  const roundedRatio = Math.round(ratio * 10) / 10;
  const ratioFormatted = `${roundedRatio.toFixed(1)}:1`;

  if (ratio >= 7.0) {
    return {
      ratio: roundedRatio,
      ratioFormatted,
      level: 'AAA',
      labelAr: 'ممتاز وفائق الوضوح (AAA)',
      labelEn: 'Superb High Contrast (AAA)',
      isAccessible: true,
      textColor,
    };
  }

  if (ratio >= 4.5) {
    return {
      ratio: roundedRatio,
      ratioFormatted,
      level: 'AA',
      labelAr: 'مطابق للمواصفات القياسية (AA)',
      labelEn: 'Compliant & Readable (AA)',
      isAccessible: true,
      textColor,
    };
  }

  return {
    ratio: roundedRatio,
    ratioFormatted,
    level: 'FAIL',
    labelAr: 'تباين منخفض - يُنصح بتعديل الدرجة',
    labelEn: 'Low Contrast - Adjustment Recommended',
    isAccessible: false,
    textColor,
  };
};
