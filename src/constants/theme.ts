import '@/global.css';
import type { WithSpringConfig } from 'react-native-reanimated';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1a2118',
    background: '#f2f5ef',
    backgroundElement: '#e8ece3',
    backgroundSelected: '#d6ddd0',
    textSecondary: '#5a6652',
    primary: '#2e7d32',
    onPrimary: '#ffffff',
    primaryContainer: '#a0d57c',
    onPrimaryContainer: '#1a2118',
    secondary: '#538334',
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    outline: '#737c6e',
    outlineVariant: '#c2c9b8',
    surfaceContainer: '#e8ece3',
    surfaceContainerHigh: '#dde2d9',
    surfaceContainerHighest: '#d1d6ce',
    surfaceContainerLow: '#eef2ea',
    surfaceContainerLowest: '#ffffff',
    tertiary: '#386649',
    tertiaryContainer: '#c8c6c5',
  },
  dark: {
    text: '#d7e6e2',
    background: '#091614',
    backgroundElement: '#152220',
    backgroundSelected: '#2a3735',
    textSecondary: '#c2c9b8',
    primary: '#a0d57c',
    onPrimary: '#153800',
    primaryContainer: '#538334',
    onPrimaryContainer: '#ffffff',
    secondary: '#abd28f',
    error: '#ffb4ab',
    errorContainer: '#93000a',
    outline: '#8c9384',
    outlineVariant: '#42493c',
    surfaceContainer: '#152220',
    surfaceContainerHigh: '#1f2c2a',
    surfaceContainerHighest: '#2a3735',
    surfaceContainerLow: '#111e1c',
    surfaceContainerLowest: '#04100f',
    tertiary: '#c8c6c5',
    tertiaryContainer: '#777676',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  sans: 'Inter',
  serif: 'Inter',
  rounded: 'Inter',
  mono: 'Inter',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/** Shared animation timing presets for consistent motion feel across the app */
export const Animation = {
  /** 150ms – immediate feedback (icon swap, colour change) */
  fast: 150,
  /** 250ms – default UI transition */
  normal: 250,
  /** 400ms – emphasis / page entry */
  slow: 400,

  /** Bouncy spring for press/release interactions */
  springBouncy: { damping: 20, stiffness: 300 } satisfies WithSpringConfig,
  /** Smooth spring for layout / position transitions */
  springSmooth: { damping: 28, stiffness: 200 } satisfies WithSpringConfig,
  /** Gentle spring for idle / ambient animations */
  springGentle: { damping: 30, stiffness: 120 } satisfies WithSpringConfig,

  /** Idle glow pulse timing in ms (half-period) */
  glowPulse: 1400,
} as const;

/** Neon-lime primary glow color used for CTA highlights */
export const GlowColors = {
  primary: 'rgba(160,213,124,0.18)',
  primaryStrong: 'rgba(160,213,124,0.35)',
  surface: 'rgba(255,255,255,0.04)',
  surfaceBorder: 'rgba(255,255,255,0.07)',
} as const;
