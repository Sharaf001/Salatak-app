/**
 * One-time / repeatable seed script for the content tables.
 *
 * Run with: pnpm --filter @workspace/db run seed
 * (requires DATABASE_URL to be set, and `pnpm --filter @workspace/db run push`
 * to have already created the tables)
 *
 * Safe to re-run: each row is upserted by its unique `slug`.
 */
import { readFileSync } from "node:fs";
import { db, pool } from "./index";
import {
  surahsTable,
  duasTable,
  azkarTable,
  ziyaratTable,
  wallpapersTable,
  type InsertSurah,
  type InsertDua,
  type InsertAzkar,
  type InsertZiyarat,
  type InsertWallpaper,
} from "./schema/content";

// Verse text comes from artifacts/salatak/data/quran-verses.json — the same
// file the app reads. Fill it with the complete Quran by running
// `node scripts/download-quran.mjs` inside artifacts/salatak, then re-run seed.
const versesFile = JSON.parse(
  readFileSync(new URL("../../../artifacts/salatak/data/quran-verses.json", import.meta.url), "utf-8"),
) as Record<string, string[]>;
function versesFor(n: number): string[] {
  return versesFile[String(n)] ?? [];
}

const surahs: InsertSurah[] = [
  { slug: "surah-1", number: "٠١", name: "الفاتحة", english: "Al-Fatihah", verseCount: 7, revelationType: "مكية", excerpt: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", verses: versesFor(1) },
  { slug: "surah-2", number: "٠٢", name: "البقرة", english: "Al-Baqarah", verseCount: 286, revelationType: "مدنية", excerpt: "الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", verses: versesFor(2) },
  { slug: "surah-3", number: "٠٣", name: "آل عمران", english: "Aal-e-Imran", verseCount: 200, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(3) },
  { slug: "surah-4", number: "٠٤", name: "النساء", english: "An-Nisa", verseCount: 176, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(4) },
  { slug: "surah-5", number: "٠٥", name: "المائدة", english: "Al-Ma'idah", verseCount: 120, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(5) },
  { slug: "surah-6", number: "٠٦", name: "الأنعام", english: "Al-An'am", verseCount: 165, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(6) },
  { slug: "surah-7", number: "٠٧", name: "الأعراف", english: "Al-A'raf", verseCount: 206, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(7) },
  { slug: "surah-8", number: "٠٨", name: "الأنفال", english: "Al-Anfal", verseCount: 75, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(8) },
  { slug: "surah-9", number: "٠٩", name: "التوبة", english: "At-Tawbah", verseCount: 129, revelationType: "مدنية", excerpt: "بَرَاءَةٌ مِنَ اللَّهِ وَرَسُولِهِ إِلَى الَّذِينَ عَاهَدْتُمْ مِنَ الْمُشْرِكِينَ", verses: versesFor(9) },
  { slug: "surah-10", number: "١٠", name: "يونس", english: "Yunus", verseCount: 109, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(10) },
  { slug: "surah-11", number: "١١", name: "هود", english: "Hud", verseCount: 123, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(11) },
  { slug: "surah-12", number: "١٢", name: "يوسف", english: "Yusuf", verseCount: 111, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(12) },
  { slug: "surah-13", number: "١٣", name: "الرعد", english: "Ar-Ra'd", verseCount: 43, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(13) },
  { slug: "surah-14", number: "١٤", name: "إبراهيم", english: "Ibrahim", verseCount: 52, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(14) },
  { slug: "surah-15", number: "١٥", name: "الحجر", english: "Al-Hijr", verseCount: 99, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(15) },
  { slug: "surah-16", number: "١٦", name: "النحل", english: "An-Nahl", verseCount: 128, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(16) },
  { slug: "surah-17", number: "١٧", name: "الإسراء", english: "Al-Isra", verseCount: 111, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(17) },
  { slug: "surah-18", number: "١٨", name: "الكهف", english: "Al-Kahf", verseCount: 110, revelationType: "مكية", excerpt: "الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ", verses: versesFor(18) },
  { slug: "surah-19", number: "١٩", name: "مريم", english: "Maryam", verseCount: 98, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(19) },
  { slug: "surah-20", number: "٢٠", name: "طه", english: "Taha", verseCount: 135, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(20) },
  { slug: "surah-21", number: "٢١", name: "الأنبياء", english: "Al-Anbiya", verseCount: 112, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(21) },
  { slug: "surah-22", number: "٢٢", name: "الحج", english: "Al-Hajj", verseCount: 78, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(22) },
  { slug: "surah-23", number: "٢٣", name: "المؤمنون", english: "Al-Mu'minun", verseCount: 118, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(23) },
  { slug: "surah-24", number: "٢٤", name: "النور", english: "An-Nur", verseCount: 64, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(24) },
  { slug: "surah-25", number: "٢٥", name: "الفرقان", english: "Al-Furqan", verseCount: 77, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(25) },
  { slug: "surah-26", number: "٢٦", name: "الشعراء", english: "Ash-Shu'ara", verseCount: 227, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(26) },
  { slug: "surah-27", number: "٢٧", name: "النمل", english: "An-Naml", verseCount: 93, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(27) },
  { slug: "surah-28", number: "٢٨", name: "القصص", english: "Al-Qasas", verseCount: 88, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(28) },
  { slug: "surah-29", number: "٢٩", name: "العنكبوت", english: "Al-Ankabut", verseCount: 69, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(29) },
  { slug: "surah-30", number: "٣٠", name: "الروم", english: "Ar-Rum", verseCount: 60, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(30) },
  { slug: "surah-31", number: "٣١", name: "لقمان", english: "Luqman", verseCount: 34, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(31) },
  { slug: "surah-32", number: "٣٢", name: "السجدة", english: "As-Sajdah", verseCount: 30, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(32) },
  { slug: "surah-33", number: "٣٣", name: "الأحزاب", english: "Al-Ahzab", verseCount: 73, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(33) },
  { slug: "surah-34", number: "٣٤", name: "سبأ", english: "Saba", verseCount: 54, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(34) },
  { slug: "surah-35", number: "٣٥", name: "فاطر", english: "Fatir", verseCount: 45, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(35) },
  { slug: "surah-36", number: "٣٦", name: "يس", english: "Ya-Sin", verseCount: 83, revelationType: "مكية", excerpt: "يس ۝ وَالْقُرْآنِ الْحَكِيمِ", verses: versesFor(36) },
  { slug: "surah-37", number: "٣٧", name: "الصافات", english: "As-Saffat", verseCount: 182, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(37) },
  { slug: "surah-38", number: "٣٨", name: "ص", english: "Sad", verseCount: 88, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(38) },
  { slug: "surah-39", number: "٣٩", name: "الزمر", english: "Az-Zumar", verseCount: 75, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(39) },
  { slug: "surah-40", number: "٤٠", name: "غافر", english: "Ghafir", verseCount: 85, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(40) },
  { slug: "surah-41", number: "٤١", name: "فصلت", english: "Fussilat", verseCount: 54, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(41) },
  { slug: "surah-42", number: "٤٢", name: "الشورى", english: "Ash-Shura", verseCount: 53, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(42) },
  { slug: "surah-43", number: "٤٣", name: "الزخرف", english: "Az-Zukhruf", verseCount: 89, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(43) },
  { slug: "surah-44", number: "٤٤", name: "الدخان", english: "Ad-Dukhan", verseCount: 59, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(44) },
  { slug: "surah-45", number: "٤٥", name: "الجاثية", english: "Al-Jathiyah", verseCount: 37, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(45) },
  { slug: "surah-46", number: "٤٦", name: "الأحقاف", english: "Al-Ahqaf", verseCount: 35, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(46) },
  { slug: "surah-47", number: "٤٧", name: "محمد", english: "Muhammad", verseCount: 38, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(47) },
  { slug: "surah-48", number: "٤٨", name: "الفتح", english: "Al-Fath", verseCount: 29, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(48) },
  { slug: "surah-49", number: "٤٩", name: "الحجرات", english: "Al-Hujurat", verseCount: 18, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(49) },
  { slug: "surah-50", number: "٥٠", name: "ق", english: "Qaf", verseCount: 45, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(50) },
  { slug: "surah-51", number: "٥١", name: "الذاريات", english: "Adh-Dhariyat", verseCount: 60, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(51) },
  { slug: "surah-52", number: "٥٢", name: "الطور", english: "At-Tur", verseCount: 49, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(52) },
  { slug: "surah-53", number: "٥٣", name: "النجم", english: "An-Najm", verseCount: 62, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(53) },
  { slug: "surah-54", number: "٥٤", name: "القمر", english: "Al-Qamar", verseCount: 55, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(54) },
  { slug: "surah-55", number: "٥٥", name: "الرحمن", english: "Ar-Rahman", verseCount: 78, revelationType: "مدنية", excerpt: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ", verses: versesFor(55) },
  { slug: "surah-56", number: "٥٦", name: "الواقعة", english: "Al-Waqi'ah", verseCount: 96, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(56) },
  { slug: "surah-57", number: "٥٧", name: "الحديد", english: "Al-Hadid", verseCount: 29, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(57) },
  { slug: "surah-58", number: "٥٨", name: "المجادلة", english: "Al-Mujadila", verseCount: 22, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(58) },
  { slug: "surah-59", number: "٥٩", name: "الحشر", english: "Al-Hashr", verseCount: 24, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(59) },
  { slug: "surah-60", number: "٦٠", name: "الممتحنة", english: "Al-Mumtahanah", verseCount: 13, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(60) },
  { slug: "surah-61", number: "٦١", name: "الصف", english: "As-Saff", verseCount: 14, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(61) },
  { slug: "surah-62", number: "٦٢", name: "الجمعة", english: "Al-Jumu'ah", verseCount: 11, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(62) },
  { slug: "surah-63", number: "٦٣", name: "المنافقون", english: "Al-Munafiqun", verseCount: 11, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(63) },
  { slug: "surah-64", number: "٦٤", name: "التغابن", english: "At-Taghabun", verseCount: 18, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(64) },
  { slug: "surah-65", number: "٦٥", name: "الطلاق", english: "At-Talaq", verseCount: 12, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(65) },
  { slug: "surah-66", number: "٦٦", name: "التحريم", english: "At-Tahrim", verseCount: 12, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(66) },
  { slug: "surah-67", number: "٦٧", name: "الملك", english: "Al-Mulk", verseCount: 30, revelationType: "مكية", excerpt: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ", verses: versesFor(67) },
  { slug: "surah-68", number: "٦٨", name: "القلم", english: "Al-Qalam", verseCount: 52, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(68) },
  { slug: "surah-69", number: "٦٩", name: "الحاقة", english: "Al-Haqqah", verseCount: 52, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(69) },
  { slug: "surah-70", number: "٧٠", name: "المعارج", english: "Al-Ma'arij", verseCount: 44, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(70) },
  { slug: "surah-71", number: "٧١", name: "نوح", english: "Nuh", verseCount: 28, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(71) },
  { slug: "surah-72", number: "٧٢", name: "الجن", english: "Al-Jinn", verseCount: 28, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(72) },
  { slug: "surah-73", number: "٧٣", name: "المزمل", english: "Al-Muzzammil", verseCount: 20, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(73) },
  { slug: "surah-74", number: "٧٤", name: "المدثر", english: "Al-Muddaththir", verseCount: 56, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(74) },
  { slug: "surah-75", number: "٧٥", name: "القيامة", english: "Al-Qiyamah", verseCount: 40, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(75) },
  { slug: "surah-76", number: "٧٦", name: "الإنسان", english: "Al-Insan", verseCount: 31, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(76) },
  { slug: "surah-77", number: "٧٧", name: "المرسلات", english: "Al-Mursalat", verseCount: 50, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(77) },
  { slug: "surah-78", number: "٧٨", name: "النبأ", english: "An-Naba", verseCount: 40, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(78) },
  { slug: "surah-79", number: "٧٩", name: "النازعات", english: "An-Nazi'at", verseCount: 46, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(79) },
  { slug: "surah-80", number: "٨٠", name: "عبس", english: "Abasa", verseCount: 42, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(80) },
  { slug: "surah-81", number: "٨١", name: "التكوير", english: "At-Takwir", verseCount: 29, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(81) },
  { slug: "surah-82", number: "٨٢", name: "الإنفطار", english: "Al-Infitar", verseCount: 19, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(82) },
  { slug: "surah-83", number: "٨٣", name: "المطففين", english: "Al-Mutaffifin", verseCount: 36, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(83) },
  { slug: "surah-84", number: "٨٤", name: "الإنشقاق", english: "Al-Inshiqaq", verseCount: 25, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(84) },
  { slug: "surah-85", number: "٨٥", name: "البروج", english: "Al-Buruj", verseCount: 22, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(85) },
  { slug: "surah-86", number: "٨٦", name: "الطارق", english: "At-Tariq", verseCount: 17, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(86) },
  { slug: "surah-87", number: "٨٧", name: "الأعلى", english: "Al-A'la", verseCount: 19, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(87) },
  { slug: "surah-88", number: "٨٨", name: "الغاشية", english: "Al-Ghashiyah", verseCount: 26, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(88) },
  { slug: "surah-89", number: "٨٩", name: "الفجر", english: "Al-Fajr", verseCount: 30, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(89) },
  { slug: "surah-90", number: "٩٠", name: "البلد", english: "Al-Balad", verseCount: 20, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(90) },
  { slug: "surah-91", number: "٩١", name: "الشمس", english: "Ash-Shams", verseCount: 15, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(91) },
  { slug: "surah-92", number: "٩٢", name: "الليل", english: "Al-Layl", verseCount: 21, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(92) },
  { slug: "surah-93", number: "٩٣", name: "الضحى", english: "Ad-Duha", verseCount: 11, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(93) },
  { slug: "surah-94", number: "٩٤", name: "الشرح", english: "Ash-Sharh", verseCount: 8, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(94) },
  { slug: "surah-95", number: "٩٥", name: "التين", english: "At-Tin", verseCount: 8, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(95) },
  { slug: "surah-96", number: "٩٦", name: "العلق", english: "Al-Alaq", verseCount: 19, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(96) },
  { slug: "surah-97", number: "٩٧", name: "القدر", english: "Al-Qadr", verseCount: 5, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(97) },
  { slug: "surah-98", number: "٩٨", name: "البينة", english: "Al-Bayyinah", verseCount: 8, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(98) },
  { slug: "surah-99", number: "٩٩", name: "الزلزلة", english: "Az-Zalzalah", verseCount: 8, revelationType: "مدنية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(99) },
  { slug: "surah-100", number: "١٠٠", name: "العاديات", english: "Al-Adiyat", verseCount: 11, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(100) },
  { slug: "surah-101", number: "١٠١", name: "القارعة", english: "Al-Qari'ah", verseCount: 11, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(101) },
  { slug: "surah-102", number: "١٠٢", name: "التكاثر", english: "At-Takathur", verseCount: 8, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(102) },
  { slug: "surah-103", number: "١٠٣", name: "العصر", english: "Al-Asr", verseCount: 3, revelationType: "مكية", excerpt: "وَالْعَصْرِ", verses: versesFor(103) },
  { slug: "surah-104", number: "١٠٤", name: "الهمزة", english: "Al-Humazah", verseCount: 9, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(104) },
  { slug: "surah-105", number: "١٠٥", name: "الفيل", english: "Al-Fil", verseCount: 5, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(105) },
  { slug: "surah-106", number: "١٠٦", name: "قريش", english: "Quraysh", verseCount: 4, revelationType: "مكية", excerpt: "لِإِيلَافِ قُرَيْشٍ", verses: versesFor(106) },
  { slug: "surah-107", number: "١٠٧", name: "الماعون", english: "Al-Ma'un", verseCount: 7, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(107) },
  { slug: "surah-108", number: "١٠٨", name: "الكوثر", english: "Al-Kawthar", verseCount: 3, revelationType: "مكية", excerpt: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", verses: versesFor(108) },
  { slug: "surah-109", number: "١٠٩", name: "الكافرون", english: "Al-Kafirun", verseCount: 6, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(109) },
  { slug: "surah-110", number: "١١٠", name: "النصر", english: "An-Nasr", verseCount: 3, revelationType: "مدنية", excerpt: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", verses: versesFor(110) },
  { slug: "surah-111", number: "١١١", name: "المسد", english: "Al-Masad", verseCount: 5, revelationType: "مكية", excerpt: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", verses: versesFor(111) },
  { slug: "surah-112", number: "١١٢", name: "الإخلاص", english: "Al-Ikhlas", verseCount: 4, revelationType: "مكية", excerpt: "قُلْ هُوَ اللَّهُ أَحَدٌ", verses: versesFor(112) },
  { slug: "surah-113", number: "١١٣", name: "الفلق", english: "Al-Falaq", verseCount: 5, revelationType: "مكية", excerpt: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", verses: versesFor(113) },
  { slug: "surah-114", number: "١١٤", name: "الناس", english: "An-Nas", verseCount: 6, revelationType: "مكية", excerpt: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", verses: versesFor(114) },
];

// Arabic text references checked against:
// https://supplications.al-islam.org/ and
// https://www.al-islam.org/commentary-kumayl-supplication-husayn-ansariyan/complete-text-dua-kumayl-arabic-trasliteration-and
// https://www.al-islam.org/file/dua-al-tawassul-arabic-text-english-translation
// The app displays short, source-preserving excerpts; full texts should be
// added to `body` before presenting them as complete prayers.
const duas: InsertDua[] = [
  { slug: "dua-morning", category: "الصباح", title: "دعاء الصباح", body: "اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت وإليك النشور.", count: "مرة واحدة" },
  { slug: "dua-rizq", category: "الصباح", title: "طلب الرزق", body: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.", count: "٣ مرات" },
  { slug: "dua-evening", category: "المساء", title: "دعاء المساء", body: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", count: "مرة واحدة" },
  { slug: "dua-sujood", category: "الصلاة", title: "دعاء السجود", body: "سبحان ربي الأعلى وبحمده، اللهم اغفر لي وارحمني واهدني وعافني وارزقني.", count: "في السجود" },
  { slug: "dua-kumayl", category: "الصلاة", title: "دعاء كميل", body: "اللهم إني أسألك برحمتك التي وسعت كل شيء، وبقوتك التي قهرت بها كل شيء، وخضع لها كل شيء، وذل لها كل شيء.", count: "ليلة الجمعة" },
  { slug: "dua-tawassul", category: "الصلاة", title: "دعاء التوسل", body: "اللهم إني أسألك وأتوجه إليك بنبيك نبي الرحمة، محمد صلى الله عليه وآله، يا أبا القاسم يا رسول الله، يا إمام الرحمة.", count: "عند الحاجة" },
  { slug: "dua-nudba", category: "الصباح", title: "دعاء الندبة", body: "الحمد لله رب العالمين، وصلى الله على سيدنا محمد نبيه وآله وسلم تسليماً.", count: "صباح الجمعة" },
  { slug: "dua-faraj", category: "الصلاة", title: "دعاء الفرج", body: "إلهي عظم البلاء، وبرح الخفاء، وانكشف الغطاء، وانقطع الرجاء، وضاقت الأرض ومنعت السماء.", count: "عند الشدة" },
  { slug: "dua-arafah", category: "الصلاة", title: "دعاء عرفة", body: "الحمد لله الذي ليس لقضائه دافع، ولا لعطائه مانع، ولا كصنعه صنع صانع، وهو الجواد الواسع.", count: "يوم عرفة" },
  { slug: "dua-makarim", category: "الصلاة", title: "مكارم الأخلاق", body: "اللهم صل على محمد وآل محمد، وبلغ بإيماني أكمل الإيمان، واجعل يقيني أفضل اليقين.", count: "في كل وقت" },
];

const azkar: InsertAzkar[] = [
  { slug: "azkar-morning-1", category: "الصباح", title: "سيد الاستغفار", body: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت.", count: "مرة واحدة" },
  { slug: "azkar-morning-2", category: "الصباح", title: "أذكار الصباح", body: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", count: "مرة واحدة" },
  { slug: "azkar-morning-3", category: "الصباح", title: "تسبيح الصباح", body: "سبحان الله وبحمده، سبحان الله العظيم.", count: "١٠٠ مرة" },
  { slug: "azkar-evening-1", category: "المساء", title: "أذكار المساء", body: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", count: "مرة واحدة" },
  { slug: "azkar-evening-2", category: "المساء", title: "آية الكرسي", body: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ.", count: "مرة واحدة" },
  { slug: "azkar-prayer-1", category: "بعد الصلاة", title: "تسبيح فاطمة الزهراء", body: "الله أكبر (٣٤ مرة)، الحمد لله (٣٣ مرة)، سبحان الله (٣٣ مرة).", count: "بعد كل صلاة" },
  { slug: "azkar-prayer-2", category: "بعد الصلاة", title: "دعاء بعد الصلاة", body: "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.", count: "مرة واحدة" },
  { slug: "azkar-morning-4", category: "الصباح", title: "الصلاة على محمد وآله", body: "اللهم صل على محمد وآل محمد.", count: "١٠ مرات" },
  { slug: "azkar-morning-5", category: "الصباح", title: "الاستعاذة", body: "أعوذ بكلمات الله التامات من شر ما خلق.", count: "٣ مرات" },
  { slug: "azkar-evening-3", category: "المساء", title: "سورة الإخلاص", body: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ.", count: "٣ مرات" },
  { slug: "azkar-evening-4", category: "المساء", title: "سورة الفلق", body: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ.", count: "٣ مرات" },
  { slug: "azkar-evening-5", category: "المساء", title: "سورة الناس", body: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ.", count: "٣ مرات" },
  { slug: "azkar-prayer-3", category: "بعد الصلاة", title: "الاستغفار", body: "أستغفر الله ربي وأتوب إليه.", count: "٣ مرات" },
];

// Ziyarat references checked against:
// https://supplications.al-islam.org/ziaraat/ziarat-ashura.php
// https://www.al-islam.org/bn/file/ziyarat-amin-allah-arabic-text-english-translation
// https://www.al-islam.org/ziarat-warith-ziyaraat-ahlul-bayt/ziyarat-warith-arabic-text
// https://supplications.al-islam.org/
const ziyarat: InsertZiyarat[] = [
  { slug: "ziyarat-hussain", category: "عامة", title: "زيارة الإمام الحسين (ع)", excerpt: "السلام عليك يا أبا عبد الله، السلام عليك يا ابن رسول الله..." },
  { slug: "ziyarat-nabi", category: "عامة", title: "زيارة النبي الأكرم (ص)", excerpt: "السلام عليك أيها النبي ورحمة الله وبركاته، السلام عليك يا رسول الله..." },
  { slug: "ziyarat-abbas", category: "عامة", title: "زيارة العباس (ع)", excerpt: "السلام عليك أيها العبد الصالح، المطيع لله ولرسوله..." },
  { slug: "ziyarat-al-yasin", category: "عامة", title: "زيارة آل ياسين", excerpt: "السلام عليك يا داعي الله وربّاني آياته..." },
  { slug: "ziyarat-ashura", category: "عامة", title: "زيارة عاشوراء", excerpt: "السلام عليك يا أبا عبد الله، السلام عليك وعلى الأرواح التي حلّت بفنائك..." },
  { slug: "ziyarat-amin-allah", category: "عامة", title: "زيارة أمين الله", excerpt: "السلام عليك يا أمين الله في أرضه، وحجته على عباده، السلام عليك يا أمير المؤمنين..." },
  { slug: "ziyarat-warith", category: "عامة", title: "زيارة وارث", excerpt: "السلام عليك يا وارث آدم صفوة الله، السلام عليك يا وارث نوح نبي الله..." },
  { slug: "ziyarat-jamia-kabira", category: "عامة", title: "الزيارة الجامعة الكبيرة", excerpt: "السلام عليكم يا أهل بيت النبوة، وموضع الرسالة، ومختلف الملائكة، ومهبط الوحي..." },
  { slug: "ziyarat-imam-rida", category: "عامة", title: "زيارة الإمام الرضا (ع)", excerpt: "السلام عليك يا ولي الله، السلام عليك يا حجة الله، السلام عليك يا نور الله في ظلمات الأرض..." },
  { slug: "ziyarat-saturday", category: "أيام الأسبوع", title: "زيارة يوم السبت", excerpt: "مخصصة لرسول الله محمد (ص)" },
  { slug: "ziyarat-sunday", category: "أيام الأسبوع", title: "زيارة يوم الأحد", excerpt: "مخصصة لأمير المؤمنين علي بن أبي طالب (ع)" },
  { slug: "ziyarat-monday", category: "أيام الأسبوع", title: "زيارة يوم الاثنين", excerpt: "مخصصة للإمام الحسين والإمام زين العابدين (ع)" },
  { slug: "ziyarat-tuesday", category: "أيام الأسبوع", title: "زيارة يوم الثلاثاء", excerpt: "مخصصة للإمام محمد الباقر والإمام جعفر الصادق (ع)" },
  { slug: "ziyarat-wednesday", category: "أيام الأسبوع", title: "زيارة يوم الأربعاء", excerpt: "مخصصة للأئمة موسى الكاظم وعلي الرضا ومحمد الجواد وعلي الهادي والحسن العسكري (ع)" },
  { slug: "ziyarat-thursday", category: "أيام الأسبوع", title: "زيارة يوم الخميس", excerpt: "مخصصة للسيدة فاطمة الزهراء (ع)" },
  { slug: "ziyarat-friday", category: "أيام الأسبوع", title: "زيارة يوم الجمعة", excerpt: "مخصصة للإمام المهدي (عج)" },
];

const wallpapers: InsertWallpaper[] = [
  { slug: "wp-1", category: "المراقد المقدسة", title: "مقام كربلاء", imageUrl: "https://picsum.photos/seed/salatak-shrine-1/400/600" },
  { slug: "wp-2", category: "المراقد المقدسة", title: "مقام النجف", imageUrl: "https://picsum.photos/seed/salatak-shrine-2/400/600" },
  { slug: "wp-3", category: "مناسبات", title: "ليالي رمضان", imageUrl: "https://picsum.photos/seed/salatak-ramadan-1/400/600" },
  { slug: "wp-4", category: "مناسبات", title: "ليلة القدر", imageUrl: "https://picsum.photos/seed/salatak-ramadan-2/400/600" },
  { slug: "wp-5", category: "المراقد المقدسة", title: "الحرم العباسي", imageUrl: "https://picsum.photos/seed/salatak-shrine-3/400/600" },
  { slug: "wp-6", category: "مناسبات", title: "عيد الفطر", imageUrl: "https://picsum.photos/seed/salatak-eid-1/400/600" },
];

// Simple "replace all" seeding: clears each table and re-inserts. Safe to
// re-run whenever you edit the arrays in this file — just run
// `pnpm --filter @workspace/db run seed` again.
async function main() {
  await db.delete(surahsTable);
  await db.insert(surahsTable).values(surahs);
  console.log(`Seeded ${surahs.length} rows into surahs`);

  await db.delete(duasTable);
  await db.insert(duasTable).values(duas);
  console.log(`Seeded ${duas.length} rows into duas`);

  await db.delete(azkarTable);
  await db.insert(azkarTable).values(azkar);
  console.log(`Seeded ${azkar.length} rows into azkar`);

  await db.delete(ziyaratTable);
  await db.insert(ziyaratTable).values(ziyarat);
  console.log(`Seeded ${ziyarat.length} rows into ziyarat`);

  await db.delete(wallpapersTable);
  await db.insert(wallpapersTable).values(wallpapers);
  console.log(`Seeded ${wallpapers.length} rows into wallpapers`);
}

main()
  .then(() => {
    console.log("Seed complete.");
    return pool.end();
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    return pool.end().finally(() => process.exit(1));
  });
