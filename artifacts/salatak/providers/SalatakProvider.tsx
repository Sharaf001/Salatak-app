import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PrayerId, PrayerMethod } from '@/hooks/usePrayerTimes';

const STORAGE_KEY = '@salatak/state';
const MIN_NOTIFICATION_LEAD_MINUTES = 0;
const MAX_NOTIFICATION_LEAD_MINUTES = 60;
const PRAYER_IDS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type SalatakState = {
  completedPrayers: Record<string, boolean>;
  bookmarks: string[];
  rakahCount: number;
  tasbihCount: number;
  tasbihTarget: number;
  readAzkar: string[];
  notificationsEnabled: boolean;
  stateDate: string;
  selectedCity: { id: string; name: string; country: string; latitude: number; longitude: number } | null;
  lastReadSurah: string | null;
  lastReadVerse: number;
  prayerMethod: PrayerMethod;
  asrMadhab: 'shafi' | 'hanafi';
  prayerOffsets: Record<PrayerId, number>;
  hijriOffset: number;
  timeFormat: '12h' | '24h';
  quranTextSize: number;
  prayerNotifications: Record<PrayerId, boolean>;
  notificationLeadMinutes: number;
};

type SalatakContextValue = SalatakState & {
  isReady: boolean;
  togglePrayer: (prayerId: string) => void;
  toggleBookmark: (itemId: string) => void;
  isBookmarked: (itemId: string) => boolean;
  incrementRakah: () => void;
  resetRakah: () => void;
  incrementTasbih: () => void;
  resetTasbih: () => void;
  setTasbihTarget: (target: number) => void;
  toggleAzkarRead: (itemId: string) => void;
  isAzkarRead: (itemId: string) => boolean;
  toggleNotifications: () => void;
  setSelectedCity: (city: NonNullable<SalatakState['selectedCity']>) => void;
  setLastReadSurah: (surahId: string) => void;
  setLastReadVerse: (verse: number) => void;
  setPrayerMethod: (method: PrayerMethod) => void;
  setAsrMadhab: (madhab: 'shafi' | 'hanafi') => void;
  setPrayerOffset: (prayer: PrayerId, minutes: number) => void;
  setHijriOffset: (offset: number) => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setQuranTextSize: (size: number) => void;
  setPrayerNotification: (prayer: PrayerId, enabled: boolean) => void;
  setNotificationLeadMinutes: (minutes: number) => void;
  resetSettings: () => void;
};

const initialState: SalatakState = {
  completedPrayers: {},
  bookmarks: [],
  rakahCount: 0,
  tasbihCount: 0,
  tasbihTarget: 33,
  readAzkar: [],
  notificationsEnabled: true,
  stateDate: '',
  selectedCity: null,
  lastReadSurah: null,
  lastReadVerse: 0,
  prayerMethod: 'tehran',
  asrMadhab: 'shafi',
  prayerOffsets: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  hijriOffset: 0,
  timeFormat: '24h',
  quranTextSize: 22,
  prayerNotifications: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  notificationLeadMinutes: 0,
};

const SalatakContext = createContext<SalatakContextValue | null>(null);

export function SalatakProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SalatakState>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try {
            const saved = sanitizeState(JSON.parse(stored));
            setState(saved.stateDate === getDayKey(new Date()) ? saved : { ...saved, ...dailyDefaults(), stateDate: getDayKey(new Date()) });
          } catch {
            setState({ ...initialState, stateDate: getDayKey(new Date()) });
          }
        }
        else setState({ ...initialState, stateDate: getDayKey(new Date()) });
      })
      .finally(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady) return undefined;
    const timer = setInterval(() => {
      const today = getDayKey(new Date());
      setState((current) => {
        if (current.stateDate === today) return current;
        const next = { ...current, ...dailyDefaults(), stateDate: today };
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }, 60_000);
    return () => clearInterval(timer);
  }, [isReady]);

  const persist = (next: SalatakState) => {
    const sanitized = sanitizeState(next);
    setState(sanitized);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  };

  const value = useMemo<SalatakContextValue>(
    () => ({
      ...state,
      isReady,
      togglePrayer: (prayerId) => {
        const completedPrayers = {
          ...state.completedPrayers,
          [prayerId]: !state.completedPrayers[prayerId],
        };
        persist({
          ...state,
          completedPrayers,
        });
      },
      toggleBookmark: (itemId) => {
        const bookmarks = state.bookmarks.includes(itemId)
          ? state.bookmarks.filter((bookmark) => bookmark !== itemId)
          : [...state.bookmarks, itemId];
        persist({ ...state, bookmarks });
      },
      isBookmarked: (itemId) => state.bookmarks.includes(itemId),
      incrementRakah: () => persist({ ...state, rakahCount: state.rakahCount + 1 }),
      resetRakah: () => persist({ ...state, rakahCount: 0 }),
      incrementTasbih: () => persist({ ...state, tasbihCount: state.tasbihCount + 1 }),
      resetTasbih: () => persist({ ...state, tasbihCount: 0 }),
      setTasbihTarget: (target) => persist({ ...state, tasbihTarget: target }),
      toggleAzkarRead: (itemId) => {
        const readAzkar = state.readAzkar.includes(itemId)
          ? state.readAzkar.filter((id) => id !== itemId)
          : [...state.readAzkar, itemId];
        persist({ ...state, readAzkar });
      },
      isAzkarRead: (itemId) => state.readAzkar.includes(itemId),
      toggleNotifications: () => persist({ ...state, notificationsEnabled: !state.notificationsEnabled }),
      setSelectedCity: (city) => persist({ ...state, selectedCity: city }),
      setLastReadSurah: (surahId) => persist({ ...state, lastReadSurah: surahId }),
      setLastReadVerse: (verse) => persist({ ...state, lastReadVerse: verse }),
      setPrayerMethod: (prayerMethod) => persist({ ...state, prayerMethod }),
      setAsrMadhab: (asrMadhab) => persist({ ...state, asrMadhab }),
      setPrayerOffset: (prayer, minutes) => persist({ ...state, prayerOffsets: { ...state.prayerOffsets, [prayer]: minutes } }),
      setHijriOffset: (hijriOffset) => persist({ ...state, hijriOffset: Math.max(-2, Math.min(2, hijriOffset)) }),
      setTimeFormat: (timeFormat) => persist({ ...state, timeFormat }),
      setQuranTextSize: (quranTextSize) => persist({ ...state, quranTextSize: Math.max(16, Math.min(32, quranTextSize)) }),
      setPrayerNotification: (prayer, enabled) => persist({ ...state, prayerNotifications: { ...state.prayerNotifications, [prayer]: enabled } }),
      setNotificationLeadMinutes: (notificationLeadMinutes) => persist({ ...state, notificationLeadMinutes: normalizeNotificationLeadMinutes(notificationLeadMinutes) }),
      resetSettings: () => persist({ ...state, ...settingsDefaults }),
    }),
    [isReady, state],
  );

  return <SalatakContext.Provider value={value}>{children}</SalatakContext.Provider>;
}

const settingsDefaults = {
  prayerMethod: initialState.prayerMethod,
  asrMadhab: initialState.asrMadhab,
  prayerOffsets: initialState.prayerOffsets,
  hijriOffset: initialState.hijriOffset,
  timeFormat: initialState.timeFormat,
  quranTextSize: initialState.quranTextSize,
  prayerNotifications: initialState.prayerNotifications,
  notificationLeadMinutes: initialState.notificationLeadMinutes,
};

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dailyDefaults(): Pick<SalatakState, 'completedPrayers' | 'rakahCount' | 'readAzkar'> {
  return { completedPrayers: {}, rakahCount: 0, readAzkar: [] };
}

function normalizeNotificationLeadMinutes(value: number): number {
  if (!Number.isFinite(value)) return initialState.notificationLeadMinutes;
  return Math.max(MIN_NOTIFICATION_LEAD_MINUTES, Math.min(MAX_NOTIFICATION_LEAD_MINUTES, Math.trunc(value)));
}

function sanitizeState(value: unknown): SalatakState {
  const saved = isRecord(value) ? value : {};
  const selectedCity = isRecord(saved.selectedCity)
    && typeof saved.selectedCity.id === 'string'
    && typeof saved.selectedCity.name === 'string'
    && typeof saved.selectedCity.country === 'string'
    && isFiniteNumber(saved.selectedCity.latitude)
    && isFiniteNumber(saved.selectedCity.longitude)
    ? {
        id: saved.selectedCity.id,
        name: saved.selectedCity.name,
        country: saved.selectedCity.country,
        latitude: saved.selectedCity.latitude,
        longitude: saved.selectedCity.longitude,
      }
    : initialState.selectedCity;

  return {
    completedPrayers: booleanRecord(saved.completedPrayers),
    bookmarks: stringArray(saved.bookmarks),
    rakahCount: nonNegativeInteger(saved.rakahCount, initialState.rakahCount),
    tasbihCount: nonNegativeInteger(saved.tasbihCount, initialState.tasbihCount),
    tasbihTarget: positiveInteger(saved.tasbihTarget, initialState.tasbihTarget),
    readAzkar: stringArray(saved.readAzkar),
    notificationsEnabled: booleanValue(saved.notificationsEnabled, initialState.notificationsEnabled),
    stateDate: typeof saved.stateDate === 'string' ? saved.stateDate : initialState.stateDate,
    selectedCity,
    lastReadSurah: typeof saved.lastReadSurah === 'string' ? saved.lastReadSurah : null,
    lastReadVerse: nonNegativeInteger(saved.lastReadVerse, initialState.lastReadVerse),
    prayerMethod: saved.prayerMethod === 'qom' ? 'qom' : initialState.prayerMethod,
    asrMadhab: saved.asrMadhab === 'hanafi' ? 'hanafi' : initialState.asrMadhab,
    prayerOffsets: prayerNumberRecord(saved.prayerOffsets, initialState.prayerOffsets),
    hijriOffset: boundedInteger(saved.hijriOffset, -2, 2, initialState.hijriOffset),
    timeFormat: saved.timeFormat === '12h' ? '12h' : '24h',
    quranTextSize: boundedInteger(saved.quranTextSize, 16, 32, initialState.quranTextSize),
    prayerNotifications: booleanRecordWithDefaults(saved.prayerNotifications, initialState.prayerNotifications),
    notificationLeadMinutes: normalizeNotificationLeadMinutes(numberValue(saved.notificationLeadMinutes, initialState.notificationLeadMinutes)),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function numberValue(value: unknown, fallback: number): number {
  return isFiniteNumber(value) ? value : fallback;
}

function boundedInteger(value: unknown, min: number, max: number, fallback: number): number {
  return Math.max(min, Math.min(max, Math.trunc(numberValue(value, fallback))));
}

function nonNegativeInteger(value: unknown, fallback: number): number {
  return Math.max(0, Math.trunc(numberValue(value, fallback)));
}

function positiveInteger(value: unknown, fallback: number): number {
  return Math.max(1, Math.trunc(numberValue(value, fallback)));
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function booleanRecord(value: unknown): Record<string, boolean> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'),
  );
}

function booleanRecordWithDefaults(value: unknown, defaults: Record<PrayerId, boolean>): Record<PrayerId, boolean> {
  const saved = booleanRecord(value);
  return PRAYER_IDS.reduce(
    (result, prayer) => ({ ...result, [prayer]: saved[prayer] ?? defaults[prayer] }),
    {} as Record<PrayerId, boolean>,
  );
}

function prayerNumberRecord(value: unknown, defaults: Record<PrayerId, number>): Record<PrayerId, number> {
  const saved = isRecord(value) ? value : {};
  return PRAYER_IDS.reduce(
    (result, prayer) => ({
      ...result,
      [prayer]: boundedInteger(saved[prayer], -30, 30, defaults[prayer]),
    }),
    {} as Record<PrayerId, number>,
  );
}

export function useSalatak() {
  const context = useContext(SalatakContext);
  if (!context) {
    throw new Error('useSalatak must be used within SalatakProvider');
  }
  return context;
}