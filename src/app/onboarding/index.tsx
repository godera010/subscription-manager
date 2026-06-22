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

export default function OnboardingGetStarted() {
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
      <View style={[styles.glow1, { backgroundColor: 'rgba(160,213,124,0.05)' }]} />
      <View style={[styles.glow2, { backgroundColor: 'rgba(160,213,124,0.05)' }]} />

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
            styles.glowBall,
            { backgroundColor: 'rgba(160,213,124,0.08)' },
            glowOrbStyle,
          ]}
        />
        <Animated.View style={[styles.illustrationBox, heroStyle]}>
          <Icon name="sparkle" size={120} color={theme.primary} fallback="🔮" />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(200).springify().damping(20)}
        style={styles.textSection}
      >
        <ThemedText type="title" style={styles.title}>
          Ready to Prism?
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
          Join thousands managing their subscriptions smarter. Your financial clarity starts now.
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(350).springify().damping(20)}
        style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}
      >
        <AnimatedPressable
          variant="glow"
          glowColor="rgba(160,213,124,0.30)"
          style={[styles.getStartedBtn, { backgroundColor: theme.primaryContainer }]}
          onPress={() => router.replace('/onboarding/track' as any)}
        >
          <ThemedText style={{ color: theme.onPrimaryContainer, fontSize: 18, fontWeight: '600' }}>
            Get Started
          </ThemedText>
        </AnimatedPressable>

        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dot, { backgroundColor: theme.outlineVariant }]} />
          <View style={[styles.dotActive, { backgroundColor: theme.primary }]} />
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
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
    bottom: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  header: { alignItems: 'center', width: '100%', paddingVertical: 16 },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  illustrationBox: {
    width: width * 0.7,
    height: width * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowBall: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -125 }, { translateY: -125 }],
  },
  textSection: { alignItems: 'center', paddingHorizontal: 32, gap: 8 },
  title: { textAlign: 'center', fontSize: 32, lineHeight: 40 },
  subtitle: { textAlign: 'center', maxWidth: 280 },
  footer: { width: '100%', alignItems: 'center', paddingHorizontal: 16, gap: 24 },
  getStartedBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.4 },
  dotActive: { width: 10, height: 10, borderRadius: 5, transform: [{ scale: 1.25 }] },
});
