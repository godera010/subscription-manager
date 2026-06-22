import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, useColorScheme, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useOnboardingGuard } from '@/hooks/use-onboarding-guard';
import { useStore } from '@/store/use-store';

export default function RootLayout() {
  const themeMode = useStore((s) => s.themeMode);
  const colorScheme = useColorScheme();
  
  // Resolve effective theme
  const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
  const colors = Colors[isDark ? 'dark' : 'light'];

  const load = useStore((s) => s.load);
  const loaded = useStore((s) => s.loaded);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });

  useOnboardingGuard();

  useEffect(() => {
    load();
  }, [load]);

  const ready = loaded && fontsLoaded;

  // Setup React Navigation theme config to eliminate native white flash during mounting
  const navigationTheme = useMemo(() => ({
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: 'transparent',
    },
    fonts: isDark ? DarkTheme.fonts : DefaultTheme.fonts,
  }), [isDark, colors]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={isDark ? '#091614' : '#FFFFFF'}
          translucent={false}
        />
        {!ready && (
          <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        {ready && (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'none',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="subscription-detail" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="add-subscription" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="cancel-subscriptions" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="subscription-hub" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="upcoming-renewals" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="renewal-calendar" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="spending-insights" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="spending-insights-detail" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="streaming-spending-detail" options={{ animation: 'slide_from_right' }} />
          </Stack>
        </View>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
