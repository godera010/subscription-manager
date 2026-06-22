import { create } from 'zustand';

import type { AppState, BillingCycle, Category, Subscription } from '@/types';
import { loadPersistedState, persistState } from '@/store/persistence';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Entertainment', icon: 'film.fill', fallback: '🎬', color: '#a0d57c' },
  { id: '2', name: 'Productivity', icon: 'briefcase.fill', fallback: '💼', color: '#abd28f' },
  { id: '3', name: 'Utilities', icon: 'bolt.fill', fallback: '⚡', color: '#c8c6c5' },
  { id: '4', name: 'Gaming', icon: 'gamecontroller.fill', fallback: '🎮', color: '#ffb4ab' },
];

interface Store extends AppState {
  loaded: boolean;
  load: () => Promise<void>;
  addSubscription: (sub: Omit<Subscription, 'id' | 'createdAt' | 'status'>) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setThemeMode: (mode: AppState['themeMode']) => void;
  getSubscriptionsByCategory: (category: string) => Subscription[];
  getUpcomingRenewals: (days?: number) => Subscription[];
  getMonthlySpend: () => number;
  getCategoryBreakdown: () => { name: string; amount: number; percent: number }[];
}

export const useStore = create<Store>((set, get) => ({
  subscriptions: [],
  categories: DEFAULT_CATEGORIES,
  onboardingCompleted: false,
  themeMode: 'dark',
  loaded: false,

  load: async () => {
    const saved = await loadPersistedState<AppState>();
    if (saved) {
      set({ ...saved, loaded: true });
    } else {
      set({ loaded: true });
    }
  },

  addSubscription: (sub) => {
    const { randomUUID } = require('expo-crypto');
    const newSub: Subscription = {
      ...sub,
      id: randomUUID(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    set((s) => {
      const subscriptions = [...s.subscriptions, newSub];
      persistState({ subscriptions, onboardingCompleted: s.onboardingCompleted, categories: s.categories, themeMode: s.themeMode });
      return { subscriptions };
    });
  },

  removeSubscription: (id) => {
    set((s) => {
      const subscriptions = s.subscriptions.filter((sub) => sub.id !== id);
      persistState({ subscriptions, onboardingCompleted: s.onboardingCompleted, categories: s.categories, themeMode: s.themeMode });
      return { subscriptions };
    });
  },

  updateSubscription: (id, updates) => {
    set((s) => {
      const subscriptions = s.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updates } : sub
      );
      persistState({ subscriptions, onboardingCompleted: s.onboardingCompleted, categories: s.categories, themeMode: s.themeMode });
      return { subscriptions };
    });
  },

  setOnboardingCompleted: (v) => {
    set((s) => {
      persistState({ subscriptions: s.subscriptions, onboardingCompleted: v, categories: s.categories, themeMode: s.themeMode });
      return { onboardingCompleted: v };
    });
  },

  setThemeMode: (mode) => {
    set((s) => {
      persistState({ subscriptions: s.subscriptions, onboardingCompleted: s.onboardingCompleted, categories: s.categories, themeMode: mode });
      return { themeMode: mode };
    });
  },

  getSubscriptionsByCategory: (category) => {
    return get().subscriptions.filter((s) => s.category === category);
  },

  getUpcomingRenewals: (days = 30) => {
    const now = new Date();
    const future = new Date(now.getTime() + days * 86400000);
    return get().subscriptions.filter((s) => {
      const renewal = new Date(s.renewalDate);
      return renewal >= now && renewal <= future;
    });
  },

  getMonthlySpend: () => {
    return get().subscriptions.reduce((total, sub) => {
      const monthlyCost =
        sub.billingCycle === 'Yearly' ? sub.cost / 12
        : sub.billingCycle === 'Quarterly' ? sub.cost / 3
        : sub.cost;
      return total + monthlyCost;
    }, 0);
  },

  getCategoryBreakdown: () => {
    const subs = get().subscriptions;
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    subs.forEach((sub) => {
      const monthly =
        sub.billingCycle === 'Yearly' ? sub.cost / 12
        : sub.billingCycle === 'Quarterly' ? sub.cost / 3
        : sub.cost;
      categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthly;
      total += monthly;
    });

    return Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount: Math.round(amount * 100) / 100,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
  },
}));
