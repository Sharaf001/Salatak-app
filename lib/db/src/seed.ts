/**
 * One-time / repeatable seed script for the content tables.
 *
 * Run with: pnpm --filter @workspace/db run seed
 * (requires DATABASE_URL to be set, and `pnpm --filter @workspace/db run push`
 * to have already created the tables)
 *
 * Safe to re-run: each row is upserted by its unique `slug`.
 */
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

const surahs: InsertSurah[] = [
  { slug: "surah-1", number: "٠١", name: "الفاتحة", english: "Al-Fatihah", verseCount: 7, revelationType: "مكية", excerpt: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", verses: [] },
  { slug: "surah-2", number: "٠٢", name: "البقرة", english: "Al-Baqarah", verseCount: 286, revelationType: "مدنية", excerpt: "الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ", verses: [] },
  { slug: "surah-18", number: "١٨", name: "الكهف", english: "Al-Kahf", verseCount: 110, revelationType: "مكية", excerpt: "الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ", verses: [] },
  {
    slug: "surah-36",
    number: "٣٦",
    name: "يس",
    english: "Ya-Sin",
    verseCount: 83,
    revelationType: "مكية",
    excerpt: "يس ۝ وَالْقُرْآنِ الْحَكِيمِ",
    verses: [
      "يس ۝ وَالْقُرْآنِ الْحَكِيمِ",
      "إِنَّكَ لَمِنَ الْمُرْسَلِينَ",
      "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
      "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ",
      "لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ",
    ],
  },
  { slug: "surah-55", number: "٥٥", name: "الرحمن", english: "Ar-Rahman", verseCount: 78, revelationType: "مدنية", excerpt: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ", verses: [] },
  { slug: "surah-67", number: "٦٧", name: "الملك", english: "Al-Mulk", verseCount: 30, revelationType: "مكية", excerpt: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ", verses: [] },
  { slug: "surah-112", number: "١١٢", name: "الإخلاص", english: "Al-Ikhlas", verseCount: 4, revelationType: "مكية", excerpt: "قُلْ هُوَ اللَّهُ أَحَدٌ", verses: [] },
];

const duas: InsertDua[] = [
  { slug: "dua-morning", category: "الصباح", title: "دعاء الصباح", body: "اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت وإليك النشور.", count: "مرة واحدة" },
  { slug: "dua-rizq", category: "الصباح", title: "طلب الرزق", body: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.", count: "٣ مرات" },
  { slug: "dua-evening", category: "المساء", title: "دعاء المساء", body: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", count: "مرة واحدة" },
  { slug: "dua-sujood", category: "الصلاة", title: "دعاء السجود", body: "سبحان ربي الأعلى وبحمده، اللهم اغفر لي وارحمني واهدني وعافني وارزقني.", count: "في السجود" },
];

const azkar: InsertAzkar[] = [
  { slug: "azkar-morning-1", category: "الصباح", title: "سيد الاستغفار", body: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت.", count: "مرة واحدة" },
  { slug: "azkar-morning-2", category: "الصباح", title: "أذكار الصباح", body: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", count: "مرة واحدة" },
  { slug: "azkar-morning-3", category: "الصباح", title: "تسبيح الصباح", body: "سبحان الله وبحمده، سبحان الله العظيم.", count: "١٠٠ مرة" },
  { slug: "azkar-evening-1", category: "المساء", title: "أذكار المساء", body: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.", count: "مرة واحدة" },
  { slug: "azkar-evening-2", category: "المساء", title: "آية الكرسي", body: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ.", count: "مرة واحدة" },
  { slug: "azkar-prayer-1", category: "بعد الصلاة", title: "تسبيح فاطمة الزهراء", body: "الله أكبر (٣٤ مرة)، الحمد لله (٣٣ مرة)، سبحان الله (٣٣ مرة).", count: "بعد كل صلاة" },
  { slug: "azkar-prayer-2", category: "بعد الصلاة", title: "دعاء بعد الصلاة", body: "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.", count: "مرة واحدة" },
];

const ziyarat: InsertZiyarat[] = [
  { slug: "ziyarat-hussain", category: "عامة", title: "زيارة الإمام الحسين (ع)", excerpt: "السلام عليك يا أبا عبد الله، السلام عليك يا ابن رسول الله..." },
  { slug: "ziyarat-nabi", category: "عامة", title: "زيارة النبي الأكرم (ص)", excerpt: "السلام عليك أيها النبي ورحمة الله وبركاته، السلام عليك يا رسول الله..." },
  { slug: "ziyarat-abbas", category: "عامة", title: "زيارة العباس (ع)", excerpt: "السلام عليك أيها العبد الصالح، المطيع لله ولرسوله..." },
  { slug: "ziyarat-al-yasin", category: "عامة", title: "زيارة آل ياسين", excerpt: "السلام عليك يا داعي الله وربّاني آياته..." },
  { slug: "ziyarat-ashura", category: "عامة", title: "زيارة عاشوراء", excerpt: "السلام عليك يا أبا عبد الله، السلام عليك وعلى الأرواح التي حلّت بفنائك..." },
  { slug: "ziyarat-saturday", category: "أيام الأسبوع", title: "زيارة يوم السبت", excerpt: "مخصصة للإمام علي بن أبي طالب (ع)" },
  { slug: "ziyarat-sunday", category: "أيام الأسبوع", title: "زيارة يوم الأحد", excerpt: "مخصصة للإمام الحسن بن علي (ع)" },
  { slug: "ziyarat-thursday", category: "أيام الأسبوع", title: "زيارة يوم الخميس", excerpt: "مخصصة للإمام موسى الكاظم (ع)" },
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
