import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatGeocodedCity, MANUAL_CITIES, PRAYER_METHODS, type ManualCity, type PrayerId } from '@/hooks/usePrayerTimes';
import { useColors } from '@/hooks/useColors';
import { useSalatak } from '@/providers/SalatakProvider';

const PRAYERS: Array<[PrayerId, string]> = [['fajr', 'الفجر'], ['dhuhr', 'الظهر'], ['asr', 'العصر'], ['maghrib', 'المغرب'], ['isha', 'العشاء']];
const PRIVACY_POLICY_URL = Constants.expoConfig?.extra?.privacyPolicyUrl as string | undefined;
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const colors = useColors();
  const state = useSalatak();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ManualCity[]>([]);
  const [leadText, setLeadText] = useState(String(state.notificationLeadMinutes));

  useEffect(() => {
    const query = search.trim();
    if (!query) {
      setResults([]);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      Location.geocodeAsync(query).then((places) => {
        if (cancelled) return;
        Promise.all(places.map(async (place, index) => ({
          id: `settings-${place.latitude}-${place.longitude}-${index}`,
          ...formatGeocodedCity(
            await Location.reverseGeocodeAsync({ latitude: place.latitude, longitude: place.longitude })
              .then((addresses) => addresses[0] ?? {})
              .catch(() => ({})),
            query,
          ),
          latitude: place.latitude,
          longitude: place.longitude,
        }))).then((resolved) => {
          if (!cancelled) setResults(resolved);
        });
      }).catch(() => {
        if (!cancelled) setResults([]);
      });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  const presetCities = search.trim()
    ? MANUAL_CITIES.filter((city) => `${city.name} ${city.country} ${city.id}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
    : [];
  const cities = [...presetCities, ...results];
  const setLead = (value: string) => {
    const minutes = Number(value);
    if (!Number.isFinite(minutes)) {
      setLeadText(value);
      return;
    }
    const normalized = Math.max(0, Math.min(60, Math.trunc(minutes)));
    setLeadText(String(normalized));
    state.setNotificationLeadMinutes(normalized);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.back}><Feather name="arrow-right" size={20} color={colors.deep} /><Text style={[styles.backText, { color: colors.deep }]}>الإعدادات</Text></Pressable>
        <Section title="الصلاة" colors={colors}>
          <Choice label="طريقة الحساب" value={PRAYER_METHODS[state.prayerMethod]} onPress={() => state.setPrayerMethod(state.prayerMethod === 'tehran' ? 'qom' : 'tehran')} colors={colors} />
          <Choice label="قاعدة العصر" value={state.asrMadhab === 'shafi' ? 'الشافعي (ظل واحد)' : 'الحنفي (ظلان)'} onPress={() => state.setAsrMadhab(state.asrMadhab === 'shafi' ? 'hanafi' : 'shafi')} colors={colors} />
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>التعديلات بالدقائق تضاف إلى مواقيت الصلاة.</Text>
          {PRAYERS.map(([id, label]) => <Stepper key={id} label={label} value={state.prayerOffsets[id]} onChange={(value) => state.setPrayerOffset(id, value)} colors={colors} />)}
        </Section>
        <Section title="الموقع" colors={colors}>
          <TextInput value={search} onChangeText={setSearch} placeholder="ابحث عن مدينة" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.deep, borderColor: colors.border }]} />
          {(search ? cities : MANUAL_CITIES.slice(0, 6)).map((city) => <Choice key={city.id} label={`${city.name}، ${city.country}`} value={state.selectedCity?.id === city.id ? 'محددة' : ''} onPress={() => { state.setSelectedCity(city); setSearch(''); }} colors={colors} />)}
        </Section>
        <Section title="الهجري والعرض" colors={colors}>
          <Stepper label="تعديل التاريخ الهجري" value={state.hijriOffset} min={-2} max={2} onChange={state.setHijriOffset} colors={colors} />
          <Choice label="صيغة الوقت" value={state.timeFormat} onPress={() => state.setTimeFormat(state.timeFormat === '24h' ? '12h' : '24h')} colors={colors} />
          <Stepper label="حجم نص القرآن" value={state.quranTextSize} min={16} max={32} step={2} onChange={state.setQuranTextSize} colors={colors} />
        </Section>
        <Section title="التنبيهات" colors={colors}>
          {PRAYERS.map(([id, label]) => <Toggle key={id} label={label} value={state.prayerNotifications[id]} onChange={(value) => state.setPrayerNotification(id, value)} colors={colors} />)}
          <View style={styles.row}><Text style={[styles.label, { color: colors.deep }]}>التنبيه قبل (دقيقة)</Text><TextInput keyboardType="number-pad" value={leadText} onChangeText={setLead} style={[styles.numberInput, { color: colors.deep, borderColor: colors.border }]} /></View>
        </Section>
        <Section title="حول التطبيق" colors={colors}>
          <Text style={[styles.about, { color: colors.mutedForeground }]}>صلاتك · مواقيت الصلاة والقرآن والأذكار</Text>
          <Text style={[styles.about, { color: colors.mutedForeground }]}>المحتوى الديني من مصادره الموثقة، والتاريخ الهجري حساب تقريبي.</Text>
          <Text style={[styles.about, { color: colors.mutedForeground }]}>الإصدار {APP_VERSION}</Text>
          {PRIVACY_POLICY_URL && <Choice label="سياسة الخصوصية" value="فتح" onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)} colors={colors} />}
          <Choice label="الاعتمادات والمصادر" value="عرض" onPress={() => router.push('/wallpaper-credits')} colors={colors} />
          <Pressable onPress={() => Alert.alert('إعادة الإعدادات', 'هل تريد إعادة إعدادات الصلاة والعرض والتنبيهات؟', [{ text: 'إلغاء', style: 'cancel' }, { text: 'إعادة', style: 'destructive', onPress: state.resetSettings }])}><Text style={[styles.reset, { color: colors.primary }]}>إعادة الإعدادات</Text></Pressable>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, colors, children }: { title: string; colors: ReturnType<typeof useColors>; children: React.ReactNode }) {
  return <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.sectionTitle, { color: colors.deep }]}>{title}</Text>{children}</View>;
}
function Choice({ label, value, onPress, colors }: { label: string; value: string; onPress: () => void; colors: ReturnType<typeof useColors> }) {
  return <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.deep }]}>{label}</Text><Text style={[styles.value, { color: colors.primary }]}>{value}</Text></Pressable>;
}
function Toggle({ label, value, onChange, colors }: { label: string; value: boolean; onChange: (value: boolean) => void; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.row, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.deep }]}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.primary }} /></View>;
}
function Stepper({ label, value, onChange, colors, min = -30, max = 30, step = 1 }: { label: string; value: number; onChange: (value: number) => void; colors: ReturnType<typeof useColors>; min?: number; max?: number; step?: number }) {
  return <View style={[styles.row, { borderBottomColor: colors.border }]}><Text style={[styles.label, { color: colors.deep }]}>{label}</Text><View style={styles.stepper}><Pressable onPress={() => onChange(Math.min(max, value + step))}><Text style={[styles.step, { color: colors.primary }]}>+</Text></Pressable><Text style={[styles.value, { color: colors.deep }]}>{value}</Text><Pressable onPress={() => onChange(Math.max(min, value - step))}><Text style={[styles.step, { color: colors.primary }]}>−</Text></Pressable></View></View>;
}
const styles = StyleSheet.create({
  safe: { flex: 1 }, content: { padding: 18, paddingBottom: 40 }, back: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 }, backText: { fontSize: 24, fontWeight: '700' }, section: { borderWidth: 1, borderRadius: 16, padding: 12, marginBottom: 14 }, sectionTitle: { fontSize: 18, fontWeight: '700', textAlign: 'right', marginBottom: 5 }, row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth }, label: { fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1 }, value: { fontSize: 13, fontWeight: '600' }, hint: { fontSize: 11, textAlign: 'right', paddingVertical: 8 }, input: { borderWidth: 1, borderRadius: 10, padding: 10, textAlign: 'right', marginVertical: 8 }, stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 }, step: { fontSize: 23, fontWeight: '700' }, numberInput: { borderWidth: 1, borderRadius: 8, width: 65, padding: 7, textAlign: 'center' }, about: { fontSize: 12, textAlign: 'right', paddingVertical: 5 }, reset: { fontSize: 13, fontWeight: '700', textAlign: 'right', paddingTop: 12 },
});
