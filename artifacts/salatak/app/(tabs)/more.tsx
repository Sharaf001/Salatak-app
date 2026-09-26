import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';
import { notificationsSupported } from '@/hooks/usePrayerNotifications';

function ToolRow({
  icon,
  title,
  subtitle,
  onPress,
  accent,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle: string;
  onPress?: () => void;
  accent?: string;
}) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.toolRow, { borderBottomColor: colors.border }, pressed && { opacity: 0.7 }]}>
      <View style={[styles.toolIcon, { backgroundColor: accent ?? colors.secondary }]}><Feather name={icon} size={18} color={accent ? colors.accentForeground : colors.primary} /></View>
      <View style={styles.toolCopy}><Text style={[styles.toolTitle, { color: colors.deep }]}>{title}</Text><Text style={[styles.toolSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text></View>
      <Feather name="chevron-left" size={17} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { rakahCount, incrementRakah, resetRakah, bookmarks, notificationsEnabled, toggleNotifications } = useSalatak();

  const countRakah = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    incrementRakah();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>كل ما تحتاجه</Text>
            <Text style={[styles.title, { color: colors.deep }]}>المزيد</Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}><Feather name="grid" size={19} color={colors.primary} /></View>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.deep }]}>
          <View style={[styles.profileMark, { backgroundColor: '#2A6761' }]}><Text style={styles.profileLetter}>ص</Text></View>
          <View style={styles.profileCopy}><Text style={styles.profileTitle}>صلاتك</Text><Text style={styles.profileSubtitle}>رفيقك لكل صلاة وذكر</Text></View>
          <Feather name="settings" size={19} color="#B6D2CB" />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.deep }]}>أدوات العبادة</Text>
        <View style={[styles.toolGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToolRow icon="calendar" title="التقويم الهجري" subtitle="١ ربيع الآخر ١٤٤٨" accent="#F3E5C5" onPress={() => Alert.alert('التقويم الهجري', 'اليوم الأربعاء، ٢٣ سبتمبر ٢٠٢٦ يوافق ١ ربيع الآخر ١٤٤٨.')} />
          <ToolRow icon="hash" title="عداد الركعات" subtitle={`${rakahCount} ركعات مسجلة اليوم`} onPress={countRakah} />
          <ToolRow icon="bookmark" title="المحفوظات" subtitle={`${bookmarks.length} عناصر محفوظة`} onPress={() => Alert.alert('المحفوظات', 'ستجد هنا السور والأدعية التي حفظتها للرجوع إليها بسرعة.')} />
          <ToolRow icon="compass" title="اتجاه القبلة" subtitle="اضبط موقعك لمعرفة الاتجاه" onPress={() => Alert.alert('اتجاه القبلة', 'ميزة تحديد اتجاه القبلة ستستخدم موقع جهازك عند تفعيلها.')} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.deep, marginTop: 25 }]}>المميزات</Text>
        <View style={[styles.toolGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ToolRow icon="sun" title="الأذكار" subtitle="أذكار الصباح والمساء والتسبيحات" onPress={() => router.push('/azkar')} />
          <ToolRow icon="circle" title="المسبحة" subtitle="عداد إلكتروني لتسبيحة الزهراء والتسبيح المفتوح" onPress={() => router.push('/tasbih')} />
          <ToolRow icon="book-open" title="الزيارات" subtitle="زيارات الأئمة العامة وزيارات أيام الأسبوع" onPress={() => router.push('/ziyarat')} />
          <ToolRow icon="image" title="الخلفيات" subtitle="خلفيات هاتف بجودة عالية للمراقد والمناسبات" onPress={() => router.push('/wallpapers')} />
        </View>

        <View style={[styles.counterCard, { backgroundColor: '#E0ECE5' }]}>
          <View style={styles.counterTop}>
            <View><Text style={[styles.counterLabel, { color: colors.deepMuted }]}>عداد الركعات</Text><Text style={[styles.counterTitle, { color: colors.deep }]}>سجّل صلاتك بهدوء</Text></View>
            <View style={[styles.counterNumber, { backgroundColor: '#BCD4C8' }]}><Text style={[styles.counterNumberText, { color: colors.primary }]}>{rakahCount}</Text></View>
          </View>
          <View style={styles.counterActions}>
            <Pressable onPress={resetRakah} style={[styles.resetButton, { borderColor: colors.deepMuted }]}><Text style={[styles.resetText, { color: colors.deepMuted }]}>تصفير</Text></Pressable>
            <Pressable onPress={countRakah} style={[styles.addButton, { backgroundColor: colors.primary }]}><Feather name="plus" size={18} color={colors.white} /><Text style={styles.addText}>أضف ركعة</Text></Pressable>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.deep, marginTop: 25 }]}>الإعدادات</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            onPress={() => {
              if (!notificationsSupported) {
                Alert.alert('يتطلب بناء تطوير', 'تنبيهات الصلاة تحتاج نسخة "development build" من التطبيق ولا تعمل داخل Expo Go على أندرويد. راسلنا للمزيد من التفاصيل.');
                return;
              }
              void Haptics.selectionAsync();
              toggleNotifications();
            }}
            style={styles.settingRow}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}><Ionicons name="notifications-outline" size={18} color={colors.primary} /></View>
            <Text style={[styles.settingText, { color: colors.deep }]}>تنبيهات الصلاة</Text>
            <View style={[styles.statusPill, { backgroundColor: !notificationsSupported ? '#F1E5E5' : notificationsEnabled ? '#E4EEE9' : '#F1E5E5' }]}>
              <Text style={[styles.statusText, { color: !notificationsSupported ? colors.mutedForeground : notificationsEnabled ? colors.success : colors.mutedForeground }]}>
                {!notificationsSupported ? 'غير متاحة' : notificationsEnabled ? 'مفعّلة' : 'متوقفة'}
              </Text>
            </View>
          </Pressable>
          <View style={styles.settingRow}><View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}><Feather name="map-pin" size={17} color={colors.primary} /></View><Text style={[styles.settingText, { color: colors.deep }]}>الموقع</Text><Text style={[styles.settingValue, { color: colors.mutedForeground }]}>بيروت</Text></View>
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
  profileCard: { borderRadius: 20, padding: 17, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profileMark: { width: 47, height: 47, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  profileLetter: { color: '#E8C77D', fontSize: 22, fontWeight: '700' },
  profileCopy: { flex: 1, marginLeft: 12 },
  profileTitle: { color: '#FFF9ED', fontSize: 17, fontWeight: '700', textAlign: 'left' },
  profileSubtitle: { color: '#B6D2CB', fontSize: 11, marginTop: 3, textAlign: 'left' },
  sectionTitle: { fontSize: 18, fontWeight: '700', textAlign: 'right', marginBottom: 10 },
  toolGroup: { borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  toolRow: { minHeight: 65, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  toolIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  toolCopy: { flex: 1, marginLeft: 11 },
  toolTitle: { fontSize: 14, fontWeight: '700', textAlign: 'left' },
  toolSubtitle: { fontSize: 10, marginTop: 3, textAlign: 'left' },
  counterCard: { borderRadius: 19, padding: 15, marginTop: 14 },
  counterTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counterLabel: { fontSize: 11, textAlign: 'left' },
  counterTitle: { fontSize: 16, fontWeight: '700', textAlign: 'left', marginTop: 4 },
  counterNumber: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  counterNumberText: { fontSize: 23, fontWeight: '700' },
  counterActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 9, marginTop: 15 },
  resetButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  resetText: { fontSize: 11, fontWeight: '600' },
  addButton: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  addText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  settingsCard: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
  settingRow: { minHeight: 60, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', borderBottomColor: '#D8DED7', borderBottomWidth: StyleSheet.hairlineWidth },
  settingIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  settingText: { flex: 1, fontSize: 14, fontWeight: '600', marginLeft: 11, textAlign: 'left' },
  statusPill: { borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5 },
  statusText: { fontSize: 10, fontWeight: '700' },
  settingValue: { fontSize: 11 },
});