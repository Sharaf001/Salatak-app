export type DuaAudioLicense =
  | 'written-contract'
  | 'public-domain'
  | 'cc0'
  | 'commercial-with-credit';

export type DuaAudio = {
  url: string;
  sourceUrl: string;
  reciter: string;
  license: DuaAudioLicense;
  licenseUrl?: string;
  contractUrl?: string;
  credit?: string;
};

export const DUA_AUDIO: Record<string, DuaAudio> = {
  'dua-morning': {
    url: 'https://archive.org/download/20230916_647/004%20%20%D8%AF%D8%B9%D8%A7%D8%A1%20%D8%A7%D9%84%D8%B5%D8%A8%D8%A7%D8%AD%20-%20%D8%A8%D8%B5%D9%88%D8%AA%20%D8%B3%D8%B9%D8%AF%20%D8%A7%D9%84%D8%BA%D8%A7%D9%85%D8%AF%D9%8A.mp3',
    sourceUrl: 'https://archive.org/details/20230916_647',
    reciter: 'سعد الغامدي',
    license: 'public-domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  'dua-kumayl': {
    url: 'https://archive.org/download/mohammed_201505/%D8%AF%D8%B9%D8%A7%D8%A1%20%D9%83%D9%85%D9%8A%D9%84%20%D8%A7%D9%84%D8%B4%D9%87%D8%B1%D9%88%D8%AF%D9%8A.mp3',
    sourceUrl: 'https://archive.org/details/mohammed_201505',
    reciter: 'دعاء كميل الشهرودي',
    license: 'public-domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
};

export function isDuaAudioApproved(audio: DuaAudio | undefined): audio is DuaAudio {
  if (!audio) return false;

  if (audio.license === 'written-contract') {
    return Boolean(audio.contractUrl?.trim());
  }

  if (audio.license === 'public-domain' || audio.license === 'cc0') {
    return Boolean(audio.licenseUrl?.trim());
  }

  return Boolean(audio.licenseUrl?.trim() && audio.credit?.trim());
}
