import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

const prayers = [
  { id: 'fajr', name: 'الفجر', english: 'Fajr', time: '04:38', icon: 'sunrise' as const },
  { id: 'dhuhr', name: 'الظهر', english: 'Dhuhr', time: '12:43', icon: 'sun' as const },
  { id: 'asr', name: 'العصر', english: 'Asr', time: '16:18', icon: 'cloud' as const },
  { id: 'maghrib', name: 'المغرب', english: 'Maghrib', time: '19:21', icon: 'sunset' as const },
  { id: 'isha', name: 'العشاء', english: 'Isha', time: '20:42', icon: 'moon' as const },
];

function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.deep }]}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress} hitSlop={10}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completedPrayers, togglePrayer } = useSalatak();
  const completedCount = prayers.filter((prayer) => completedPrayers[prayer.id]).length;

  const open = (route: '/quran' | '/duas' | '/more') => {
    router.push(route);
  };

  const handlePrayer = (prayerId: string) => {
    void Haptics.selectionAsync();
    togglePrayer(prayerId);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: colors.deepMuted }]}>الأربعاء، ٢٣ سبتمبر ٢٠٢٦</Text>
            <Text style={[styles.greeting, { color: colors.deep }]}>السلام عليكم</Text>
            <Text style={[styles.subGreeting, { color: colors.mutedForeground }]}>نسأل الله أن يتقبل طاعتكم</Text>
          </View>
          <Pressable style={[styles.avatar, { backgroundColor: colors.secondary }]} onPress={() => open('/more')}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>ص</Text>
          </Pressable>
        </View>

        <View style={[styles.locationRow, { backgroundColor: colors.secondary }]}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.deepMuted }]}>بيروت، لبنان</Text>
          <View style={styles.locationSpacer} />
          <Text style={[styles.hijriText, { color: colors.primary }]}>١ ربيع الآخر ١٤٤٨</Text>
          <Feather name="chevron-left" size={15} color={colors.primary} />
        </View>

        <View style={[styles.nextPrayerCard, { backgroundColor: colors.deep }]}>
          <View style={styles.nextPrayerTop}>
            <View>
              <Text style={styles.nextLabel}>الصلاة القادمة</Text>
              <Text style={styles.nextName}>المغرب <Text style={styles.nextEnglish}>Maghrib</Text></Text>
            </View>
            <View style={styles.countdownPill}>
              <Text style={[styles.countdownValue, { color: colors.deep }]}>02:14:08</Text>
              <Text style={[styles.countdownCaption, { color: colors.deepMuted }]}>متبقي</Text>
            </View>
          </View>
          <View style={styles.nextPrayerBottom}>
            <View style={styles.nextTimeWrap}>
              <Text style={styles.nextTime}>19:21</Text>
              <Text style={styles.nextTimePeriod}>PM</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: colors.gold, width: '58%' }]} />
            </View>
            <Text style={styles.sunsetText}>غروب الشمس 18:59</Text>
          </View>
        </View>

        <SectionTitle title="مواقيت الصلاة" action={`${completedCount}/5 مكتملة`} />
        <View style={[styles.prayerList, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {prayers.map((prayer, index) => {
            const isCompleted = completedPrayers[prayer.id];
            const isNext = prayer.id === 'maghrib';
            return (
              <Pressable
                key={prayer.id}
                onPress={() => handlePrayer(prayer.id)}
                style={({ pressed }) => [
                  styles.prayerRow,
                  index < prayers.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
                  isNext && { backgroundColor: colors.cream },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View style={[styles.prayerIcon, { backgroundColor: isNext ? '#F4E4B7' : colors.secondary }]}>
                  <Feather name={prayer.icon} size={17} color={isNext ? colors.accentForeground : colors.primary} />
                </View>
                <View style={styles.prayerNameWrap}>
                  <Text style={[styles.prayerName, { color: colors.deep }]}>{prayer.name}</Text>
                  <Text style={[styles.prayerEnglish, { color: colors.mutedForeground }]}>{prayer.english}</Text>
                </View>
                <Text style={[styles.prayerTime, { color: colors.deep }]}>{prayer.time}</Text>
                <Pressable
                  onPress={() => handlePrayer(prayer.id)}
                  style={[styles.checkCircle, { borderColor: isCompleted ? colors.success : colors.border, backgroundColor: isCompleted ? colors.success : colors.background }]}
                >
                  {isCompleted ? <Feather name="check" size={13} color={colors.white} /> : null}
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle title="الوصول السريع" />
        <View style={styles.quickGrid}>
          <Pressable onPress={() => open('/quran')} style={({ pressed }) => [styles.quickCard, { backgroundColor: '#E0ECE5' }, pressed && styles.pressed]}>
            <View style={[styles.quickIcon, { backgroundColor: '#BCD4C8' }]}><Feather name="book-open" size={20} color={colors.primary} /></View>
            <Text style={[styles.quickTitle, { color: colors.deep }]}>القرآن الكريم</Text>
            <Text style={[styles.quickSubtitle, { color: colors.deepMuted }]}>واصل من يس</Text>
            <View style={[styles.quickArrow, { backgroundColor: colors.primary }]}><Feather name="arrow-up-left" size={14} color={colors.white} /></View>
          </Pressable>
          <Pressable onPress={() => open('/duas')} style={({ pressed }) => [styles.quickCard, { backgroundColor: '#F3E5C5' }, pressed && styles.pressed]}>
            <View style={[styles.quickIcon, { backgroundColor: '#E9D29C' }]}><Feather name="heart" size={20} color={colors.accentForeground} /></View>
            <Text style={[styles.quickTitle, { color: colors.deep }]}>الأدعية اليومية</Text>
            <Text style={[styles.quickSubtitle, { color: colors.deepMuted }]}>وردك اليومي</Text>
            <View style={[styles.quickArrow, { backgroundColor: colors.accentForeground }]}><Feather name="arrow-up-left" size={14} color={colors.white} /></View>
          </Pressable>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: colors.coral }]}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quoteText}>ألا بذكر الله تطمئن القلوب</Text>
          <Text style={styles.quoteSource}>الرعد · ٢٨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontSize: 12, fontWeight: '500', textAlign: 'right' },
  greeting: { fontSize: 28, fontWeight: '700', marginTop: 7, textAlign: 'right', letterSpacing: -0.4 },
  subGreeting: { fontSize: 13, marginTop: 3, textAlign: 'right' },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 21, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 18 },
  locationText: { fontSize: 12, marginLeft: 5 },
  locationSpacer: { flex: 1 },
  hijriText: { fontSize: 11, marginRight: 4 },
  nextPrayerCard: { borderRadius: 22, padding: 19, marginTop: 14 },
  nextPrayerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nextLabel: { color: '#B6D2CB', fontSize: 12, textAlign: 'right', marginBottom: 7 },
  nextName: { color: '#FFF9ED', fontSize: 25, fontWeight: '700', textAlign: 'right' },
  nextEnglish: { color: '#9EBBB4', fontSize: 13, fontWeight: '500' },
  countdownPill: { backgroundColor: '#2A6761', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, alignItems: 'center' },
  countdownValue: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  countdownCaption: { fontSize: 10, marginTop: 2 },
  nextPrayerBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  nextTimeWrap: { flexDirection: 'row', alignItems: 'flex-end' },
  nextTime: { color: '#FFF9ED', fontSize: 32, fontWeight: '700', letterSpacing: -1 },
  nextTimePeriod: { color: '#B6D2CB', fontSize: 11, marginLeft: 4, marginBottom: 6 },
  progressTrack: { flex: 1, height: 5, backgroundColor: '#376762', borderRadius: 5, marginHorizontal: 13, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  sunsetText: { color: '#B6D2CB', fontSize: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 11 },
  sectionTitle: { fontSize: 18, fontWeight: '700', textAlign: 'right' },
  sectionAction: { fontSize: 12, fontWeight: '600' },
  prayerList: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  prayerRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 },
  prayerIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  prayerNameWrap: { flex: 1, marginLeft: 11 },
  prayerName: { fontSize: 16, fontWeight: '700', textAlign: 'left' },
  prayerEnglish: { fontSize: 11, marginTop: 2, textAlign: 'left' },
  prayerTime: { fontSize: 15, fontWeight: '600', marginRight: 15 },
  checkCircle: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  quickGrid: { flexDirection: 'row', gap: 10 },
  quickCard: { flex: 1, minHeight: 148, borderRadius: 19, padding: 14, position: 'relative' },
  pressed: { opacity: 0.74, transform: [{ scale: 0.98 }] },
  quickIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  quickTitle: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
  quickSubtitle: { fontSize: 11, marginTop: 4, textAlign: 'right' },
  quickArrow: { position: 'absolute', right: 13, bottom: 12, width: 27, height: 27, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  quoteCard: { borderRadius: 18, padding: 16, marginTop: 14, minHeight: 106, justifyContent: 'center' },
  quoteMark: { color: '#F6C7B8', position: 'absolute', top: 3, left: 14, fontSize: 42, fontWeight: '700' },
  quoteText: { color: '#FFF9ED', fontSize: 20, fontWeight: '600', textAlign: 'right', marginTop: 4 },
  quoteSource: { color: '#FAD4C8', fontSize: 11, textAlign: 'right', marginTop: 7 },
});