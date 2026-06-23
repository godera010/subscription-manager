import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { Icon } from '@/components/prism/Icon';
import { ProgressBar } from '@/components/prism/ProgressBar';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import {
  daysUntilRenewal,
  formatShortDate,
  monthlyCostOf,
} from '@/lib/subscriptions';

const CYCLE_DAYS: Record<string, number> = { Monthly: 30, Quarterly: 91, Yearly: 365 };
const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  paused: 'Paused',
  cancelled: 'Cancelled',
};

export default function SubscriptionDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const sub = useStore((s) => s.subscriptions.find((x) => x.id === id));
  const categories = useStore((s) => s.categories);
  const removeSubscription = useStore((s) => s.removeSubscription);

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!sub) {
    return (
      <ThemedView style={styles.container}>
        <TopBar
          title="Subscription"
          left={
            <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={styles.backBtn}>
              <Icon name="chevron.left" size={24} color={theme.primary} fallback="←" />
            </Pressable>
          }
        />
        <View style={styles.notFound}>
          <Icon name="questionmark.circle" size={48} color={theme.textSecondary} fallback="?" />
          <ThemedText type="subtitle" style={{ marginTop: 12 }}>Subscription not found</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            It may have been removed.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const categoryMeta = categories.find((c) => c.name === sub.category);
  const cycleLen = CYCLE_DAYS[sub.billingCycle] ?? 30;
  const daysLeft = Math.max(0, Math.min(cycleLen, daysUntilRenewal(sub)));
  const elapsed = cycleLen - daysLeft;
  const progress = Math.max(0, Math.min(100, (elapsed / cycleLen) * 100));
  const monthly = monthlyCostOf(sub);

  function handleCancel() {
    if (!sub) return;
    Alert.alert(
      `Remove ${sub.name}?`,
      'This deletes the subscription from your tracker. You can add it again later.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeSubscription(sub.id);
            router.back();
          },
        },
      ],
    );
  }

  function comingSoon(feature: string) {
    Alert.alert(feature, 'This feature is coming soon.');
  }

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title={sub.name}
        left={
          <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={styles.backBtn}>
            <Icon name="chevron.left" size={24} color={theme.primary} fallback="←" />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + Spacing.six }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
            <View style={[styles.heroGlow, { backgroundColor: 'rgba(160,213,124,0.15)' }]} />
            <Icon name={sub.icon} size={48} color={theme.primary} fallback={sub.fallback ?? '📱'} />
          </View>
          <ThemedText type="title" style={{ fontSize: 28 }}>{sub.name}</ThemedText>
          <View style={[styles.badge, { backgroundColor: 'rgba(171,210,143,0.15)', borderColor: 'rgba(171,210,143,0.2)' }]}>
            <ThemedText type="small" style={{ color: theme.secondary, textTransform: 'uppercase' }}>
              {(STATUS_LABEL[sub.status] ?? sub.status)} • {sub.category}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
          <View style={styles.progressRow}>
            <ThemedText type="small" themeColor="textSecondary">Billing Cycle</ThemedText>
            <ThemedText type="small">{elapsed} / {cycleLen} Days</ThemedText>
          </View>
          <ProgressBar progress={progress} />
        </View>

        <View style={styles.detailGrid}>
          {[
            { label: 'Price', value: `$${sub.cost.toFixed(2)}` },
            { label: 'Billing', value: sub.billingCycle },
            { label: 'Renewal', value: formatShortDate(sub.renewalDate) || '—' },
          ].map((item, i) => (
            <View key={i} style={[styles.detailCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
              <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>{item.label}</ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 20 }}>{item.value}</ThemedText>
            </View>
          ))}
        </View>

        {sub.billingCycle !== 'Monthly' && (
          <View style={[styles.equivCard, { backgroundColor: 'rgba(160,213,124,0.05)', borderColor: 'rgba(160,213,124,0.1)' }]}>
            <Icon name="equal.circle.fill" size={20} color={theme.primary} fallback="≈" />
            <ThemedText type="small" themeColor="textSecondary">
              Works out to <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>${monthly.toFixed(2)}/mo</ThemedText>
            </ThemedText>
          </View>
        )}

        <View style={styles.actionRow}>
          <AnimatedPressable
            style={[styles.primaryBtn, { backgroundColor: theme.primaryContainer }]}
            onPress={() => router.push({ pathname: Routes.ADD_SUBSCRIPTION, params: { id: sub.id } } as any)}
            accessibilityLabel="Edit subscription"
            accessibilityRole="button"
            pressedScale={0.97}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="pencil" size={18} color={theme.onPrimaryContainer} fallback="✏️" />
              <ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: '600' }}>Edit Subscription</ThemedText>
            </View>
          </AnimatedPressable>
          <AnimatedPressable
            style={[styles.secondaryBtn, { borderColor: 'rgba(140,147,132,0.3)' }]}
            onPress={() => comingSoon('Billing History')}
            accessibilityLabel="View billing history"
            accessibilityRole="button"
            pressedScale={0.97}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="doc.text.fill" size={18} color={theme.text} fallback="📜" />
              <ThemedText>View Billing History</ThemedText>
            </View>
          </AnimatedPressable>
        </View>

        <Pressable style={styles.cancelSection} onPress={handleCancel} accessibilityLabel="Remove subscription" accessibilityRole="button">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="trash.fill" size={18} color={theme.error} fallback="🗑" />
            <ThemedText type="default" style={{ color: theme.error }}>Remove Subscription</ThemedText>
          </View>
          <ThemedText type="small" style={{ color: 'rgba(194,201,184,0.6)', textAlign: 'center' }}>
            This removes {sub.name} from your tracker. It won't cancel the service with the provider.
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  backBtn: { padding: 8 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  heroSection: { alignItems: 'center', gap: 8 },
  heroIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', inset: 0, borderRadius: 48 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 24, borderWidth: 1 },
  progressCard: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailGrid: { flexDirection: 'row', gap: 16 },
  detailCard: { flex: 1, borderRadius: 12, padding: 16, borderWidth: 1, alignItems: 'center', gap: 4 },
  equivCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, padding: 14 },
  actionRow: { gap: 12 },
  primaryBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  cancelSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
});
