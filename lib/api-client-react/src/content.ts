import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { customFetch, isBaseUrlConfigured } from "./custom-fetch";
import type { ErrorType } from "./custom-fetch";
import type {
  Azkar,
  Dua,
  Surah,
  Wallpaper,
  Ziyarat,
} from "./generated/api.schemas";

export type { Azkar, Dua, Surah, Wallpaper, Ziyarat };

// ---------------------------------------------------------------------------
// Hooks — one per resource, all GET /api/<resource>
// ---------------------------------------------------------------------------

function makeListHook<T>(path: string, queryKey: string) {
  return function useResource(options?: {
    query?: Omit<UseQueryOptions<T[], ErrorType<unknown>>, "queryKey" | "queryFn">;
  }) {
    return useQuery<T[], ErrorType<unknown>>({
      queryKey: [queryKey],
      queryFn: ({ signal }) => customFetch<T[]>(path, { signal }),
      ...options?.query,
      enabled: isBaseUrlConfigured() && options?.query?.enabled !== false,
    });
  };
}

export const useSurahs = makeListHook<Surah>("/api/surahs", "surahs");
export const useDuas = makeListHook<Dua>("/api/duas", "duas");
export const useAzkar = makeListHook<Azkar>("/api/azkar", "azkar");
export const useZiyarat = makeListHook<Ziyarat>("/api/ziyarat", "ziyarat");
export const useWallpapers = makeListHook<Wallpaper>("/api/wallpapers", "wallpapers");
