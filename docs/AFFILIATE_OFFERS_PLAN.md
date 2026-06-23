# Live Offers Catalog — Integration Plan

> Status: **Planned / deferred.** The app currently ships a hardcoded curated
> offers list (`src/constants/offers.ts`) whose "Claim" buttons deep-link to each
> brand's real signup/pricing page. This document captures how to replace that
> with a live, always-current catalog later.

## 1. Goal

Replace the hand-maintained offers list with a live catalog that:

- stays current automatically (deals appear/expire without an app release),
- deep-links "Claim" to the exact brand page,
- (optionally) earns affiliate commission on conversions, and
- can later tie into email parsing so a claimed subscription auto-appears in the app.

## 2. How affiliate offers actually work

You do **not** get offers from brands directly. You join an **affiliate network**
as a *publisher*, receive API credentials, and pull their offers / deals / product
feeds programmatically. The app renders those, and "Claim" uses *your tracked
affiliate link*. When a user converts, the network attributes it and pays a
commission. The network handles tracking, attribution, and payouts.

## 3. Networks evaluated (all expose APIs)

| Network | API strengths | Notes |
|---|---|---|
| **Impact.com** | **Best fit.** `Ads` endpoint returns ads + tracking links (filter by campaign/deal); `Deals` model with state (ACTIVE/EXPIRED/PENDING), type (free shipping, BOGO, rebate…) and scope; **Product Catalog** feeds. Full developer hub: auth, pagination, rate limits. | Many brands run their programs on Impact, so one integration covers many advertisers. |
| **CJ Affiliate** | Developer APIs for link generation + reporting; product-feed API. | ~3,800 brands. |
| **Awin** | Product feeds + API; very large network (~270k partners, ~30k advertisers). | Absorbed ShareASale (migration completed 2025). |
| **Rakuten Advertising** | Product feeds + APIs; premium retail/lifestyle brands; strong attribution tooling. | **Strictest entry bar** (often 10k+ monthly visitors). |
| **Rewardful** | REST + JS API, built for SaaS/subscription recurring commissions. | For running *your own* program, not consuming others' offers. |
| **Aggregators** (Strackr; Sovrn/Skimlinks for auto-affiliation) | Expose *multiple* networks through one API. | Integrate once instead of per-network. |

## 4. Subscription-specific caveat

Not every brand has a public affiliate program:

- **Netflix** and **Spotify** have **no public affiliate program** for individual
  publishers (Spotify has historically used Impact behind the scenes).
- Many others do: Hulu, Disney+, plus numerous SaaS tools.

=> A "subscription deals" catalog will be **partial** — only brands with programs
can be monetized. Non-program brands can still appear as plain deep-links (no commission).

## 5. Becoming a publisher — requirements

- Live app/site (not "under construction"), original content, clear niche alignment
  (a finance/subscriptions app fits well).
- Minimum traffic on some networks: ~1k–5k monthly typical; **~10k for Rakuten**.
- Government ID + proof of address; tax forms (W-9 / W-8).
- FTC affiliate disclosure in-app ("we may earn a commission").
- Approval takes days; rejection is common for thin traffic; reapply after 7–90 days.

## 6. Recommended approach

Start with **Impact.com** (best deals/ads API) — optionally plus an aggregator
(Strackr) to widen brand coverage — behind a thin backend that caches and serves
offers to the app.

## 7. Backend architecture (required)

API keys must **never** live in the mobile app. Build a small service that:

1. **Holds credentials** for the affiliate network(s) securely (server env/secrets).
2. **Fetches + caches** offers on a schedule (e.g. hourly/daily cron).
3. **Normalizes** each network's payload into one schema (below).
4. **Serves** a clean `GET /offers` JSON endpoint to the app (with category + search params).
5. **Supplies** the tracked "Claim" deep-link per offer.

The app simply fetches this endpoint instead of the hardcoded array.

## 8. Normalized offer schema

Keep it identical to today's `CuratedOffer` so the swap is a drop-in:

```ts
interface Offer {
  id: string;          // stable id
  title: string;       // "Hulu"
  desc: string;        // short value line
  tag: string;         // "Free trial" | "Student" | ...
  tagColor: string;    // hex accent
  category: string;    // Streaming | Music | Productivity | ...
  icon: string;        // SF Symbol name
  fallback: string;    // emoji fallback
  url: string;         // tracked claim/deep link
  // live-only optional fields:
  state?: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  expiresAt?: string;  // ISO
  network?: string;    // 'impact' | 'cj' | ...
}
```

## 9. Migration from hardcoded → live

1. **Now:** `src/constants/offers.ts` exports the curated array; the Offers screen
   reads it. Claim deep-links to real brand pages.
2. Add `getOffers()` in a data layer that *currently* returns the hardcoded array.
3. When the backend is live, change only `getOffers()` to `fetch('<backend>/offers')`
   and cache the result — the screen needs no changes.
4. Add affiliate disclosure text and an `EXPIRED`/`PENDING` filter.

## 10. Legal / compliance

- FTC affiliate disclosure visible near offers.
- Comply with each network's program terms and link policies.
- Tax onboarding (W-9 / W-8) before payout; mind payout thresholds.

## 11. Connection to email auto-import

The same backend + OAuth work that powers "Connect Gmail" import also lets a
*claimed offer's confirmation email* auto-create the subscription — build the email
pipeline once and both features benefit. (See the separate Gmail/email plan.)

## Sources

- Impact — Ads endpoint reference: https://integrations.impact.com/partner-api-reference/reference/ads/ads
- Impact — Catalogs overview: https://integrations.impact.com/impact-brand/reference/catalogs-overview
- Impact REST API: https://api.impact.com/
- Shopify — Best affiliate networks: https://www.shopify.com/blog/affiliate-networks
- Admitad — Best affiliate networks 2025 comparison: https://www.admitad.com/blog/best-affiliate-networks-in-2025/
- AffiliateProgramDB — Netflix affiliate program: https://www.affiliateprogramdb.com/brands/netflix-affiliate-program/
- Authority Hacker — Netflix affiliate program: https://www.authorityhacker.com/netflix-affiliate-program/
- AffiliateProgramDB — Spotify affiliate program: https://www.affiliateprogramdb.com/brands/spotify-affiliate-program/
- Rewardful — Affiliate software with APIs: https://www.rewardful.com/articles/affiliate-software-with-apis
- Rakuten — Requirements for new publishers: https://pubhelp.rakutenadvertising.com/hc/en-us/articles/360060314292-Requirements-for-New-Publishers
- Post Affiliate Pro — Documents required for applications: https://www.postaffiliatepro.com/blog/documents-required-affiliate-network-applications/
- AFFBun — How to get approved by affiliate networks: https://affbun.com/blog/how-to-get-approved-by-affiliate-networks
