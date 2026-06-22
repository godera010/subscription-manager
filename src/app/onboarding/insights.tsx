import { router } from 'expo-router';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { Icon } from '@/components/prism/Icon';
import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const { width } = Dimensions.get('window');

export default function OnboardingInsights() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Floating hero icon
  const heroTranslateY = useSharedValue(0);
  // Glow orb breathing scale
  const glowScale = useSharedValue(1);

  useEffect(() => {
    heroTranslateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2000 }),
        withTiming(0, { duration: 2000 }),
      ),
      -1,
      false,
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2200 }),
        withTiming(0.9, { duration: 2200 }),
      ),
      -1,
      false,
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateY: heroTranslateY.value }] };
  });

  const glowOrbStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: glowScale.value }] };
  });

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.blob1, { backgroundColor: theme.primary }]} />
      <View style={[styles.blob2, { backgroundColor: theme.secondary }]} />

      <Animated.View
        entering={FadeInDown.delay(100).springify().damping(20)}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <ThemedText style={{ color: theme.primary, fontSize: 20, fontWeight: '600' }}>
          Prism Finance
        </ThemedText>
      </Animated.View>

      <View style={styles.hero}>
        <Animated.View
          style={[
            styles.glassCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        />
        <Animated.View
          style={[
            styles.glassBall,
            { backgroundColor: theme.surfaceContainerLowest, opacity: 0.2 },
            glowOrbStyle,
          ]}
        />
        <Animated.View style={[styles.illustrationBox, heroStyle]}>
          <Icon name="chart.line.uptrend.xyaxis" size={120} color={theme.primary} fallback="📈" />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).springify().damping(20)}
        style={styles.textSection}
      >
        <ThemedText type="title" style={styles.title}>
          Visualize Your Spend
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
          Identify where your money goes with intuitive charts and smart spending alerts.
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(350).springify().damping(20)}
        style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
        </View>
        <View style={styles.navRow}>
          <AnimatedPressable
            style={styles.skipBtn}
            onPress={() => router.replace('/onboarding/offers' as any)}
          >
            <ThemedText type="small" themeColor="textSecondary">
              Skip
            </ThemedText>
          </AnimatedPressable>
          <AnimatedPressable
            variant="glow"
            glowColor="rgba(160,213,124,0.30)"
            style={[styles.nextBtn, { backgroundColor: theme.primaryContainer }]}
            onPress={() => router.replace('/onboarding/offers' as any)}
          >
            <ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: '600' }}>
              Next →
            </ThemedText>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  blob1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 256,
    height: 256,
    borderRadius: 128,
    opacity: 0.15,
  },
  blob2: {
    position: 'absolute',
    bottom: -100,
    left: -50,
    width: 384,
    height: 384,
    borderRadius: 192,
    opacity: 0.1,
  },
  header: { alignItems: 'center', width: '100%', paddingVertical: 16 },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  illustrationBox: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  glassCard: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 12,
    borderWidth: 1,
    transform: [{ rotate: '12deg' }],
    top: 0,
    right: 16,
    opacity: 0.4,
  },
  glassBall: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    bottom: 32,
    left: 0,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
    zIndex: 20,
  },
  title: { textAlign: 'center', fontSize: 28, lineHeight: 36 },
  subtitle: { textAlign: 'center', maxWidth: 320 },
  footer: { width: '100%', paddingHorizontal: 16, gap: 24 },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.4 },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    transform: [{ scale: 1.25 }],
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  nextBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
});
