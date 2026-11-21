# Sources and licenses

This file is the release inventory for text, audio, and images. Update it when
adding or replacing an asset.

The release review table with reviewer sign-off and dates is maintained in
[CONTENT_LOG.md](./CONTENT_LOG.md). Do not ship an asset without an approved
entry there.

## Religious text

- Quran: `artifacts/salatak/data/quran-verses.json`; source and download
  process are documented by the app's Quran data scripts.
- Arabic religious texts: ShiaCompanion, MIT-licensed; per-entry source URLs
  are stored in `artifacts/salatak/data/religious-texts.json`.
- Prayer calculations and occasions: `artifacts/salatak/hooks/usePrayerTimes.ts`
  and `artifacts/salatak/data/islamic-occasions.ts`; dates are civil-calendar
  estimates and require annual scholarly/local-authority review.

## Audio

- Dua recordings: only the exact public-domain matches currently enabled are
  Dua al-Sabah and Dua Kumayl. Their Internet Archive collection licenses are
  recorded in `artifacts/salatak/data/dua-audio.ts`. Other entries remain
  disabled because their redistribution permission has not been verified.
  Before enabling another recording, add it to
  `artifacts/salatak/data/dua-audio.ts` with one of the approved license forms
  and the corresponding contract or license URL.
- Quran audio: Islamic Network/Al Quran Cloud URLs are defined in
  `artifacts/salatak/app/(tabs)/quran.tsx`; confirm current redistribution
  terms before each store release.

## Images

- Wallpaper authors, licenses, and original Wikimedia URLs are maintained in
  `artifacts/salatak/data/wallpaperCredits.ts`.
