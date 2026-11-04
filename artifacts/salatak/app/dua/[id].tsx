import { Feather } from '@expo/vector-icons';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDuas } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';
import { FALLBACK_DUAS } from '@/data/religious-content';
import { DUA_AUDIO } from '@/data/dua-audio';

export default function DuaReaderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useDuas();
  const fallback = FALLBACK_DUAS.find((item) => item.id === id);
  const remote = data?.find((item) => item.slug === id);
  const title = remote?.title ?? fallback?.title ?? 'الدعاء';
  const body = remote?.body && remote.body.length > 200 ? remote.body : fallback?.body ?? remote?.body ?? '';
  const audio = DUA_AUDIO[id ?? ''];
  const audioPlayer = useAudioPlayer(
    audio ? { uri: audio.url, name: `${title} - ${audio.reciter}` } : null,
    { downloadFirst: true },
  );
  const audioStatus = useAudioPlayerStatus(audioPlayer);

  useEffect(() => {
    audioPlayer.volume = 1;
    setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    }).catch((error) => {
      console.warn('Dua audio mode setup failed:', error);
    });
  }, [audioPlayer]);

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
        <View style={[styles.audioCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={audioStatus.playing ? 'إيقاف صوت الدعاء' : 'تشغيل صوت الدعاء'}
            disabled={!audio}
            onPress={() => audioStatus.playing ? audioPlayer.pause() : audioPlayer.play()}
            style={[styles.audioButton, { backgroundColor: audio ? colors.primary : colors.border }]}
          >
            <Feather name={audioStatus.playing ? 'pause' : 'play'} size={16} color={colors.primaryForeground} />
            <Text style={[styles.audioButtonText, { color: colors.primaryForeground }]}>{audioStatus.playing ? 'إيقاف الصوت' : 'تشغيل الصوت'}</Text>
          </Pressable>
          <Text style={[styles.audioNote, { color: colors.deepMuted }]}>
            {audio ? `بصوت ${audio.reciter}` : 'الصوت العربي لأباذر الحلواجي غير متاح لهذا الدعاء حالياً'}
          </Text>
          {audio && <Pressable onPress={() => void Linking.openURL(audio.sourceUrl)}><Text style={[styles.sourceLink, { color: colors.primary }]}>مصدر الصوت</Text></Pressable>}
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
  audioCard: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 16, alignItems: 'flex-end', gap: 8 },
  audioButton: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9 },
  audioButtonText: { fontSize: 13, fontWeight: '700' },
  audioNote: { fontSize: 11 },
  sourceLink: { fontSize: 11, textDecorationLine: 'underline' },
  notice: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 16 },
  noticeText: { textAlign: 'right', fontSize: 12, lineHeight: 19 },
  reader: { borderWidth: 1, borderRadius: 18, padding: 18 },
  body: { textAlign: 'right', fontSize: 20, lineHeight: 40 },
});
