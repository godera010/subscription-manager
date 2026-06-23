import { useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, TextInput, View } from 'react-native';
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
import { useStore } from '@/store/use-store';
import { savingsTips } from '@/lib/subscriptions';
import { OFFERS, OFFER_CATEGORIES } from '@/constants/offers';

const FILTERS = OFFER_CATEGORIES;

export default function OffersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState('');

  const subscriptions = useStore((s) => s.subscriptions);
  const categories = useStore((s) => s.categories);
  const tips = useMemo(() => savingsTips(subscriptions, categories), [subscriptions, categories]);

  function openDeal(offer: { url?: string; title: string }) {
    const target =
      offer.url ?? `https://www.google.com/search?q=${encodeURIComponent(`${offer.title} deal offer`)}`;
    Linking.openURL(target);
  }

  const activeCategory = FILTERS[selectedFilter];
  const filteredOffers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OFFERS.filter((o) => {
      const matchesCat = activeCategory === 'All' || o.category === activeCategory;
      const matchesQuery = !q || o.title.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, query]);

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
            Personalized ways to save based on your subscriptions, plus curated deals.
          </ThemedText>
        </View>

        {/* Personalized savings (computed from the user's own data) */}
        {tips.length > 0 && (
          <View style={{ gap: 12 }}>
            <ThemedText type="subtitle" style={{ fontSize: 18 }}>
              Ways to Save
            </ThemedText>
            {tips.map((tip) => (
              <View
                key={tip.id}
                style={[
                  styles.tipCard,
                  { backgroundColor: theme.surfaceContainer, borderColor: 'rgba(255,255,255,0.05)' },
                ]}
              >
                <View style={[styles.tipIcon, { backgroundColor: `${tip.color}1a` }]}>
                  <Icon name={tip.icon} size={20} color={tip.color} fallback={tip.fallback} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText type="default" style={{ fontWeight: '600' }}>
                    {tip.title}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {tip.desc}
                  </ThemedText>
                </View>
                {tip.amount && (
                  <ThemedText type="small" style={{ color: tip.color, fontWeight: '700' }}>
                    {tip.amount}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        )}

        <ThemedText type="subtitle" style={{ fontSize: 18, marginTop: 4 }}>
          Deals
        </ThemedText>

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
            value={query}
            onChangeText={setQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
        </Animated.View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
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
        </ScrollView>

        {/* Offer cards — staggered FadeInUp */}
        <View style={styles.offerList}>
          {filteredOffers.length === 0 && (
            <View style={[styles.emptyCard, { borderColor: 'rgba(255,255,255,0.05)' }]}>
              <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
                No offers match your search.
              </ThemedText>
            </View>
          )}
          {filteredOffers.map((offer, i) => (
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
                onPress={() => openDeal(offer)}
                accessibilityLabel={`Claim ${offer.title}`}
                accessibilityRole="button"
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
  emptyCard: { borderRadius: 16, borderWidth: 1, padding: 32, alignItems: 'center' },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
