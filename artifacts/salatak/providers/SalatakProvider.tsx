import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@salatak/state';

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
            const saved = { ...initialState, ...JSON.parse(stored) } as SalatakState;
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
    setState(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<SalatakContextValue>(
    () => ({
      ...state,
      isReady,
      togglePrayer: (prayerId) => {
        persist({
          ...state,
          completedPrayers: {
            ...state.completedPrayers,
            [prayerId]: !state.completedPrayers[prayerId],
          },
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
    }),
    [isReady, state],
  );

  return <SalatakContext.Provider value={value}>{children}</SalatakContext.Provider>;
}

function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function dailyDefaults(): Pick<SalatakState, 'completedPrayers' | 'rakahCount' | 'readAzkar'> {
  return { completedPrayers: {}, rakahCount: 0, readAzkar: [] };
}

export function useSalatak() {
  const context = useContext(SalatakContext);
  if (!context) {
    throw new Error('useSalatak must be used within SalatakProvider');
  }
  return context;
}