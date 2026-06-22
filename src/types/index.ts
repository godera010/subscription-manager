export type BillingCycle = 'Monthly' | 'Quarterly' | 'Yearly';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  name: string;
  icon: string;
  fallback?: string;
  cost: number;
  billingCycle: BillingCycle;
  category: string;
  renewalDate: string;
  plan?: string;
  status: SubscriptionStatus;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  fallback?: string;
  color: string;
}

export interface Offer {
  id: string;
  icon: string;
  title: string;
  desc: string;
  tag: string;
  tagColor: string;
}

export interface Alert {
  icon: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppState {
  subscriptions: Subscription[];
  onboardingCompleted: boolean;
  categories: Category[];
  themeMode: ThemeMode;
}
