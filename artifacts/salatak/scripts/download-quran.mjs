/**
 * Downloads the complete Quran text (all 114 surahs) into data/quran-verses.json.
 *
 * Source: the free Al Quran Cloud API (api.alquran.cloud), "quran-uthmani" edition.
 * Run once from artifacts/salatak:   node scripts/download-quran.mjs
 * (needs Node 18+ and an internet connection)
 *
 * The file is only written if EVERY surah has exactly the official number of
 * verses (6,236 in total) and no verse is empty, so you never end up with a
 * half-downloaded Quran.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const URL_ALL = "https://api.alquran.cloud/v1/quran/quran-uthmani";
const EXPECTED = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];

export function convert(payload) {
  const surahs = payload?.data?.surahs;
  if (!Array.isArray(surahs) || surahs.length !== 114) {
    throw new Error("Unexpected response: expected 114 surahs");
  }
  const out = {};
  let total = 0;
  for (const surah of surahs) {
    const n = surah.number;
    const ayahs = surah.ayahs ?? [];
    if (ayahs.length !== EXPECTED[n - 1]) {
      throw new Error(`Surah ${n}: got ${ayahs.length} verses, expected ${EXPECTED[n - 1]}`);
    }
    ayahs.forEach((a, i) => {
      if (a.numberInSurah !== i + 1) throw new Error(`Surah ${n}: verse order problem at ${i + 1}`);
      if (!a.text || !a.text.trim()) throw new Error(`Surah ${n} verse ${i + 1} is empty`);
    });
    out[String(n)] = ayahs.map((a) => a.text.trim());
    total += ayahs.length;
  }
  if (total !== 6236) throw new Error(`Total verses ${total}, expected 6236`);
  return out;
}

async function main() {
  console.log("Downloading the Quran text...");
  const res = await fetch(URL_ALL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const data = convert(await res.json());
  const here = dirname(fileURLToPath(import.meta.url));
  const dir = join(here, "..", "data");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "quran-verses.json"), JSON.stringify(data));
  console.log("Done: 114 surahs, 6236 verses written to data/quran-verses.json");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
}
