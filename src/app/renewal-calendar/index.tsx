import { router } from 'expo-router';
import { useMemo, useState } from 'react';
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
import type { Subscription } from '@/types';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function RenewalCalendar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const categories = useStore((s) => s.categories);

  const today = new Date();
  const [offset, setOffset] = useState(0); // months from current
  const view = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const isCurrentMonth = offset === 0;

  // Map day-of-month -> subscriptions renewing that day this month
  const renewalsByDay = useMemo(() => {
    const map: Record<number, Subscription[]> = {};
    for (const sub of subscriptions) {
      const d = new Date(sub.renewalDate);
      if (isNaN(d.getTime())) continue;
      if (d.getFullYear() === year && d.getMonth() === month) {
        (map[d.getDate()] ??= []).push(sub);
      }
    }
    return map;
  }, [subscriptions, year, month]);

  const renewalCount = useMemo(
    () => Object.values(renewalsByDay).reduce((n, arr) => n + arr.length, 0),
    [renewalsByDay],
  );

  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const effectiveSelected = selectedDay;
  const selectedRenewals = renewalsByDay[effectiveSelected] ?? [];

  // Build grid: leading muted days + this month's days
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { day: number; muted?: boolean }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, muted: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d });
  }

  function catColor(sub: Subscription) {
    return categories.find((c) => c.name === sub.category)?.color ?? theme.primary;
  }

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
          <Pressable onPress={() => setOffset((o) => o - 1)} accessibilityLabel="Previous month" hitSlop={12}>
            <Icon name="chevron.left" size={24} color={theme.primary} fallback="‹" />
          </Pressable>
          <View style={styles.monthCenter}>
            <ThemedText type="subtitle" style={{ fontSize: 20 }}>
              {MONTHS[month]} {year}
            </ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.primary, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}
            >
              {renewalCount} Renewal{renewalCount !== 1 ? 's' : ''}
            </ThemedText>
          </View>
          <Pressable onPress={() => setOffset((o) => o + 1)} accessibilityLabel="Next month" hitSlop={12}>
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
            {cells.map((cell, i) => {
              const isToday = isCurrentMonth && !cell.muted && cell.day === today.getDate();
              const isSelected = !cell.muted && cell.day === effectiveSelected;
              const dayRenewals = cell.muted ? [] : (renewalsByDay[cell.day] ?? []);
              const dot = dayRenewals[0] ? catColor(dayRenewals[0]) : undefined;
              return (
                <Pressable
                  key={i}
                  style={styles.dayCell}
                  disabled={cell.muted}
                  onPress={() => setSelectedDay(cell.day)}
                  accessibilityLabel={`Day ${cell.day}`}
                >
                  <View
                    style={[
                      styles.dayNum,
                      isSelected && {
                        backgroundColor: isToday ? theme.primary : theme.surfaceContainerHighest,
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
                        cell.muted && { opacity: 0.4 },
                        isSelected && isToday && { color: '#153800', fontWeight: '700' },
                      ]}
                    >
                      {cell.day}
                    </ThemedText>
                  </View>
                  {dot && <View style={[styles.dot, { backgroundColor: dot }]} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <View style={styles.sectionRow}>
            <ThemedText type="subtitle" style={{ fontSize: 20 }}>
              Renewing on {MONTHS[month].slice(0, 3)} {effectiveSelected}
            </ThemedText>
          </View>

          {selectedRenewals.length === 0 ? (
            <View style={[styles.emptyDay, { borderColor: 'rgba(255,255,255,0.05)' }]}>
              <ThemedText type="small" themeColor="textSecondary">
                No renewals on this day.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.renewalList}>
              {selectedRenewals.map((item) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.renewalCard,
                    {
                      backgroundColor: theme.surfaceContainer,
                      borderColor: 'rgba(255,255,255,0.05)',
                      borderLeftColor: catColor(item),
                      borderLeftWidth: 4,
                    },
                  ]}
                  onPress={() => router.push({ pathname: Routes.SUBSCRIPTION_DETAIL, params: { id: item.id } } as any)}
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
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
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
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyDay: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  renewalList: { gap: 8 },
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
