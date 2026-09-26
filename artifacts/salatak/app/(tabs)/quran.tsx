import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSurahs } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

// Bundled offline content — see the comment in duas.tsx for why this exists.
const FALLBACK_READER_VERSES = [
  'يس ۝ وَالْقُرْآنِ الْحَكِيمِ',
  'إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
  'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ',
  'تَنزِيلَ الْعَزِيزِ الرَّحِيمِ',
  'لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ',
];

const PLACEHOLDER_READER_VERSES = [
  'نص هذه السورة لم يُضَف بعد إلى النسخة غير المتصلة من التطبيق.',
];

const FALLBACK_SURAHS = [
  { id: 'surah-1', number: '٠١', name: 'الفاتحة', english: "Al-Fatihah", verses: 7, type: 'مكية', excerpt: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', readerVerses: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    'الرَّحْمَٰنِ الرَّحِيمِ',
    'مَالِكِ يَوْمِ الدِّينِ',
    'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
  ] },
  { id: 'surah-2', number: '٠٢', name: 'البقرة', english: "Al-Baqarah", verses: 286, type: 'مدنية', excerpt: 'الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-3', number: '٠٣', name: 'آل عمران', english: "Aal-e-Imran", verses: 200, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-4', number: '٠٤', name: 'النساء', english: "An-Nisa", verses: 176, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-5', number: '٠٥', name: 'المائدة', english: "Al-Ma'idah", verses: 120, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-6', number: '٠٦', name: 'الأنعام', english: "Al-An'am", verses: 165, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-7', number: '٠٧', name: 'الأعراف', english: "Al-A'raf", verses: 206, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-8', number: '٠٨', name: 'الأنفال', english: "Al-Anfal", verses: 75, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-9', number: '٠٩', name: 'التوبة', english: "At-Tawbah", verses: 129, type: 'مدنية', excerpt: 'بَرَاءَةٌ مِنَ اللَّهِ وَرَسُولِهِ إِلَى الَّذِينَ عَاهَدْتُمْ مِنَ الْمُشْرِكِينَ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-10', number: '١٠', name: 'يونس', english: "Yunus", verses: 109, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-11', number: '١١', name: 'هود', english: "Hud", verses: 123, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-12', number: '١٢', name: 'يوسف', english: "Yusuf", verses: 111, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-13', number: '١٣', name: 'الرعد', english: "Ar-Ra'd", verses: 43, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-14', number: '١٤', name: 'إبراهيم', english: "Ibrahim", verses: 52, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-15', number: '١٥', name: 'الحجر', english: "Al-Hijr", verses: 99, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-16', number: '١٦', name: 'النحل', english: "An-Nahl", verses: 128, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-17', number: '١٧', name: 'الإسراء', english: "Al-Isra", verses: 111, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-18', number: '١٨', name: 'الكهف', english: "Al-Kahf", verses: 110, type: 'مكية', excerpt: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-19', number: '١٩', name: 'مريم', english: "Maryam", verses: 98, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-20', number: '٢٠', name: 'طه', english: "Taha", verses: 135, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-21', number: '٢١', name: 'الأنبياء', english: "Al-Anbiya", verses: 112, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-22', number: '٢٢', name: 'الحج', english: "Al-Hajj", verses: 78, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-23', number: '٢٣', name: 'المؤمنون', english: "Al-Mu'minun", verses: 118, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-24', number: '٢٤', name: 'النور', english: "An-Nur", verses: 64, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-25', number: '٢٥', name: 'الفرقان', english: "Al-Furqan", verses: 77, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-26', number: '٢٦', name: 'الشعراء', english: "Ash-Shu'ara", verses: 227, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-27', number: '٢٧', name: 'النمل', english: "An-Naml", verses: 93, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-28', number: '٢٨', name: 'القصص', english: "Al-Qasas", verses: 88, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-29', number: '٢٩', name: 'العنكبوت', english: "Al-Ankabut", verses: 69, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-30', number: '٣٠', name: 'الروم', english: "Ar-Rum", verses: 60, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-31', number: '٣١', name: 'لقمان', english: "Luqman", verses: 34, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-32', number: '٣٢', name: 'السجدة', english: "As-Sajdah", verses: 30, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-33', number: '٣٣', name: 'الأحزاب', english: "Al-Ahzab", verses: 73, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-34', number: '٣٤', name: 'سبأ', english: "Saba", verses: 54, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-35', number: '٣٥', name: 'فاطر', english: "Fatir", verses: 45, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-36', number: '٣٦', name: 'يس', english: "Ya-Sin", verses: 83, type: 'مكية', excerpt: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-37', number: '٣٧', name: 'الصافات', english: "As-Saffat", verses: 182, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-38', number: '٣٨', name: 'ص', english: "Sad", verses: 88, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-39', number: '٣٩', name: 'الزمر', english: "Az-Zumar", verses: 75, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-40', number: '٤٠', name: 'غافر', english: "Ghafir", verses: 85, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-41', number: '٤١', name: 'فصلت', english: "Fussilat", verses: 54, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-42', number: '٤٢', name: 'الشورى', english: "Ash-Shura", verses: 53, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-43', number: '٤٣', name: 'الزخرف', english: "Az-Zukhruf", verses: 89, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-44', number: '٤٤', name: 'الدخان', english: "Ad-Dukhan", verses: 59, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-45', number: '٤٥', name: 'الجاثية', english: "Al-Jathiyah", verses: 37, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-46', number: '٤٦', name: 'الأحقاف', english: "Al-Ahqaf", verses: 35, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-47', number: '٤٧', name: 'محمد', english: "Muhammad", verses: 38, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-48', number: '٤٨', name: 'الفتح', english: "Al-Fath", verses: 29, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-49', number: '٤٩', name: 'الحجرات', english: "Al-Hujurat", verses: 18, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-50', number: '٥٠', name: 'ق', english: "Qaf", verses: 45, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-51', number: '٥١', name: 'الذاريات', english: "Adh-Dhariyat", verses: 60, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-52', number: '٥٢', name: 'الطور', english: "At-Tur", verses: 49, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-53', number: '٥٣', name: 'النجم', english: "An-Najm", verses: 62, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-54', number: '٥٤', name: 'القمر', english: "Al-Qamar", verses: 55, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-55', number: '٥٥', name: 'الرحمن', english: "Ar-Rahman", verses: 78, type: 'مدنية', excerpt: 'الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-56', number: '٥٦', name: 'الواقعة', english: "Al-Waqi'ah", verses: 96, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-57', number: '٥٧', name: 'الحديد', english: "Al-Hadid", verses: 29, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-58', number: '٥٨', name: 'المجادلة', english: "Al-Mujadila", verses: 22, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-59', number: '٥٩', name: 'الحشر', english: "Al-Hashr", verses: 24, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-60', number: '٦٠', name: 'الممتحنة', english: "Al-Mumtahanah", verses: 13, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-61', number: '٦١', name: 'الصف', english: "As-Saff", verses: 14, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-62', number: '٦٢', name: 'الجمعة', english: "Al-Jumu'ah", verses: 11, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-63', number: '٦٣', name: 'المنافقون', english: "Al-Munafiqun", verses: 11, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-64', number: '٦٤', name: 'التغابن', english: "At-Taghabun", verses: 18, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-65', number: '٦٥', name: 'الطلاق', english: "At-Talaq", verses: 12, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-66', number: '٦٦', name: 'التحريم', english: "At-Tahrim", verses: 12, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-67', number: '٦٧', name: 'الملك', english: "Al-Mulk", verses: 30, type: 'مكية', excerpt: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-68', number: '٦٨', name: 'القلم', english: "Al-Qalam", verses: 52, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-69', number: '٦٩', name: 'الحاقة', english: "Al-Haqqah", verses: 52, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-70', number: '٧٠', name: 'المعارج', english: "Al-Ma'arij", verses: 44, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-71', number: '٧١', name: 'نوح', english: "Nuh", verses: 28, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-72', number: '٧٢', name: 'الجن', english: "Al-Jinn", verses: 28, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-73', number: '٧٣', name: 'المزمل', english: "Al-Muzzammil", verses: 20, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-74', number: '٧٤', name: 'المدثر', english: "Al-Muddaththir", verses: 56, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-75', number: '٧٥', name: 'القيامة', english: "Al-Qiyamah", verses: 40, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-76', number: '٧٦', name: 'الإنسان', english: "Al-Insan", verses: 31, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-77', number: '٧٧', name: 'المرسلات', english: "Al-Mursalat", verses: 50, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-78', number: '٧٨', name: 'النبأ', english: "An-Naba", verses: 40, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-79', number: '٧٩', name: 'النازعات', english: "An-Nazi'at", verses: 46, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-80', number: '٨٠', name: 'عبس', english: "Abasa", verses: 42, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-81', number: '٨١', name: 'التكوير', english: "At-Takwir", verses: 29, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-82', number: '٨٢', name: 'الإنفطار', english: "Al-Infitar", verses: 19, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-83', number: '٨٣', name: 'المطففين', english: "Al-Mutaffifin", verses: 36, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-84', number: '٨٤', name: 'الإنشقاق', english: "Al-Inshiqaq", verses: 25, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-85', number: '٨٥', name: 'البروج', english: "Al-Buruj", verses: 22, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-86', number: '٨٦', name: 'الطارق', english: "At-Tariq", verses: 17, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-87', number: '٨٧', name: 'الأعلى', english: "Al-A'la", verses: 19, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-88', number: '٨٨', name: 'الغاشية', english: "Al-Ghashiyah", verses: 26, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-89', number: '٨٩', name: 'الفجر', english: "Al-Fajr", verses: 30, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-90', number: '٩٠', name: 'البلد', english: "Al-Balad", verses: 20, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-91', number: '٩١', name: 'الشمس', english: "Ash-Shams", verses: 15, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-92', number: '٩٢', name: 'الليل', english: "Al-Layl", verses: 21, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-93', number: '٩٣', name: 'الضحى', english: "Ad-Duha", verses: 11, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-94', number: '٩٤', name: 'الشرح', english: "Ash-Sharh", verses: 8, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-95', number: '٩٥', name: 'التين', english: "At-Tin", verses: 8, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-96', number: '٩٦', name: 'العلق', english: "Al-Alaq", verses: 19, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-97', number: '٩٧', name: 'القدر', english: "Al-Qadr", verses: 5, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-98', number: '٩٨', name: 'البينة', english: "Al-Bayyinah", verses: 8, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-99', number: '٩٩', name: 'الزلزلة', english: "Az-Zalzalah", verses: 8, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-100', number: '١٠٠', name: 'العاديات', english: "Al-Adiyat", verses: 11, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-101', number: '١٠١', name: 'القارعة', english: "Al-Qari'ah", verses: 11, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-102', number: '١٠٢', name: 'التكاثر', english: "At-Takathur", verses: 8, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-103', number: '١٠٣', name: 'العصر', english: "Al-Asr", verses: 3, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-104', number: '١٠٤', name: 'الهمزة', english: "Al-Humazah", verses: 9, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-105', number: '١٠٥', name: 'الفيل', english: "Al-Fil", verses: 5, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-106', number: '١٠٦', name: 'قريش', english: "Quraysh", verses: 4, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-107', number: '١٠٧', name: 'الماعون', english: "Al-Ma'un", verses: 7, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-108', number: '١٠٨', name: 'الكوثر', english: "Al-Kawthar", verses: 3, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-109', number: '١٠٩', name: 'الكافرون', english: "Al-Kafirun", verses: 6, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-110', number: '١١٠', name: 'النصر', english: "An-Nasr", verses: 3, type: 'مدنية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-111', number: '١١١', name: 'المسد', english: "Al-Masad", verses: 5, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-112', number: '١١٢', name: 'الإخلاص', english: "Al-Ikhlas", verses: 4, type: 'مكية', excerpt: 'قُلْ هُوَ اللَّهُ أَحَدٌ', readerVerses: [
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'قُلْ هُوَ اللَّهُ أَحَدٌ',
    'اللَّهُ الصَّمَدُ',
    'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
  ] },
  { id: 'surah-113', number: '١١٣', name: 'الفلق', english: "Al-Falaq", verses: 5, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
  { id: 'surah-114', number: '١١٤', name: 'الناس', english: "An-Nas", verses: 6, type: 'مكية', excerpt: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', readerVerses: PLACEHOLDER_READER_VERSES },
];

export default function QuranScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toggleBookmark, isBookmarked } = useSalatak();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data } = useSurahs();
  const surahs =
    Array.isArray(data) && data.length > 0
      ? data.map((s) => ({
          id: s.slug,
          number: s.number,
          name: s.name,
          english: s.english,
          verses: s.verseCount,
          type: s.revelationType,
          excerpt: s.excerpt,
          readerVerses: s.verses.length > 0 ? s.verses : PLACEHOLDER_READER_VERSES,
        }))
      : FALLBACK_SURAHS;
  const filtered = useMemo(
    () => surahs.filter((surah) => `${surah.name} ${surah.english}`.toLowerCase().includes(query.toLowerCase())),
    [query, surahs],
  );
  const selected = surahs.find((surah) => surah.id === selectedId);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>القراءة والتدبر</Text>
            <Text style={[styles.title, { color: colors.deep }]}>القرآن الكريم</Text>
          </View>
          <Pressable style={[styles.headerIcon, { backgroundColor: colors.secondary }]} onPress={() => toggleBookmark('surah-36')}>
            <Feather name="bookmark" size={19} color={colors.primary} />
          </Pressable>
        </View>

        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="ابحث عن سورة أو آية"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.deep }]}
            textAlign="right"
          />
        </View>

        {selected ? (
          <View style={[styles.readerCard, { backgroundColor: colors.deep }]}>
            <View style={styles.readerHeader}>
              <Pressable onPress={() => setSelectedId(null)} hitSlop={12}>
                <Feather name="chevron-right" size={20} color="#B6D2CB" />
              </Pressable>
              <View style={styles.readerTitle}>
                <Text style={styles.readerSurah}>{selected.name}</Text>
                <Text style={styles.readerMeta}>{selected.english} · {selected.verses} آيات</Text>
              </View>
              <Pressable onPress={() => { void Haptics.selectionAsync(); toggleBookmark(selected.id); }} hitSlop={12}>
                <Feather name="bookmark" size={19} color={isBookmarked(selected.id) ? '#E8C77D' : '#B6D2CB'} />
              </Pressable>
            </View>
            <View style={styles.verseList}>
              {selected.readerVerses.map((verse, index) => (
                <View key={verse} style={styles.verseRow}>
                  <Text style={styles.verseNumber}>{index + 1}</Text>
                  <Text style={styles.verseText}>{verse}</Text>
                </View>
              ))}
            </View>
            <View style={styles.readerFooter}>
              <Text style={styles.readerFooterText}>{selected.verses} آية</Text>
              <Text style={styles.readerFooterText}>{selected.type}</Text>
            </View>
          </View>
        ) : (
          <>
            <Pressable onPress={() => setSelectedId('surah-36')} style={[styles.continueCard, { backgroundColor: colors.cream, borderColor: '#EBD9A8' }]}>
              <View style={[styles.continueIcon, { backgroundColor: '#E9D29C' }]}><Feather name="play" size={16} color={colors.accentForeground} /></View>
              <View style={styles.continueCopy}>
                <Text style={[styles.continueLabel, { color: colors.deepMuted }]}>متابعة القراءة</Text>
                <Text style={[styles.continueTitle, { color: colors.deep }]}>سورة يس</Text>
                <Text style={[styles.continueMeta, { color: colors.deepMuted }]}>٨٣ آية · مكية</Text>
              </View>
              <Text style={[styles.continueProgress, { color: colors.accentForeground }]}>افتح</Text>
            </Pressable>

            <View style={styles.sectionLine}>
              <Text style={[styles.sectionTitle, { color: colors.deep }]}>فهرس السور</Text>
              <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>{filtered.length} سور</Text>
            </View>
            <View style={styles.surahList}>
              {filtered.map((surah) => (
                <Pressable
                  key={surah.id}
                  onPress={() => setSelectedId(surah.id)}
                  style={({ pressed }) => [styles.surahRow, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.72 }]}
                >
                  <View style={[styles.numberBadge, { backgroundColor: colors.secondary }]}><Text style={[styles.numberText, { color: colors.primary }]}>{surah.number}</Text></View>
                  <View style={styles.surahCopy}>
                    <Text style={[styles.surahName, { color: colors.deep }]}>{surah.name}</Text>
                    <Text style={[styles.surahMeta, { color: colors.mutedForeground }]}>{surah.english} · {surah.type} · {surah.verses} آيات</Text>
                    <Text style={[styles.excerpt, { color: colors.deepMuted }]} numberOfLines={1}>{surah.excerpt}</Text>
                  </View>
                  <Feather name={isBookmarked(surah.id) ? 'bookmark' : 'chevron-left'} size={18} color={isBookmarked(surah.id) ? colors.gold : colors.mutedForeground} />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  eyebrow: { textAlign: 'right', fontSize: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  search: { height: 48, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, marginBottom: 17 },
  searchInput: { flex: 1, fontSize: 13, marginLeft: 10 },
  continueCard: { borderRadius: 18, borderWidth: 1, padding: 14, flexDirection: 'row', alignItems: 'center' },
  continueIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  continueCopy: { flex: 1, marginLeft: 11 },
  continueLabel: { fontSize: 11, textAlign: 'right' },
  continueTitle: { fontSize: 17, fontWeight: '700', textAlign: 'right', marginTop: 3 },
  continueMeta: { fontSize: 11, textAlign: 'right', marginTop: 2 },
  continueProgress: { fontSize: 13, fontWeight: '700' },
  sectionLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', textAlign: 'right' },
  sectionMeta: { fontSize: 12 },
  surahList: { gap: 9 },
  surahRow: { minHeight: 84, borderRadius: 17, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center' },
  numberBadge: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 12, fontWeight: '700' },
  surahCopy: { flex: 1, marginLeft: 11 },
  surahName: { fontSize: 17, fontWeight: '700', textAlign: 'right' },
  surahMeta: { fontSize: 10, textAlign: 'right', marginTop: 2 },
  excerpt: { fontSize: 12, textAlign: 'right', marginTop: 5 },
  readerCard: { borderRadius: 22, padding: 17 },
  readerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  readerTitle: { alignItems: 'center' },
  readerSurah: { color: '#FFF9ED', fontSize: 23, fontWeight: '700' },
  readerMeta: { color: '#9EBBB4', fontSize: 11, marginTop: 3 },
  verseList: { marginTop: 22 },
  verseRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', paddingVertical: 13, borderBottomColor: '#376762', borderBottomWidth: StyleSheet.hairlineWidth },
  verseNumber: { color: '#D7A84C', fontSize: 12, width: 22, textAlign: 'center', marginTop: 5 },
  verseText: { color: '#FFF9ED', fontSize: 19, lineHeight: 35, textAlign: 'right', flex: 1 },
  readerFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  readerFooterText: { color: '#9EBBB4', fontSize: 11 },
});