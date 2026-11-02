import test from 'node:test';
import assert from 'node:assert/strict';
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

test('Leva uses a later Maghrib angle than Tehran', () => {
  const coordinates = new Coordinates(34.6416, 50.8746);
  const date = new Date('2026-11-02T00:00:00Z');
  const tehranParams = CalculationMethod.Tehran();
  tehranParams.madhab = Madhab.Shafi;
  const levaParams = CalculationMethod.Tehran();
  levaParams.fajrAngle = 16;
  levaParams.ishaAngle = 14;
  levaParams.maghribAngle = 4;
  levaParams.madhab = Madhab.Shafi;
  const tehran = new PrayerTimes(coordinates, date, tehranParams);
  const leva = new PrayerTimes(coordinates, date, levaParams);
  assert.ok(leva.maghrib.getTime() < tehran.maghrib.getTime());
});

test('Leva uses the documented angles', () => {
  const params = CalculationMethod.Tehran();
  params.fajrAngle = 16;
  params.ishaAngle = 14;
  params.maghribAngle = 4;
  assert.equal(params.fajrAngle, 16);
  assert.equal(params.ishaAngle, 14);
  assert.equal(params.maghribAngle, 4);
});
