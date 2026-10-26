# Salatak / صلاتك

This is the editable Expo mobile app source for Salatak.

## Store identity

The native application identifiers are:

- iOS: `com.sharaf001.salatakprayer`
- Android: `com.sharaf001.salatakprayer`

The store privacy policy is available at
[PRIVACY.md](../../PRIVACY.md). The EAS build profiles are defined in
[`eas.json`](./eas.json).

## Open on a PC

1. Install Node.js 20 or newer.
2. Install pnpm:

   ```bash
   npm install -g pnpm
   ```

3. From the extracted project folder, install dependencies:

   ```bash
   pnpm install
   ```

4. Start the app locally:

   ```bash
   pnpm --filter @workspace/salatak run dev:local
   ```

5. To open the web version in a browser:

   ```bash
   pnpm --filter @workspace/salatak exec expo start --web
   ```

6. To preview on a phone, install Expo Go and scan the QR code shown by Expo.

Prayer notifications require an Android standalone build; they are not
supported by Expo Go on Android. With EAS configured, build an installable
preview APK with:

```bash
eas build --profile preview --platform android
```

The main app files are in `artifacts/salatak/app/`. Local app data such as bookmarks,
completed prayers, and the rak'ah counter is stored with AsyncStorage.

## Religious text attribution

The Arabic religious texts in `data/religious-texts.json` include material
from [ShiaCompanion](https://github.com/saeedjassani/ShiaCompanion), licensed
under the MIT License, Copyright (c) 2020 Saeed Jassani. The required MIT
notice is retained through the source URLs stored with each entry. The
Makarim al-Akhlaq excerpt is attributed separately to Sahifa Sajjadiya 20.

The Hijri calendar and occasions are calculated estimates based on the civil
calendar. Local moon-sighting authorities may determine dates one day earlier
or later.