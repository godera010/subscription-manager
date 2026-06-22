import { router, useSegments } from 'expo-router';
import { useEffect, useRef } from 'react';

import { Routes } from '@/constants/routes';
import { useStore } from '@/store/use-store';

export function useOnboardingGuard() {
  const loaded = useStore((s) => s.loaded);
  const onboardingCompleted = useStore((s) => s.onboardingCompleted);
  const segments = useSegments();
  const initialized = useRef(false);

  useEffect(() => {
    if (!loaded || initialized.current) return;
    initialized.current = true;

    const isOnboarding = segments[0] === 'onboarding';

    if (!onboardingCompleted && !isOnboarding) {
      router.replace(Routes.ONBOARDING);
    } else if (onboardingCompleted && isOnboarding) {
      router.replace(Routes.HOME);
    }
  }, [loaded, onboardingCompleted, segments]);
}
