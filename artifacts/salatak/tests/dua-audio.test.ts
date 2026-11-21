import test from 'node:test';
import assert from 'node:assert/strict';
import { isDuaAudioApproved, type DuaAudio } from '../data/dua-audio';

const baseAudio: DuaAudio = {
  url: 'https://example.com/dua.mp3',
  sourceUrl: 'https://example.com/dua',
  reciter: 'Test reciter',
  license: 'cc0',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
};

test('accepts only recordings with verifiable approved licenses or contracts', () => {
  assert.equal(isDuaAudioApproved(baseAudio), true);
  assert.equal(isDuaAudioApproved({ ...baseAudio, licenseUrl: undefined }), false);
  assert.equal(isDuaAudioApproved({ ...baseAudio, license: 'written-contract', contractUrl: 'https://example.com/contract' }), true);
  assert.equal(isDuaAudioApproved({ ...baseAudio, license: 'written-contract', contractUrl: undefined }), false);
  assert.equal(isDuaAudioApproved({ ...baseAudio, license: 'commercial-with-credit', credit: 'Test credit' }), true);
  assert.equal(isDuaAudioApproved({ ...baseAudio, license: 'commercial-with-credit', credit: undefined }), false);
});

