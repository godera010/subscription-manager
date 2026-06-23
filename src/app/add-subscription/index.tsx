import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { DatePickerField } from '@/components/prism/DatePickerField';
import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { Animation, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import type { BillingCycle } from '@/types';

const BILLING_CYCLES: BillingCycle[] = ['Monthly', 'Quarterly', 'Yearly'];

export default function AddSubscription() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const addSubscription = useStore((s) => s.addSubscription);
  const updateSubscription = useStore((s) => s.updateSubscription);
  const categories = useStore((s) => s.categories);

  // ── Edit mode ──────────────────────────────────────────────────────────────
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useStore((s) => (id ? s.subscriptions.find((x) => x.id === id) : undefined));
  const editing = !!existing;

  // ── Form state (pre-filled when editing) ───────────────────────────────────
  const [name, setName] = useState(existing?.name ?? '');
  const [cost, setCost] = useState(existing ? String(existing.cost) : '');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(existing?.billingCycle ?? 'Monthly');
  const [renewalDate, setRenewalDate] = useState(existing?.renewalDate ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Focus ring state ──────────────────────────────────────────────────────
  const [nameFocused, setNameFocused] = useState(false);
  const [costFocused, setCostFocused] = useState(false);

  // ── Shake animation ───────────────────────────────────────────────────────
  const shakeX = useSharedValue(0);

  const formCardAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: shakeX.value }] };
  });

  // ── Billing-cycle sliding pill ────────────────────────────────────────────
  const [cycleWidth, setCycleWidth] = useState(0);
  const pillLeft = useSharedValue(0);

  const pillAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return { transform: [{ translateX: pillLeft.value }] };
  });

  function handleCycleLayout(e: LayoutChangeEvent) {
    setCycleWidth(e.nativeEvent.layout.width);
  }

  function selectCycle(cycle: BillingCycle) {
    setBillingCycle(cycle);
    const idx = BILLING_CYCLES.indexOf(cycle);
    const segW = cycleWidth / BILLING_CYCLES.length;
    pillLeft.value = withTiming(idx * segW, { duration: 200 });
  }

  // Snap the pill under the current cycle once the row has measured (e.g. on edit).
  useEffect(() => {
    if (cycleWidth > 0) {
      const idx = BILLING_CYCLES.indexOf(billingCycle);
      pillLeft.value = (cycleWidth / BILLING_CYCLES.length) * idx;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleWidth]);

  // ── Validation ────────────────────────────────────────────────────────────
  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Subscription name is required';
    if (!cost.trim() || isNaN(Number(cost)) || Number(cost) <= 0)
      errs.cost = 'Enter a valid monthly cost';
    if (!renewalDate.trim()) errs.renewalDate = 'Pick a renewal date';
    if (!category) errs.category = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) {
      // Shake the form card
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 40 }),
      );
      return;
    }
    const fields = {
      name: name.trim(),
      cost: parseFloat(parseFloat(cost).toFixed(2)),
      billingCycle,
      category,
      renewalDate,
    };
    if (editing && existing) {
      updateSubscription(existing.id, fields);
    } else {
      addSubscription({ ...fields, icon: 'app.badge.fill', fallback: '📱' });
    }
    router.back();
  }

  const segW = cycleWidth > 0 ? cycleWidth / BILLING_CYCLES.length : 0;

  return (
    <ThemedView style={styles.container}>
      <TopBar
        title={editing ? 'Edit Subscription' : 'Add Subscription'}
        left={
          <AnimatedPressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backBtn}
            pressedScale={0.88}
          >
            <Icon name="chevron.left" size={24} color={theme.primary} fallback="←" />
          </AnimatedPressable>
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
        {/* ── Form card ──────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(80).duration(250)}>
         <Animated.View
          style={[
            formCardAnimatedStyle,
            styles.formCard,
            { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
          ]}
         >
          {/* Subscription Name */}
          <Field label="Subscription Name" error={errors.name}>
            <TextInput
              placeholder="e.g., Netflix"
              placeholderTextColor="rgba(194,201,184,0.5)"
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.surfaceContainerHighest,
                  borderColor: nameFocused ? theme.primary : 'rgba(255,255,255,0.1)',
                },
              ]}
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              accessibilityLabel="Subscription name"
            />
          </Field>

          {/* Monthly Cost */}
          <Field label="Monthly Cost" error={errors.cost}>
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor: theme.surfaceContainerHighest,
                  borderColor: costFocused ? theme.primary : 'rgba(255,255,255,0.1)',
                },
              ]}
            >
              <ThemedText type="default" style={{ color: theme.primary, fontWeight: '700' }}>
                $
              </ThemedText>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="rgba(194,201,184,0.5)"
                keyboardType="decimal-pad"
                style={[styles.inputInRow, { color: theme.text }]}
                value={cost}
                onChangeText={setCost}
                onFocus={() => setCostFocused(true)}
                onBlur={() => setCostFocused(false)}
                accessibilityLabel="Monthly cost in dollars"
              />
            </View>
          </Field>

          {/* Billing Cycle */}
          <Field label="Billing Cycle">
            <View
              style={[
                styles.cycleRow,
                { backgroundColor: theme.surfaceContainerLow, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
              onLayout={handleCycleLayout}
            >
              {/* Animated sliding pill — sits behind buttons */}
              {segW > 0 && (
                <Animated.View
                  style={[
                    styles.cyclePill,
                    pillAnimatedStyle,
                    { backgroundColor: theme.primaryContainer, width: segW },
                  ]}
                />
              )}

              {BILLING_CYCLES.map((cycle) => (
                <AnimatedPressable
                  key={cycle}
                  style={styles.cycleBtn}
                  onPress={() => selectCycle(cycle)}
                  accessibilityLabel={`${cycle} billing`}
                  accessibilityRole="button"
                  pressedScale={0.94}
                  noScale={false}
                >
                  <ThemedText
                    type="small"
                    style={billingCycle === cycle ? { color: theme.onPrimaryContainer, fontWeight: '600' } : {}}
                  >
                    {cycle}
                  </ThemedText>
                </AnimatedPressable>
              ))}
            </View>
          </Field>

          {/* Next Renewal Date */}
          <Field label="Next Renewal Date" error={errors.renewalDate}>
            <DatePickerField
              value={renewalDate}
              onChange={setRenewalDate}
              placeholder="Select renewal date"
              hasError={!!errors.renewalDate}
            />
          </Field>

          {/* Category */}
          <Field label="Category" error={errors.category}>
            <View style={styles.chipRow}>
              {categories.map((cat) => (
                <AnimatedPressable
                  key={cat.id}
                  pressedScale={0.93}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: theme.surfaceContainerHighest,
                      borderColor: category === cat.name ? theme.primary : 'rgba(255,255,255,0.1)',
                    },
                  ]}
                  onPress={() => setCategory(cat.name === category ? '' : cat.name)}
                  accessibilityLabel={`Category: ${cat.name}`}
                  accessibilityRole="button"
                >
                  <Icon name={cat.icon} size={16} color={theme.primary} fallback={cat.fallback} />
                  <ThemedText type="small">{cat.name}</ThemedText>
                </AnimatedPressable>
              ))}
            </View>
          </Field>

          {/* Create Button */}
          <AnimatedPressable
            variant="glow"
            glowColor="rgba(160,213,124,0.30)"
            style={[styles.createBtn, { backgroundColor: theme.primaryContainer }]}
            onPress={handleSubmit}
            accessibilityLabel="Create subscription"
            accessibilityRole="button"
          >
            <ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: '600', fontSize: 18 }}>
              {editing ? 'Save Changes' : 'Create Subscription'}
            </ThemedText>
          </AnimatedPressable>
         </Animated.View>
        </Animated.View>

        {/* ── Security card ───────────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(250)}
          style={[
            styles.securityCard,
            { backgroundColor: 'rgba(160,213,124,0.05)', borderColor: 'rgba(160,213,124,0.1)' },
          ]}
        >
          <View style={[styles.securityIcon, { backgroundColor: 'rgba(160,213,124,0.15)' }]}>
            <Icon name="lock.fill" size={20} color={theme.primary} fallback="🔒" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="default" style={{ fontWeight: '700' }}>
              Secure Data Encryption
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Your data is stored securely on-device.
            </ThemedText>
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <ThemedText
        type="small"
        themeColor={error ? 'error' : 'textSecondary'}
        style={{ textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4 }}
      >
        {label}
      </ThemedText>
      {children}
      {error && (
        <ThemedText type="small" style={{ color: theme.error, marginLeft: 4 }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  formCard: { borderRadius: 16, padding: 24, borderWidth: 1, gap: 24 },
  backBtn: { padding: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    gap: 8,
  },
  inputInRow: { flex: 1, fontSize: 16, height: 52 },
  cycleRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 24,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cyclePill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 20,
  },
  cycleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  createBtn: { paddingVertical: 16, borderRadius: 24, alignItems: 'center', marginTop: 8 },
  securityCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
