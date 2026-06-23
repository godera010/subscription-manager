import React from 'react';
import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { ColorValue, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';

const SF_SYMBOL_TO_MATERIAL: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'bell.fill': 'notifications',
  'square.grid.2x2.fill': 'dashboard',
  'rectangle.stack.fill': 'subscriptions',
  'tag.fill': 'local-offer',
  'gearshape.fill': 'settings',
  'plus': 'add',
  'plus.circle.fill': 'add-circle',
  'message.fill': 'message',
  'envelope.fill': 'mail',
  'lock.fill': 'lock',
  'sparkle': 'auto-awesome',
  'chart.bar.fill': 'bar-chart',
  'chart.pie.fill': 'pie-chart',
  'magnifyingglass': 'search',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  'film.fill': 'movie',
  'tv.fill': 'tv',
  'music.note': 'music-note',
  'person.fill': 'person',
  'person.crop.circle.fill': 'account-circle',
  'calendar': 'calendar-today',
  'arrow.down.right': 'trending-down',
  'arrow.up.forward': 'trending-up',
  'trash.fill': 'delete',
  'doc.text.fill': 'description',
  'info.circle.fill': 'info',
  'questionmark.circle.fill': 'help',
  'creditcard.fill': 'credit-card',
  'gift.fill': 'card-giftcard',
  'chart.line.uptrend.xyaxis': 'show-chart',
  'bolt.fill': 'bolt',
  'briefcase.fill': 'work',
  'gamecontroller.fill': 'sports-esports',
  'paintpalette.fill': 'palette',
  'icloud.fill': 'cloud',
  'headphones': 'headphones',
  'lightbulb.fill': 'lightbulb',
  'square.and.arrow.up.fill': 'publish',
  'square.and.arrow.down': 'file-download',
  'app.badge.fill': 'apps',
  'arrow.down.circle.fill': 'arrow-circle-down',
  'exclamationmark.triangle.fill': 'warning',
  'sun.max.fill': 'light-mode',
  'moon.fill': 'dark-mode',
};

type IconProps = {
  name: string;
  size?: number;
  color?: ColorValue;
  fallback?: string;
  type?: SymbolViewProps['type'];
  weight?: SymbolViewProps['weight'];
  style?: any;
};

export const Icon = React.memo(function Icon({ name, size = 24, color, fallback, type, weight, style }: IconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={name as any}
        size={size}
        tintColor={color}
        type={type}
        weight={weight}
        style={StyleSheet.flatten([{ backgroundColor: 'transparent' }, style])}
        fallback={
          fallback ? (
            <ThemedText style={{ fontSize: size, color: color as string }}>{fallback}</ThemedText>
          ) : undefined
        }
      />
    );
  }

  // On Android and Web, use MaterialIcons from @expo/vector-icons
  const materialName = SF_SYMBOL_TO_MATERIAL[name];
  if (materialName) {
    return (
      <MaterialIcons
        name={materialName}
        size={size}
        color={color as any}
      />
    );
  }

  // If no material mapping, render the fallback text/glyph if provided
  if (fallback) {
    return (
      <ThemedText style={{ fontSize: size, color: color as string }}>
        {fallback}
      </ThemedText>
    );
  }

  return (
    <MaterialIcons
      name="help-outline"
      size={size}
      color={color as any}
    />
  );
});
