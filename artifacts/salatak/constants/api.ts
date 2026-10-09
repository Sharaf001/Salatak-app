import { setBaseUrl } from '@workspace/api-client-react';
import Constants from 'expo-constants';

/**
 * Points the API client at your API server. An explicit API URL is useful for
 * hosted environments; during local Expo development we derive the API host
 * from Expo's packager host so a changing LAN address does not need to be
 * copied into an env file.
 *
 * `EXPO_PUBLIC_API_PORT` is optional and defaults to the API server's local
 * port. If neither an explicit URL nor an Expo packager host is available,
 * the API remains unset and screens use their bundled offline content.
 */
export function initApiClient() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const apiPort = process.env.EXPO_PUBLIC_API_PORT?.trim() || '3000';
  const hostUri = Constants.expoConfig?.hostUri;
  const packagerHost = hostUri?.split(':')[0];
  const url = configuredUrl || (packagerHost ? `http://${packagerHost}:${apiPort}` : undefined);

  if (url) {
    setBaseUrl(url);
  }
}
