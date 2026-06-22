export const Routes = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  ONBOARDING_TRACK: '/onboarding/track',
  ONBOARDING_INSIGHTS: '/onboarding/insights',
  ONBOARDING_OFFERS: '/onboarding/offers',
  SUBSCRIPTIONS: '/subscriptions',
  OFFERS: '/offers',
  SETTINGS: '/settings',
  ADD_SUBSCRIPTION: '/add-subscription',
  SUBSCRIPTION_DETAIL: '/subscription-detail',
  CANCEL_SUBSCRIPTIONS: '/cancel-subscriptions',
  SUBSCRIPTION_HUB: '/subscription-hub',
  UPCOMING_RENEWALS: '/upcoming-renewals',
  RENEWAL_CALENDAR: '/renewal-calendar',
  SPENDING_INSIGHTS: '/spending-insights',
  SPENDING_INSIGHTS_DETAIL: '/spending-insights-detail',
  STREAMING_SPENDING_DETAIL: '/streaming-spending-detail',
} as const;

export type AppRoute = (typeof Routes)[keyof typeof Routes];
