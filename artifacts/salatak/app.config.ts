import type { ExpoConfig } from 'expo/config';
import appJson from './app.json';

const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim();
const baseConfig = appJson.expo as ExpoConfig;

const config: ExpoConfig = {
  ...baseConfig,
  runtimeVersion: {
    policy: 'appVersion',
  },
  ...(projectId
    ? {
        updates: {
          url: `https://u.expo.dev/${projectId}`,
        },
        extra: {
          ...baseConfig.extra,
          eas: { projectId },
        },
      }
    : {}),
};

export default config;
