import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface BarData {
  label: string;
  /** 0–100 percentage fill */
  value: number;
  active?: boolean;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
}

// ─── BarItem ────────────────────────────────────────────────────────────────────

interface BarItemProps {
  bar: BarData;
  index: number;
  trackHeight: number;
}

function BarItem({ bar, index, trackHeight }: BarItemProps) {
  const theme = useTheme();
  const fillHeight = useSharedValue(0);

  useEffect(() => {
    if (trackHeight <= 0) return;
    const target = trackHeight * (bar.value / 100);
    fillHeight.value = withDelay(
      index * 120,
      withTiming(target, { duration: 350 }),
    );
  }, [trackHeight, bar.value, index]);

  const fillStyle = useAnimatedStyle(() => {
    'worklet';
    return { height: fillHeight.value };
  });

  const fillColor = bar.active
    ? (bar.color ?? theme.primary)
    : (bar.color ?? theme.outlineVariant);

  return (
    <View style={styles.col}>
      <View
        style={[styles.track, { backgroundColor: theme.surfaceContainerHighest }]}
      >
        <Animated.View
          style={[styles.fill, { backgroundColor: fillColor }, fillStyle]}
        />
      </View>
      <ThemedText
        type="small"
        style={[styles.label, bar.active && { color: theme.primary, fontWeight: '700' }]}
      >
        {bar.label}
      </ThemedText>
    </View>
  );
}

// ─── BarChart ───────────────────────────────────────────────────────────────────

export function BarChart({ data, height = 160 }: BarChartProps) {
  const [trackHeight, setTrackHeight] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setTrackHeight(h);
  };

  return (
    <View style={[styles.chart, { height }]}>
      {data.map((bar, i) => (
        <View key={i} style={styles.colWrapper} onLayout={i === 0 ? handleLayout : undefined}>
          <BarItem bar={bar} index={i} trackHeight={trackHeight} />
        </View>
      ))}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  colWrapper: {
    flex: 1,
    height: '100%',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    height: '100%',
    justifyContent: 'flex-end',
  },
  track: {
    width: '100%',
    flex: 1,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    borderRadius: 8,
  },
  label: {},
});
