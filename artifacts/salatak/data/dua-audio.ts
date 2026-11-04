export type DuaAudio = {
  url: string;
  sourceUrl: string;
};

export const DUA_AUDIO: Record<string, DuaAudio> = {
  'dua-faraj': {
    url: 'https://mp3.duas.org/Namazmasoomeen/namaz-hazrat-imam-mahdi.mp3',
    sourceUrl: 'https://www.duas.org/data_v2/dua-faraj-dua-azumal-bala-imam-mahdi.json',
  },
  'dua-kumayl': {
    url: 'https://mp3.duas.org/kumail-english.mp3',
    sourceUrl: 'https://www.duas.org/data_v2/dua-kumayl.json',
  },
  'dua-nudba': {
    url: 'https://mp3.duas.org/Nudba_AbdulHayyQambar.mp3',
    sourceUrl: 'https://www.duas.org/data_v2/dua-nudbah.json',
  },
};
