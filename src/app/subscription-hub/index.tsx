import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const categories = [
  {
    name: 'Entertainment',
    icon: 'film.fill',
    fallback: '🎬',
    total: '$184.00',
    subs: '4 subscriptions',
    color: '#a0d57c',
  },
  {
    name: 'Productivity',
    icon: 'briefcase.fill',
    fallback: '💼',
    total: '$92.50',
    subs: '3 subscriptions',
    color: '#abd28f',
  },
  {
    name: 'Utilities',
    icon: 'bolt.fill',
    fallback: '⚡',
    total: '$122.00',
    subs: '2 subscriptions',
    color: '#c8c6c5',
  },
  {
    name: 'Gaming',
    icon: 'gamecontroller.fill',
    fallback: '🎮',
    total: '$30.00',
    subs: '1 subscription',
    color: '#ffb4ab',
  },
];

const quickActions = [
  { icon: 'plus.circle.fill', fallback: '➕', label: 'Add New', href: '/add-subscription' },
  { icon: 'trash.fill', fallback: '🗑', label: 'Cancel', href: '/cancel-subscriptions' },
  { icon: 'calendar', fallback: '📅', label: 'Calendar', href: '/renewal-calendar' },
  { icon: 'chart.bar.fill', fallback: '📊', label: 'Insights', href: '/spending-insights' },
];

export default function SubscriptionHub() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Subscription Hub"
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
            styles.totalCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Total Monthly Spend
          </ThemedText>
          <ThemedText type="title" style={{ fontSize: 44 }}>
            $428.50
          </ThemedText>
          <View style={styles.totalMeta}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Active Subs</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>10</ThemedText>
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Avg. Cost</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>$42.85</ThemedText>
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Next Renewal</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>Jan 28</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          {quickActions.map((action, i) => (
            <Pressable
              key={i}
              style={[
                styles.actionBtn,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
              onPress={() => router.push(action.href as any)}
            >
              <Icon name={action.icon} size={24} color={theme.primary} fallback={action.fallback} />
              <ThemedText type="small">{action.label}</ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText type="subtitle" style={{ fontSize: 20 }}>
          Categories
        </ThemedText>

        <View style={styles.categoryList}>
          {categories.map((cat, i) => (
            <View
              key={i}
              style={[
                styles.categoryCard,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
            >
              <View style={styles.categoryRow}>
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.catIcon,
                      { backgroundColor: `${cat.color}15` },
                    ]}
                  >
                    <Icon name={cat.icon} size={20} color={cat.color} fallback={cat.fallback} />
                  </View>
                  <View>
                    <ThemedText type="default" style={{ fontWeight: '600' }}>
                      {cat.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {cat.subs}
                    </ThemedText>
                  </View>
                </View>
                <ThemedText type="default" style={{ fontWeight: '600' }}>
                  {cat.total}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: theme.surfaceContainerHighest },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: cat.color, width: `${20 + i * 10}%` },
                  ]}
                />
              </View>
            </View>
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
  totalCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    gap: 12,
  },
  totalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  categoryList: { gap: 12 },
  categoryCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
