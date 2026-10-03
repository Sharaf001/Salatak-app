import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { gregorianToHijri, toArabicIndicDigits } from '@/hooks/useHijriDate';

const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function dateAtUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function findMonthStart(date: Date): Date {
  let current = dateAtUtcMidnight(date);
  for (let offset = 0; offset < 32; offset += 1) {
    if (gregorianToHijri(current).day === 1) return current;
    current = addDays(current, -1);
  }
  return current;
}

function findHijriMonthStart(currentMonthStart: Date, monthOffset: number): Date {
  let start = currentMonthStart;
  const direction = monthOffset >= 0 ? 1 : -1;
  for (let index = 0; index < Math.abs(monthOffset); index += 1) {
    start = findMonthStart(addDays(start, direction > 0 ? 32 : -1));
  }
  return start;
}

function getMonthDays(monthStart: Date): Date[] {
  const dates: Date[] = [];
  for (let offset = 0; offset < 31; offset += 1) {
    const date = addDays(monthStart, offset);
    if (gregorianToHijri(date).day === 1 && offset > 0) break;
    dates.push(date);
  }
  return dates;
}

export default function HijriCalendarScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = useMemo(() => dateAtUtcMidnight(new Date()), []);
  const todayHijri = useMemo(() => gregorianToHijri(today), [today]);
  const currentMonthStart = useMemo(() => findMonthStart(today), [today]);
  const [monthOffset, setMonthOffset] = useState(0);
  const monthStart = useMemo(() => findHijriMonthStart(currentMonthStart, monthOffset), [currentMonthStart, monthOffset]);
  const monthDays = useMemo(() => getMonthDays(monthStart), [monthStart]);
  const month = gregorianToHijri(monthStart);
  const leadingEmptyDays = monthStart.getUTCDay();
  const cells = [...Array(leadingEmptyDays).fill(null), ...monthDays];

  const isToday = (date: Date) => date.getTime() === today.getTime();
  const dayLabel = (date: Date) => toArabicIndicDigits(gregorianToHijri(date).day);

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
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>التاريخ القمري</Text>
            <Text style={[styles.title, { color: colors.deep }]}>التقويم الهجري</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: '#F3E5C5' }]}>
            <Feather name="calendar" size={19} color={colors.accentForeground} />
          </View>
        </View>

        <View style={[styles.todayCard, { backgroundColor: colors.deep }]}>
          <Text style={styles.todayLabel}>اليوم</Text>
          <Text style={styles.todayDate}>{toArabicIndicDigits(todayHijri.day)} {todayHijri.monthName} {toArabicIndicDigits(todayHijri.year)}</Text>
          <Text style={styles.todayNote}>بحسب الحساب المدني التقريبي</Text>
        </View>

        <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.monthControls}>
            <Pressable onPress={() => setMonthOffset((value) => value - 1)} style={[styles.navButton, { backgroundColor: colors.secondary }]} hitSlop={8}>
              <Feather name="chevron-right" size={18} color={colors.primary} />
            </Pressable>
            <Text style={[styles.monthTitle, { color: colors.deep }]}>{month.monthName} {toArabicIndicDigits(month.year)}</Text>
            <Pressable onPress={() => setMonthOffset((value) => value + 1)} style={[styles.navButton, { backgroundColor: colors.secondary }]} hitSlop={8}>
              <Feather name="chevron-left" size={18} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((weekday) => <Text key={weekday} style={[styles.weekday, { color: colors.mutedForeground }]}>{weekday}</Text>)}
          </View>
          <View style={styles.grid}>
            {cells.map((date, index) => (
              <View key={date ? date.toISOString() : `empty-${index}`} style={styles.cell}>
                {date && (
                  <View style={[styles.day, isToday(date) && { backgroundColor: colors.primary }]}>
                    <Text style={[styles.dayText, { color: isToday(date) ? colors.white : colors.deep }]}>{dayLabel(date)}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>قد يختلف بدء الشهر يومًا بحسب رؤية الهلال المحلية.</Text>
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
  todayCard: { borderRadius: 19, padding: 17, marginBottom: 14 },
  todayLabel: { color: '#B6D2CB', fontSize: 11, textAlign: 'right' },
  todayDate: { color: '#FFF9ED', fontSize: 20, fontWeight: '700', textAlign: 'right', marginTop: 5 },
  todayNote: { color: '#B6D2CB', fontSize: 10, textAlign: 'right', marginTop: 6 },
  calendarCard: { borderWidth: 1, borderRadius: 18, padding: 14 },
  monthControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  navButton: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { fontSize: 17, fontWeight: '700' },
  weekdayRow: { flexDirection: 'row', marginBottom: 8 },
  weekday: { flex: 1, fontSize: 10, fontWeight: '600', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '14.2857%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  day: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 13, fontWeight: '600' },
  disclaimer: { fontSize: 10, textAlign: 'center', marginTop: 13 },
});