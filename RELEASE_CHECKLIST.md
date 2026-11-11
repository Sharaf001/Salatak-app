# Release checklist

## Automated gates

- [ ] Typecheck
- [ ] Tests
- [ ] `expo-doctor`
- [ ] `expo install --check`
- [ ] Preview EAS build succeeds
- [ ] Every content/image/audio row in `CONTENT_LOG.md` has a named reviewer,
  ISO-8601 review date, and `Approved` status
- [ ] Record the release bundle size and compare it with the baseline in
  `CONTENT_LOG.md`

## Device matrix

Install the preview build on real physical devices and test in light and dark
mode on:

- [ ] iOS 26 device
- [ ] Older supported iPhone
- [ ] Low-end Android phone (keep this device for the blur/performance check)
- [ ] Arabic-language phone
- [ ] English-language phone

Do not substitute simulators or emulators for the release device pass. The
device matrix must be repeated for each release, including dark mode.

Verify prayer notifications, location permission, Quran/dua streaming,
background playback, city search, Hijri offset, settings validation, and
wallpaper saving.

## Tab bar validation

- [ ] Verify the classic Android tab bar blur on a low-end Android phone.
- [ ] Verify iOS 26 uses native tabs with Liquid Glass on an iOS 26 device.
- [ ] Verify older iOS and Android use the classic tab layout and consistent
  Feather icons.

## Accessibility validation

Run a screen-reader pass on real devices with large text sizes enabled:

- [ ] VoiceOver on an iOS device
- [ ] TalkBack on an Android device
- [ ] Large text/dynamic type on iOS, including the largest practical size
- [ ] Largest supported font/display size on Android
- [ ] Verify every primary action has a meaningful spoken label and focus
  order, including prayer ticks, audio controls, tabs, settings, and links.
- [ ] Verify text remains readable, controls remain reachable, and no content
  is clipped or hidden at large sizes.

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
  drill against an isolated restore target.
- [ ] Confirm the Neon password was rotated after the restore drill and the
  deployment secret was updated.
- [ ] Confirm Sentry source maps uploaded using the EAS secret token.
- [ ] Trigger a non-production test crash and verify it arrives in Sentry with
  readable source locations.
- [ ] Confirm API uptime alerts and EAS credential backups are active.

## Merge protection

- [ ] GitHub `main` branch protection requires the
  `Salatak checks / typecheck-and-test` CI check to pass before merging.
- [ ] Require pull requests and dismiss stale approvals when repository policy
  allows.
