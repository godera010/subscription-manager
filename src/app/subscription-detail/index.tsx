import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { ProgressBar } from '@/components/prism/ProgressBar';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const perks = [
  { icon: 'tv.fill', fallback: '📺', title: '4 Screens at once', desc: 'Watch on multiple devices simultaneously' },
  { icon: 'sparkle', fallback: '✨', title: 'Ultra HD available', desc: 'Crystal clear resolution for your TV' },
  { icon: 'arrow.down.circle.fill', fallback: '⬇️', title: 'Download on 6 devices', desc: 'Take your movies anywhere offline' },
];

export default function SubscriptionDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Netflix"
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
            <Icon name="film.fill" size={48} color={theme.primary} fallback="🎬" />
          </View>
          <ThemedText type="title" style={{ fontSize: 28 }}>Netflix</ThemedText>
          <View style={[styles.badge, { backgroundColor: 'rgba(171,210,143,0.15)', borderColor: 'rgba(171,210,143,0.2)' }]}>
            <ThemedText type="small" style={{ color: theme.secondary, textTransform: 'uppercase' }}>Premium 4K</ThemedText>
          </View>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
          <View style={styles.progressRow}>
            <ThemedText type="small" themeColor="textSecondary">Billing Cycle</ThemedText>
            <ThemedText type="small">18 / 31 Days</ThemedText>
          </View>
          <ProgressBar progress={58} />
        </View>

        <View style={styles.detailGrid}>
          {[
            { label: 'Price', value: '$15.99' },
            { label: 'Billing', value: 'Monthly' },
            { label: 'Renewal', value: 'Feb 12' },
          ].map((item, i) => (
            <View key={i} style={[styles.detailCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
              <ThemedText type="small" themeColor="textSecondary" style={{ textTransform: 'uppercase' }}>{item.label}</ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 20 }}>{item.value}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <View style={[styles.primaryBtn, { backgroundColor: theme.primaryContainer }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="gearshape.fill" size={18} color={theme.onPrimaryContainer} fallback="⚙️" />
              <ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: '600' }}>Manage Subscription</ThemedText>
            </View>
          </View>
          <View style={[styles.secondaryBtn, { borderColor: 'rgba(140,147,132,0.3)' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="doc.text.fill" size={18} color={theme.text} fallback="📜" />
              <ThemedText>View Billing History</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.perksSection}>
          <ThemedText type="subtitle" style={{ fontSize: 20, color: theme.textSecondary }}>Subscription Perks</ThemedText>
          <View style={[styles.perksCard, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' }]}>
            {perks.map((perk, i) => (
              <View key={i} style={[styles.perkRow, i < perks.length - 1 && { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }]}>
                <Icon name={perk.icon} size={24} color={theme.primary} fallback={perk.fallback} />
                <View style={{ flex: 1 }}>
                  <ThemedText type="default">{perk.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{perk.desc}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          style={styles.cancelSection}
          onPress={() => router.push(Routes.CANCEL_SUBSCRIPTIONS as any)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="trash.fill" size={18} color={theme.error} fallback="🗑" />
            <ThemedText type="default" style={{ color: theme.error }}>Cancel Subscription</ThemedText>
          </View>
          <ThemedText type="small" style={{ color: 'rgba(194,201,184,0.6)', textAlign: 'center' }}>
            You can cancel anytime. If you cancel, you'll still have access until the end of the billing period.
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
  heroSection: { alignItems: 'center', gap: 8 },
  heroIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', inset: 0, borderRadius: 48 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 24, borderWidth: 1 },
  progressCard: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 8 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailGrid: { flexDirection: 'row', gap: 16 },
  detailCard: { flex: 1, borderRadius: 12, padding: 16, borderWidth: 1, alignItems: 'center', gap: 4 },
  actionRow: { gap: 12 },
  primaryBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  perksSection: { gap: 16 },
  perksCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  perkRow: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16 },
  cancelSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
});
