import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
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
import { useStore } from '@/store/use-store';
import {
  categoryBreakdown as buildBreakdown,
  formatShortDate,
  nextRenewal,
  totalMonthlySpend,
} from '@/lib/subscriptions';

export default function SpendingInsights() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const categories = useStore((s) => s.categories);

  const monthly = useMemo(() => totalMonthlySpend(subscriptions), [subscriptions]);
  const yearly = monthly * 12;
  const breakdown = useMemo(
    () => buildBreakdown(subscriptions, categories),
    [subscriptions, categories],
  );
  const next = useMemo(() => nextRenewal(subscriptions), [subscriptions]);
  const isEmpty = subscriptions.length === 0;

  // Pulsing scale for the hero glow orb (started in an effect, not during render)
  const glowScale = useSharedValue(1);
  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2400 }),
        withTiming(0.85, { duration: 2400 }),
      ),
      -1,
      false,
    );
  }, []);

  const glowAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ scale: glowScale.value }] };
  });

  // Bars = each category's share of monthly spend (real data)
  const barData = breakdown.slice(0, 6).map((c, i) => ({
    label: c.name.length > 5 ? c.name.slice(0, 4) + '…' : c.name,
    value: c.percent,
    active: i === 0,
    color: c.color,
  }));

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
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Icon name="chart.pie" size={48} color={theme.textSecondary} fallback="📊" />
            <ThemedText type="subtitle" style={{ marginTop: 12 }}>No spending to analyze yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
              Add a few subscriptions and your spending breakdown will appear here.
            </ThemedText>
          </View>
        ) : (
          <>
            {/* Hero card */}
            <Animated.View
              entering={FadeInDown.delay(80).springify().damping(18)}
              style={[
                styles.heroCard,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
            >
              <Animated.View
                style={[styles.heroGlow, { backgroundColor: 'rgba(160,213,124,0.06)' }, glowAnimatedStyle]}
              />
              <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                Total Monthly Spend
              </ThemedText>
              <View style={styles.heroRow}>
                <ThemedText type="title" style={{ fontSize: 36 }}>
                  ${monthly.toFixed(2)}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary">
                across {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''}
              </ThemedText>
              <View style={[styles.heroMeta, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                <View>
                  <ThemedText type="small" themeColor="textSecondary">Yearly Total</ThemedText>
                  <ThemedText style={{ fontWeight: '500' }}>${yearly.toFixed(2)}</ThemedText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <ThemedText type="small" themeColor="textSecondary">Next Renewal</ThemedText>
                  <ThemedText style={{ color: theme.primary, fontWeight: '500' }}>
                    {next ? formatShortDate(next.renewalDate) : '—'}
                  </ThemedText>
                </View>
              </View>
            </Animated.View>

            {/* Chart card — spend share by category */}
            <Animated.View
              entering={FadeInDown.delay(200).springify().damping(18)}
              style={[
                styles.chartCard,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
            >
              <View style={styles.chartHeader}>
                <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                  Spend by Category
                </ThemedText>
                <View style={[styles.chartBadge, { backgroundColor: 'rgba(160,213,124,0.1)' }]}>
                  <ThemedText type="small" style={{ color: theme.primary }}>
                    % of total
                  </ThemedText>
                </View>
              </View>
              <BarChart data={barData} />
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
                      <ThemedText style={{ fontWeight: '500' }}>${monthly.toFixed(0)}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.donutLabels}>
                    {breakdown.slice(0, 3).map((cat, i) => (
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
                  {breakdown.map((cat, i) => (
                    <View key={i} style={styles.catRow}>
                      <View style={styles.catLabelRow}>
                        <ThemedText type="small" themeColor="textSecondary">
                          {cat.name} ({cat.count})
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          ${cat.amount.toFixed(2)}
                        </ThemedText>
                      </View>
                      <ProgressBar progress={cat.percent} color={cat.color} height={6} />
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>

            {/* Insight cards — derived from real data */}
            <View style={styles.insightList}>
              {next && (
                <Animated.View
                  entering={FadeInRight.delay(0).springify().damping(18)}
                  style={[
                    styles.insightCard,
                    { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                  ]}
                >
                  <View style={styles.insightLeft}>
                    <View style={[styles.insightIcon, { backgroundColor: theme.surfaceContainerHigh }]}>
                      <Icon name="calendar" size={20} color={theme.primary} fallback="📅" />
                    </View>
                    <View>
                      <ThemedText type="default" style={{ fontWeight: '500' }}>Next Payment</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {next.name} • {formatShortDate(next.renewalDate)}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={{ color: theme.primary, fontWeight: '500' }}>
                    ${next.cost.toFixed(2)}
                  </ThemedText>
                </Animated.View>
              )}
              {breakdown[0] && (
                <Animated.View
                  entering={FadeInRight.delay(100).springify().damping(18)}
                  style={[
                    styles.insightCard,
                    { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                  ]}
                >
                  <View style={styles.insightLeft}>
                    <View style={[styles.insightIcon, { backgroundColor: theme.surfaceContainerHigh }]}>
                      <Icon name="chart.pie.fill" size={20} color={breakdown[0].color} fallback="🥧" />
                    </View>
                    <View>
                      <ThemedText type="default" style={{ fontWeight: '500' }}>Top Category</ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {breakdown[0].name} • {breakdown[0].percent}% of spend
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={{ color: breakdown[0].color, fontWeight: '500' }}>
                    ${breakdown[0].amount.toFixed(2)}
                  </ThemedText>
                </Animated.View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 24 },
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
