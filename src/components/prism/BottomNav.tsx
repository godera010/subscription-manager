import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { Icon } from '@/components/prism/Icon';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const TAB_META: Record<string, { label: string; symbol: string; fallback: string }> = {
  index: { label: 'Home', symbol: 'square.grid.2x2.fill', fallback: '■' },
  subscriptions: { label: 'Subs', symbol: 'rectangle.stack.fill', fallback: '≣' },
  offers: { label: 'Offers', symbol: 'tag.fill', fallback: '◆' },
  settings: { label: 'Settings', symbol: 'gearshape.fill', fallback: '⚙' },
};

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function TabItem({
  label,
  symbol,
  fallback,
  isActive,
  onPress,
}: {
  label: string;
  symbol: string;
  fallback: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
    >
      <View style={styles.tabInner}>
        <Icon
          name={symbol}
          size={22}
          color={isActive ? theme.onPrimaryContainer : theme.textSecondary}
          fallback={fallback}
        />
      </View>
      <ThemedText
        type="small"
        style={[
          styles.label,
          isActive ? { color: theme.onPrimaryContainer } : { color: theme.textSecondary },
        ]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function BottomNav({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);

  const displayIndex = state.index;
  const numTabs = state.routes.length;

  const HORIZONTAL_PADDING = 8;
  const activeWidth = containerWidth - HORIZONTAL_PADDING * 2;
  const tabWidth = containerWidth > 0 && numTabs > 0 ? activeWidth / numTabs : 0;
  const pillWidth = tabWidth * 0.72;

  const pillX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      const tabCenter = tabWidth * displayIndex + tabWidth / 2;
      pillX.value = withTiming(tabCenter - pillWidth / 2, { duration: 120 });
    }
  }, [displayIndex, tabWidth, pillWidth, pillX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleTabPress = (index: number, routeName: string, routeKey: string) => {
    const isFocused = state.index === index;

    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate({ name: routeName, merge: true });
    }
  };

  const webStyles: ViewStyle = Platform.OS === 'web' ? { backdropFilter: 'blur(16px)' } as ViewStyle : {};

  return (
    <View
      style={[
        styles.container,
        webStyles,
        {
          backgroundColor: hexToRgba(theme.background, 0.88),
          borderTopColor: 'rgba(255,255,255,0.06)',
          paddingBottom: insets.bottom + 8,
        },
      ]}
      onLayout={handleLayout}
    >
      {/* Sliding active pill */}
      {containerWidth > 0 && numTabs > 0 && (
        <Animated.View
          style={[
            styles.pill,
            {
              width: pillWidth,
              backgroundColor: theme.primaryContainer,
              borderRadius: 16,
              position: 'absolute',
              top: 6,
              left: HORIZONTAL_PADDING,
              height: 50,
            },
            pillStyle,
          ]}
        />
      )}

      {/* Tab items */}
      {state.routes.map((route: any, i: number) => {
        const meta = TAB_META[route.name] || { label: route.name, symbol: 'questionmark', fallback: '?' };
        const isActive = i === displayIndex;

        return (
          <TabItem
            key={route.key}
            label={meta.label}
            symbol={meta.symbol}
            fallback={meta.fallback}
            isActive={isActive}
            onPress={() => handleTabPress(i, route.name, route.key)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    shadowColor: '#091614',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  pill: {},
  label: { fontSize: 11, marginTop: 1, fontWeight: '500' },
});
