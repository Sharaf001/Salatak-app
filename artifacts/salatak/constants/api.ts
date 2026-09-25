import { setBaseUrl } from '@workspace/api-client-react';

/**
 * Points the API client at your API server.
 *
 * Set EXPO_PUBLIC_API_URL in a .env file at artifacts/salatak/.env, e.g.:
 *   EXPO_PUBLIC_API_URL=http://192.168.1.23:5000
 *
 * Use your computer's LAN IP (not "localhost") when testing on a physical
 * phone with Expo Go, since "localhost" on the phone refers to the phone
 * itself. Find your LAN IP with `ipconfig` (Windows) — look for IPv4 Address
 * — then run the API server with `pnpm --filter @workspace/api-server run dev`.
 *
 * If EXPO_PUBLIC_API_URL isn't set, API calls fail and every screen falls
 * back to its bundled local content (see each screen's FALLBACK_* constant).
 */
export function initApiClient() {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (url) {
    setBaseUrl(url);
  }
}
