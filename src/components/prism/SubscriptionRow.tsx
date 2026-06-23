/**
 * SubscriptionRow – enhanced, animated version
 *
 * Enhancements vs original:
 *  - Spring scale on press via AnimatedPressable
 *  - Left category-colour accent strip
 *  - Larger icon box (borderRadius 16), subtle card shadow
 *  - Optional urgency highlight (e.g. renewal in < 3 days)
 */
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/prism/AnimatedPressable';
import { Icon } from '@/components/prism/Icon';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type SubscriptionRowProps = {
  icon: string;
  fallback?: string;
  name: string;
  subtitle: string;
  price: string;
  priceNote?: string;
  accentColor?: string;
  urgent?: boolean;
  /** briefly pulses a colored highlight when set true (e.g. just-added row) */
  highlight?: boolean;
  onPress?: () => void;
  /** stagger index for entry animation delay (ms) */
  index?: number;
};

export const SubscriptionRow = React.memo(function SubscriptionRow({
  icon,
  fallback,
  name,
  subtitle,
  price,
  priceNote,
  accentColor,
  urgent = false,
  highlight = false,
  onPress,
  index = 0,
}: SubscriptionRowProps) {
  const theme = useTheme();
  const accent = accentColor ?? theme.primary;

  const glow = useSharedValue(0);
  useEffect(() => {
    if (highlight) {
      glow.value = 0;
      glow.value = withSequence(
        withTiming(1, { duration: 320 }),
        withTiming(0, { duration: 1900 }),
      );
    }
  }, [highlight]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.22 }));

  return (
    <View>
      <AnimatedPressable
        style={[
          styles.container,
          {
            backgroundColor: theme.surfaceContainerLow,
            borderColor: urgent || highlight
              ? `${accent}40`
              : 'rgba(255,255,255,0.05)',
            borderWidth: 1,
          },
        ]}
        onPress={onPress}
        pressedScale={0.97}
      >
        {/* Highlight pulse overlay (just-added) */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: accent }, overlayStyle]}
        />

        {/* Left accent strip */}
        <View style={[styles.accentBar, { backgroundColor: accent }]} />

        <View style={styles.left}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: theme.surfaceContainerHighest },
            ]}
          >
            <Icon name={icon} size={22} color={accent} fallback={fallback} />
          </View>
          <View style={styles.textGroup}>
            <ThemedText style={styles.name}>{name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          </View>
        </View>

        <View style={styles.right}>
          <ThemedText style={styles.price}>{price}</ThemedText>
          {priceNote ? (
            <ThemedText type="small" style={{ color: accent, fontWeight: '500' }}>
              {priceNote}
            </ThemedText>
          ) : null}
        </View>
      </AnimatedPressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingRight: 16,
    paddingLeft: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
    marginRight: 14,
    borderRadius: 2,
    opacity: 0.8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
  },
  subtitle: {
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
  },
  price: {
    fontWeight: '600',
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
});
