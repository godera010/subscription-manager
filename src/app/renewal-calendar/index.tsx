import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const calendarDays = [
  { day: 26, muted: true },
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 1 },
  { day: 2 },
  { day: 3, dot: '#a0d57c' },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9 },
  { day: 10 },
  { day: 11 },
  { day: 12, active: true },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16, dot: '#ffb4ab' },
  { day: 17 },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23, dot: '#a0d57c' },
  { day: 24 },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30 },
];

const todayRenewals = [
  { icon: 'film.fill', fallback: '🎬', name: 'Netflix Premium', category: 'Entertainment • Auto-pay', price: '$15.99', time: 'Renewing at 10:00 AM' },
  { icon: 'icloud.fill', fallback: '☁️', name: 'Google One', category: 'Productivity • Cloud', price: '$2.99', time: 'Monthly Billing' },
];

const upcomingHighlight = {
  icon: 'music.note',
  fallback: '🎵',
  name: 'Spotify Family Plan',
  desc: 'Coming up on Oct 23rd',
  price: '$16.99',
};

export default function RenewalCalendar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title="Renewal Calendar"
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
        <View style={styles.monthNav}>
          <Pressable accessibilityLabel="Previous month">
            <Icon name="chevron.left" size={24} color={theme.primary} fallback="‹" />
          </Pressable>
          <View style={styles.monthCenter}>
            <ThemedText type="subtitle" style={{ fontSize: 20 }}>
              October 2023
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.primary, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              3 Renewals Pending
            </ThemedText>
          </View>
          <Pressable accessibilityLabel="Next month">
            <Icon name="chevron.right" size={24} color={theme.primary} fallback="›" />
          </Pressable>
        </View>

        <View
          style={[
            styles.calendarCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
        >
          <View style={styles.weekRow}>
            {weekDays.map((d, i) => (
              <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.weekDay}>
                {d}
              </ThemedText>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {calendarDays.map((day, i) => (
              <View key={i} style={styles.dayCell}>
                <View
                  style={[
                    styles.dayNum,
                    day.active && {
                      backgroundColor: theme.primary,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  <ThemedText
                    type="default"
                    style={[
                      day.muted && { opacity: 0.4 },
                      day.active && { color: '#153800', fontWeight: '700' },
                    ]}
                  >
                    {day.day}
                  </ThemedText>
                </View>
                {day.dot && (
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: day.dot },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: 'rgba(160,213,124,0.6)' }]} />
            <ThemedText type="small" themeColor="textSecondary">Paid</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.error }]} />
            <ThemedText type="small" themeColor="textSecondary">Unpaid</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
            <ThemedText type="small" themeColor="textSecondary">Upcoming</ThemedText>
          </View>
        </View>

        <View>
          <View style={styles.sectionRow}>
            <ThemedText type="subtitle" style={{ fontSize: 20 }}>
              Renewing Today
            </ThemedText>
            <View style={[styles.dateBadge, { backgroundColor: 'rgba(160,213,124,0.1)' }]}>
              <ThemedText type="small" style={{ color: theme.primary }}>
                Oct 12
              </ThemedText>
            </View>
          </View>

          <View style={styles.renewalList}>
            {todayRenewals.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.renewalCard,
                  {
                    backgroundColor: theme.surfaceContainer,
                    borderColor: 'rgba(255,255,255,0.05)',
                    borderLeftColor: theme.primary,
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
                        {item.category}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.renewalRight}>
                    <ThemedText type="default" style={{ color: theme.primary }}>
                      {item.price}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: 'rgba(160,213,124,0.7)' }}>
                      {item.time}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.upcomingCard,
            {
              backgroundColor: 'rgba(160,213,124,0.03)',
              borderColor: 'rgba(160,213,124,0.1)',
            },
          ]}
        >
          <View
            style={[
              styles.ucIcon,
              { backgroundColor: 'rgba(160,213,124,0.15)' },
            ]}
          >
            <Icon name="calendar" size={20} color={theme.primary} fallback="📅" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="default" style={{ color: theme.primary, fontWeight: '500' }}>
              {upcomingHighlight.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {upcomingHighlight.desc} • {upcomingHighlight.price}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthCenter: { alignItems: 'center', gap: 4 },
  calendarCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayNum: { alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
  },
  renewalList: { gap: 8, marginTop: 16 },
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
  upcomingCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ucIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
