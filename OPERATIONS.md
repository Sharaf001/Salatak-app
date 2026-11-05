# Operations

## Secrets and credentials

- Never commit `.env` files, database URLs, EAS tokens, or service credentials.
- Rotate the Neon database password immediately if it was exposed in chat or
  logs, then update the deployment secret and verify the API connection.
- Store EAS credentials in the EAS/CI secret store and back up the recovery
  information securely.
- Set `EXPO_PUBLIC_SENTRY_DSN` only through local or EAS environment secrets.
- Set the GitHub `EXPO_TOKEN` secret to enable the preview-build job.
- Set the GitHub `API_HEALTH_URL` secret to enable the scheduled uptime check.

## Release cadence

- Upgrade one Expo SDK major version at a time.
- For each release, run the automated gates in CI and complete
  [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).
- Test the preview build on every listed OS/device/language/dark-mode
  combination before submission.

## Monitoring and recovery

- Configure Sentry with a project DSN before production release and verify a
  test crash reaches the intended project without collecting unnecessary
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
