# Salatak / صلاتك

This is the editable Expo mobile app source for Salatak.

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

The main app files are in `artifacts/salatak/app/`. Local app data such as bookmarks,
completed prayers, and the rak'ah counter is stored with AsyncStorage.