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
import { daysUntilRenewal, renewalLabel, formatShortDate, upcomingRenewals } from '@/lib/subscriptions';

export default function UpcomingRenewals() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const categories = useStore((s) => s.categories);

  const renewals = useMemo(() => upcomingRenewals(subscriptions, 30), [subscriptions]);
  const total = useMemo(() => renewals.reduce((sum, s) => sum + s.cost, 0), [renewals]);

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Upcoming Renewals"
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
            styles.heroCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          <View style={[styles.heroGlow, { backgroundColor: 'rgba(160,213,124,0.06)' }]} />
          <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Renewals (Next 30 Days)
          </ThemedText>
          <ThemedText type="title" style={{ fontSize: 40 }}>
            {renewals.length}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Total upcoming: ${total.toFixed(2)}
          </ThemedText>
        </View>

        {renewals.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
            <Icon name="checkmark.circle" size={40} color={theme.primary} fallback="✓" />
            <ThemedText type="default" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 8 }}>
              Nothing renewing in the next 30 days.
            </ThemedText>
          </View>
        ) : (
          <View style={styles.list}>
            {renewals.map((item) => {
              const meta = categories.find((c) => c.name === item.category);
              const urgent = daysUntilRenewal(item) <= 3;
              const accent = urgent ? theme.error : (meta?.color ?? theme.primary);
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.renewalCard,
                    {
                      backgroundColor: theme.surfaceContainer,
                      borderColor: 'rgba(255,255,255,0.05)',
                      borderLeftColor: accent,
                      borderLeftWidth: 4,
                    },
                  ]}
                  onPress={() => router.push({ pathname: Routes.SUBSCRIPTION_DETAIL, params: { id: item.id } } as any)}
                  accessibilityLabel={`${item.name} renewal`}
                >
                  <View style={styles.renewalRow}>
                    <View style={styles.renewalLeft}>
                      <View style={[styles.renewalIcon, { backgroundColor: theme.surfaceContainerHigh }]}>
                        <Icon name={item.icon} size={28} color={theme.primary} fallback={item.fallback ?? '📱'} />
                      </View>
                      <View>
                        <ThemedText type="default" style={{ fontWeight: '600' }}>
                          {item.name}
                        </ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {item.category} • {item.billingCycle}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.renewalRight}>
                      <ThemedText type="default" style={{ color: theme.primary }}>
                        ${item.cost.toFixed(2)}
                      </ThemedText>
                      <ThemedText type="small" style={{ color: urgent ? theme.error : theme.textSecondary }}>
                        {renewalLabel(item)} • {formatShortDate(item.renewalDate)}
                      </ThemedText>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 20, paddingTop: 16 },
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
  emptyCard: { borderRadius: 16, padding: 32, borderWidth: 1, alignItems: 'center' },
  list: { gap: 12 },
  renewalCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  renewalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  renewalLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  renewalIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renewalRight: { alignItems: 'flex-end' },
});
