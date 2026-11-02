import test from 'node:test';
import assert from 'node:assert/strict';
import colors from '../constants/colors';

test('light and dark themes define the same semantic tokens', () => {
  assert.deepEqual(Object.keys(colors.light).sort(), Object.keys(colors.dark).sort());
  for (const value of Object.values(colors.dark)) assert.equal(typeof value, 'string');
});
