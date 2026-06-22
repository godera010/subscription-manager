/**
 * TopBar – animated entry version
 * Slides down from -8px and fades in on mount.
 */
import { StyleSheet, Platform, View, ViewStyle, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import { Icon } from '@/components/prism/Icon';
import { AnimatedPressable } from '@/components/prism/AnimatedPressable';

type TopBarProps = {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function TopBar({ title, left, right }: TopBarProps) {
  const theme = useTheme();
  const themeMode = useStore((state) => state.themeMode);
  const setThemeMode = useStore((state) => state.setThemeMode);

  const colorScheme = useColorScheme();
  // If system defaults to dark, treat system as dark for the toggle.
  const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'rgba(9,22,20,0.88)',
          borderBottomColor: 'rgba(255,255,255,0.06)',
        },
        Platform.select({ web: { backdropFilter: 'blur(12px)' } as ViewStyle }),
      ]}
    >
      <View style={styles.left}>{left}</View>
      <ThemedText type="subtitle" style={{ fontSize: 20, color: theme.primary, fontWeight: '700', letterSpacing: -0.3 }}>
        {title}
      </ThemedText>
      <View style={[styles.right, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
        {right}
        <AnimatedPressable onPress={toggleTheme} pressedScale={0.85} accessibilityRole="button">
          <Icon name={isDark ? 'sun.max.fill' : 'moon.fill'} size={22} color={theme.text} fallback={isDark ? '☀️' : '🌙'} />
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    borderBottomWidth: 1,
    shadowColor: '#091614',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  left: { minWidth: 40 },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
