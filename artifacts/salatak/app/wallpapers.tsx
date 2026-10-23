import { Feather } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system/legacy';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallpapers } from '@workspace/api-client-react';
import { ErrorFallback } from '@/components/ErrorFallback';
import { wallpaperCredits } from '@/data/wallpaperCredits';

const categories = ['الكل', 'المراقد المقدسة', 'مناسبات'];

const WALLPAPER_SOURCES = {
  'wp-1': require('@/assets/wallpapers/wp-1.jpg'),
  'wp-2': require('@/assets/wallpapers/wp-2.jpg'),
  'wp-3': require('@/assets/wallpapers/wp-3.png'),
  'wp-4': require('@/assets/wallpapers/wp-4.jpg'),
  'wp-5': require('@/assets/wallpapers/wp-5.jpg'),
  'wp-6': require('@/assets/wallpapers/wp-6.jpg'),
} as const;

const FALLBACK_WALLPAPERS = [
  { id: 'wp-1', category: 'المراقد المقدسة', title: 'مقام كربلاء', source: WALLPAPER_SOURCES['wp-1'] },
  { id: 'wp-2', category: 'المراقد المقدسة', title: 'مقام النجف', source: WALLPAPER_SOURCES['wp-2'] },
  { id: 'wp-3', category: 'مناسبات', title: 'ليالي رمضان', source: WALLPAPER_SOURCES['wp-3'] },
  { id: 'wp-4', category: 'مناسبات', title: 'ليلة القدر', source: WALLPAPER_SOURCES['wp-4'] },
  { id: 'wp-5', category: 'المراقد المقدسة', title: 'الحرم العباسي', source: WALLPAPER_SOURCES['wp-5'] },
  { id: 'wp-6', category: 'مناسبات', title: 'عيد الفطر', source: WALLPAPER_SOURCES['wp-6'] },
];

export default function WallpapersScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const { data } = useWallpapers();
  const wallpapers = Array.isArray(data) && data.length > 0
    ? data.map((w) => {
      const source = WALLPAPER_SOURCES[w.slug as keyof typeof WALLPAPER_SOURCES];
      return source ? { id: w.slug, category: w.category, title: w.title, source } : null;
    }).filter((item): item is NonNullable<typeof item> => item !== null)
    : FALLBACK_WALLPAPERS;
  const visible = activeCategory === 'الكل' ? wallpapers : wallpapers.filter((item) => item.category === activeCategory);

  const downloadWallpaper = async (id: string, source: (typeof WALLPAPER_SOURCES)[keyof typeof WALLPAPER_SOURCES], title: string) => {
    try {
      setDownloadingId(id);
      const asset = Asset.fromModule(source);
      await asset.downloadAsync();
      const imageUri = asset.localUri ?? asset.uri;
      if (Platform.OS === 'web') {
        await Linking.openURL(imageUri);
        return;
      }
      if (Constants.appOwnership === 'expo') {
        Alert.alert('يلزم إصدار التطوير', 'حفظ الخلفيات غير متاح بالكامل في Expo Go. شغّل نسخة تطويرية للتطبيق لاختبار الحفظ في صور جهازك.');
        return;
      }
      const MediaLibrary = await import('expo-media-library');
      const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo']);
      if (!permission.granted) {
        Alert.alert('الإذن مطلوب', 'اسمح للتطبيق بالوصول إلى الصور لحفظ الخلفية.');
        return;
      }
      const extension = id === 'wp-3' ? 'png' : 'jpg';
      const localUri = `${FileSystem.cacheDirectory}salatak-${id}.${extension}`;
      await FileSystem.deleteAsync(localUri, { idempotent: true });
      await FileSystem.copyAsync({ from: imageUri, to: localUri });
      await MediaLibrary.createAssetAsync(localUri);
      setDownloadedIds((current) => new Set(current).add(id));
      Alert.alert('تم الحفظ', `تم حفظ «${title}» في صور جهازك.`);
    } catch (error) {
      console.error('Failed to download wallpaper:', error);
      Alert.alert('تعذر الحفظ', 'تعذر حفظ الخلفية الآن. تحقق من اتصالك ومساحة التخزين ثم حاول مرة أخرى.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="العودة" onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color="#6B7A74" />
          <Text style={styles.backText}>رجوع</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>معرض الصور</Text>
            <Text style={styles.title}>الخلفيات</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push('/wallpaper-credits')} style={styles.creditsButton}>
              <Feather name="info" size={14} color="#1F5A55" />
              <Text style={styles.creditsText}>اعتمادات ({wallpaperCredits.length})</Text>
            </Pressable>
            <View style={styles.headerIcon}>
              <Feather name="image" size={19} color="#1F5A55" />
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filters, { flexDirection: 'row-reverse' }]}>
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[styles.filter, activeCategory === category && styles.filterActive]}
            >
              <Text style={[styles.filterText, activeCategory === category && styles.filterTextActive]}>{category}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {visible.map((item) => (
            <Pressable key={item.id} style={styles.tile} onPress={() => void downloadWallpaper(item.id, item.source, item.title)}>
              <Image source={item.source} style={styles.image} contentFit="cover" transition={200} />
              <View style={styles.overlay}>
                <Text style={styles.tileTitle}>{item.title}</Text>
              </View>
              <View style={styles.downloadBadge}>
                <Feather name={downloadingId === item.id ? 'loader' : downloadedIds.has(item.id) ? 'check' : 'download'} size={13} color="#FFFFFF" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorFallback error={error} resetError={retry} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F3EC' },
  content: { paddingHorizontal: 20, paddingTop: 14 },
  backRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginBottom: 10 },
  backText: { fontSize: 13, fontWeight: '600', color: '#6B7A74' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  creditsButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 12, backgroundColor: '#E4EEE9' },
  creditsText: { color: '#1F5A55', fontSize: 11, fontWeight: '600' },
  eyebrow: { textAlign: 'right', fontSize: 12, color: '#376762' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'right', marginTop: 6, color: '#173B3A' },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4EEE9' },
  filters: { gap: 8, paddingVertical: 18 },
  filter: { paddingHorizontal: 16, height: 35, borderRadius: 18, borderWidth: 1, borderColor: '#D8DED7', backgroundColor: '#FFFCF6', justifyContent: 'center' },
  filterActive: { backgroundColor: '#1F5A55', borderColor: '#1F5A55' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#376762' },
  filterTextActive: { color: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  tile: { width: '48%', aspectRatio: 0.66, borderRadius: 18, overflow: 'hidden', backgroundColor: '#EAE5DB' },
  image: { width: '100%', height: '100%' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: 'rgba(23,59,58,0.55)' },
  tileTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', textAlign: 'right' },
  downloadBadge: { position: 'absolute', top: 8, left: 8, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(23,59,58,0.55)', alignItems: 'center', justifyContent: 'center' },
});
