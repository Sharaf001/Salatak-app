# Content provenance and review log

Every text, image, and audio asset shipped by Salatak must have a source,
license, reviewer, and review date recorded here. A blank reviewer or date
means the asset is not approved for release.

| Asset | Path | Source | License | Reviewer | Review date | Status |
|---|---|---|---|---|---|---|
| Quran verses, all 114 surahs | `artifacts/salatak/data/quran-verses.json` | Al Quran Cloud `quran-uthmani`; generation script in `artifacts/salatak/scripts/download-quran.mjs` | Confirm source terms before release | Pending | Pending | Not signed off |
| Religious texts, all entries | `artifacts/salatak/data/religious-texts.json` | ShiaCompanion; source URLs are stored per entry | MIT per repository attribution | Pending | Pending | Not signed off |
| Fallback duas, azkar, and ziyarat | `artifacts/salatak/data/religious-content.ts` | Local fallback copy; entries overridden by `religious-texts.json` where available | Review required; source attribution pending per entry | Pending | Pending | Not signed off |
| Hijri occasions | `artifacts/salatak/data/islamic-occasions.ts` | Maintained calendar data | Review by qualified local authority | Pending | Pending | Not signed off |
| Prayer method notes and labels | `artifacts/salatak/hooks/usePrayerTimes.ts`, `artifacts/salatak/hooks/prayerCalculator.ts` | Tehran/Qom calculation assumptions documented in source | Review by qualified prayer-times authority | Pending | Pending | Not signed off |
| Dua recordings, all listed files | `artifacts/salatak/data/dua-audio.ts` | Internet Archive collection linked in `SOURCES.md` | Redistribution permission required | Pending | Pending | Not signed off |
| Quran recordings | `artifacts/salatak/app/(tabs)/quran.tsx` | Islamic Network / Al Quran Cloud | Confirm current redistribution terms | Pending | Pending | Not signed off |
| Wallpaper `wp-1` | `artifacts/salatak/assets/wallpapers/wp-1.jpg` | Wikimedia Commons; details in `wallpaperCredits.ts` | Public domain | Pending | Pending | Not signed off |
| Wallpaper `wp-2` | `artifacts/salatak/assets/wallpapers/wp-2.jpg` | Wikimedia Commons; details in `wallpaperCredits.ts` | CC BY-SA 4.0 | Pending | Pending | Not signed off |
| Wallpaper `wp-3` | `artifacts/salatak/assets/wallpapers/wp-3.png` | Wikimedia Commons; details in `wallpaperCredits.ts` | CC BY-SA 4.0 | Pending | Pending | Not signed off |
| Wallpaper `wp-4` | `artifacts/salatak/assets/wallpapers/wp-4.jpg` | Wikimedia Commons; details in `wallpaperCredits.ts` | CC BY-SA 4.0 | Pending | Pending | Not signed off |
| Wallpaper `wp-5` | `artifacts/salatak/assets/wallpapers/wp-5.jpg` | Wikimedia Commons; details in `wallpaperCredits.ts` | Public domain | Pending | Pending | Not signed off |
| Wallpaper `wp-6` | `artifacts/salatak/assets/wallpapers/wp-6.jpg` | Wikimedia Commons; details in `wallpaperCredits.ts` | CC0 1.0 | Pending | Pending | Not signed off |
| App icon and adaptive icon | `artifacts/salatak/assets/images/` | Project artwork | Project-owned; confirm ownership | Pending | Pending | Not signed off |

## Release rule

Do not ship a release while any row has `Pending` reviewer/date or
`Not signed off` status. Replace those values with the named reviewer,
ISO-8601 review date, and `Approved` after the review is complete.

## Bundle-size baseline

Measured on 2026-11-11 from the checked-out app source:

| Component | Bytes | MiB |
|---|---:|---:|
| `quran-verses.json` | 1,373,293 | 1.31 |
| Wallpapers | 2,624,614 | 2.50 |
| Entire `artifacts/salatak` tree | 8,276,163 | 7.89 |

Record a new measurement in this table for every release and investigate
unexpected increases before approval.
