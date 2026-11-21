export type AppLanguage = 'ar' | 'en';

const strings = {
  ar: {
    settings: 'الإعدادات',
    prayer: 'الصلاة',
    location: 'الموقع',
    hijriAndDisplay: 'الهجري والعرض',
    alerts: 'التنبيهات',
    aboutApp: 'حول التطبيق',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    reportContentError: 'الإبلاغ عن خطأ في المحتوى',
    privacyPolicy: 'سياسة الخصوصية',
    support: 'الدعم والخصوصية',
    credits: 'الاعتمادات والمصادر',
    quran: 'القرآن الكريم',
    nextPrayer: 'الصلاة القادمة',
  },
  en: {
    settings: 'Settings',
    prayer: 'Prayer',
    location: 'Location',
    hijriAndDisplay: 'Hijri and Display',
    alerts: 'Notifications',
    aboutApp: 'About',
    language: 'Language',
    arabic: 'Arabic',
    english: 'English',
    reportContentError: 'Report a content error',
    privacyPolicy: 'Privacy Policy',
    support: 'Support and Privacy',
    credits: 'Credits and Sources',
    quran: 'The Quran',
    nextPrayer: 'Next Prayer',
  },
} as const;

export function getStrings(language: AppLanguage) {
  return strings[language];
}
