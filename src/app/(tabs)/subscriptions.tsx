import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { SubscriptionRow } from '@/components/prism/SubscriptionRow';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';

const FILTERS = ['All', 'Active', 'Upcoming'] as const;
type Filter = (typeof FILTERS)[number];

export default function SubscriptionsScreen() {
  console.log('SubscriptionsScreen mounted');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const activeFilter: Filter = FILTERS[selectedFilter];

  const filtered = subscriptions.filter((sub) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return true;
    if (activeFilter === 'Upcoming') return false;
    return true;
  });

  return (
    <ThemedView style={styles.container}>
      <TopBar title="Subscriptions" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header row ─────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <ThemedText themeColor="textSecondary" style={{ fontSize: 13 }}>
            {subscriptions.length} Active Subscription{subscriptions.length !== 1 ? 's' : ''}
          </ThemedText>

          <AnimatedPressable
            pressedScale={0.92}
            onPress={() => router.push(Routes.ADD_SUBSCRIPTION as any)}
            accessibilityLabel="Add subscription"
            accessibilityRole="button"
          >
            <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>+ Add</ThemedText>
          </AnimatedPressable>
        </View>

        {/* ── Filter chips ───────────────────────────────────────── */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {FILTERS.map((label, i) => {
              const isActive = i === selectedFilter;
              return (
                <AnimatedPressable
                  key={label}
                  pressedScale={0.92}
                  onPress={() => setSelectedFilter(i)}
                  accessibilityLabel={`Filter: ${label}`}
                  accessibilityRole="button"
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isActive ? theme.primaryContainer : 'transparent',
                      borderColor: isActive ? theme.primary : theme.outlineVariant,
                    },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{
                      color: isActive ? theme.onPrimaryContainer : theme.textSecondary,
                      fontWeight: isActive ? '600' : '400',
                    }}
                  >
                    {label}
                  </ThemedText>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── List ───────────────────────────────────────────────── */}
        <View style={styles.list}>
          {filtered.length === 0 && (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: 'rgba(21,34,32,0.6)',
                  borderColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                },
              ]}
            >
              <ThemedText
                type="default"
                themeColor="textSecondary"
                style={{ textAlign: 'center' }}
              >
                No subscriptions yet.{'\n'}Tap {"\"+ Add\""} to create your first one.
              </ThemedText>
            </View>
          )}

          {filtered.map((sub, i) => (
            <SubscriptionRow
              key={sub.id}
              index={i}
              icon={sub.icon}
              fallback={sub.fallback}
              name={sub.name}
              subtitle={`${sub.plan || sub.category} • ${sub.billingCycle}`}
              price={`$${sub.cost.toFixed(2)}`}
              priceNote={sub.renewalDate}
              onPress={() => router.push(Routes.SUBSCRIPTION_DETAIL as any)}
            />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 16, paddingTop: 16 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  list: { gap: 8 },
  emptyCard: { borderRadius: 12, padding: 32, alignItems: 'center' },
});
