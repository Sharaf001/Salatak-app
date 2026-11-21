import { useSyncExternalStore } from 'react';

let readerActive = false;
const listeners = new Set<() => void>();

export function setQuranReaderActive(active: boolean) {
  if (readerActive === active) return;
  readerActive = active;
  listeners.forEach((listener) => listener());
}

export function useQuranReaderActive() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => readerActive,
  );
}
