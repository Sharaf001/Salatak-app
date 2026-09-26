/**
 * Gregorian -> Hijri date conversion using the tabular ("civil") Islamic
 * calendar algorithm, calibrated against published prayer-time calendars
 * for 2026.
 *
 * IMPORTANT LIMITATION: this is a calculated calendar, not a moon-sighting
 * based one. Real Hijri dates are officially set by local moon sighting and
 * can differ from this calculation by a day in either direction, especially
 * around the start of Ramadan, Shawwal, and Dhul Hijjah. Treat the date
 * shown as a close estimate, not an authoritative religious ruling.
 */

const HIJRI_MONTHS = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicIndicDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}

export type HijriDate = {
  year: number;
  month: number; // 1-12
  day: number;
  monthName: string;
};

// Calibrated epoch adjustment — see hooks/useHijriDate.test notes in the repo
// history for how this constant was chosen against known reference dates.
const EPOCH_ADJUSTMENT = 2440589;

export function gregorianToHijri(date: Date): HijriDate {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const jd = Math.floor(utcMidnight / 86400000) + EPOCH_ADJUSTMENT;

  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return { year, month, day, monthName: HIJRI_MONTHS[month - 1] ?? '' };
}

export function formatHijriDate(date: Date): string {
  const hijri = gregorianToHijri(date);
  return `${toArabicIndicDigits(hijri.day)} ${hijri.monthName} ${toArabicIndicDigits(hijri.year)}`;
}
