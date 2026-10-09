import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { getQiblaBearing, getRelativeBearing } from '@/lib/qibla';
import { ErrorFallback } from '@/components/ErrorFallback';

export default function QiblaScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState('جارٍ تحديد موقعك...');
  const [error, setError] = useState<string | null>(null);
  const [headingAccuracy, setHeadingAccuracy] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    const loadQibla = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          throw new Error('يلزم السماح بالوصول إلى الموقع لحساب اتجاه القبلة.');
        }

        export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
          return <ErrorFallback error={error} resetError={retry} />;
        }

        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        if (cancelled) return;
        setQiblaBearing(getQiblaBearing(position.coords.latitude, position.coords.longitude));
        setStatus('وجّه هاتفك نحو السهم لمعرفة اتجاه القبلة.');

        if (Platform.OS === 'web') {
          setError('البوصلة الحية غير متاحة على هذا الجهاز. الاتجاه المحسوب أدناه يعتمد على الشمال الجغرافي.');
          return;
        }

        subscription = await Location.watchHeadingAsync((reading) => {
          if (cancelled) return;
          const nextHeading = reading.trueHeading >= 0 ? reading.trueHeading : reading.magHeading;
          setHeading(nextHeading);
          setHeadingAccuracy(reading.accuracy);
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
    () => (qiblaBearing === null || heading === null ? qiblaBearing : getRelativeBearing(qiblaBearing, heading)),
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
        {Platform.OS !== 'web' && headingAccuracy !== null && headingAccuracy < 0 ? (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>حرّك الهاتف بشكل دائري لمعايرة البوصلة قبل الاعتماد على الاتجاه.</Text>
        ) : null}
        {Platform.OS !== 'web' && heading !== null && headingAccuracy !== null && headingAccuracy >= 0 ? (
          <Text style={[styles.hint, { color: colors.mutedForeground }]}>دقة البوصلة: {headingAccuracy === 3 ? 'منخفضة' : headingAccuracy === 2 ? 'متوسطة' : 'جيدة'}</Text>
        ) : null}
        {Platform.OS !== 'web' && heading === null ? (
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
