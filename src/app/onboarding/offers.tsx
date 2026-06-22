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
import { useStore } from '@/store/use-store';

const { width } = Dimensions.get('window');

export default function OnboardingOffers() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const setOnboardingCompleted = useStore((s) => s.setOnboardingCompleted);

  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    router.replace('/' as any);
  };

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
      <View style={styles.ambientGlow1} />
      <View style={styles.ambientGlow2} />

      <Animated.View
        entering={FadeInDown.delay(100).springify().damping(20)}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <ThemedText style={{ color: theme.primary, fontSize: 20, fontWeight: '600' }}>
          Prism Finance
        </ThemedText>
      </Animated.View>

      <View style={styles.hero}>
        <Animated.View style={[styles.illustrationBox, heroStyle]}>
          <Icon name="gift.fill" size={120} color={theme.primary} fallback="🎁" />
        </Animated.View>
        <Animated.View style={[styles.particle1, { backgroundColor: theme.primary }, glowOrbStyle]} />
        <Animated.View style={[styles.particle2, { backgroundColor: theme.primary }, glowOrbStyle]} />
        <Animated.View style={[styles.particle3, { backgroundColor: theme.primary }, glowOrbStyle]} />
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).springify().damping(20)}
        style={styles.textSection}
      >
        <ThemedText type="title" style={styles.title}>
          Unlock Exclusive Perks
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
          Discover curated offers and trial opportunities tailored to your spending habits.
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(350).springify().damping(20)}
        style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dotWide, { backgroundColor: theme.primary }]} />
        </View>
        <View style={styles.navRow}>
          <AnimatedPressable
            style={styles.skipBtn}
            onPress={completeOnboarding}
          >
            <ThemedText type="small" themeColor="textSecondary">
              Skip
            </ThemedText>
          </AnimatedPressable>
          <AnimatedPressable
            variant="glow"
            glowColor="rgba(160,213,124,0.30)"
            style={[styles.nextBtn, { backgroundColor: theme.primaryContainer }]}
            onPress={completeOnboarding}
          >
            <ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: '600' }}>
              Finish
            </ThemedText>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  ambientGlow1: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(160,213,124,0.06)',
  },
  ambientGlow2: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(160,213,124,0.04)',
  },
  header: { alignItems: 'center', width: '100%', paddingVertical: 16, zIndex: 50 },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 10,
  },
  illustrationBox: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle1: {
    position: 'absolute',
    top: '25%',
    right: 40,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
  particle2: {
    position: 'absolute',
    bottom: '25%',
    left: 48,
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.4,
  },
  particle3: {
    position: 'absolute',
    top: '50%',
    left: 16,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.5,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
    gap: 8,
  },
  title: { textAlign: 'center', fontSize: 28, lineHeight: 36 },
  subtitle: { textAlign: 'center', lineHeight: 24 },
  footer: { width: '100%', paddingHorizontal: 16, gap: 24, zIndex: 50 },
  dots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  dotWide: {
    width: 24,
    height: 8,
    borderRadius: 4,
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
