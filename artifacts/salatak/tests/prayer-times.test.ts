import assert from 'node:assert/strict';
import test from 'node:test';
import { Coordinates } from 'adhan';
import { computePrayerTimes } from '../hooks/prayerCalculator';

test('Qom method applies its documented angles and produces an earlier Maghrib', () => {
  const coordinates = new Coordinates(34.6416, 50.8746);
  const date = new Date('2026-11-02T00:00:00Z');
  const tehran = computePrayerTimes(coordinates, date, 'tehran');
  const qom = computePrayerTimes(coordinates, date, 'qom');

  assert.ok(qom.maghrib.getTime() < tehran.maghrib.getTime());
  assert.ok(qom.fajr.getTime() > tehran.fajr.getTime());
});

test('computePrayerTimes applies prayer offsets without changing other prayers', () => {
  const coordinates = new Coordinates(35.6892, 51.389);
  const date = new Date('2026-11-02T00:00:00Z');
  const baseline = computePrayerTimes(coordinates, date);
  const adjusted = computePrayerTimes(coordinates, date, 'tehran', 'shafi', {
    fajr: 5,
    maghrib: -3,
  });

  assert.equal(adjusted.fajr.getTime() - baseline.fajr.getTime(), 5 * 60_000);
  assert.equal(adjusted.maghrib.getTime() - baseline.maghrib.getTime(), -3 * 60_000);
  assert.equal(adjusted.dhuhr.getTime(), baseline.dhuhr.getTime());
});

test('computePrayerTimes supports both Asr madhabs', () => {
  const coordinates = new Coordinates(35.6892, 51.389);
  const date = new Date('2026-11-02T00:00:00Z');
  const shafi = computePrayerTimes(coordinates, date, 'tehran', 'shafi');
  const hanafi = computePrayerTimes(coordinates, date, 'tehran', 'hanafi');

  assert.ok(hanafi.asr.getTime() > shafi.asr.getTime());
});
