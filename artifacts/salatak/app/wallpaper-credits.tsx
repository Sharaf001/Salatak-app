import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { wallpaperCredits } from "@/data/wallpaperCredits";

export default function WallpaperCreditsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backRow}
          hitSlop={10}
        >
          <Feather name="chevron-right" size={16} color="#6B7A74" />
          <Text style={styles.backText}>رجوع</Text>
        </Pressable>
        <Text style={styles.eyebrow}>المصادر والتراخيص</Text>
        <Text style={styles.title}>اعتمادات الخلفيات</Text>
        <Text style={styles.intro}>
          هذه الخلفيات نسخ مصغّرة مستضافة داخل التطبيق بدل تحميل الصور الأصلية
          من Wikimedia Commons. اضغط على المصدر لفتح صفحة الملف الأصلية.
        </Text>
        {wallpaperCredits.map((credit) => (
          <View key={credit.slug} style={styles.card}>
            <Text style={styles.cardTitle}>{credit.title}</Text>
            <Text style={styles.detail}>المصوّر: {credit.author}</Text>
            <Text style={styles.detail}>الترخيص: {credit.license}</Text>
            <Text style={styles.note}>{credit.note}</Text>
            <Pressable
              onPress={() => void Linking.openURL(credit.sourceUrl)}
              style={styles.sourceButton}
            >
              <Feather name="external-link" size={14} color="#1F5A55" />
              <Text style={styles.sourceText}>
                صفحة الملف على Wikimedia Commons
              </Text>
            </Pressable>
            <Pressable onPress={() => void Linking.openURL(credit.licenseUrl)}>
              <Text style={styles.licenseLink}>نص الترخيص الكامل</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F3EC" },
  content: { paddingHorizontal: 20, paddingTop: 14 },
  backRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-end",
    marginBottom: 22,
  },
  backText: { fontSize: 13, fontWeight: "600", color: "#6B7A74" },
  eyebrow: { textAlign: "right", fontSize: 12, color: "#376762" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 6,
    color: "#173B3A",
  },
  intro: {
    textAlign: "right",
    lineHeight: 22,
    color: "#6B7A74",
    marginTop: 14,
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#FFFCF6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8DED7",
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    textAlign: "right",
    fontSize: 16,
    fontWeight: "700",
    color: "#173B3A",
    marginBottom: 10,
  },
  detail: { textAlign: "right", color: "#376762", lineHeight: 22 },
  note: { textAlign: "right", color: "#6B7A74", lineHeight: 21, marginTop: 6 },
  sourceButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    marginTop: 12,
  },
  sourceText: { color: "#1F5A55", fontSize: 12, fontWeight: "600" },
  licenseLink: {
    color: "#6B7A74",
    fontSize: 12,
    textAlign: "right",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});
