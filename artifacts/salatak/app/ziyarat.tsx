import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useZiyarat } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

const categories = ['الكل', 'عامة', 'أيام الأسبوع'];

// Bundled offline content — verified against the Arabic ziyarat texts listed
// by al-islam.org's Islamic Supplication Browser. Keep this list in sync with
// lib/db/src/seed.ts.
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
  { id: 'ziyarat-sunday', category: 'أيام الأسبوع', title: 'زيارة يوم الأحد', excerpt: 'مخصصة لأمير المؤمنين علي بن أبي طالب (ع)' },
  { id: 'ziyarat-monday', category: 'أيام الأسبوع', title: 'زيارة يوم الاثنين', excerpt: 'مخصصة للإمام الحسين والإمام زين العابدين (ع)' },
  { id: 'ziyarat-tuesday', category: 'أيام الأسبوع', title: 'زيارة يوم الثلاثاء', excerpt: 'مخصصة للإمام محمد الباقر والإمام جعفر الصادق (ع)' },
  { id: 'ziyarat-wednesday', category: 'أيام الأسبوع', title: 'زيارة يوم الأربعاء', excerpt: 'مخصصة للأئمة موسى الكاظم وعلي الرضا ومحمد الجواد وعلي الهادي والحسن العسكري (ع)' },
  { id: 'ziyarat-thursday', category: 'أيام الأسبوع', title: 'زيارة يوم الخميس', excerpt: 'مخصصة للسيدة فاطمة الزهراء (ع)' },
  { id: 'ziyarat-friday', category: 'أيام الأسبوع', title: 'زيارة يوم الجمعة', excerpt: 'مخصصة للإمام المهدي (عج)' },
];

export default function ZiyaratScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toggleBookmark, isBookmarked } = useSalatak();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const { data } = useZiyarat();
  const ziyaratList = Array.isArray(data) && data.length > 0 ? data.map((z) => ({ id: z.slug, category: z.category, title: z.title, excerpt: z.excerpt })) : FALLBACK_ZIYARAT;
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
              <Pressable key={item.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
                  <Feather name="book-open" size={16} color={colors.primary} />
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.itemTitle, { color: colors.deep }]}>{item.title}</Text>
                  <Text style={[styles.excerpt, { color: colors.mutedForeground }]} numberOfLines={1}>{item.excerpt}</Text>
                </View>
                <Pressable onPress={() => { void Haptics.selectionAsync(); toggleBookmark(item.id); }} hitSlop={10}>
                  <Feather name="bookmark" size={17} color={saved ? colors.gold : colors.mutedForeground} />
                </Pressable>
              </Pressable>
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
});
