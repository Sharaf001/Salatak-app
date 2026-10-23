import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { Coordinates, CalculationMethod, Madhab, PrayerTimes } from 'adhan';

/**
 * Prayer time calculation notes (read before changing the method below):
 *
 * - We use the "Tehran" calculation method (University of Tehran Institute
 *   of Geophysics). Unlike Sunni-oriented methods, it defines Maghrib as
 *   ~4.5° below the horizon rather than at sunset itself — which lines up
 *   with the Shia practice of waiting for the sunset redness to pass before
 *   praying Maghrib, instead of praying immediately at sunset.
 * - Asr is calculated with the "Shafi" shadow-length rule (shadow length
 *   equals object height), which is the standard single-factor convention
 *   most Shia sources also use, as opposed to the Hanafi double-factor rule.
 * - This is a geometric approximation, like every prayer-time calculator.
 *   It's a reasonable default but isn't a substitute for your local
 *   mosque/marja's own published timetable if precision matters to you.
 */

export type PrayerId = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type PrayerTimeId = PrayerId | 'sunrise' | 'sunset' | 'midnight';
export type PrayerMethod = 'tehran' | 'qom';
export const PRAYER_METHODS: Record<PrayerMethod, string> = {
  tehran: 'جامعة طهران',
  qom: 'قم (لوا)',
};

export type PrayerTimesResult = {
  loading: boolean;
  /** null if location permission was denied / unavailable */
  coords: { latitude: number; longitude: number } | null;
  locationLabel: string | null;
  today: Record<PrayerTimeId, Date> | null;
  /** raw geometric sunset, shown separately from the Shia-adjusted Maghrib time */
  sunset: Date | null;
  nextPrayer: { id: PrayerId; time: Date } | null;
};

export type ManualCity = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export const MANUAL_CITIES: ManualCity[] = [
  { id: 'beirut', name: 'بيروت', country: 'لبنان', latitude: 33.8938, longitude: 35.5018 },
  { id: 'new-york', name: 'نيويورك', country: 'الولايات المتحدة', latitude: 40.7128, longitude: -74.006 },
  { id: 'london', name: 'لندن', country: 'المملكة المتحدة', latitude: 51.5072, longitude: -0.1276 },
  { id: 'toronto', name: 'تورنتو', country: 'كندا', latitude: 43.6532, longitude: -79.3832 },
  { id: 'dubai', name: 'دبي', country: 'الإمارات', latitude: 25.2048, longitude: 55.2708 },
  { id: 'sydney', name: 'سيدني', country: 'أستراليا', latitude: -33.8688, longitude: 151.2093 },
];

const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function computePrayerTimes(coordinates: Coordinates, date: Date, method: PrayerMethod = 'tehran') {
  const params = CalculationMethod.Tehran();
  if (method === 'qom') {
    params.fajrAngle = 16;
    params.ishaAngle = 14;
    params.maghribAngle = 4.5;
  }
  params.madhab = Madhab.Shafi;
  const pt = new PrayerTimes(coordinates, date, params);
  const midnight = new Date((pt.sunset.getTime() + pt.fajr.getTime()) / 2);
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    sunset: pt.sunset,
    maghrib: pt.maghrib,
    isha: pt.isha,
    midnight,
  } satisfies Record<PrayerTimeId, Date>;
}

function computeSunset(coordinates: Coordinates, date: Date) {
  // ISNA defines Maghrib as sunset itself (0° adjustment), so we borrow that
  // for a plain geometric sunset time to display alongside the Shia Maghrib.
  const params = CalculationMethod.NorthAmerica();
  const pt = new PrayerTimes(coordinates, date, params);
  return pt.maghrib;
}

export function usePrayerTimes(now: Date, manualCity: ManualCity | null = null, method: PrayerMethod = 'tehran'): PrayerTimesResult {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  useEffect(() => {
    if (manualCity) {
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) setLoading(false);
          return;
        }
        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
        if (cancelled) return;
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });

        try {
          const places = await Location.reverseGeocodeAsync({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          const place = places[0];
          if (place && !cancelled) {
            const label = [place.city ?? place.subregion, place.country].filter(Boolean).join('، ');
            setLocationLabel(label || null);
          }
        } catch {
          // Reverse geocoding is a nice-to-have; ignore failures silently.
        }
      } catch {
        // Permission or location services unavailable — caller falls back to defaults.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [manualCity]);

  const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
  return useMemo<PrayerTimesResult>(() => {
    if (manualCity) {
      const manualCoords = { latitude: manualCity.latitude, longitude: manualCity.longitude };
      const coordinates = new Coordinates(manualCoords.latitude, manualCoords.longitude);
      const today = computePrayerTimes(coordinates, now, method);
      const sunset = computeSunset(coordinates, now);
      let nextPrayer = PRAYER_ORDER.map((id) => ({ id, time: today[id] })).find((p) => p.time.getTime() > now.getTime()) ?? null;
      if (!nextPrayer) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        nextPrayer = { id: 'fajr', time: computePrayerTimes(coordinates, tomorrow, method).fajr };
      }
      return { loading: false, coords: manualCoords, locationLabel: `${manualCity.name}، ${manualCity.country}`, today, sunset, nextPrayer };
    }
    if (!coords) {
      return { loading, coords: null, locationLabel: null, today: null, sunset: null, nextPrayer: null };
    }

    const coordinates = new Coordinates(coords.latitude, coords.longitude);
    const today = computePrayerTimes(coordinates, now, method);
    const sunset = computeSunset(coordinates, now);

    let nextPrayer = PRAYER_ORDER.map((id) => ({ id, time: today[id] })).find((p) => p.time.getTime() > now.getTime()) ?? null;

    if (!nextPrayer) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = computePrayerTimes(coordinates, tomorrow, method);
      nextPrayer = { id: 'fajr', time: tomorrowTimes.fajr };
    }

    return { loading, coords, locationLabel, today, sunset, nextPrayer };
  }, [coords, locationLabel, loading, manualCity, method, minuteKey]);
}
