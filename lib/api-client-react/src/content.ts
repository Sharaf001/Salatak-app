import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";
import type { ErrorType } from "./custom-fetch";

// ---------------------------------------------------------------------------
// Types (kept in sync by hand with lib/db/src/schema/content.ts — if the
// schema changes, update these too)
// ---------------------------------------------------------------------------

export interface Surah {
  id: number;
  slug: string;
  number: string;
  name: string;
  english: string;
  verseCount: number;
  revelationType: string;
  excerpt: string;
  verses: string[];
}

export interface Dua {
  id: number;
  slug: string;
  category: string;
  title: string;
  body: string;
  count: string;
}

export interface Azkar {
  id: number;
  slug: string;
  category: string;
  title: string;
  body: string;
  count: string;
}

export interface Ziyarat {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body: string | null;
}

export interface Wallpaper {
  id: number;
  slug: string;
  category: string;
  title: string;
  imageUrl: string;
}

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
    });
  };
}

export const useSurahs = makeListHook<Surah>("/api/surahs", "surahs");
export const useDuas = makeListHook<Dua>("/api/duas", "duas");
export const useAzkar = makeListHook<Azkar>("/api/azkar", "azkar");
export const useZiyarat = makeListHook<Ziyarat>("/api/ziyarat", "ziyarat");
export const useWallpapers = makeListHook<Wallpaper>("/api/wallpapers", "wallpapers");
