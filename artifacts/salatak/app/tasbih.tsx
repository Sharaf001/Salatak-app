import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

const targets = [33, 99, 100];

export default function TasbihScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tasbihCount, tasbihTarget, incrementTasbih, resetTasbih, setTasbihTarget } = useSalatak();

  const progress = Math.min(tasbihCount / tasbihTarget, 1);
  const cycles = Math.floor(tasbihCount / tasbihTarget);

  const tap = () => {
    const justCompleted = (tasbihCount + 1) % tasbihTarget === 0;
    void Haptics.impactAsync(justCompleted ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
    incrementTasbih();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.content, { paddingBottom: insets.bottom + 30 }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>رجوع</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>سبحان الله وبحمده</Text>
            <Text style={[styles.title, { color: colors.deep }]}>المسبحة</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="circle" size={19} color={colors.primary} />
          </View>
        </View>

        <View style={styles.targetRow}>
          {targets.map((target) => (
            <Pressable
              key={target}
              onPress={() => {
                void Haptics.selectionAsync();
                setTasbihTarget(target);
              }}
              style={[
                styles.targetChip,
                { backgroundColor: tasbihTarget === target ? colors.primary : colors.card, borderColor: tasbihTarget === target ? colors.primary : colors.border },
              ]}
            >
              <Text style={[styles.targetText, { color: tasbihTarget === target ? colors.white : colors.deepMuted }]}>{target}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.counterWrap}>
          <View style={[styles.ring, { borderColor: colors.secondary }]}>
            <View
              style={[
                styles.ringFill,
                {
                  borderColor: colors.primary,
                  borderTopColor: progress < 1 ? colors.primary : colors.gold,
                  transform: [{ rotate: `${progress * 360}deg` }],
                },
              ]}
            />
            <Pressable onPress={tap} style={styles.ringCenter}>
              <Text style={[styles.countText, { color: colors.deep }]}>{tasbihCount % tasbihTarget || (tasbihCount > 0 && progress === 1 ? tasbihTarget : 0)}</Text>
              <Text style={[styles.countOf, { color: colors.mutedForeground }]}>من {tasbihTarget}</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[styles.totalText, { color: colors.deepMuted }]}>
          إجمالي التسبيح: {tasbihCount}{cycles > 0 ? ` · ${cycles} دورة مكتملة` : ''}
        </Text>

        <Pressable onPress={tap} style={[styles.tapButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.tapButtonText}>سبّح</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            resetTasbih();
          }}
          style={[styles.resetButton, { borderColor: colors.border }]}
        >
          <Feather name="rotate-ccw" size={15} color={colors.mutedForeground} />
          <Text style={[styles.resetText, { color: colors.mutedForeground }]}>تصفير العداد</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 14, alignItems: 'center' },
  backRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginBottom: 10 },
  backText: { fontSize: 13, fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 18 },
  eyebrow: { textAlign: 'right', fontSize: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  targetRow: { flexDirection: 'row-reverse', gap: 8, marginBottom: 30 },
  targetChip: { minWidth: 56, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  targetText: { fontSize: 13, fontWeight: '700' },
  counterWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 220, height: 220, borderRadius: 110, borderWidth: 10, alignItems: 'center', justifyContent: 'center' },
  ringFill: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 10, borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: 'transparent' },
  ringCenter: { alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 56, fontWeight: '800' },
  countOf: { fontSize: 13, marginTop: 4 },
  totalText: { fontSize: 12, marginBottom: 18 },
  tapButton: { width: '100%', height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  tapButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  resetButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  resetText: { fontSize: 12, fontWeight: '600' },
});
