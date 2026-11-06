# Release checklist

## Automated gates

- [ ] Typecheck
- [ ] Tests
- [ ] `expo-doctor`
- [ ] `expo install --check`
- [ ] Preview EAS build succeeds

## Device matrix

Install the preview build and test in light and dark mode on:

- [ ] iOS 26 device
- [ ] Older supported iPhone
- [ ] Low-end Android
- [ ] Arabic-language phone
- [ ] English-language phone

Verify prayer notifications, location permission, Quran/dua streaming,
background playback, city search, Hijri offset, settings validation, and
wallpaper saving.

## Store disclosures

- [ ] Apple privacy labels include location, notifications, photo-library
  saving, third-party audio streaming, crash diagnostics, and optional API
  requests as applicable.
- [ ] Google Play Data Safety answers include crash diagnostics and match the
  same behavior.
- [ ] Recheck `PRIVACY.md` and `SOURCES.md`.
- [ ] Obtain written redistribution permission for the dua recordings or
  replace them with licensed audio before release.
- [ ] Confirm Neon password rotation, automated backups, and a recent restore
  test.
- [ ] Confirm Sentry, API uptime alerts, and EAS credential backups are active.
