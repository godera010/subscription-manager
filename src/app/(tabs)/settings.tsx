import { useMemo } from 'react';
import { Alert, Pressable, Share, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store/use-store';
import { totalMonthlySpend } from '@/lib/subscriptions';
import type { ThemeMode } from '@/types';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string; fallback: string }[] = [
  { mode: 'system', label: 'System', icon: 'gear', fallback: '⚙️' },
  { mode: 'light', label: 'Light', icon: 'sun.max.fill', fallback: '☀️' },
  { mode: 'dark', label: 'Dark', icon: 'moon.fill', fallback: '🌙' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useStore((s) => s.subscriptions);
  const themeMode = useStore((s) => s.themeMode);
  const setThemeMode = useStore((s) => s.setThemeMode);

  const monthly = useMemo(() => totalMonthlySpend(subscriptions), [subscriptions]);

  async function exportData() {
    try {
      await Share.share({
        title: 'My subscriptions',
        message: JSON.stringify({ subscriptions }, null, 2),
      });
    } catch {
      Alert.alert('Export failed', 'Could not export your data right now.');
    }
  }

  const comingSoon = (feature: string) => Alert.alert(feature, 'This feature is coming soon.');

  const settingsItems = [
    { icon: 'person.fill', fallback: '👤', label: 'Account', desc: 'Manage your profile and preferences', onPress: () => comingSoon('Account') },
    { icon: 'bell.fill', fallback: '🔔', label: 'Notifications', desc: 'Configure renewal reminders', onPress: () => comingSoon('Notifications') },
    { icon: 'lock.fill', fallback: '🔒', label: 'Privacy & Security', desc: 'Data is stored on-device', onPress: () => comingSoon('Privacy & Security') },
    { icon: 'creditcard.fill', fallback: '💳', label: 'Payment Methods', desc: 'Manage linked payment sources', onPress: () => comingSoon('Payment Methods') },
    { icon: 'square.and.arrow.up.fill', fallback: '📤', label: 'Export Data', desc: 'Share your subscription data as JSON', onPress: exportData },
    { icon: 'questionmark.circle.fill', fallback: '❓', label: 'Help & Support', desc: 'Get help using the app', onPress: () => comingSoon('Help & Support') },
    { icon: 'info.circle.fill', fallback: 'ℹ️', label: 'About', desc: 'Version 1.0.0', onPress: () => Alert.alert('Subscription Manager', 'Version 1.0.0') },
  ];

  return (
    <ThemedView style={styles.container}>
      <TopBar title="Settings" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: theme.surfaceContainerHighest }]}>
            <Icon name="person.crop.circle.fill" size={40} color={theme.text} fallback="👤" />
          </View>
          <ThemedText type="subtitle" style={{ fontSize: 20 }}>
            Your Account
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {subscriptions.length} subscription{subscriptions.length !== 1 ? 's' : ''} • ${monthly.toFixed(2)}/mo
          </ThemedText>
        </View>

        {/* Theme control */}
        <View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
            APPEARANCE
          </ThemedText>
          <View style={[styles.themeRow, { backgroundColor: theme.surfaceContainerLow, borderColor: 'rgba(255,255,255,0.05)' }]}>
            {THEME_OPTIONS.map((opt) => {
              const active = themeMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  style={[
                    styles.themeBtn,
                    active && { backgroundColor: theme.primaryContainer },
                  ]}
                  onPress={() => setThemeMode(opt.mode)}
                  accessibilityLabel={`${opt.label} theme`}
                  accessibilityRole="button"
                >
                  <Icon
                    name={opt.icon}
                    size={18}
                    color={active ? theme.onPrimaryContainer : theme.textSecondary}
                    fallback={opt.fallback}
                  />
                  <ThemedText
                    type="small"
                    style={active ? { color: theme.onPrimaryContainer, fontWeight: '600' } : { color: theme.textSecondary }}
                  >
                    {opt.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.list}>
          {settingsItems.map((item, i) => (
            <Pressable
              key={i}
              onPress={item.onPress}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              style={[
                styles.settingRow,
                { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
              ]}
            >
              <View style={styles.settingLeft}>
                <Icon name={item.icon} size={24} color={theme.primary} fallback={item.fallback} />
                <View>
                  <ThemedText type="default" style={{ fontWeight: '500' }}>
                    {item.label}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.desc}
                  </ThemedText>
                </View>
              </View>
              <Icon name="chevron.right" size={18} color={theme.outline} fallback="›" />
            </Pressable>
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
  profileSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  themeRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  list: { gap: 8 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
