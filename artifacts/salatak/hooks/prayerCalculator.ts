import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type PrayerTimeId = PrayerId | 'imsak' | 'sunrise' | 'sunset' | 'midnight';
export type PrayerMethod = 'tehran' | 'qom';

export function computePrayerTimes(
  coordinates: Coordinates,
  date: Date,
  method: PrayerMethod = 'tehran',
  asrMadhab: 'shafi' | 'hanafi' = 'shafi',
  offsets: Partial<Record<PrayerId, number>> = {},
) {
  const params = CalculationMethod.Tehran();
  if (method === 'qom') {
    params.fajrAngle = 16;
    params.ishaAngle = 14;
    params.maghribAngle = 4;
  }
  params.madhab = asrMadhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  const pt = new PrayerTimes(coordinates, date, params);
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowPt = new PrayerTimes(coordinates, tomorrow, params);
  const midnight = new Date((pt.sunset.getTime() + tomorrowPt.fajr.getTime()) / 2);
  const imsak = new Date(pt.fajr.getTime() - 10 * 60 * 1000);
  return {
    fajr: new Date(pt.fajr.getTime() + (offsets.fajr ?? 0) * 60_000),
    imsak,
    sunrise: pt.sunrise,
    dhuhr: new Date(pt.dhuhr.getTime() + (offsets.dhuhr ?? 0) * 60_000),
    asr: new Date(pt.asr.getTime() + (offsets.asr ?? 0) * 60_000),
    sunset: pt.sunset,
    maghrib: new Date(pt.maghrib.getTime() + (offsets.maghrib ?? 0) * 60_000),
    isha: new Date(pt.isha.getTime() + (offsets.isha ?? 0) * 60_000),
    midnight,
  } satisfies Record<PrayerTimeId, Date>;
}
