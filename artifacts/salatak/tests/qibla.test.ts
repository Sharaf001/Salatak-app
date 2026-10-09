import assert from 'node:assert/strict';
import test from 'node:test';
import { getQiblaBearing, getRelativeBearing } from '../lib/qibla';

test('calculates the expected Qibla bearing from Beirut', () => {
  const bearing = getQiblaBearing(33.8938, 35.5018);
  assert.ok(Math.abs(bearing - 161.9) < 0.1, `expected about 161.9°, got ${bearing}`);
});

test('normalizes relative compass rotation across north', () => {
  assert.equal(getRelativeBearing(10, 350), 20);
  assert.equal(getRelativeBearing(350, 10), 340);
});
