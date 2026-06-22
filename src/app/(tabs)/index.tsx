import { router } from 'expo-router';
import { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, View, Image, ViewStyle, useColorScheme } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { Icon } from '@/components/prism/Icon';
import { ProgressBar } from '@/components/prism/ProgressBar';
import { SubscriptionRow } from '@/components/prism/SubscriptionRow';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Routes } from '@/constants/routes';
import { Animation, BottomTabInset, GlowColors, Spacing } from '@/constants/theme';
import { useStore } from '@/store/use-store';
import { useTheme } from '@/hooks/use-theme';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Dashboard() {
  console.log('Dashboard mounted');
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const themeMode = useStore((s) => s.themeMode);
  const setThemeMode = useStore((s) => s.setThemeMode);
  const colorScheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon ☀️';
    return 'Good Evening 🌙';
  }, []);

  // ─── Business logic (unchanged) ────────────────────────────────────────────
  const monthlySpend = useMemo(() => {
    return subscriptions.reduce((total, sub) => {
      const monthlyCost =
        sub.billingCycle === 'Yearly' ? sub.cost / 12
        : sub.billingCycle === 'Quarterly' ? sub.cost / 3
        : sub.cost;
      return total + monthlyCost;
    }, 0);
  }, [subscriptions]);

  const upcoming = useMemo(() => {
    const now = new Date();
    const future = new Date(now.getTime() + 14 * 86400000);
    return subscriptions.filter((s) => {
      const renewal = new Date(s.renewalDate);
      return renewal >= now && renewal <= future;
    });
  }, [subscriptions]);

  const recent = subscriptions.slice(-3).reverse();
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const isEmpty = subscriptions.length === 0;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <ThemedView style={styles.container}>
      {/* ── Top Bar ── */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            backgroundColor: isDark ? 'rgba(9,22,20,0.95)' : 'rgba(255,255,255,0.95)',
          },
        ]}
      >
        <View style={styles.topBarLeft}>
          <ThemedText style={{ fontSize: 16, fontWeight: '700', color: theme.text, letterSpacing: -0.4, marginBottom: 2 }}>
            Subscription Manager
          </ThemedText>
          <ThemedText style={{ fontSize: 10, fontWeight: '500', color: theme.textSecondary }}>
            {greeting}
          </ThemedText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Theme Toggle */}
          <AnimatedPressable
            style={[styles.headerIconBtn, { backgroundColor: isDark ? theme.surfaceContainer : '#F2F6FA' }]}
            onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
            pressedScale={0.88}
            accessibilityLabel="Toggle Theme"
            accessibilityRole="button"
          >
            <Icon 
              name={isDark ? 'sun.max.fill' : 'moon.fill'} 
              size={20} 
              color={theme.textSecondary} 
              fallback={isDark ? '☀️' : '🌙'} 
            />
          </AnimatedPressable>

          {/* Settings */}
          <AnimatedPressable
            style={[styles.headerIconBtn, { backgroundColor: isDark ? theme.surfaceContainer : '#F2F6FA' }]}
            pressedScale={0.88}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Icon name="gearshape.fill" size={20} color={theme.textSecondary} fallback="⚙️" />
          </AnimatedPressable>

          {/* Notification bell */}
          <AnimatedPressable
            style={[styles.headerIconBtn, { backgroundColor: isDark ? theme.surfaceContainer : '#F2F6FA' }]}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            pressedScale={0.88}
          >
            <Icon name="bell.fill" size={20} color={theme.textSecondary} fallback="🔔" />
          </AnimatedPressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <>
            <View style={styles.emptySection}>
              <Image 
                  source={isDark ? require('../../assets/images/hero_dark.webp') : require('../../assets/images/hero_light.webp')} 
                  style={{ width: '100%', height: 260 }} 
                  resizeMode="contain" 
                />

              {/* Text Content */}
              <View style={styles.emptyTextWrap}>
                <ThemedText
                  style={{ fontSize: 22, fontWeight: '700', lineHeight: 28, color: theme.text, textAlign: 'center', marginBottom: 8 }}
                >
                  No subscriptions yet
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 14,
                    fontWeight: '400',
                    lineHeight: 20,
                    color: theme.textSecondary,
                    textAlign: 'center',
                  }}
                >
                  Connect your email, scan your SMS messages, or manually add subscriptions to start tracking recurring payments.
                </ThemedText>
              </View>

              {/* Vertical Action Cards */}
              <View style={{ width: '100%', gap: 12, marginTop: 12 }}>
                {/* 1. Connect Gmail */}
                <AnimatedPressable
                    style={[styles.actionCard, { backgroundColor: isDark ? theme.surfaceContainer : '#F2F6FA' }]}
                    onPress={() => {}}
                    pressedScale={0.96}
                  >
                    <View style={styles.actionCardLeft}>
                      <View style={[styles.actionCardIconBox, { backgroundColor: '#FFFFFF' }]}>
                         <Icon name="envelope.fill" size={20} color="#EA4335" fallback="M" />
                      </View>
                      <View style={styles.actionCardText}>
                        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Connect Gmail</ThemedText>
                        <ThemedText style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2, lineHeight: 18 }}>
                          Automatically detect subscriptions from receipts and renewal emails.
                        </ThemedText>
                      </View>
                    </View>
                    <Icon name="chevron.right" size={16} color={theme.textSecondary} fallback=">" />
                </AnimatedPressable>

                {/* 2. Scan SMS Messages */}
                <AnimatedPressable
                    style={[styles.actionCard, { backgroundColor: isDark ? theme.surfaceContainer : '#F2FAF5' }]}
                    onPress={() => {}}
                    pressedScale={0.96}
                  >
                    <View style={styles.actionCardLeft}>
                      <View style={[styles.actionCardIconBox, { backgroundColor: '#FFFFFF' }]}>
                         <Icon name="message.fill" size={20} color="#34A853" fallback="💬" />
                      </View>
                      <View style={styles.actionCardText}>
                        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Scan SMS Messages</ThemedText>
                        <ThemedText style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2, lineHeight: 18 }}>
                          Find subscriptions from mobile money and bank payment alerts.
                        </ThemedText>
                      </View>
                    </View>
                    <Icon name="chevron.right" size={16} color={theme.textSecondary} fallback=">" />
                </AnimatedPressable>

                {/* 3. Add Subscription */}
                <AnimatedPressable
                    style={[styles.actionCard, { backgroundColor: isDark ? theme.surfaceContainer : '#F8F2FA' }]}
                    onPress={() => router.push(Routes.ADD_SUBSCRIPTION as any)}
                    pressedScale={0.96}
                  >
                    <View style={styles.actionCardLeft}>
                      <View style={[styles.actionCardIconBox, { backgroundColor: '#FFFFFF' }]}>
                         <Icon name="plus" size={20} color="#9C27B0" fallback="+" />
                      </View>
                      <View style={styles.actionCardText}>
                        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>Add Subscription</ThemedText>
                        <ThemedText style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2, lineHeight: 18 }}>
                          Manually add a subscription to start tracking.
                        </ThemedText>
                      </View>
                    </View>
                    <Icon name="chevron.right" size={16} color={theme.textSecondary} fallback=">" />
                </AnimatedPressable>
              </View>
            </View>

            {/* Feature Highlights Grid */}
            <View style={[styles.featureGrid, { backgroundColor: isDark ? theme.surfaceContainer : '#FFFFFF' }]}>
              <View style={styles.featureItem}>
                <Icon name="calendar" size={20} color="#3B82F6" fallback="Cal" />
                <ThemedText style={styles.featureText}>Never miss a renewal</ThemedText>
              </View>
              <View style={[styles.featureDivider, { backgroundColor: theme.outlineVariant }]} />
              
              <View style={styles.featureItem}>
                <Icon name="chart.bar.fill" size={20} color="#10B981" fallback="Chart" />
                <ThemedText style={styles.featureText}>Track monthly spending</ThemedText>
              </View>
              <View style={[styles.featureDivider, { backgroundColor: theme.outlineVariant }]} />
              
              <View style={styles.featureItem}>
                <Icon name="bell.fill" size={20} color="#F59E0B" fallback="Alert" />
                <ThemedText style={styles.featureText}>Get cancellation reminders</ThemedText>
              </View>
              <View style={[styles.featureDivider, { backgroundColor: theme.outlineVariant }]} />
              
              <View style={styles.featureItem}>
                <Icon name="chart.pie.fill" size={20} color="#8B5CF6" fallback="Trends" />
                <ThemedText style={styles.featureText}>See spending trends</ThemedText>
              </View>
            </View>
          </>
        ) : (
          // ══════════════════════════════════════════════════════════════════
          // POPULATED STATE
          // ══════════════════════════════════════════════════════════════════
          <>
            {/* 1. Hero spend card wrapped in FadeInDown */}
            <Animated.View entering={FadeInDown.delay(100).duration(200)}>
              <View
                style={[
                  styles.heroCard,
                  {
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.05)',
                  },
                  Platform.select({ web: { backdropFilter: 'blur(12px)' } as ViewStyle }),
                ]}
              >

                <View style={styles.heroContent}>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      fontWeight: '500',
                      letterSpacing: 0.6,
                      color: theme.textSecondary,
                      textTransform: 'uppercase',
                    }}
                  >
                    Total Monthly Spend
                  </ThemedText>
                  <View style={styles.heroRow}>
                    <ThemedText
                      style={{ fontSize: 32, lineHeight: 40, fontWeight: '600', color: theme.text }}
                    >
                      ${monthlySpend.toFixed(2)}
                    </ThemedText>
                    {subscriptions.length > 0 && (
                      <View style={styles.trendRow}>
                        <Icon name="arrow.up.forward" size={14} color={theme.primary} fallback="↑" />
                        <ThemedText type="small" style={{ color: theme.primary }}>
                          +2% vs last month
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.heroActions}>
                  {/* 3. Add Subscription CTA → AnimatedPressable variant='glow' */}
                  <AnimatedPressable
                    style={[styles.addBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push(Routes.ADD_SUBSCRIPTION as any)}
                    accessibilityLabel="Add subscription"
                    accessibilityRole="button"
                    variant="glow"
                    glowColor="rgba(160,213,124,0.30)"
                  >
                    <ThemedText style={{ color: theme.onPrimary, fontWeight: '600', fontSize: 14 }}>
                      Add Subscription
                    </ThemedText>
                  </AnimatedPressable>

                  {/* 4. Insight button → AnimatedPressable */}
                  <AnimatedPressable
                    style={[styles.insightBtn, { borderColor: theme.outline }]}
                    onPress={() => router.push(Routes.SPENDING_INSIGHTS as any)}
                    accessibilityLabel="View spending insights"
                    accessibilityRole="button"
                    pressedScale={0.90}
                  >
                    <Icon name="chart.bar.fill" size={20} color={theme.textSecondary} fallback="📊" />
                  </AnimatedPressable>
                </View>
              </View>
            </Animated.View>

            {/* 5. Upcoming Renewals header → FadeInDown */}
            <View style={styles.sectionHeader}>
              <ThemedText style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>
                Upcoming Renewals
              </ThemedText>
              <AnimatedPressable
                onPress={() => router.push(Routes.UPCOMING_RENEWALS as any)}
                pressedScale={0.92}
              >
                <ThemedText
                  style={{ fontSize: 12, fontWeight: '500', letterSpacing: 0.6, color: theme.primary }}
                >
                  View All
                </ThemedText>
              </AnimatedPressable>
            </View>

            {/* 6. Renewal cards carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
            >
              {upcoming.length === 0 && (
                <View
                  style={[
                    styles.renewalCard,
                    {
                      backgroundColor: theme.surfaceContainer,
                      borderColor: 'rgba(255,255,255,0.05)',
                    },
                  ]}
                >
                  <ThemedText style={{ fontSize: 12, fontWeight: '500', color: theme.textSecondary }}>
                    No upcoming renewals
                  </ThemedText>
                </View>
              )}
              {upcoming.map((item, i) => {
                const daysUntil = Math.ceil(
                  (new Date(item.renewalDate).getTime() - Date.now()) / 86400000,
                );
                return (
                  <AnimatedPressable
                      style={[
                        styles.renewalCard,
                        {
                          backgroundColor: theme.surfaceContainer,
                          borderColor: 'rgba(255,255,255,0.05)',
                        },
                      ]}
                      onPress={() => router.push(Routes.SUBSCRIPTION_DETAIL as any)}
                      accessibilityLabel={`${item.name} renewal`}
                    >
                      <View
                        style={[
                          styles.renewalIcon,
                          { backgroundColor: theme.surfaceContainerHighest },
                        ]}
                      >
                        <Icon name={item.icon} size={20} color={theme.primary} fallback={item.icon} />
                      </View>
                      <ThemedText style={{ fontSize: 16, fontWeight: '400', color: theme.text }}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={{ fontSize: 12, fontWeight: '500', color: theme.textSecondary }}>
                        {daysUntil <= 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontVariant: ['tabular-nums'],
                          color: theme.primary,
                          marginTop: 4,
                          fontWeight: '500',
                        }}
                      >
                        ${item.cost.toFixed(2)}
                      </ThemedText>
                    </AnimatedPressable>

                );
              })}
            </ScrollView>

            {/* 7. Recently Active header → FadeInDown */}
            <View style={styles.sectionHeader}>
              <ThemedText style={{ fontSize: 20, fontWeight: '600', color: theme.text }}>
                Recently Active
              </ThemedText>
            </View>
            {/* 8. Subscription rows with index prop for stagger */}
            <View style={styles.subList}>
              {recent.length === 0 && (
                <View
                  style={[
                    styles.emptyCard,
                    {
                      backgroundColor: theme.surfaceContainerLow,
                      borderColor: 'rgba(255,255,255,0.05)',
                    },
                  ]}
                >
                  <ThemedText style={{ fontSize: 12, fontWeight: '500', color: theme.textSecondary }}>
                    No subscriptions yet.
                  </ThemedText>
                </View>
              )}
              {recent.map((item, i) => (
                <SubscriptionRow
                  key={item.id}
                  icon={item.icon}
                  name={item.name}
                  subtitle={`Renewed ${new Date(item.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  price={`$${item.cost.toFixed(2)}`}
                  priceNote={item.billingCycle}
                  index={i}
                  onPress={() => router.push(Routes.SUBSCRIPTION_DETAIL as any)}
                />
              ))}
            </View>

            {/* 9. Billing card → FadeInDown */}
            <View
              style={[
                styles.billingCard,
                {
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.05)',
                },
                Platform.select({ web: { backdropFilter: 'blur(12px)' } as ViewStyle }),
              ]}
            >
              <View style={styles.billingRow}>
                <ThemedText
                  style={{ fontSize: 12, fontWeight: '500', letterSpacing: 0.6, color: theme.textSecondary }}
                >
                  Monthly Billing Cycle
                </ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: '500', color: theme.text }}>
                  {dayOfMonth} / {daysInMonth} Days
                </ThemedText>
              </View>
              <ProgressBar
                progress={(dayOfMonth / daysInMonth) * 100}
                height={8}
              />
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    shadowColor: '#091614',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 4,
  },
  topBarLeft: { flexDirection: 'column', alignItems: 'flex-start', gap: 0 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, gap: 24, paddingTop: 16 },
  // --- Empty state ---
  emptySection: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  emptyIllustrationBox: {
    width: '100%',
    height: 260,
    marginTop: -16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  emptyGlowBall: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  emptyTextWrap: {
    maxWidth: 320,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  actionCardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionCardText: {
    flex: 1,
  },
  featureGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  featureDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 4,
  },
  // --- Populated state ---
  heroCard: {
    borderRadius: 8,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  heroContent: { gap: 8, zIndex: 1 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  heroActions: { flexDirection: 'row', gap: 12, marginTop: 24, zIndex: 1 },
  addBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6BD8CB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
  },
  insightBtn: {
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carousel: { gap: 16 },
  emptyCard: {
    minWidth: 200,
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renewalCard: {
    minWidth: 160,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  renewalIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  subList: { gap: 8 },
  billingCard: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
