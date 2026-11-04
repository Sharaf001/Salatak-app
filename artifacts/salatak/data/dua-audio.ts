export type DuaAudio = {
  url: string;
  sourceUrl: string;
  reciter: string;
};

export const DUA_AUDIO: Record<string, DuaAudio> = {
  'dua-morning': {
    url: 'https://archive.org/download/duas-abather-al-halwachi/Dua%20Sabah%20-%20Abather%20Al%20Halwachi%20-%20Dua%27s%20Abather%20Al%20Halwachi.mp3',
    sourceUrl: 'https://archive.org/details/duas-abather-al-halwachi',
    reciter: 'أباذر الحلواجي',
  },
  'dua-kumayl': {
    url: 'https://archive.org/download/duas-abather-al-halwachi/Dua%20e%20Kumayl%20-%20Abather%20Al%20Halwachi%20-%20Dua%27s%20Abather%20Al%20Halwachi.mp3',
    sourceUrl: 'https://archive.org/details/duas-abather-al-halwachi',
    reciter: 'أباذر الحلواجي',
  },
  'dua-tawassul': {
    url: 'https://archive.org/download/duas-abather-al-halwachi/Dua%20e%20Tawassul%20-%20Abather%20Al%20Halwachi%20-%20Dua%27s%20Abather%20Al%20Halwachi.mp3',
    sourceUrl: 'https://archive.org/details/duas-abather-al-halwachi',
    reciter: 'أباذر الحلواجي',
  },
};
