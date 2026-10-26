import Constants from 'expo-constants';
import { AppState, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import type { PrayerId, PrayerMethod } from './usePrayerTimes';
import { computePrayerTimes } from './usePrayerTimes';
import { Coordinates } from 'adhan';

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
const notificationsUnavailableInCurrentBuild = Platform.OS === 'android' && isExpoGo;

const PRAYER_LABELS: Record<PrayerId, string> = {
  fajr: 'حان الآن وقت صلاة الفجر',
  dhuhr: 'حان الآن وقت صلاة الظهر',
  asr: 'حان الآن وقت صلاة العصر',
  maghrib: 'حان الآن وقت صلاة المغرب',
  isha: 'حان الآن وقت صلاة العشاء',
};
const PRAYER_ORDER: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NOTIFICATION_KIND = 'salatak-prayer';

/**
 * Whether this build can actually schedule notifications. The "More" screen
 * uses this to tell the person why the toggle isn't doing anything, instead
 * of silently failing, when running inside Expo Go.
 */
export const notificationsSupported = !notificationsUnavailableInCurrentBuild;

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
  today: Record<PrayerId, Date> | null,
  method: PrayerMethod,
) {
  const lastScheduledDay = useRef<string | null>(null);
  const todayRef = useRef(today);
  const [foregroundVersion, setForegroundVersion] = useState(0);
  todayRef.current = today;

  useEffect(() => {
    if (notificationsUnavailableInCurrentBuild) return;

    // Loaded lazily (only once we know we're not in Expo Go) so importing
    // this hook never touches the native module in an unsupported environment.
    const loadedNotifications = require('expo-notifications') as
      | (typeof import('expo-notifications') & { default?: typeof import('expo-notifications') })
      | undefined;
    const Notifications = loadedNotifications?.default ?? loadedNotifications;
    if (!Notifications || typeof Notifications.setNotificationHandler !== 'function') {
      console.warn('Prayer notifications are unavailable in this build.');
      return undefined;
    }
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      void Notifications.setNotificationChannelAsync('prayer-times', {
        name: 'مواقيت الصلاة',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    let cancelled = false;
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        lastScheduledDay.current = null;
        setForegroundVersion((version) => version + 1);
      }
    });

    if (!enabled || !coords) {
      void cancelPrayerNotifications(Notifications);
      lastScheduledDay.current = null;
      return () => {
        cancelled = true;
        appStateSubscription.remove();
      };
    }

    const todayKey = new Date().toDateString();
    lastScheduledDay.current = null;
    (async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        await cancelPrayerNotifications(Notifications);
        const now = new Date();
        const currentToday = todayRef.current;
        if (!currentToday) return;
        const coordinates = new Coordinates(coords.latitude, coords.longitude);
        const upcoming: { id: PrayerId; time: Date }[] = PRAYER_ORDER
          .map((id) => ({ id, time: currentToday[id] }))
          .filter((p) => p.time.getTime() > now.getTime());
        for (let offset = 1; offset <= 7; offset += 1) {
          const date = new Date(now);
          date.setDate(date.getDate() + offset);
          const prayerTimes = computePrayerTimes(coordinates, date, method);
          for (const prayer of PRAYER_ORDER) {
            upcoming.push({ id: prayer, time: prayerTimes[prayer] });
          }
        }

        for (const prayer of upcoming) {
          if (cancelled) return;
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'صلاتك',
              body: PRAYER_LABELS[prayer.id],
              sound: true,
              data: { kind: NOTIFICATION_KIND },
              ...(Platform.OS === 'android' ? { channelId: 'prayer-times' } : {}),
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
      appStateSubscription.remove();
    };
  }, [coords?.latitude, coords?.longitude, enabled, method, foregroundVersion]);
}

async function cancelPrayerNotifications(Notifications: typeof import('expo-notifications')) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.content.data && (item.content.data as { kind?: string }).kind === NOTIFICATION_KIND)
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)),
  );
}
