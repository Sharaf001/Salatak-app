# Operations

## Secrets and credentials

- Never commit `.env` files, database URLs, EAS tokens, or service credentials.
- Rotate the Neon database password immediately if it was exposed in chat or
  logs, then update the deployment secret and verify the API connection.
- Store EAS credentials in the EAS/CI secret store and back up the recovery
  information securely.
- Set `EXPO_PUBLIC_SENTRY_DSN` only through local or EAS environment secrets.
- Set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` in the EAS build
  environment so Sentry can upload source maps and produce readable stack
  traces. Keep the auth token secret.
- Set `EXPO_PUBLIC_EAS_PROJECT_ID` in the EAS build/update environment. This
  enables the Expo Updates URL without committing project metadata.
- Set the GitHub `EXPO_TOKEN` secret to enable the preview-build job.
- Set the GitHub `API_HEALTH_URL` secret to enable the scheduled uptime check.

## Release verification

- Before a production build, confirm the EAS environment contains the Sentry
  DSN, organization, project, and auth token. Verify the build logs report a
  successful source-map upload.
- Trigger a deliberate test exception in a non-production build and confirm
  the event arrives in the configured Sentry project with readable source
  locations. Do not trigger this against production users.
- Run one Neon backup/restore drill against an isolated restore target. Verify
  the restored database can connect and passes the app's schema checks, then
  rotate the Neon password and update the deployment secret.

## Release cadence

- Upgrade one Expo SDK major version at a time.
- After selecting the target SDK, run `npx expo install --fix` in
  `artifacts/salatak` so Expo packages and React Native remain in lockstep.
- For each release, run the automated gates in CI and complete
  [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).
- Publish JavaScript and content fixes with `eas update --channel
  production`; native changes still require a new build.
- Test the preview build on every listed OS/device/language/dark-mode
  combination before submission.

## Ongoing maintenance

- Monthly, run the workspace typecheck and app tests, then run `expo-doctor`
  and `expo install --check` from `artifacts/salatak`. Review dependency and
  security updates.
- Before Ramadan and Muharram, review
  `artifacts/salatak/data/islamic-occasions.ts` and the configured prayer
  methods.
- Yearly, rotate deployment secrets, change the Neon password if it has not
  been rotated, and re-check Apple and Google store requirements.

## Monitoring and recovery

- Configure Sentry with a project DSN, organization, and project before
  production release. Verify a test crash reaches the intended project and
  source maps produce readable stack traces without collecting unnecessary
  personal data.
- Configure the API health endpoint and alerting owner for the uptime workflow.
- Enable Neon automated backups and periodically perform a restore test.
- Record incidents, credential rotations, and restore tests in the changelog
  or deployment record.

## Annual content review

- Review `artifacts/salatak/data/islamic-occasions.ts` and prayer-method
  assumptions with qualified reviewers/local authorities.
- Review every text, audio, and image attribution in `SOURCES.md` and the
  referenced source files before the annual release.
