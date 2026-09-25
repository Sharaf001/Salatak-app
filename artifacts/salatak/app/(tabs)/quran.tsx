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

const FALLBACK_SURAHS = [
  { id: 'surah-1', number: '٠١', name: 'الفاتحة', english: 'Al-Fatihah', verses: 7, type: 'مكية', excerpt: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-2', number: '٠٢', name: 'البقرة', english: 'Al-Baqarah', verses: 286, type: 'مدنية', excerpt: 'الم ۝ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-18', number: '١٨', name: 'الكهف', english: 'Al-Kahf', verses: 110, type: 'مكية', excerpt: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-36', number: '٣٦', name: 'يس', english: 'Ya-Sin', verses: 83, type: 'مكية', excerpt: 'يس ۝ وَالْقُرْآنِ الْحَكِيمِ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-55', number: '٥٥', name: 'الرحمن', english: 'Ar-Rahman', verses: 78, type: 'مدنية', excerpt: 'الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-67', number: '٦٧', name: 'الملك', english: 'Al-Mulk', verses: 30, type: 'مكية', excerpt: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ', readerVerses: FALLBACK_READER_VERSES },
  { id: 'surah-112', number: '١١٢', name: 'الإخلاص', english: 'Al-Ikhlas', verses: 4, type: 'مكية', excerpt: 'قُلْ هُوَ اللَّهُ أَحَدٌ', readerVerses: FALLBACK_READER_VERSES },
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
          readerVerses: s.verses.length > 0 ? s.verses : FALLBACK_READER_VERSES,
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
              <Text style={styles.readerFooterText}>صفحة ٤٤٠</Text>
              <Text style={styles.readerFooterText}>الجزء ٢٣</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.continueCard, { backgroundColor: colors.cream, borderColor: '#EBD9A8' }]}>
              <View style={[styles.continueIcon, { backgroundColor: '#E9D29C' }]}><Feather name="play" size={16} color={colors.accentForeground} /></View>
              <View style={styles.continueCopy}>
                <Text style={[styles.continueLabel, { color: colors.deepMuted }]}>متابعة القراءة</Text>
                <Text style={[styles.continueTitle, { color: colors.deep }]}>سورة يس</Text>
                <Text style={[styles.continueMeta, { color: colors.deepMuted }]}>الآية ١٢ · صفحة ٤٤٠</Text>
              </View>
              <Text style={[styles.continueProgress, { color: colors.accentForeground }]}>١٤%</Text>
            </View>

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