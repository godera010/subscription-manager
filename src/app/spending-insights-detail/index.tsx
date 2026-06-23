import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BarChart } from '@/components/ui/bar-chart';
import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import {
  categoryBreakdown as buildBreakdown,
  monthlyCostOf,
  totalMonthlySpend,
  yearlyCostOf,
} from '@/lib/subscriptions';

export default function SpendingInsightsDetail() {
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
  const top = breakdown[0];
  const isEmpty = subscriptions.length === 0;

  // Most expensive subscription (by monthly cost)
  const priciest = useMemo(() => {
    if (subscriptions.length === 0) return null;
    return [...subscriptions].sort((a, b) => monthlyCostOf(b) - monthlyCostOf(a))[0];
  }, [subscriptions]);

  // Honest, computed alerts
  const alerts = useMemo(() => {
    const out: { icon: string; fallback: string; title: string; desc: string; color: string; bg: string; border: string }[] = [];
    if (top) {
      out.push({
        icon: 'chart.pie.fill', fallback: '🥧',
        title: 'Top Category',
        desc: `${top.name} is ${top.percent}% of your monthly spend ($${top.amount.toFixed(2)}).`,
        color: top.color, bg: `${top.color}14`, border: `${top.color}1a`,
      });
    }
    if (priciest) {
      out.push({
        icon: 'arrow.up.forward', fallback: '⬆️',
        title: 'Largest Subscription',
        desc: `${priciest.name} costs $${monthlyCostOf(priciest).toFixed(2)}/mo ($${yearlyCostOf(priciest).toFixed(2)}/yr).`,
        color: '#ffb4ab', bg: 'rgba(255,180,171,0.1)', border: 'rgba(255,180,171,0.1)',
      });
    }
    out.push({
      icon: 'calendar', fallback: '📅',
      title: 'Annual Outlook',
      desc: `At this rate you'll spend $${yearly.toFixed(2)} over the next 12 months.`,
      color: '#a0d57c', bg: 'rgba(160,213,124,0.08)', border: 'rgba(160,213,124,0.1)',
    });
    return out;
  }, [top, priciest, yearly]);

  const barData = breakdown.slice(0, 6).map((c, i) => ({
    label: c.name.length > 5 ? c.name.slice(0, 4) + '…' : c.name,
    value: c.percent,
    active: i === 0,
    color: c.color,
  }));

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
        {isEmpty ? (
          <View style={styles.emptyState}>
            <Icon name="chart.bar" size={48} color={theme.textSecondary} fallback="📊" />
            <ThemedText type="subtitle" style={{ marginTop: 12 }}>Nothing to break down yet</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
              Add subscriptions to see category insights.
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.heroGrid}>
              <View
                style={[
                  styles.heroMain,
                  { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                ]}
              >
                <View style={[styles.heroGlow, { backgroundColor: 'rgba(160,213,124,0.06)' }]} />
                <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Current Month Spend
                </ThemedText>
                <ThemedText type="title" style={{ fontSize: 44, color: theme.primary }}>
                  ${monthly.toFixed(2)}
                </ThemedText>
                <View style={[styles.heroMeta, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                  <View>
                    <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
                      Yearly Total
                    </ThemedText>
                    <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                      ${yearly.toFixed(0)}
                    </ThemedText>
                  </View>
                  <View>
                    <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
                      Subscriptions
                    </ThemedText>
                    <ThemedText type="subtitle" style={{ fontSize: 20, color: theme.secondary }}>
                      {subscriptions.length}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {top && (
                <View
                  style={[
                    styles.donutCard,
                    { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                  ]}
                >
                  <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Top Category
                  </ThemedText>
                  <View style={[styles.donut, { borderColor: `${top.color}40` }]}>
                    <View style={styles.donutInner}>
                      <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                        {top.percent}%
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>
                        {top.name}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              )}
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
                    Spend by Category
                  </ThemedText>
                </View>
                <BarChart data={barData} />
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
                      style={[styles.alertRow, { backgroundColor: alert.bg, borderColor: alert.border }]}
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
              </View>
              <View style={styles.catList}>
                {breakdown.map((cat, i) => (
                  <View key={i} style={styles.catItem}>
                    <View style={styles.catRow}>
                      <View style={styles.catLeft}>
                        <View style={[styles.catIcon, { backgroundColor: `${cat.color}15` }]}>
                          <Icon name={cat.icon} size={20} color={cat.color} fallback={cat.fallback ?? '•'} />
                        </View>
                        <ThemedText type="default">{cat.name}</ThemedText>
                      </View>
                      <ThemedText style={{ fontWeight: '500' }}>${cat.amount.toFixed(2)}</ThemedText>
                    </View>
                    <View style={[styles.catTrack, { backgroundColor: theme.surfaceContainerHighest }]}>
                      <View style={[styles.catFill, { backgroundColor: cat.color, width: `${cat.percent}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
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
