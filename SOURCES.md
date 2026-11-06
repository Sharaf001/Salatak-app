# Sources and licenses

This file is the release inventory for text, audio, and images. Update it when
adding or replacing an asset.

## Religious text

- Quran: `artifacts/salatak/data/quran-verses.json`; source and download
  process are documented by the app's Quran data scripts.
- Arabic religious texts: ShiaCompanion, MIT-licensed; per-entry source URLs
  are stored in `artifacts/salatak/data/religious-texts.json`.
- Prayer calculations and occasions: `artifacts/salatak/hooks/usePrayerTimes.ts`
  and `artifacts/salatak/data/islamic-occasions.ts`; dates are civil-calendar
  estimates and require annual scholarly/local-authority review.

## Audio

- Abather Al-Halwaji dua recordings: Internet Archive collection
  [duas-abather-al-halwachi](https://archive.org/details/duas-abather-al-halwachi);
  exact file URLs and reciter attribution are in
  `artifacts/salatak/data/dua-audio.ts`. Verify redistribution permission
  before release.
- Quran audio: Islamic Network/Al Quran Cloud URLs are defined in
  `artifacts/salatak/app/(tabs)/quran.tsx`; confirm current redistribution
  terms before each store release.

## Images

- Wallpaper authors, licenses, and original Wikimedia URLs are maintained in
  `artifacts/salatak/data/wallpaperCredits.ts`.
