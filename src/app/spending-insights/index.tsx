import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ProgressBar } from '@/components/prism/ProgressBar';
import { BarChart } from '@/components/ui/bar-chart';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const categoryBreakdown = [
  { name: 'Streaming', percent: 55, amount: '$687.68', color: '#a0d57c' },
  { name: 'Gaming', percent: 25, amount: '$312.13', color: '#abd28f' },
  { name: 'Security', percent: 15, amount: '$187.28', color: '#c8c6c5' },
  { name: 'Productivity', percent: 35, amount: '$45.00', color: '#a0d57c' },
  { name: 'Entertainment', percent: 65, amount: '$120.00', color: '#abd28f' },
];

const insights = [
  {
    icon: 'calendar', fallback: '📅',
    title: 'Next Payment',
    desc: 'Spotify Premium • Jan 28',
    amount: '$14.99',
    color: '#a0d57c',
  },
  {
    icon: 'arrow.down.right', fallback: '📉',
    title: 'Reduced Spend',
    desc: 'Gaming Subscriptions',
    amount: '-$25.00',
    color: '#abd28f',
  },
];

export default function SpendingInsights() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // Pulsing scale for the hero glow orb
  const glowScale = useSharedValue(1);
  glowScale.value = withRepeat(
    withSequence(
      withTiming(1.2, { duration: 2400 }),
      withTiming(0.85, { duration: 2400 }),
    ),
    -1,
    false,
  );

  const glowAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: glowScale.value }] };
  });

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Insights"
        left={
          <AnimatedPressable
            pressedScale={0.92}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Icon name="chevron.left" size={24} color={theme.primary} fallback="←" />
          </AnimatedPressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.six },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <Animated.View
          entering={FadeInDown.delay(80).springify().damping(18)}
          style={[
            styles.heroCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          {/* Pulsing glow orb */}
          <Animated.View
            style={[
              styles.heroGlow,
              { backgroundColor: 'rgba(160,213,124,0.06)' },
              glowAnimatedStyle,
            ]}
          />
          <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            Trend Analysis
          </ThemedText>
          <View style={styles.heroRow}>
            <ThemedText type="title" style={{ fontSize: 36 }}>
              $1,248.50
            </ThemedText>
            <View style={styles.trendBadge}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Icon name="arrow.up.forward" size={12} color={theme.primary} fallback="↑" />
                <ThemedText type="small" style={{ color: theme.primary }}>
                  +12%
                </ThemedText>
              </View>
            </View>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            vs last month
          </ThemedText>
          <View style={[styles.heroMeta, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Average Spend</ThemedText>
              <ThemedText style={{ fontWeight: '500' }}>$1,120.00</ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText type="small" themeColor="textSecondary">Projected (Next)</ThemedText>
              <ThemedText style={{ color: theme.primary, fontWeight: '500' }}>$1,310.00</ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Chart card */}
        <Animated.View
          entering={FadeInDown.delay(200).springify().damping(18)}
          style={[
            styles.chartCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          <View style={styles.chartHeader}>
            <ThemedText type="subtitle" style={{ fontSize: 20 }}>
              Monthly Comparison
            </ThemedText>
            <View style={[styles.chartBadge, { backgroundColor: 'rgba(160,213,124,0.1)' }]}>
              <ThemedText type="small" style={{ color: theme.primary }}>
                Last 4 Months
              </ThemedText>
            </View>
          </View>
          <BarChart
            data={[
              { label: 'Oct', value: 60 },
              { label: 'Nov', value: 45 },
              { label: 'Dec', value: 85 },
              { label: 'Jan', value: 75, active: true },
            ]}
          />
        </Animated.View>

        {/* Category breakdown */}
        <Animated.View entering={FadeInDown.delay(300).springify().damping(18)}>
          <ThemedText type="subtitle" style={{ fontSize: 20, marginBottom: 16 }}>
            Category Breakdown
          </ThemedText>
          <View
            style={[
              styles.catCard,
              { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
            ]}
          >
            <View style={styles.donutSection}>
              <View style={styles.donut}>
                <View style={styles.donutInner}>
                  <ThemedText type="small" themeColor="textSecondary">Total</ThemedText>
                  <ThemedText style={{ fontWeight: '500' }}>$1.2k</ThemedText>
                </View>
              </View>
              <View style={styles.donutLabels}>
                {categoryBreakdown.slice(0, 3).map((cat, i) => (
                  <View key={i} style={styles.donutLabelRow}>
                    <View style={[styles.donutDot, { backgroundColor: cat.color }]} />
                    <ThemedText type="small">{cat.name}</ThemedText>
                    <ThemedText type="small" style={{ marginLeft: 'auto' }}>
                      {cat.percent}%
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.catDivider, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
              {categoryBreakdown.slice(3).map((cat, i) => (
                <View key={i} style={styles.catRow}>
                  <View style={styles.catLabelRow}>
                    <ThemedText type="small" themeColor="textSecondary">
                      {cat.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {cat.amount}
                    </ThemedText>
                  </View>
                  <ProgressBar progress={cat.percent} color={cat.color} height={6} />
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Insight cards — staggered FadeInRight */}
        <View style={styles.insightList}>
          {insights.map((item, i) => (
            <Animated.View
              key={i}
              entering={FadeInRight.delay(i * 100).springify().damping(18)}
              style={[
                styles.insightCard,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
            >
              <View style={styles.insightLeft}>
                <View
                  style={[
                    styles.insightIcon,
                    { backgroundColor: theme.surfaceContainerHigh },
                  ]}
                >
                  <Icon name={item.icon} size={20} color={item.color} fallback={item.fallback} />
                </View>
                <View>
                  <ThemedText type="default" style={{ fontWeight: '500' }}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.desc}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={{ color: item.color, fontWeight: '500' }}>
                {item.amount}
              </ThemedText>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  heroCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
  },
  chartCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    gap: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 24,
  },
  catCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 16,
  },
  donutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  donut: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 8,
    borderColor: '#2a3735',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutInner: { alignItems: 'center' },
  donutLabels: { flex: 1, gap: 16 },
  donutLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  donutDot: { width: 8, height: 8, borderRadius: 4 },
  catDivider: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 16,
  },
  catRow: { gap: 4 },
  catLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightList: { gap: 8 },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  insightLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
