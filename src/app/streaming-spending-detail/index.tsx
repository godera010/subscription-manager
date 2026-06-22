import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const services = [
  { icon: 'film.fill', fallback: '🎬', name: 'Netflix', plan: 'Premium 4K', price: '$15.99', usage: '45h', change: '+5%', changeColor: '#ffb4ab' },
  { icon: 'music.note', fallback: '🎵', name: 'Spotify', plan: 'Family Plan', price: '$16.99', usage: '30h', change: '+2%', changeColor: '#ffb4ab' },
  { icon: 'tv.fill', fallback: '📺', name: 'Hulu', plan: 'No Ads', price: '$14.99', usage: '12h', change: '-8%', changeColor: '#a0d57c' },
  { icon: 'headphones', fallback: '🎧', name: 'Apple Music', plan: 'Individual', price: '$10.99', usage: '28h', change: '0%', changeColor: '#c2c9b8' },
  { icon: 'tv.fill', fallback: '📺', name: 'Disney+', plan: 'Premium', price: '$13.99', usage: '18h', change: '+15%', changeColor: '#ffb4ab' },
  { icon: 'film.fill', fallback: '🎬', name: 'HBO Max', plan: 'Ad-Free', price: '$15.99', usage: '8h', change: '-22%', changeColor: '#a0d57c' },
];

const totalStreaming = '$88.94';
const avgPerService = '$14.82';

export default function StreamingSpendingDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
            {totalStreaming}
          </ThemedText>
          <View style={styles.summaryMeta}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Services</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>6</ThemedText>
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">Avg/Service</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600' }}>{avgPerService}</ThemedText>
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">vs Last Month</ThemedText>
              <ThemedText type="default" style={{ fontWeight: '600', color: '#ffb4ab' }}>+4.2%</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.headerRow}>
          <ThemedText type="subtitle" style={{ fontSize: 20 }}>
            All Services
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.primary }}>Sort: Cost ↓</ThemedText>
        </View>

        <View style={styles.serviceList}>
          {services.map((svc, i) => (
            <View
              key={i}
              style={[
                styles.serviceCard,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
            >
              <View style={styles.serviceRow}>
                <View style={styles.serviceLeft}>
                  <View
                    style={[
                      styles.serviceIcon,
                      { backgroundColor: theme.surfaceContainerHighest },
                    ]}
                  >
                    <Icon name={svc.icon} size={24} color={theme.primary} fallback={svc.fallback} />
                  </View>
                  <View>
                    <ThemedText type="default" style={{ fontWeight: '600' }}>
                      {svc.name}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {svc.plan}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.serviceRight}>
                  <ThemedText type="default" style={{ fontWeight: '600' }}>
                    {svc.price}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: svc.changeColor }}>
                    {svc.change}
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.serviceDivider, { borderTopColor: 'rgba(255,255,255,0.05)' }]}>
                <ThemedText type="small" themeColor="textSecondary">
                  Usage: {svc.usage}/mo
                </ThemedText>
                <View
                  style={[
                    styles.usageTrack,
                    { backgroundColor: theme.surfaceContainerHighest },
                  ]}
                >
                  <View
                    style={[
                      styles.usageFill,
                      { backgroundColor: theme.primary, width: `${40 + i * 8}%` },
                    ]}
                  />
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
