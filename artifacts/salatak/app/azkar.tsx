import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAzkar } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';
import { FALLBACK_AZKAR } from '@/data/religious-content';

const categories = ['الكل', 'الصباح', 'المساء', 'بعد الصلاة'];

// Bundled offline content. Wording and attribution remain pending review by a
// qualified religious reviewer; keep this list in sync with lib/db/src/seed.ts.
export default function AzkarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toggleAzkarRead, isAzkarRead } = useSalatak();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const { data } = useAzkar();
  const azkarList = Array.isArray(data) && data.length > 0 ? data.map((a) => ({ id: a.slug, category: a.category, title: a.title, body: a.body, count: a.count })) : FALLBACK_AZKAR;
  const visible = activeCategory === 'الكل' ? azkarList : azkarList.filter((item) => item.category === activeCategory);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="العودة" onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>رجوع</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>ذِكر دائم</Text>
            <Text style={[styles.title, { color: colors.deep }]}>الأذكار</Text>
          </View>
          <View style={[styles.notice, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
            <Text style={[styles.noticeTitle, { color: colors.deep }]}>المصدر وحالة المراجعة</Text>
            <Text style={[styles.noticeText, { color: colors.deepMuted }]}>المصادر المنسوبة: القرآن الكريم ومراجع الأذكار في al-islam.org. هذه النصوص قيد مراجعة شخص مؤهل، فلا تُعرض كمحتوى موثّق بعد.</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: '#F3E5C5' }]}>
            <Feather name="sun" size={19} color={colors.accentForeground} />
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

        <View style={styles.sectionLine}>
          <Text style={[styles.sectionTitle, { color: colors.deep }]}>الأذكار المقروءة والمسموعة</Text>
          <Text style={[styles.sectionMeta, { color: colors.mutedForeground }]}>{visible.length} أذكار</Text>
        </View>

        <View style={styles.list}>
          {visible.map((item) => {
            const read = isAzkarRead(item.id);
            return (
              <View key={item.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.top}>
                  <View style={styles.titleWrap}>
                    <Text style={[styles.itemTitle, { color: colors.deep }]}>{item.title}</Text>
                    <Text style={[styles.itemCount, { color: colors.mutedForeground }]}>{item.count}</Text>
                  </View>
                  {read && (
                    <View style={[styles.readBadge, { backgroundColor: colors.secondary }]}>
                      <Feather name="check" size={13} color={colors.primary} />
                    </View>
                  )}
                </View>
                <Text style={[styles.body, { color: colors.deepMuted }]}>{item.body}</Text>
                <View style={[styles.bottom, { borderTopColor: colors.border }]}>
                  <Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text>
                  <Pressable
                    onPress={() => {
                      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      toggleAzkarRead(item.id);
                    }}
                    style={[styles.doneButton, { backgroundColor: read ? colors.secondary : colors.cream }]}
                  >
                    <Feather name="check" size={14} color={colors.primary} />
                    <Text style={[styles.doneText, { color: colors.primary }]}>{read ? 'تمت القراءة' : 'وضع علامة'}</Text>
                  </Pressable>
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
  sectionLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', textAlign: 'right' },
  sectionMeta: { fontSize: 12 },
  list: { gap: 10 },
  card: { borderWidth: 1, borderRadius: 18, padding: 14 },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  titleWrap: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
  itemCount: { fontSize: 10, textAlign: 'right', marginTop: 3 },
  readBadge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  body: { fontSize: 15, lineHeight: 27, textAlign: 'right', marginTop: 13 },
  bottom: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 13, paddingTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  category: { fontSize: 11, fontWeight: '600' },
  doneButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 },
  doneText: { fontSize: 10, fontWeight: '600' },
});
