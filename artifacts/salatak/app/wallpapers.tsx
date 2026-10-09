import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallpapers } from '@workspace/api-client-react';

const categories = ['الكل', 'المراقد المقدسة', 'مناسبات'];

// Bundled offline content uses named Wikimedia Commons artwork rather than
// generated placeholders. Keep these URLs in sync with lib/db/src/seed.ts.
const FALLBACK_WALLPAPERS = [
  { id: 'wp-1', category: 'المراقد المقدسة', title: 'مقام كربلاء', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Kerbela_Hussein_Moschee.jpg' },
  { id: 'wp-2', category: 'المراقد المقدسة', title: 'مقام النجف', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Shrine_of_Imam_Ali_Najaf_August_2023.jpg' },
  { id: 'wp-3', category: 'مناسبات', title: 'ليالي رمضان', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/80/17th_of_Ramadan_Mosque_night.png' },
  { id: 'wp-4', category: 'مناسبات', title: 'ليلة القدر', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Laylat_al-Qadr_%28mosque%29.svg' },
  { id: 'wp-5', category: 'المراقد المقدسة', title: 'الحرم العباسي', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Abbas_ibn_Ali_Shrine%2C_Qajar.jpg' },
  { id: 'wp-6', category: 'مناسبات', title: 'عيد الفطر', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Jeonju_Mosque_during_Eid_al-Fitr_2026_6.jpg' },
];

export default function WallpapersScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('الكل');
  const { data } = useWallpapers();
  const wallpapers = Array.isArray(data) && data.length > 0 ? data.map((w) => ({ id: w.slug, category: w.category, title: w.title, imageUrl: w.imageUrl })) : FALLBACK_WALLPAPERS;
  const visible = activeCategory === 'الكل' ? wallpapers : wallpapers.filter((item) => item.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <Feather name="chevron-right" size={16} color="#6B7A74" />
          <Text style={styles.backText}>رجوع</Text>
        </Pressable>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>معرض الصور</Text>
            <Text style={styles.title}>الخلفيات</Text>
          </View>
          <View style={styles.headerIcon}>
            <Feather name="image" size={19} color="#1F5A55" />
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
            <Pressable key={item.id} style={styles.tile}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
              <View style={styles.overlay}>
                <Text style={styles.tileTitle}>{item.title}</Text>
              </View>
              <View style={styles.downloadBadge}>
                <Feather name="download" size={13} color="#FFFFFF" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F3EC' },
  content: { paddingHorizontal: 20, paddingTop: 14 },
  backRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, alignSelf: 'flex-end', marginBottom: 10 },
  backText: { fontSize: 13, fontWeight: '600', color: '#6B7A74' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
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
