import React from 'react';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// IMPORTANT: iOS 26 uses NativeTabs for native tabs with liquid glass support.
// NativeTabs intentionally does NOT use custom design tokens — liquid glass
// is a system-level appearance provided by iOS and cannot be overridden.
// Custom brand colors are applied only on the ClassicTabLayout path (older iOS / Android / web).
function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
        />
        <NativeTabs.Trigger.Label>الرئيسية</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="quran">
        <NativeTabs.Trigger.Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <NativeTabs.Trigger.Label>القرآن</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="duas">
        <NativeTabs.Trigger.Icon sf={{ default: 'hands.sparkles', selected: 'hands.sparkles.fill' }} />
        <NativeTabs.Trigger.Label>الأدعية</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} />
        <NativeTabs.Trigger.Label>المزيد</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.mutedForeground,
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        left: isWeb ? 0 : 20,
        right: isWeb ? 0 : 20,
        bottom: isWeb ? 0 : Math.max(insets.bottom, 8),
        height: isWeb ? 84 : 64,
        paddingTop: isWeb ? 0 : 5,
        paddingBottom: isWeb ? 0 : 5,
        borderRadius: isWeb ? 0 : 32,
        borderWidth: isWeb ? 1 : StyleSheet.hairlineWidth,
        borderTopColor: isWeb ? colors.border : 'rgba(255,255,255,0.42)',
        borderColor: isWeb ? colors.border : isDark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.65)',
        backgroundColor: isWeb ? colors.background : 'transparent',
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isWeb ? 0 : isDark ? 0.3 : 0.14,
        shadowRadius: 16,
        overflow: 'hidden',
      },
      tabBarBackground: () =>
        !isWeb ? (
          <BlurView
            intensity={Platform.OS === 'android' ? 85 : 100}
            tint={isDark ? 'dark' : 'light'}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={styles.glassBackground}
          >
            <View
              style={[
                styles.glassTint,
                { backgroundColor: isDark ? 'rgba(16,35,33,0.68)' : 'rgba(255,252,246,0.72)' },
              ]}
            />
          </BlurView>
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.background },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={String(color)} size={24} />
            ) : (
              <Feather name="home" size={22} color={String(color)} />
            ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'القرآن',
          tabBarIcon: ({ color }) => <Feather name="book-open" size={21} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="duas"
        options={{
          title: 'الأدعية',
          tabBarIcon: ({ color }) => <Feather name="heart" size={21} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'المزيد',
          tabBarIcon: ({ color }) => <Feather name="grid" size={21} color={String(color)} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  glassBackground: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderRadius: 32,
  },
  glassTint: {
    ...StyleSheet.absoluteFill,
  },
});

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
