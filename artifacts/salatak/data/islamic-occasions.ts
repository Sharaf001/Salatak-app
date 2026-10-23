export type IslamicOccasion = {
  month: number;
  day: number;
  name: string;
};

export const ISLAMIC_OCCASIONS: IslamicOccasion[] = [
  { month: 1, day: 1, name: 'رأس السنة الهجرية' },
  { month: 1, day: 10, name: 'عاشوراء' },
  { month: 2, day: 20, name: 'الأربعين' },
  { month: 3, day: 17, name: 'مولد النبي (ص) والإمام الصادق (ع)' },
  { month: 6, day: 13, name: 'ولادة أمير المؤمنين (ع)' },
  { month: 7, day: 27, name: 'المبعث النبوي' },
  { month: 8, day: 15, name: 'ولادة الإمام المهدي (عج)' },
  { month: 9, day: 19, name: 'ليلة القدر' },
  { month: 9, day: 21, name: 'شهادة أمير المؤمنين (ع)' },
  { month: 10, day: 1, name: 'عيد الفطر' },
  { month: 12, day: 10, name: 'عيد الأضحى' },
  { month: 12, day: 18, name: 'عيد الغدير' },
];

export function occasionFor(month: number, day: number): IslamicOccasion | undefined {
  return ISLAMIC_OCCASIONS.find((occasion) => occasion.month === month && occasion.day === day);
}
