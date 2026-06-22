import { GlassView } from 'expo-glass-effect';
import { type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type GlassCardProps = ViewProps & {
  intensity?: 'low' | 'medium' | 'high';
};

export function GlassCard({ style, intensity = 'medium', ...props }: GlassCardProps) {
  const theme = useTheme();

  return (
    <GlassView
      glassEffectStyle="regular"
      tintColor={theme.surfaceContainer}
      style={[
        {
          borderRadius: 16,
          borderWidth: 0.5,
          borderColor: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}
    />
  );
}
