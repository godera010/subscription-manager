import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const renewals = [
  { icon: 'film.fill', fallback: '🎬', name: 'Netflix Premium', category: 'Entertainment', price: '$15.99', date: 'Today', time: '10:00 AM', status: 'upcoming', borderColor: '#a0d57c' },
  { icon: 'icloud.fill', fallback: '☁️', name: 'Google One', category: 'Productivity', price: '$2.99', date: 'Today', time: 'Monthly Billing', status: 'paid', borderColor: '#abd28f' },
  { icon: 'music.note', fallback: '🎵', name: 'Spotify Family', category: 'Entertainment', price: '$16.99', date: 'Oct 23', time: 'Coming up', status: 'upcoming', borderColor: '#a0d57c' },
  { icon: 'paintpalette.fill', fallback: '🎨', name: 'Adobe CC', category: 'Productivity', price: '$52.99', date: 'Oct 28', time: 'Annual', status: 'upcoming', borderColor: '#a0d57c' },
  { icon: 'gamecontroller.fill', fallback: '🎮', name: 'Xbox Game Pass', category: 'Gaming', price: '$16.99', date: 'Nov 03', time: 'Monthly', status: 'upcoming', borderColor: '#a0d57c' },
  { icon: 'tv.fill', fallback: '📺', name: 'Hulu', category: 'Entertainment', price: '$14.99', date: 'Nov 12', time: 'No Ads', status: 'upcoming', borderColor: '#a0d57c' },
];

export default function UpcomingRenewals() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
            Renewals This Month
          </ThemedText>
          <ThemedText type="title" style={{ fontSize: 40 }}>
            6
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Total upcoming: $120.94
          </ThemedText>
        </View>

        <View style={styles.list}>
          {renewals.map((item, i) => (
            <View
              key={i}
              style={[
                styles.renewalCard,
                {
                  backgroundColor: theme.surfaceContainer,
                  borderColor: 'rgba(255,255,255,0.05)',
                  borderLeftColor: item.borderColor,
                  borderLeftWidth: 4,
                },
              ]}
            >
              <View style={styles.renewalRow}>
                <View style={styles.renewalLeft}>
                  <View
                    style={[
                      styles.renewalIcon,
                      { backgroundColor: theme.surfaceContainerHigh },
                    ]}
                  >
                    <Icon name={item.icon} size={28} color={theme.primary} fallback={item.fallback} />
                  </View>
                  <View>
                    <ThemedText type="default" style={{ fontWeight: '600' }}>
                      {item.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.category} • {item.time}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.renewalRight}>
                  <ThemedText type="default" style={{ color: theme.primary }}>
                    {item.price}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.date}
                  </ThemedText>
                </View>
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
