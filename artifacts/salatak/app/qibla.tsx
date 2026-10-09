import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const KAABA = { latitude: 21.422487, longitude: 39.826206 };

function getQiblaBearing(latitude: number, longitude: number): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const toDegrees = (radians: number) => (radians * 180) / Math.PI;
  const latitudeRadians = toRadians(latitude);
  const kaabaLatitudeRadians = toRadians(KAABA.latitude);
  const longitudeDelta = toRadians(KAABA.longitude - longitude);
  const bearing = toDegrees(
    Math.atan2(
      Math.sin(longitudeDelta),
      Math.cos(latitudeRadians) * Math.tan(kaabaLatitudeRadians) -
        Math.sin(latitudeRadians) * Math.cos(longitudeDelta),
    ),
  );
  return (bearing + 360) % 360;
}

function getHeading(x: number, y: number): number {
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export default function QiblaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState('جارٍ تحديد موقعك...');
  const [error, setError] = useState<string | null>(null);
  const [hasMagnetometer, setHasMagnetometer] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let subscription: ReturnType<typeof Magnetometer.addListener> | null = null;

    const loadQibla = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          throw new Error('يلزم السماح بالوصول إلى الموقع لحساب اتجاه القبلة.');
        }

        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (cancelled) return;
        setQiblaBearing(getQiblaBearing(position.coords.latitude, position.coords.longitude));
        setStatus('وجّه هاتفك نحو السهم لمعرفة اتجاه القبلة.');

        if (Platform.OS === 'web' || !(await Magnetometer.isAvailableAsync())) {
          setError('البوصلة الحية غير متاحة على هذا الجهاز. الاتجاه المحسوب أدناه يعتمد على الشمال الجغرافي.');
          return;
        }

        setHasMagnetometer(true);
        Magnetometer.setUpdateInterval(250);
        subscription = Magnetometer.addListener(({ x, y }) => {
          if (!cancelled) setHeading(getHeading(x, y));
        });
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : 'تعذر تحديد موقعك. تحقق من تفعيل خدمات الموقع ثم حاول مرة أخرى.');
          setStatus('تعذر حساب اتجاه القبلة');
        }
      }
    };

    void loadQibla();
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  const relativeBearing = useMemo(
    () => (qiblaBearing === null || heading === null ? qiblaBearing : (qiblaBearing - heading + 360) % 360),
    [heading, qiblaBearing],
  );
  const arrowRotation = relativeBearing === null ? '0deg' : `${relativeBearing}deg`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>رجوع</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.deepMuted }]}>اتجاه القبلة</Text>
          <Text style={[styles.title, { color: colors.deep }]}>البوصلة</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{status}</Text>
        </View>

        <View style={[styles.compass, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {qiblaBearing === null ? (
            <ActivityIndicator color={colors.primary} size="large" />
          ) : (
            <>
              <View style={[styles.arrow, { transform: [{ rotate: arrowRotation }] }]}>
                <Feather name="navigation" size={92} color={colors.primary} />
              </View>
              <Text style={[styles.kaaba, { color: colors.accentForeground }]}>الكعبة</Text>
              <Text style={[styles.bearing, { color: colors.deep }]}>{Math.round(qiblaBearing)}° من الشمال</Text>
            </>
          )}
        </View>

        {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
        {hasMagnetometer && heading === null ? (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>حرّك الهاتف بشكل دائري لمعايرة البوصلة.</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },
  backRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4 },
  backText: { fontSize: 13 },
  header: { alignItems: 'center', marginTop: 32 },
  eyebrow: { fontSize: 13 },
  title: { fontSize: 30, fontWeight: '700', marginTop: 5 },
  subtitle: { fontSize: 12, marginTop: 8, textAlign: 'center' },
  compass: {
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 42,
  },
  arrow: { alignItems: 'center', justifyContent: 'center' },
  kaaba: { fontSize: 15, fontWeight: '700', marginTop: 8 },
  bearing: { fontSize: 12, marginTop: 5 },
  error: { fontSize: 13, lineHeight: 21, textAlign: 'center', marginTop: 26 },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 18 },
});
