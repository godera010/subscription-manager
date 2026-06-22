import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BarChart } from '@/components/ui/bar-chart';
import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const alerts = [
  {
    icon: 'exclamationmark.triangle.fill',
    fallback: '⚠️',
    title: 'Spending Spike',
    desc: 'You spent 15% more on Entertainment this month due to Netflix price hike.',
    color: '#ffb4ab',
    bgColor: 'rgba(255,180,171,0.1)',
    borderColor: 'rgba(255,180,171,0.1)',
  },
  {
    icon: 'sparkle',
    fallback: '✨',
    title: 'Potential Saving',
    desc: 'Switch to an annual plan for Adobe CC and save $120/year.',
    color: '#a0d57c',
    bgColor: 'rgba(160,213,124,0.08)',
    borderColor: 'rgba(160,213,124,0.1)',
  },
  {
    icon: 'chart.bar.fill',
    fallback: '📊',
    title: 'Unused Service',
    desc: "You haven't used Hulu in 45 days. Consider canceling.",
    color: '#abd28f',
    bgColor: 'rgba(171,210,143,0.08)',
    borderColor: 'rgba(171,210,143,0.1)',
  },
];

const categoryBreakdown = [
  { icon: 'film.fill', fallback: '🎬', name: 'Entertainment', amount: '$184.00', percent: 45, color: '#a0d57c' },
  { icon: 'briefcase.fill', fallback: '💼', name: 'Productivity', amount: '$92.50', percent: 25, color: '#abd28f' },
  { icon: 'bolt.fill', fallback: '⚡', name: 'Utilities', amount: '$122.00', percent: 30, color: '#c8c6c5' },
  { icon: 'gamecontroller.fill', fallback: '🎮', name: 'Gaming', amount: '$30.00', percent: 10, color: '#ffb4ab' },
];

export default function SpendingInsightsDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Spending Insights"
        left={
          <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
            <Icon name="chevron.left" size={24} color={theme.primary} fallback="←" />
          </Pressable>
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
        <View style={styles.heroGrid}>
          <View
            style={[
              styles.heroMain,
              {
                backgroundColor: theme.surfaceContainer,
                borderColor: 'rgba(255,255,255,0.05)',
              },
            ]}
          >
            <View style={[styles.heroGlow, { backgroundColor: 'rgba(160,213,124,0.06)' }]} />
            <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Current Month Spend
            </ThemedText>
            <ThemedText type="title" style={{ fontSize: 44, color: theme.primary }}>
              $428.50
            </ThemedText>
            <View style={styles.trendRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="arrow.up.forward" size={12} color={theme.error} fallback="↑" />
                <ThemedText type="small" style={{ color: theme.error }}>12.5% vs last month</ThemedText>
              </View>
            </View>
            <View style={[styles.heroMeta, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
              <View>
                <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
                  Average Spend
                </ThemedText>
                <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                  $380.20
                </ThemedText>
              </View>
              <View>
                <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
                  Projected Spend
                </ThemedText>
                <ThemedText type="subtitle" style={{ fontSize: 20, color: theme.secondary }}>
                  $455.00
                </ThemedText>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.donutCard,
              { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
            ]}
          >
            <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              Top Category
            </ThemedText>
            <View style={styles.donut}>
              <View style={styles.donutInner}>
                <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                  72%
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
                  Entertainment
                </ThemedText>
              </View>
            </View>
            <View
              style={[styles.viewAllBtn, { backgroundColor: theme.primaryContainer }]}
            >
              <ThemedText type="small" style={{ color: theme.onPrimaryContainer, textTransform: 'uppercase', letterSpacing: 1 }}>
                VIEW ALL CATEGORIES
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.bentoGrid}>
          <View
            style={[
              styles.chartCard,
              { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
            ]}
          >
            <View style={styles.chartHeader}>
              <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                Monthly Comparison
              </ThemedText>
            </View>
            <BarChart
              data={[
                { label: 'JAN', value: 24 },
                { label: 'FEB', value: 32 },
                { label: 'MAR', value: 28 },
                { label: 'APR', value: 40 },
                { label: 'MAY', value: 36 },
                { label: 'JUN', value: 44, active: true },
              ]}
            />
          </View>

          <View
            style={[
              styles.alertsCard,
              { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
            ]}
          >
            <ThemedText type="subtitle" style={{ fontSize: 20, marginBottom: 24 }}>
              Smart Alerts
            </ThemedText>
            <View style={styles.alertList}>
              {alerts.map((alert, i) => (
                <View
                  key={i}
                  style={[
                    styles.alertRow,
                    { backgroundColor: alert.bgColor, borderColor: alert.borderColor },
                  ]}
                >
                  <Icon name={alert.icon} size={18} color={alert.color} fallback={alert.fallback} />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="default" style={{ fontWeight: '600' }}>
                      {alert.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {alert.desc}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.categoryCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          <View style={styles.catHeader}>
            <ThemedText type="subtitle" style={{ fontSize: 20 }}>
              Category Breakdown
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.primary }}>
              Manage Categories →
            </ThemedText>
          </View>
          <View style={styles.catList}>
            {categoryBreakdown.map((cat, i) => (
              <View key={i} style={styles.catItem}>
                <View style={styles.catRow}>
                  <View style={styles.catLeft}>
                    <View
                      style={[
                        styles.catIcon,
                        { backgroundColor: `${cat.color}15` },
                      ]}
                    >
                      <Icon name={cat.icon} size={20} color={cat.color} fallback={cat.fallback} />
                    </View>
                    <ThemedText type="default">{cat.name}</ThemedText>
                  </View>
                  <ThemedText style={{ fontWeight: '500' }}>{cat.amount}</ThemedText>
                </View>
                <View
                  style={[
                    styles.catTrack,
                    { backgroundColor: theme.surfaceContainerHighest },
                  ]}
                >
                  <View
                    style={[
                      styles.catFill,
                      {
                        backgroundColor: cat.color,
                        width: `${cat.percent}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  heroGrid: { gap: 16 },
  heroMain: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
  },
  donutCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
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
  },
  donutInner: { alignItems: 'center' },
  viewAllBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bentoGrid: { gap: 16 },
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
  alertsCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  alertList: { gap: 12 },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    gap: 24,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catList: { gap: 20 },
  catItem: { gap: 8 },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 4,
  },
});
