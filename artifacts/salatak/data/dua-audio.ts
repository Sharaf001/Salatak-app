export type DuaAudio = {
  url: string;
  sourceUrl: string;
  reciter: string;
};

export const DUA_AUDIO: Record<string, DuaAudio> = {
  'dua-kumayl': {
    url: 'https://mp3.duas.org/kumail.mp3',
    sourceUrl: 'https://www.duas.org/ereaderpdfs/kumayl.htm',
    reciter: 'أباذر الحلواجي',
  },
};
