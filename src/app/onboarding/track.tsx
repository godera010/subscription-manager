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
import { Animation } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function OnboardingTrack() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Floating hero icon
  const heroTranslateY = useSharedValue(0);
  // Glow orb breathing scale
  const glowScale = useSharedValue(1);
  // Glass card slow rotation (card 1: -8 to -6 deg)
  const card1Rotate = useSharedValue(-8);
  // Glass card slow rotation (card 2: 3 to 5 deg)
  const card2Rotate = useSharedValue(3);

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
    card1Rotate.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 3000 }),
        withTiming(-8, { duration: 3000 }),
      ),
      -1,
      false,
    );
    card2Rotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 3500 }),
        withTiming(3, { duration: 3500 }),
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

  const card1Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { rotate: `${card1Rotate.value}deg` },
        { translateY: -40 },
      ],
    };
  });

  const card2Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { rotate: `${card2Rotate.value}deg` },
        { translateY: 20 },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.glow1, { backgroundColor: 'rgba(160,213,124,0.05)' }]} />
      <View style={[styles.glow2, { backgroundColor: 'rgba(160,213,124,0.08)' }]} />

      <Animated.View
        entering={FadeInDown.delay(100).springify().damping(20)}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <ThemedText style={{ color: theme.primary, fontSize: 20, fontWeight: '600' }}>
          Prism Finance
        </ThemedText>
      </Animated.View>

      <View style={styles.hero}>
        <Animated.View style={[styles.glowBall, { backgroundColor: 'rgba(160,213,124,0.08)' }, glowOrbStyle]} />
        <Animated.View
          style={[
            styles.glassCard1,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
            card1Style,
          ]}
        />
        <Animated.View
          style={[
            styles.glassCard2,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
            card2Style,
          ]}
        />
        <Animated.View style={[styles.illustrationBox, heroStyle]}>
          <Icon name="chart.bar.fill" size={120} color={theme.primary} fallback="📊" />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).springify().damping(20)}
        style={styles.textSection}
      >
        <ThemedText type="title" style={styles.title}>
          Master Your Subscriptions
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
          Connect your accounts and see all your active services in one unified dashboard.
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(350).springify().damping(20)}
        style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
        </View>
        <View style={styles.navRow}>
          <AnimatedPressable
            style={styles.skipBtn}
            onPress={() => router.replace('/onboarding/insights' as any)}
          >
            <ThemedText type="small" themeColor="textSecondary">
              Skip
            </ThemedText>
          </AnimatedPressable>
          <AnimatedPressable
            variant="glow"
            glowColor="rgba(160,213,124,0.30)"
            style={[styles.nextBtn, { backgroundColor: theme.primaryContainer }]}
            onPress={() => router.replace('/onboarding/insights' as any)}
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
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.4 },
  dotActive: { width: 10, height: 10, borderRadius: 5, transform: [{ scale: 1.25 }] },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  glow1: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  glow2: {
    position: 'absolute',
    bottom: '10%',
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  header: { alignItems: 'center', width: '100%', paddingVertical: 16 },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  glowBall: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  illustrationBox: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  glassCard1: {
    position: 'absolute',
    width: 192,
    height: 128,
    borderRadius: 12,
    borderWidth: 1,
    opacity: 0.4,
  },
  glassCard2: {
    position: 'absolute',
    width: 224,
    height: 144,
    borderRadius: 12,
    borderWidth: 1,
    opacity: 0.2,
  },
  textSection: { alignItems: 'center', paddingHorizontal: 32, gap: 8 },
  title: { textAlign: 'center', fontSize: 28, lineHeight: 36 },
  subtitle: { textAlign: 'center', paddingHorizontal: 8 },
  footer: { width: '100%', paddingHorizontal: 16, gap: 24 },
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
