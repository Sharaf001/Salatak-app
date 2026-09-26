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

export type PrayerTimesResult = {
  loading: boolean;
  /** null if location permission was denied / unavailable */
  coords: { latitude: number; longitude: number } | null;
  locationLabel: string | null;
  today: Record<PrayerId, Date> | null;
  /** raw geometric sunset, shown separately from the Shia-adjusted Maghrib time */
  sunset: Date | null;
  nextPrayer: { id: PrayerId; time: Date } | null;
};

const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function computeToday(coordinates: Coordinates, date: Date) {
  const params = CalculationMethod.Tehran();
  params.madhab = Madhab.Shafi;
  const pt = new PrayerTimes(coordinates, date, params);
  return {
    fajr: pt.fajr,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  } satisfies Record<PrayerId, Date>;
}

function computeSunset(coordinates: Coordinates, date: Date) {
  // ISNA defines Maghrib as sunset itself (0° adjustment), so we borrow that
  // for a plain geometric sunset time to display alongside the Shia Maghrib.
  const params = CalculationMethod.NorthAmerica();
  const pt = new PrayerTimes(coordinates, date, params);
  return pt.maghrib;
}

export function usePrayerTimes(now: Date): PrayerTimesResult {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  return useMemo<PrayerTimesResult>(() => {
    if (!coords) {
      return { loading, coords: null, locationLabel: null, today: null, sunset: null, nextPrayer: null };
    }

    const coordinates = new Coordinates(coords.latitude, coords.longitude);
    const today = computeToday(coordinates, now);
    const sunset = computeSunset(coordinates, now);

    let nextPrayer = PRAYER_ORDER.map((id) => ({ id, time: today[id] })).find((p) => p.time.getTime() > now.getTime()) ?? null;

    if (!nextPrayer) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = computeToday(coordinates, tomorrow);
      nextPrayer = { id: 'fajr', time: tomorrowTimes.fajr };
    }

    return { loading, coords, locationLabel, today, sunset, nextPrayer };
  }, [coords, locationLabel, loading, now]);
}
