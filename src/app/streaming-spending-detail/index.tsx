import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import { monthlyCostOf } from '@/lib/subscriptions';

// Category treated as "streaming" for this view.
const STREAMING_CATEGORY = 'Entertainment';

export default function StreamingSpendingDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);

  const services = useMemo(
    () =>
      subscriptions
        .filter((s) => s.category === STREAMING_CATEGORY)
        .sort((a, b) => monthlyCostOf(b) - monthlyCostOf(a)),
    [subscriptions],
  );

  const total = useMemo(() => services.reduce((sum, s) => sum + monthlyCostOf(s), 0), [services]);
  const avg = services.length > 0 ? total / services.length : 0;
  const maxCost = services[0] ? monthlyCostOf(services[0]) : 0;

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Streaming Spend"
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
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          <View style={[styles.summaryGlow, { backgroundColor: 'rgba(160,213,124,0.06)' }]} />
          <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Total Streaming Spend
          </ThemedText>
          <ThemedText type="title" style={{ fontSize: 44, color: theme.primary }}>
            ${total.toFixed(2)}
          </ThemedText>
          <View style={styles.summaryMeta}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Services</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>{services.length}</ThemedText>
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Avg/Service</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>${avg.toFixed(2)}</ThemedText>
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Per Year</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>${(total * 12).toFixed(0)}</ThemedText>
            </View>
          </View>
        </View>

        {services.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
            <Icon name="tv" size={40} color={theme.textSecondary} fallback="📺" />
            <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 8 }}>
              No {STREAMING_CATEGORY} subscriptions yet.
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.headerRow}>
              <ThemedText type="subtitle" style={{ fontSize: 20 }}>
                All Services
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.primary }}>Sort: Cost ↓</ThemedText>
            </View>

            <View style={styles.serviceList}>
              {services.map((svc) => {
                const m = monthlyCostOf(svc);
                const share = maxCost > 0 ? (m / maxCost) * 100 : 0;
                return (
                  <Pressable
                    key={svc.id}
                    style={[
                      styles.serviceCard,
                      { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                    ]}
                    onPress={() => router.push({ pathname: Routes.SUBSCRIPTION_DETAIL, params: { id: svc.id } } as any)}
                  >
                    <View style={styles.serviceRow}>
                      <View style={styles.serviceLeft}>
                        <View style={[styles.serviceIcon, { backgroundColor: theme.surfaceContainerHighest }]}>
                          <Icon name={svc.icon} size={24} color={theme.primary} fallback={svc.fallback ?? '📺'} />
                        </View>
                        <View>
                          <ThemedText type="default" style={{ fontWeight: '600' }}>
                            {svc.name}
                          </ThemedText>
                          <ThemedText type="small" themeColor="textSecondary">
                            {svc.plan || svc.billingCycle}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.serviceRight}>
                        <ThemedText type="default" style={{ fontWeight: '600' }}>
                          ${svc.cost.toFixed(2)}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {svc.billingCycle}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={[styles.serviceDivider, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                      <ThemedText type="small" themeColor="textSecondary">
                        ${m.toFixed(2)}/mo
                      </ThemedText>
                      <View style={[styles.usageTrack, { backgroundColor: theme.surfaceContainerHighest }]}>
                        <View style={[styles.usageFill, { backgroundColor: theme.primary, width: `${share}%` }]} />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
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
  summaryCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  summaryGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  summaryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    marginTop: 8,
  },
  emptyCard: { borderRadius: 16, padding: 32, borderWidth: 1, alignItems: 'center' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceList: { gap: 12 },
  serviceCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceRight: { alignItems: 'flex-end' },
  serviceDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  usageTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  usageFill: {
    height: '100%',
    borderRadius: 2,
  },
});
