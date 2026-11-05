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
  saving, third-party audio streaming, and optional API requests as applicable.
- [ ] Google Play Data Safety answers match the same behavior.
- [ ] Recheck `PRIVACY.md` and `SOURCES.md`.
- [ ] Confirm Neon password rotation, automated backups, and a recent restore
  test.
- [ ] Confirm Sentry, API uptime alerts, and EAS credential backups are active.
