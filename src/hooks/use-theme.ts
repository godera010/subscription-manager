/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/store/use-store';

export function useTheme() {
  const scheme = useColorScheme();
  const themeMode = useStore((state) => state.themeMode);
  
  // If themeMode is system, fall back to scheme (defaulting to dark if scheme is unspecified).
  // Otherwise use the explicit themeMode.
  const activeTheme = themeMode === 'system' 
    ? (scheme === 'unspecified' || !scheme ? 'dark' : scheme)
    : themeMode;

  return Colors[activeTheme];
}
