/**
 * DatePickerField — a dependency-free calendar date picker.
 *
 * Renders a pressable field (styled like the form inputs); tapping it opens a
 * modal month-grid calendar. Selecting a day calls onChange with a
 * 'YYYY-MM-DD' string. Past dates are disabled (a "next renewal" is upcoming).
 */
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/prism/Icon';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

/** Parse 'YYYY-MM-DD' to {y,m,d} (m is 0-based) without timezone drift. */
function parseISO(value: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { y: +match[1], m: +match[2] - 1, d: +match[3] };
}

type Props = {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  hasError?: boolean;
};

export function DatePickerField({ value, onChange, placeholder = 'Select a date', hasError }: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const parsed = parseISO(value);
  const today = new Date();
  const todayParts = { y: today.getFullYear(), m: today.getMonth(), d: today.getDate() };

  // The month currently shown in the modal.
  const [view, setView] = useState(() => ({
    y: parsed?.y ?? todayParts.y,
    m: parsed?.m ?? todayParts.m,
  }));

  const cells = useMemo(() => {
    const firstWeekday = new Date(view.y, view.m, 1).getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const prevDays = new Date(view.y, view.m, 0).getDate();
    const out: { day: number; muted?: boolean }[] = [];
    for (let i = firstWeekday - 1; i >= 0; i--) out.push({ day: prevDays - i, muted: true });
    for (let d = 1; d <= daysInMonth; d++) out.push({ day: d });
    return out;
  }, [view]);

  const displayLabel = useMemo(() => {
    if (!parsed) return placeholder;
    return new Date(parsed.y, parsed.m, parsed.d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [parsed, placeholder]);

  function isPast(day: number) {
    if (view.y < todayParts.y) return true;
    if (view.y > todayParts.y) return false;
    if (view.m < todayParts.m) return true;
    if (view.m > todayParts.m) return false;
    return day < todayParts.d;
  }

  function selectDay(day: number) {
    onChange(toISO(view.y, view.m, day));
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setView((v) => {
      const next = new Date(v.y, v.m + delta, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });
  }

  function openPicker() {
    // Reset the visible month to the selected date (or today) each open.
    setView({ y: parsed?.y ?? todayParts.y, m: parsed?.m ?? todayParts.m });
    setOpen(true);
  }

  return (
    <>
      <Pressable
        onPress={openPicker}
        accessibilityLabel="Pick renewal date"
        accessibilityRole="button"
        style={[
          styles.field,
          {
            backgroundColor: theme.surfaceContainerHighest,
            borderColor: hasError ? theme.error : open ? theme.primary : 'rgba(255,255,255,0.1)',
          },
        ]}
      >
        <ThemedText style={{ color: parsed ? theme.text : 'rgba(194,201,184,0.5)', fontSize: 16 }}>
          {displayLabel}
        </ThemedText>
        <Icon name="calendar" size={18} color={theme.primary} fallback="📅" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.card, { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.08)' }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Month nav */}
            <View style={styles.nav}>
              <Pressable onPress={() => shiftMonth(-1)} hitSlop={12} accessibilityLabel="Previous month">
                <Icon name="chevron.left" size={22} color={theme.primary} fallback="‹" />
              </Pressable>
              <ThemedText type="subtitle" style={{ fontSize: 18 }}>
                {MONTHS[view.m]} {view.y}
              </ThemedText>
              <Pressable onPress={() => shiftMonth(1)} hitSlop={12} accessibilityLabel="Next month">
                <Icon name="chevron.right" size={22} color={theme.primary} fallback="›" />
              </Pressable>
            </View>

            {/* Weekday header */}
            <View style={styles.weekRow}>
              {WEEK.map((d, i) => (
                <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.weekDay}>
                  {d}
                </ThemedText>
              ))}
            </View>

            {/* Day grid */}
            <View style={styles.grid}>
              {cells.map((cell, i) => {
                const disabled = cell.muted || isPast(cell.day);
                const selected =
                  !cell.muted && parsed && parsed.y === view.y && parsed.m === view.m && parsed.d === cell.day;
                const isToday =
                  !cell.muted && view.y === todayParts.y && view.m === todayParts.m && cell.day === todayParts.d;
                return (
                  <View key={i} style={styles.cell}>
                    <Pressable
                      disabled={disabled}
                      onPress={() => selectDay(cell.day)}
                      accessibilityLabel={`Day ${cell.day}`}
                      style={[
                        styles.dayBtn,
                        selected && { backgroundColor: theme.primary },
                        !selected && isToday && { borderColor: theme.primary, borderWidth: 1 },
                      ]}
                    >
                      <ThemedText
                        style={[
                          { fontSize: 14 },
                          cell.muted && { opacity: 0.25 },
                          !cell.muted && isPast(cell.day) && { opacity: 0.3 },
                          selected && { color: theme.onPrimary, fontWeight: '700' },
                        ]}
                      >
                        {cell.day}
                      </ThemedText>
                    </Pressable>
                  </View>
                );
              })}
            </View>

            <Pressable
              style={[styles.todayBtn, { borderColor: 'rgba(255,255,255,0.1)' }]}
              onPress={() => {
                setView({ y: todayParts.y, m: todayParts.m });
                selectDay(todayParts.d);
              }}
              accessibilityLabel="Select today"
            >
              <ThemedText type="small" style={{ color: theme.primary, fontWeight: '600' }}>
                Today
              </ThemedText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekRow: { flexDirection: 'row' },
  weekDay: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 3 },
  dayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBtn: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
  },
});
