import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import { formatShortDate } from '@/lib/subscriptions';

const GENERIC_STEPS = [
  'Open the provider\'s website or app and sign in.',
  'Go to Account → Subscription or Billing settings.',
  'Select Cancel and confirm to stop future renewals.',
];

export default function CancelSubscriptions() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const removeSubscription = useStore((s) => s.removeSubscription);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    );
  }, [subscriptions, query]);

  function openCancelPage(name: string) {
    Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(`how to cancel ${name} subscription`)}`);
  }

  function confirmRemove(id: string, name: string) {
    Alert.alert(
      `Remove ${name}?`,
      'This removes it from your tracker. It does not cancel the service with the provider.',
      [
        { text: 'Keep', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeSubscription(id) },
      ],
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Cancel Subscriptions"
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
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.searchBox,
            { backgroundColor: theme.surfaceContainerHighest, borderColor: theme.outlineVariant },
          ]}
        >
          <Icon name="magnifyingglass" size={16} color={theme.textSecondary} fallback="🔍" />
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(194,201,184,0.5)"
            style={[styles.searchInput, { color: theme.text }]}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.countRow}>
          <ThemedText type="subtitle" style={{ fontSize: 20 }}>
            Your Subscriptions
          </ThemedText>
          <View style={[styles.countBadge, { backgroundColor: theme.surfaceContainer }]}>
            <ThemedText type="small" themeColor="textSecondary">
              {filtered.length} {query ? 'Found' : 'Total'}
            </ThemedText>
          </View>
        </View>

        {filtered.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor: 'rgba(255,255,255,0.05)' }]}>
            <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
              {query ? 'No matches.' : 'No subscriptions to cancel yet.'}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.subList}>
            {filtered.map((sub) => (
              <View
                key={sub.id}
                style={[
                  styles.subCard,
                  { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                ]}
              >
                <Pressable
                  style={styles.subHeader}
                  onPress={() => setExpanded(expanded === sub.id ? null : sub.id)}
                  accessibilityLabel={`Expand ${sub.name} cancellation guide`}
                  accessibilityRole="button"
                >
                  <View style={styles.subLeft}>
                    <View style={[styles.subIcon, { backgroundColor: theme.surfaceContainerHighest }]}>
                      <Icon name={sub.icon} size={20} color={theme.primary} fallback={sub.fallback ?? '📱'} />
                    </View>
                    <View>
                      <ThemedText type="default" style={{ fontWeight: '600' }}>
                        {sub.name}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        ${sub.cost.toFixed(2)} • {sub.billingCycle} • Renews {formatShortDate(sub.renewalDate) || '—'}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={{ color: theme.primary, fontSize: 16 }}>
                    {expanded === sub.id ? '−' : '+'}
                  </ThemedText>
                </Pressable>

                {expanded === sub.id && (
                  <View style={[styles.expandedContent, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                    <View style={styles.guideHeader}>
                      <Icon name="info.circle.fill" size={16} color={theme.primary} fallback="ℹ️" />
                      <ThemedText
                        type="small"
                        style={{ color: theme.primary, textTransform: 'uppercase', letterSpacing: 1 }}
                      >
                        Cancellation Guide
                      </ThemedText>
                    </View>
                    {GENERIC_STEPS.map((step, j) => (
                      <View key={j} style={styles.stepRow}>
                        <View style={[styles.stepNum, { backgroundColor: 'rgba(160,213,124,0.15)' }]}>
                          <ThemedText type="small" style={{ color: theme.primary }}>
                            {j + 1}
                          </ThemedText>
                        </View>
                        <ThemedText type="small" style={{ flex: 1 }}>{step}</ThemedText>
                      </View>
                    ))}
                    <Pressable
                      style={[styles.visitBtn, { borderColor: 'rgba(160,213,124,0.3)' }]}
                      onPress={() => openCancelPage(sub.name)}
                      accessibilityLabel={`Find cancellation page for ${sub.name}`}
                    >
                      <ThemedText type="small" style={{ color: theme.primary }}>
                        Find Cancellation Page ↗
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={[styles.removeBtn, { borderColor: `${theme.error}55` }]}
                      onPress={() => confirmRemove(sub.id, sub.name)}
                      accessibilityLabel={`Remove ${sub.name} from tracker`}
                    >
                      <Icon name="trash.fill" size={14} color={theme.error} fallback="🗑" />
                      <ThemedText type="small" style={{ color: theme.error }}>
                        Remove from Tracker
                      </ThemedText>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View
          style={[
            styles.suggestionCard,
            { backgroundColor: 'rgba(160,213,124,0.03)', borderColor: 'rgba(160,213,124,0.1)' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="lightbulb.fill" size={18} color={theme.secondary} fallback="💡" />
            <ThemedText type="subtitle" style={{ fontSize: 18 }}>
              Smart Suggestion
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Before cancelling, check whether pausing or downgrading keeps the features you actually use at a lower cost.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 16, paddingTop: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 16 },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
  },
  emptyCard: { borderRadius: 12, borderWidth: 1, padding: 32, alignItems: 'center' },
  subList: { gap: 12 },
  subCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  subLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  subIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 12,
  },
  guideHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
});
