import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { Coordinates, CalculationMethod, Madhab, PrayerTimes } from 'adhan';
import type { PrayerId } from './usePrayerTimes';

/**
 * expo-notifications' Android implementation is not available at all when
 * running inside Expo Go from SDK 53 onward (only in a development build /
 * standalone app). Attempting to touch the module in that environment
 * throws and can crash the whole bundle, so every real usage of the module
 * — including setNotificationHandler — is loaded lazily and only after this
 * check passes.
 *
 * Note: we check `appOwnership === 'expo'` specifically (not
 * `executionEnvironment === 'storeClient'`), because that broader check also
 * matches legitimate development-client builds, which DO support
 * notifications — only classic Expo Go doesn't.
 */
const isExpoGo = Constants.appOwnership === 'expo';

const PRAYER_LABELS: Record<PrayerId, string> = {
  fajr: 'حان الآن وقت صلاة الفجر',
  dhuhr: 'حان الآن وقت صلاة الظهر',
  asr: 'حان الآن وقت صلاة العصر',
  maghrib: 'حان الآن وقت صلاة المغرب',
  isha: 'حان الآن وقت صلاة العشاء',
};
const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function computeDay(coordinates: Coordinates, date: Date) {
  const params = CalculationMethod.Tehran();
  params.madhab = Madhab.Shafi;
  const pt = new PrayerTimes(coordinates, date, params);
  return { fajr: pt.fajr, dhuhr: pt.dhuhr, asr: pt.asr, maghrib: pt.maghrib, isha: pt.isha };
}

/**
 * Whether this build can actually schedule notifications. The "More" screen
 * uses this to tell the person why the toggle isn't doing anything, instead
 * of silently failing, when running inside Expo Go.
 */
export const notificationsSupported = !isExpoGo;

/**
 * Schedules a local notification for every remaining prayer today and all
 * five prayers tomorrow, then re-runs once a day. Cancels everything if
 * `enabled` is false, and re-schedules from scratch whenever coordinates or
 * the enabled flag change, so it never double-books notifications.
 *
 * No-ops entirely inside Expo Go on Android, where the notifications module
 * isn't available (a development build is required there) — see
 * notificationsSupported above.
 */
export function usePrayerNotifications(
  coords: { latitude: number; longitude: number } | null,
  enabled: boolean,
) {
  const lastScheduledDay = useRef<string | null>(null);

  useEffect(() => {
    if (isExpoGo) return;

    // Loaded lazily (only once we know we're not in Expo Go) so importing
    // this hook never touches the native module in an unsupported environment.
    const Notifications = require('expo-notifications') as typeof import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (!enabled || !coords) {
      void Notifications.cancelAllScheduledNotificationsAsync();
      lastScheduledDay.current = null;
      return;
    }

    const todayKey = new Date().toDateString();
    if (lastScheduledDay.current === todayKey) return; // already scheduled for today

    let cancelled = false;
    (async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        await Notifications.cancelAllScheduledNotificationsAsync();

        const coordinates = new Coordinates(coords.latitude, coords.longitude);
        const now = new Date();
        const today = computeDay(coordinates, now);
        const tomorrowDate = new Date(now);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrow = computeDay(coordinates, tomorrowDate);

        const upcoming: { id: PrayerId; time: Date }[] = [
          ...PRAYER_ORDER.map((id) => ({ id, time: today[id] })).filter((p) => p.time.getTime() > now.getTime()),
          ...PRAYER_ORDER.map((id) => ({ id, time: tomorrow[id] })),
        ];

        for (const prayer of upcoming) {
          if (cancelled) return;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'صلاتك',
              body: PRAYER_LABELS[prayer.id],
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prayer.time,
            },
          });
        }

        if (!cancelled) lastScheduledDay.current = todayKey;
      } catch (error) {
        // Never let a notifications failure take down the rest of the app.
        console.warn('Prayer notification scheduling failed:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [coords?.latitude, coords?.longitude, enabled]);
}
