/**
 * Pure helpers for deriving values from subscriptions.
 * Keep all subscription math in one place so screens stay declarative.
 */
import type { Category, Subscription } from '@/types';

const MS_PER_DAY = 86_400_000;

/** Normalise any billing cycle to a monthly figure. */
export function monthlyCostOf(sub: Pick<Subscription, 'cost' | 'billingCycle'>): number {
  switch (sub.billingCycle) {
    case 'Yearly':
      return sub.cost / 12;
    case 'Quarterly':
      return sub.cost / 3;
    default:
      return sub.cost;
  }
}

/** Annualised cost of a subscription. */
export function yearlyCostOf(sub: Pick<Subscription, 'cost' | 'billingCycle'>): number {
  return monthlyCostOf(sub) * 12;
}

/** Total monthly spend across a list. */
export function totalMonthlySpend(subs: Subscription[]): number {
  return subs.reduce((sum, s) => sum + monthlyCostOf(s), 0);
}

/** Whole days until the renewal date (can be negative if past). */
export function daysUntilRenewal(sub: Pick<Subscription, 'renewalDate'>): number {
  const renewal = new Date(sub.renewalDate);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  renewal.setHours(0, 0, 0, 0);
  return Math.round((renewal.getTime() - start.getTime()) / MS_PER_DAY);
}

/** Human label for an upcoming renewal. */
export function renewalLabel(sub: Pick<Subscription, 'renewalDate'>): string {
  const d = daysUntilRenewal(sub);
  if (d < 0) return 'Past due';
  if (d === 0) return 'Today';
  if (d === 1) return 'Tomorrow';
  return `In ${d} days`;
}

/** "Feb 12" style short date. Returns '' for unparseable input. */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Subscriptions renewing within `days` (default 30), soonest first. */
export function upcomingRenewals(subs: Subscription[], days = 30): Subscription[] {
  return subs
    .filter((s) => {
      const d = daysUntilRenewal(s);
      return d >= 0 && d <= days;
    })
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
}

/** The next subscription to renew, or null. */
export function nextRenewal(subs: Subscription[]): Subscription | null {
  const future = subs
    .filter((s) => daysUntilRenewal(s) >= 0)
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());
  return future[0] ?? null;
}

export interface CategorySummary {
  name: string;
  amount: number; // monthly
  percent: number; // of total monthly spend
  count: number;
  color: string;
  icon: string;
  fallback?: string;
}

const FALLBACK_COLORS = ['#a0d57c', '#abd28f', '#c8c6c5', '#ffb4ab', '#6BD8CB'];

/** Group subscriptions by category with monthly totals, percentages and metadata. */
export function categoryBreakdown(
  subs: Subscription[],
  categories: Category[],
): CategorySummary[] {
  const totals: Record<string, { amount: number; count: number }> = {};
  let grandTotal = 0;

  for (const sub of subs) {
    const monthly = monthlyCostOf(sub);
    const entry = totals[sub.category] ?? { amount: 0, count: 0 };
    entry.amount += monthly;
    entry.count += 1;
    totals[sub.category] = entry;
    grandTotal += monthly;
  }

  return Object.entries(totals)
    .map(([name, { amount, count }], i) => {
      const meta = categories.find((c) => c.name === name);
      return {
        name,
        amount: Math.round(amount * 100) / 100,
        percent: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
        count,
        color: meta?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        icon: meta?.icon ?? 'square.grid.2x2.fill',
        fallback: meta?.fallback,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

/** Highest-spend category, or null. */
export function topCategory(
  subs: Subscription[],
  categories: Category[],
): CategorySummary | null {
  return categoryBreakdown(subs, categories)[0] ?? null;
}

export interface SavingsTip {
  id: string;
  icon: string;
  fallback: string;
  title: string;
  desc: string;
  color: string;
  amount?: string;
}

/**
 * Personalized, computed savings suggestions derived purely from the user's
 * own subscriptions — no external data required.
 */
export function savingsTips(subs: Subscription[], categories: Category[]): SavingsTip[] {
  if (subs.length === 0) return [];
  const tips: SavingsTip[] = [];
  const breakdown = categoryBreakdown(subs, categories);

  // 1. A category with more than one subscription → consolidation opportunity.
  const dup = breakdown.filter((c) => c.count > 1).sort((a, b) => b.count - a.count)[0];
  if (dup) {
    tips.push({
      id: 'dup',
      icon: 'square.stack.3d.up.fill',
      fallback: '📚',
      title: `Consolidate ${dup.name}`,
      desc: `You have ${dup.count} ${dup.name} subscriptions totaling $${dup.amount.toFixed(2)}/mo. Dropping one trims this fast.`,
      color: dup.color,
    });
  }

  // 2. Largest subscription → suggest annual (if monthly) or flag for review.
  const priciest = [...subs].sort((a, b) => monthlyCostOf(b) - monthlyCostOf(a))[0];
  if (priciest && priciest.billingCycle === 'Monthly') {
    const est = monthlyCostOf(priciest) * 2; // annual plans commonly include ~2 months free
    tips.push({
      id: 'annual',
      icon: 'calendar.badge.clock',
      fallback: '🗓️',
      title: `Pay yearly for ${priciest.name}`,
      desc: `Annual plans often bundle ~2 months free, so you could save roughly $${est.toFixed(2)} a year.`,
      color: '#a0d57c',
      amount: `~$${est.toFixed(0)}/yr`,
    });
  } else if (priciest) {
    tips.push({
      id: 'largest',
      icon: 'arrow.up.forward',
      fallback: '⬆️',
      title: `Review ${priciest.name}`,
      desc: `It's your largest subscription at $${monthlyCostOf(priciest).toFixed(2)}/mo ($${yearlyCostOf(priciest).toFixed(2)}/yr).`,
      color: '#ffb4ab',
    });
  }

  // 3. Annual outlook — total exposure over the next 12 months.
  const yearly = totalMonthlySpend(subs) * 12;
  tips.push({
    id: 'outlook',
    icon: 'chart.line.uptrend.xyaxis',
    fallback: '📈',
    title: 'Annual outlook',
    desc: `At your current rate you'll spend about $${yearly.toFixed(2)} over the next 12 months.`,
    color: '#abd28f',
  });

  return tips;
}
