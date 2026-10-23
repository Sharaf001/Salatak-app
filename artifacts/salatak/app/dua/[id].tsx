import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDuas } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { FALLBACK_DUAS } from '@/data/religious-content';

export default function DuaReaderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useDuas();
  const fallback = FALLBACK_DUAS.find((item) => item.id === id);
  const remote = data?.find((item) => item.slug === id);
  const title = remote?.title ?? fallback?.title ?? 'الدعاء';
  const body = remote?.body && remote.body.length > 200 ? remote.body : fallback?.body ?? remote?.body ?? '';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="العودة" onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>رجوع</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>قراءة كاملة</Text>
            <Text style={[styles.title, { color: colors.deep }]}>{title}</Text>
          </View>
          <View style={[styles.icon, { backgroundColor: colors.secondary }]}><Feather name="heart" size={19} color={colors.primary} /></View>
        </View>
        <View style={[styles.notice, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Text style={[styles.noticeText, { color: colors.deepMuted }]}>المصدر النصي: سجلات ShiaCompanion العربية. النص قيد مراجعة شخص مؤهل.</Text>
        </View>
        <View style={[styles.reader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.body, { color: colors.deep }]}>{body}</Text>
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
  title: { textAlign: 'right', fontSize: 27, fontWeight: '700', marginTop: 6 },
  icon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notice: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 16 },
  noticeText: { textAlign: 'right', fontSize: 12, lineHeight: 19 },
  reader: { borderWidth: 1, borderRadius: 18, padding: 18 },
  body: { textAlign: 'right', fontSize: 20, lineHeight: 40 },
});
