/**
 * AnimatedPressable
 * Drop-in replacement for React Native's Pressable with:
 *  - Spring scale feedback on press / release
 *  - Optional idle glow-pulse for primary CTAs  (variant="glow")
 */
import React, { useCallback, useEffect } from 'react';
import {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Animation } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnimatedPressableVariant = 'default' | 'glow';

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  /** Visual style applied to the animated wrapper */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  /** 'glow' adds an idle pulsing shadow for primary CTA buttons */
  variant?: AnimatedPressableVariant;
  /** Colour of the idle glow shadow (variant="glow" only) */
  glowColor?: string;
  /** Scale target on press — default 0.96 */
  pressedScale?: number;
  /** Disable the scale animation (still fires press events) */
  noScale?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AnimatedPressableInner = Animated.createAnimatedComponent(Pressable);

export function AnimatedPressable({
  style,
  children,
  variant = 'default',
  glowColor = 'rgba(160,213,124,0.30)',
  pressedScale = 0.96,
  noScale = false,
  onPressIn,
  onPressOut,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const glowRadius = useSharedValue(variant === 'glow' ? 8 : 0);
  const glowOpacity = useSharedValue(variant === 'glow' ? 0.25 : 0);

  // Start glow pulse for CTA buttons
  useEffect(() => {
    if (variant === 'glow') {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.55, { duration: Animation.glowPulse }),
          withTiming(0.15, { duration: Animation.glowPulse }),
        ),
        -1,
        false,
      );
      glowRadius.value = withRepeat(
        withSequence(
          withTiming(18, { duration: Animation.glowPulse }),
          withTiming(8, { duration: Animation.glowPulse }),
        ),
        -1,
        false,
      );
    }
  }, [variant]);

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      if (!noScale) {
        scale.value = withTiming(pressedScale, { duration: Animation.fast });
      }
      onPressIn?.(e);
    },
    [noScale, pressedScale, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      if (!noScale) {
        scale.value = withTiming(1, { duration: Animation.fast });
      }
      onPressOut?.(e);
    },
    [noScale, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: scale.value }],
      ...(variant === 'glow' && {
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glowOpacity.value,
        shadowRadius: glowRadius.value,
        elevation: 8,
      }),
    };
  });

  return (
    <AnimatedPressableInner
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {children}
    </AnimatedPressableInner>
  );
}
