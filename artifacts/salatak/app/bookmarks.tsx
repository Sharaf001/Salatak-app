import { Feather } from '@expo/vector-icons';
import { useDuas, useSurahs, useZiyarat, type Dua, type Surah, type Ziyarat } from '@workspace/api-client-react';
import { router, Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

type BookmarkItem = {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

const FALLBACK_ITEMS: Record<string, BookmarkItem> = {
  'dua-morning': { id: 'dua-morning', title: 'دعاء الصباح', subtitle: 'أدعية · الصباح', excerpt: 'اللهم بك أصبحنا وبك أمسينا، وبك نحيا وبك نموت وإليك النشور.', icon: 'heart' },
  'dua-rizq': { id: 'dua-rizq', title: 'طلب الرزق', subtitle: 'أدعية · الصباح', excerpt: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.', icon: 'heart' },
  'dua-evening': { id: 'dua-evening', title: 'دعاء المساء', subtitle: 'أدعية · المساء', excerpt: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', icon: 'heart' },
  'dua-sujood': { id: 'dua-sujood', title: 'دعاء السجود', subtitle: 'أدعية · الصلاة', excerpt: 'سبحان ربي الأعلى وبحمده، اللهم اغفر لي وارحمني واهدني وعافني وارزقني.', icon: 'heart' },
  'ziyarat-hussain': { id: 'ziyarat-hussain', title: 'زيارة الإمام الحسين (ع)', subtitle: 'زيارات · عامة', excerpt: 'السلام عليك يا أبا عبد الله، السلام عليك يا ابن رسول الله...', icon: 'book-open' },
  'ziyarat-nabi': { id: 'ziyarat-nabi', title: 'زيارة النبي الأكرم (ص)', subtitle: 'زيارات · عامة', excerpt: 'السلام عليك أيها النبي ورحمة الله وبركاته، السلام عليك يا رسول الله...', icon: 'book-open' },
  'ziyarat-abbas': { id: 'ziyarat-abbas', title: 'زيارة العباس (ع)', subtitle: 'زيارات · عامة', excerpt: 'السلام عليك أيها العبد الصالح، المطيع لله ولرسوله...', icon: 'book-open' },
  'ziyarat-al-yasin': { id: 'ziyarat-al-yasin', title: 'زيارة آل ياسين', subtitle: 'زيارات · عامة', excerpt: 'السلام عليك يا داعي الله وربّاني آياته...', icon: 'book-open' },
  'ziyarat-ashura': { id: 'ziyarat-ashura', title: 'زيارة عاشوراء', subtitle: 'زيارات · عامة', excerpt: 'السلام عليك يا أبا عبد الله، السلام عليك وعلى الأرواح التي حلّت بفنائك...', icon: 'book-open' },
  'ziyarat-saturday': { id: 'ziyarat-saturday', title: 'زيارة يوم السبت', subtitle: 'زيارات · أيام الأسبوع', excerpt: 'مخصصة للإمام علي بن أبي طالب (ع)', icon: 'book-open' },
  'ziyarat-sunday': { id: 'ziyarat-sunday', title: 'زيارة يوم الأحد', subtitle: 'زيارات · أيام الأسبوع', excerpt: 'مخصصة للإمام الحسن بن علي (ع)', icon: 'book-open' },
  'ziyarat-thursday': { id: 'ziyarat-thursday', title: 'زيارة يوم الخميس', subtitle: 'زيارات · أيام الأسبوع', excerpt: 'مخصصة للإمام موسى الكاظم (ع)', icon: 'book-open' },
};

function fallbackForId(id: string): BookmarkItem {
  const surahNumber = id.match(/^surah-(\d+)$/)?.[1];
  if (surahNumber) {
    return {
      id,
      title: id === 'surah-36' ? 'سورة يس' : `سورة رقم ${surahNumber}`,
      subtitle: 'القرآن الكريم',
      excerpt: 'سورة محفوظة للعودة إليها بسرعة.',
      icon: 'book',
    };
  }
  return { id, title: 'عنصر محفوظ', subtitle: 'محتوى محفوظ', excerpt: id, icon: 'bookmark' };
}

export default function BookmarksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookmarks, toggleBookmark } = useSalatak();
  const { data: surahs } = useSurahs();
  const { data: duas } = useDuas();
  const { data: ziyarat } = useZiyarat();

  const itemsById = useMemo(() => {
    const items = new Map<string, BookmarkItem>();
    surahs?.forEach((item: Surah) => items.set(item.slug, { id: item.slug, title: `سورة ${item.name}`, subtitle: `القرآن الكريم · ${item.revelationType}`, excerpt: `${item.verseCount} آية · ${item.english}`, icon: 'book' }));
    duas?.forEach((item: Dua) => items.set(item.slug, { id: item.slug, title: item.title, subtitle: `أدعية · ${item.category}`, excerpt: item.body, icon: 'heart' }));
    ziyarat?.forEach((item: Ziyarat) => items.set(item.slug, { id: item.slug, title: item.title, subtitle: `زيارات · ${item.category}`, excerpt: item.excerpt, icon: 'book-open' }));
    Object.entries(FALLBACK_ITEMS).forEach(([id, item]) => {
      if (!items.has(id)) items.set(id, item);
    });
    return items;
  }, [duas, surahs, ziyarat]);

  const savedItems = bookmarks.map((id) => itemsById.get(id) ?? fallbackForId(id));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 35 }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>رجوع</Text>
        </Pressable>

        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>للعودة لاحقاً</Text>
            <Text style={[styles.title, { color: colors.deep }]}>المحفوظات</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="bookmark" size={19} color={colors.primary} />
          </View>
        </View>

        <View style={[styles.summary, { backgroundColor: colors.deep }]}>
          <Text style={styles.summaryNumber}>{bookmarks.length}</Text>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>ما حفظته للرجوع إليه</Text>
            <Text style={styles.summarySubtitle}>من القرآن والأدعية والزيارات</Text>
          </View>
        </View>

        {savedItems.length > 0 ? (
          <View style={styles.list}>
            {savedItems.map((item) => (
              <View key={item.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
                  <Feather name={item.icon} size={17} color={colors.primary} />
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.itemTitle, { color: colors.deep }]}>{item.title}</Text>
                  <Text style={[styles.itemSubtitle, { color: colors.primary }]}>{item.subtitle}</Text>
                  <Text style={[styles.excerpt, { color: colors.mutedForeground }]} numberOfLines={2}>{item.excerpt}</Text>
                </View>
                <Pressable onPress={() => toggleBookmark(item.id)} hitSlop={10} style={styles.removeButton}>
                  <Feather name="bookmark" size={18} color={colors.gold} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name="bookmark" size={22} color={colors.primary} /></View>
            <Text style={[styles.emptyTitle, { color: colors.deep }]}>لا توجد محفوظات بعد</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>اضغط علامة الحفظ بجانب أي سورة أو دعاء أو زيارة ليظهر هنا.</Text>
          </View>
        )}
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
  summary: { borderRadius: 19, padding: 17, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  summaryNumber: { color: '#E8C77D', fontSize: 32, fontWeight: '800', marginRight: 14 },
  summaryCopy: { flex: 1 },
  summaryTitle: { color: '#FFF9ED', fontSize: 16, fontWeight: '700', textAlign: 'right' },
  summarySubtitle: { color: '#B6D2CB', fontSize: 11, textAlign: 'right', marginTop: 4 },
  list: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 13, gap: 11 },
  icon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
  itemSubtitle: { fontSize: 10, fontWeight: '600', textAlign: 'right', marginTop: 3 },
  excerpt: { fontSize: 11, lineHeight: 17, textAlign: 'right', marginTop: 4 },
  removeButton: { padding: 4 },
  empty: { borderWidth: 1, borderRadius: 18, padding: 25, alignItems: 'center' },
  emptyIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyText: { fontSize: 12, lineHeight: 20, textAlign: 'center', marginTop: 6 },
});