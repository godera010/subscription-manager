import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const subscriptions = [
  {
    icon: 'film.fill',
    fallback: 'Movie',
    name: 'Netflix',
    price: '$15.99',
    subtitle: 'Premium 4K • Cancel anytime',
    steps: [
      'Go to Account Settings',
      'Select Membership & Billing',
      'Confirm Cancellation',
    ],
  },
  {
    icon: 'paintpalette.fill',
    fallback: 'Design',
    name: 'Adobe CC',
    price: '$52.99',
    subtitle: 'Annual • Early termination fee may apply',
    steps: [
      'Log in to Adobe Account',
      'Go to Plans & Payment',
      'Cancel your subscription',
    ],
  },
  {
    icon: 'music.note',
    fallback: 'Music',
    name: 'Spotify',
    price: '$9.99',
    subtitle: 'Family Plan',
  },
  {
    icon: 'square.and.arrow.down',
    fallback: 'Save',
    name: 'Loom',
    price: '$12.50',
    subtitle: 'Business • Monthly',
  },
];

export default function CancelSubscriptions() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(0);

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
      >
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.surfaceContainerHighest,
              borderColor: theme.outlineVariant,
            },
          ]}
        >
          <Icon name="magnifyingglass" size={16} color={theme.textSecondary} fallback="🔍" />
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(194,201,184,0.5)"
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>

        <View style={styles.countRow}>
          <ThemedText type="subtitle" style={{ fontSize: 20 }}>
            Active Subscriptions
          </ThemedText>
          <View
            style={[
              styles.countBadge,
              { backgroundColor: theme.surfaceContainer },
            ]}
          >
            <ThemedText type="small" themeColor="textSecondary">
              {subscriptions.length} Total
            </ThemedText>
          </View>
        </View>

        <View style={styles.subList}>
          {subscriptions.map((sub, i) => (
            <View
              key={i}
              style={[
                styles.subCard,
                {
                  backgroundColor: theme.surfaceContainer,
                  borderColor: 'rgba(255,255,255,0.05)',
                },
              ]}
            >
              <Pressable
                style={styles.subHeader}
                onPress={() => setExpanded(expanded === i ? null : i)}
                accessibilityLabel={`Expand ${sub.name} cancellation guide`}
                accessibilityRole="button"
              >
                <View style={styles.subLeft}>
                  <View
                    style={[
                      styles.subIcon,
                      { backgroundColor: theme.surfaceContainerHighest },
                    ]}
                  >
                    <Icon name={sub.icon} size={20} color={theme.primary} fallback={sub.fallback} />
                  </View>
                  <View>
                    <ThemedText type="default" style={{ fontWeight: '600' }}>
                      {sub.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {sub.price}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText style={{ color: theme.primary, fontSize: 16 }}>
                  {expanded === i ? '−' : '+'}
                </ThemedText>
                </Pressable>

              {expanded === i && sub.steps && (
                <View style={[styles.expandedContent, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                  <View style={styles.guideHeader}>
                    <Icon name="info.circle.fill" size={16} color={theme.primary} fallback="ℹ️" />
                    <ThemedText
                      type="small"
                      style={{
                        color: theme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      Cancellation Guide
                    </ThemedText>
                  </View>
                  {sub.steps.map((step, j) => (
                    <View key={j} style={styles.stepRow}>
                      <View
                        style={[
                          styles.stepNum,
                          { backgroundColor: 'rgba(160,213,124,0.15)' },
                        ]}
                      >
                        <ThemedText type="small" style={{ color: theme.primary }}>
                          {j + 1}
                        </ThemedText>
                      </View>
                      <ThemedText type="small">{step}</ThemedText>
                    </View>
                  ))}
                  <View
                    style={[
                      styles.visitBtn,
                      { borderColor: 'rgba(160,213,124,0.3)' },
                    ]}
                  >
                    <ThemedText type="small" style={{ color: theme.primary }}>
                      Visit Cancellation Page ↗
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <View
          style={[
            styles.suggestionCard,
            {
              backgroundColor: 'rgba(160,213,124,0.03)',
              borderColor: 'rgba(160,213,124,0.1)',
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="lightbulb.fill" size={18} color={theme.secondary} fallback="💡" />
            <ThemedText type="subtitle" style={{ fontSize: 18 }}>
              Smart Suggestion
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Consider pausing instead of canceling. We can help you save without losing access to
            your services.
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
  subList: { gap: 12 },
  subCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  subLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
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
  suggestionCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
});
