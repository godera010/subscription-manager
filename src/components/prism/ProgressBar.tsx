/**
 * ProgressBar – animated version
 * Animates fill width from 0 → progress on mount (or whenever progress changes).
 * Measures container with onLayout so the pixel width is always accurate.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Animation } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
};

export function ProgressBar({ progress, height = 8, color, trackColor }: ProgressBarProps) {
  const theme = useTheme();
  const containerWidth = useSharedValue(0);
  const fillWidth = useSharedValue(0);

  // Animate when progress or container size changes
  useEffect(() => {
    if (containerWidth.value > 0) {
      const target = (Math.min(100, Math.max(0, progress)) / 100) * containerWidth.value;
      fillWidth.value = withTiming(target, {
        duration: Animation.slow,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [progress, containerWidth.value]);

  const animatedFill = useAnimatedStyle(() => ({
    width: fillWidth.value,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor ?? theme.surfaceContainerHighest,
          borderRadius: height / 2,
        },
      ]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        containerWidth.value = w;
        // Trigger initial animation once we know the width
        const target = (Math.min(100, Math.max(0, progress)) / 100) * w;
        fillWidth.value = withTiming(target, {
          duration: Animation.slow,
          easing: Easing.out(Easing.cubic),
        });
      }}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: color ?? theme.primary,
            borderRadius: height / 2,
          },
          animatedFill,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden', width: '100%' },
  fill: {},
});
