import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const settingsItems = [
  { icon: 'person.fill', fallback: '👤', label: 'Account', desc: 'Manage your profile and preferences' },
  { icon: 'bell.fill', fallback: '🔔', label: 'Notifications', desc: 'Configure alert preferences' },
  { icon: 'lock.fill', fallback: '🔒', label: 'Privacy & Security', desc: 'AES-256 encrypted data' },
  { icon: 'creditcard.fill', fallback: '💳', label: 'Payment Methods', desc: 'Manage linked payment sources' },
  { icon: 'square.and.arrow.up.fill', fallback: '📤', label: 'Export Data', desc: 'Download your subscription data' },
  { icon: 'questionmark.circle.fill', fallback: '❓', label: 'Help & Support', desc: 'Get help using Prism Finance' },
  { icon: 'info.circle.fill', fallback: 'ℹ️', label: 'About', desc: 'Version 1.0.0' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
            John Doe
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            john.doe@email.com
          </ThemedText>
        </View>

        <View style={styles.list}>
          {settingsItems.map((item, i) => (
            <View
              key={i}
              style={[
                styles.settingRow,
                {
                  backgroundColor: theme.surfaceContainer,
                  borderColor: 'rgba(255,255,255,0.05)',
                },
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
  profileSection: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
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
