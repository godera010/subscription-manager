import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { Icon } from '@/components/prism/Icon';
import { TopBar } from '@/components/prism/TopBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Animation, BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FILTERS = ['All', 'Streaming', 'Productivity', 'Gaming'];

const offers = [
  {
    icon: 'film.fill',
    fallback: '🎬',
    title: 'Netflix Premium',
    desc: '3 months free with annual plan',
    tag: 'Save 25%',
    tagColor: '#a0d57c',
  },
  {
    icon: 'music.note',
    fallback: '🎵',
    title: 'Spotify Student',
    desc: '50% off for verified students',
    tag: 'Student Deal',
    tagColor: '#abd28f',
  },
  {
    icon: 'icloud.fill',
    fallback: '☁️',
    title: 'Google One',
    desc: 'Get 100GB free for 6 months',
    tag: 'Trial',
    tagColor: '#c8c6c5',
  },
  {
    icon: 'gamecontroller.fill',
    fallback: '🎮',
    title: 'Xbox Game Pass',
    desc: 'First month for $1',
    tag: 'Limited',
    tagColor: '#ffb4ab',
  },
];

export default function OffersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  // Animated border color on search focus
  const borderProgress = useSharedValue(0);

  const searchBorderStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      borderColor: borderProgress.value === 1 ? theme.primary : theme.outlineVariant,
    };
  });

  const handleSearchFocus = () => {
    setSearchFocused(true);
    borderProgress.value = withTiming(1, { duration: Animation.normal });
  };

  const handleSearchBlur = () => {
    setSearchFocused(false);
    borderProgress.value = withTiming(0, { duration: Animation.normal });
  };

  return (
    <ThemedView style={styles.container}>
      <TopBar title="Explore Offers" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header + description */}
        <View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.desc}>
            Unlock exclusive savings and trial opportunities curated for your spending profile.
          </ThemedText>
        </View>

        {/* Search box with animated border */}
        <Animated.View
          style={[
            styles.searchBox,
            { backgroundColor: theme.surfaceContainerHighest },
            searchBorderStyle,
          ]}
        >
          <View style={{ marginRight: 8 }}>
            <Icon name="magnifyingglass" size={16} color={theme.textSecondary} fallback="🔍" />
          </View>
          <TextInput
            placeholder="Search offers..."
            placeholderTextColor="rgba(194,201,184,0.5)"
            style={[styles.searchInput, { color: theme.text }]}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
        </Animated.View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {FILTERS.map((chip, i) => {
            const isActive = i === selectedFilter;
            return (
              <AnimatedPressable
                key={i}
                pressedScale={0.92}
                onPress={() => setSelectedFilter(i)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? theme.primaryContainer : 'transparent',
                    borderColor: isActive ? theme.primary : theme.outlineVariant,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={isActive ? { color: theme.onPrimaryContainer } : undefined}
                >
                  {chip}
                </ThemedText>
              </AnimatedPressable>
            );
          })}
        </View>

        {/* Offer cards — staggered FadeInUp */}
        <View style={styles.offerList}>
          {offers.map((offer, i) => (
            <View
              key={i}
              style={[
                styles.offerCard,
                {
                  backgroundColor: theme.surfaceContainer,
                  borderColor: 'rgba(255,255,255,0.05)',
                },
              ]}
            >
              <View style={styles.offerHeader}>
                <View
                  style={[
                    styles.offerIcon,
                    { backgroundColor: theme.surfaceContainerHighest },
                  ]}
                >
                  <Icon name={offer.icon} size={28} color={theme.primary} fallback={offer.fallback} />
                </View>
                <View style={[styles.offerTag, { backgroundColor: `${offer.tagColor}20` }]}>
                  <ThemedText type="small" style={{ color: offer.tagColor }}>
                    {offer.tag}
                  </ThemedText>
                </View>
              </View>

              <ThemedText type="default" style={{ fontWeight: '600' }}>
                {offer.title}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {offer.desc}
              </ThemedText>

              {/* Claim Offer — glow CTA */}
              <AnimatedPressable
                variant="glow"
                glowColor="rgba(160,213,124,0.30)"
                style={[styles.claimBtn, { backgroundColor: theme.primaryContainer }]}
              >
                <ThemedText style={{ color: theme.onPrimaryContainer, fontWeight: '600' }}>
                  Claim Offer
                </ThemedText>
              </AnimatedPressable>
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
  scrollContent: { paddingHorizontal: 16, gap: 16, paddingTop: 16 },
  desc: { lineHeight: 20 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: { flex: 1, fontSize: 16 },
  filterRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  offerList: { gap: 16 },
  offerCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  claimBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
});
