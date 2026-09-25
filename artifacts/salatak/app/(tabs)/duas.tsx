import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useDuas } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

const categories = ['الكل', 'الصباح', 'المساء', 'الصلاة'];

// Bundled offline content — used until the API responds, and whenever it's
// unreachable (no DATABASE_URL configured, phone offline, etc). Edit here
// for quick local changes, or edit the `duas` table in the DB for changes
// that reach every user without an app update.
const FALLBACK_DUAS = [
  { id: 'dua-morning', category: 'الصباح', title: 'دعاء الصباح', body: 'اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت وإليك النشور.', count: 'مرة واحدة' },
  { id: 'dua-rizq', category: 'الصباح', title: 'طلب الرزق', body: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.', count: '٣ مرات' },
  { id: 'dua-evening', category: 'المساء', title: 'دعاء المساء', body: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', count: 'مرة واحدة' },
  { id: 'dua-sujood', category: 'الصلاة', title: 'دعاء السجود', body: 'سبحان ربي الأعلى وبحمده، اللهم اغفر لي وارحمني واهدني وعافني وارزقني.', count: 'في السجود' },
];

export default function DuasScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toggleBookmark, isBookmarked } = useSalatak();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const { data } = useDuas();
  const duas = Array.isArray(data) && data.length > 0 ? data.map((d) => ({ id: d.slug, category: d.category, title: d.title, body: d.body, count: d.count })) : FALLBACK_DUAS;
  const visibleDuas = activeCategory === 'الكل' ? duas : duas.filter((dua) => dua.category === activeCategory);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>سكينة القلب</Text>
            <Text style={[styles.title, { color: colors.deep }]}>الأدعية اليومية</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: '#F3E5C5' }]}>
            <Feather name="heart" size={19} color={colors.accentForeground} />
          </View>
        </View>

        <View style={[styles.introCard, { backgroundColor: colors.deep }]}>
          <Text style={styles.introArabic}>وَاذْكُر رَّبَّكَ إِذَا نَسِيتَ</Text>
          <Text style={styles.introTranslation}>واجعل لسانك عامراً بذكر الله</Text>
          <View style={styles.introFooter}><Feather name="sun" size={14} color="#E8C77D" /><Text style={styles.introSource}>الكهف · ٢٤</Text></View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filters, { flexDirection: 'row-reverse' }]}>
          {categories.map((category) => (
            <Pressable key={category} onPress={() => setActiveCategory(category)} style={[styles.filter, { backgroundColor: activeCategory === category ? colors.primary : colors.card, borderColor: activeCategory === category ? colors.primary : colors.border }]}>
              <Text style={[styles.filterText, { color: activeCategory === category ? colors.white : colors.deepMuted }]}>{category}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionLine}>
          <Text style={[styles.sectionTitle, { color: colors.deep }]}>وردك اليومي</Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>{visibleDuas.length} أدعية</Text>
        </View>

        <View style={styles.duaList}>
          {visibleDuas.map((dua, index) => {
            const saved = isBookmarked(dua.id);
            return (
              <View key={dua.id} style={[styles.duaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.duaTop}>
                  <View style={[styles.duaIndex, { backgroundColor: index === 0 ? '#F3E5C5' : colors.secondary }]}><Text style={[styles.duaIndexText, { color: index === 0 ? colors.accentForeground : colors.primary }]}>٠{index + 1}</Text></View>
                  <View style={styles.duaTitleWrap}><Text style={[styles.duaTitle, { color: colors.deep }]}>{dua.title}</Text><Text style={[styles.duaCount, { color: colors.mutedForeground }]}>{dua.count}</Text></View>
                  <Pressable onPress={() => { void Haptics.selectionAsync(); toggleBookmark(dua.id); }} hitSlop={10}><Feather name={saved ? 'bookmark' : 'bookmark'} size={18} color={saved ? colors.gold : colors.mutedForeground} /></Pressable>
                </View>
                <Text style={[styles.duaBody, { color: colors.deepMuted }]}>{dua.body}</Text>
                <View style={[styles.duaBottom, { borderTopColor: colors.border }]}>
                  <Text style={[styles.duaCategory, { color: colors.primary }]}>{dua.category}</Text>
                  <Pressable onPress={() => { void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} style={[styles.doneButton, { backgroundColor: saved ? colors.secondary : colors.cream }]}><Feather name="check" size={14} color={colors.primary} /><Text style={[styles.doneText, { color: colors.primary }]}>تمت القراءة</Text></Pressable>
                </View>
              </View>
            );
          })}
        </View>
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
  introCard: { borderRadius: 21, padding: 18, minHeight: 130 },
  introArabic: { color: '#FFF9ED', fontSize: 21, lineHeight: 34, textAlign: 'right', fontWeight: '600' },
  introTranslation: { color: '#B6D2CB', fontSize: 12, textAlign: 'right', marginTop: 8 },
  introFooter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  introSource: { color: '#D7A84C', fontSize: 11 },
  filters: { gap: 8, paddingVertical: 18 },
  filter: { paddingHorizontal: 16, height: 35, borderRadius: 18, borderWidth: 1, justifyContent: 'center' },
  filterText: { fontSize: 12, fontWeight: '600' },
  sectionLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', textAlign: 'right' },
  sectionMeta: { fontSize: 12 },
  duaList: { gap: 10 },
  duaCard: { borderWidth: 1, borderRadius: 18, padding: 14 },
  duaTop: { flexDirection: 'row', alignItems: 'center' },
  duaIndex: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  duaIndexText: { fontSize: 11, fontWeight: '700' },
  duaTitleWrap: { flex: 1, marginLeft: 10 },
  duaTitle: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
  duaCount: { fontSize: 10, textAlign: 'right', marginTop: 2 },
  duaBody: { fontSize: 16, lineHeight: 28, textAlign: 'right', marginTop: 15 },
  duaBottom: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 14, paddingTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  duaCategory: { fontSize: 11, fontWeight: '600' },
  doneButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 },
  doneText: { fontSize: 10, fontWeight: '600' },
});