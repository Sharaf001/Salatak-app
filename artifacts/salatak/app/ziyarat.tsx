import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useZiyarat } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

const categories = ['الكل', 'عامة', 'أيام الأسبوع'];

// Bundled offline content. Text attribution and wording remain pending review
// by a qualified religious reviewer; keep this list in sync with seed.ts.
const FALLBACK_ZIYARAT = [
  { id: 'ziyarat-hussain', category: 'عامة', title: 'زيارة الإمام الحسين (ع)', excerpt: 'السلام عليك يا أبا عبد الله، السلام عليك يا ابن رسول الله...' },
  { id: 'ziyarat-nabi', category: 'عامة', title: 'زيارة النبي الأكرم (ص)', excerpt: 'السلام عليك أيها النبي ورحمة الله وبركاته، السلام عليك يا رسول الله...' },
  { id: 'ziyarat-abbas', category: 'عامة', title: 'زيارة العباس (ع)', excerpt: 'السلام عليك أيها العبد الصالح، المطيع لله ولرسوله...' },
  { id: 'ziyarat-al-yasin', category: 'عامة', title: 'زيارة آل ياسين', excerpt: 'السلام عليك يا داعي الله وربّاني آياته...' },
  { id: 'ziyarat-ashura', category: 'عامة', title: 'زيارة عاشوراء', excerpt: 'السلام عليك يا أبا عبد الله، السلام عليك وعلى الأرواح التي حلّت بفنائك...' },
  { id: 'ziyarat-amin-allah', category: 'عامة', title: 'زيارة أمين الله', excerpt: 'السلام عليك يا أمين الله في أرضه، وحجته على عباده، السلام عليك يا أمير المؤمنين...' },
  { id: 'ziyarat-warith', category: 'عامة', title: 'زيارة وارث', excerpt: 'السلام عليك يا وارث آدم صفوة الله، السلام عليك يا وارث نوح نبي الله...' },
  { id: 'ziyarat-jamia-kabira', category: 'عامة', title: 'الزيارة الجامعة الكبيرة', excerpt: 'السلام عليكم يا أهل بيت النبوة، وموضع الرسالة، ومختلف الملائكة، ومهبط الوحي...' },
  { id: 'ziyarat-imam-rida', category: 'عامة', title: 'زيارة الإمام الرضا (ع)', excerpt: 'السلام عليك يا ولي الله، السلام عليك يا حجة الله، السلام عليك يا نور الله في ظلمات الأرض...' },
  { id: 'ziyarat-saturday', category: 'أيام الأسبوع', title: 'زيارة يوم السبت', excerpt: 'مخصصة لرسول الله محمد (ص)' },
  { id: 'ziyarat-sunday', category: 'أيام الأسبوع', title: 'زيارة يوم الأحد', excerpt: 'مخصصة لأمير المؤمنين علي وفاطمة الزهراء (ع)' },
  { id: 'ziyarat-monday', category: 'أيام الأسبوع', title: 'زيارة يوم الاثنين', excerpt: 'مخصصة للإمامين الحسن والحسين (ع)' },
  { id: 'ziyarat-tuesday', category: 'أيام الأسبوع', title: 'زيارة يوم الثلاثاء', excerpt: 'مخصصة للأئمة زين العابدين والباقر والصادق (ع)' },
  { id: 'ziyarat-wednesday', category: 'أيام الأسبوع', title: 'زيارة يوم الأربعاء', excerpt: 'مخصصة للأئمة الكاظم والرضا والجواد والهادي (ع)' },
  { id: 'ziyarat-thursday', category: 'أيام الأسبوع', title: 'زيارة يوم الخميس', excerpt: 'مخصصة للإمام الحسن العسكري (ع)' },
  { id: 'ziyarat-friday', category: 'أيام الأسبوع', title: 'زيارة يوم الجمعة', excerpt: 'مخصصة للإمام المهدي (عج)' },
];

export default function ZiyaratScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toggleBookmark, isBookmarked } = useSalatak();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selected, setSelected] = useState<{ title: string; excerpt: string; body?: string | null } | null>(null);
  const { data } = useZiyarat();
  const ziyaratList = Array.isArray(data) && data.length > 0 ? data.map((z) => ({ id: z.slug, category: z.category, title: z.title, excerpt: z.excerpt, body: z.body })) : FALLBACK_ZIYARAT;
  const visible = activeCategory === 'الكل' ? ziyaratList : ziyaratList.filter((item) => item.category === activeCategory);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>رجوع</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>سلامٌ وتقرّب</Text>
            <Text style={[styles.title, { color: colors.deep }]}>الزيارات</Text>
          </View>
          <View style={[styles.notice, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text style={[styles.noticeTitle, { color: colors.deep }]}>المصدر وحالة المراجعة</Text>
            <Text style={[styles.noticeText, { color: colors.deepMuted }]}>ترتيب زيارات أيام الأسبوع من مفاتيح الجنان. النصوص المعروضة قيد مراجعة شخص مؤهل؛ راجع مرجعك قبل الاعتماد عليها.</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="book-open" size={19} color={colors.primary} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filters, { flexDirection: 'row-reverse' }]}>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[styles.filter, { backgroundColor: activeCategory === category ? colors.primary : colors.card, borderColor: activeCategory === category ? colors.primary : colors.border }]}
            >
              <Text style={[styles.filterText, { color: activeCategory === category ? colors.white : colors.deepMuted }]}>{category}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.list}>
          {visible.map((item) => {
            const saved = isBookmarked(item.id);
            return (
              <Pressable key={item.id} onPress={() => setSelected(item)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
                  <Feather name="book-open" size={16} color={colors.primary} />
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.itemTitle, { color: colors.deep }]}>{item.title}</Text>
                  <Text style={[styles.excerpt, { color: colors.mutedForeground }]} numberOfLines={1}>{item.excerpt}</Text>
                </View>
                <Pressable onPress={(event) => { event.stopPropagation(); void Haptics.selectionAsync(); toggleBookmark(item.id); }} hitSlop={10}>
                  <Feather name="bookmark" size={17} color={saved ? colors.gold : colors.mutedForeground} />
                </Pressable>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Modal visible={selected !== null} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Pressable onPress={() => setSelected(null)} style={styles.modalClose} hitSlop={10}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.deep }]}>{selected?.title}</Text>
            <Text style={[styles.modalText, { color: colors.deepMuted }]}>{selected?.body || selected?.excerpt}</Text>
            {!selected?.body && <Text style={[styles.modalPending, { color: colors.mutedForeground }]}>النص الكامل قيد المراجعة ولم يُنشر بعد.</Text>}
            <Text style={[styles.modalSource, { color: colors.primary }]}>المصدر المنسوب: مفاتيح الجنان ومراجع الزيارات المذكورة في بيانات التطبيق</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14 },
  notice: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 16 },
  noticeTitle: { textAlign: 'right', fontSize: 13, fontWeight: '700' },
  noticeText: { textAlign: 'right', fontSize: 12, lineHeight: 19, marginTop: 4 },
  backRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginBottom: 10 },
  backText: { fontSize: 13, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  eyebrow: { textAlign: 'right', fontSize: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  filters: { gap: 8, paddingVertical: 18 },
  filter: { paddingHorizontal: 16, height: 35, borderRadius: 18, borderWidth: 1, justifyContent: 'center' },
  filterText: { fontSize: 12, fontWeight: '600' },
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 13, gap: 11 },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
  excerpt: { fontSize: 11, textAlign: 'right', marginTop: 3 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  modalCard: { borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 22, paddingBottom: 34 },
  modalClose: { alignSelf: 'flex-start', padding: 4 },
  modalTitle: { textAlign: 'right', fontSize: 20, fontWeight: '700', marginTop: 8 },
  modalText: { textAlign: 'right', fontSize: 18, lineHeight: 34, marginTop: 18 },
  modalPending: { textAlign: 'right', fontSize: 12, lineHeight: 19, marginTop: 14 },
  modalSource: { textAlign: 'right', fontSize: 12, lineHeight: 19, marginTop: 14 },
});
