# Gmail / Email Connection — Architecture Plan

> Status: **Planned / not yet built.** This documents how to add "Connect your
> email" so the app can auto-detect subscriptions from receipts and confirmation
> emails. It has hard external dependencies (Google OAuth verification + a backend)
> that must be set up before any of it works in production.

## 1. Goal

Let a user connect their inbox (Gmail first) so the app can:

1. **Import existing subscriptions** by reading past receipts/confirmations, and
2. **Auto-reflect new ones** — when a signup/renewal email arrives (including a
   subscription claimed from the Offers tab), it appears in the app automatically.

Both are the **same pipeline**: connect inbox → read relevant emails → parse →
create/update subscriptions. Build it once, both features work.

## 2. Hard constraints (read first)

- **Restricted scope.** Reading email bodies needs `https://www.googleapis.com/auth/gmail.readonly`,
  which Google classifies as a **restricted scope**. Public apps that store or
  transmit this data on servers must pass a **CASA security assessment** by a
  Google-approved lab, revalidated annually (typically a few hundred to a few
  thousand USD/year; weeks of lead time).
- **Exceptions (no CASA yet):** apps in **"Testing"** mode, or used by **fewer
  than 100 users**, or restricted to **internal org accounts**. => We can build and
  run a real prototype for ourselves/testers without CASA, and only trigger the
  assessment when going public.
- **Backend required.** Safely storing refresh tokens, watching inboxes, and
  parsing email can't live in the mobile app. The app is currently 100% on-device;
  this feature introduces a server + accounts + sync.
- **Minimize scope.** Prefer `gmail.metadata` (headers only, no bodies) where
  possible; only request `gmail.readonly` if body parsing is truly needed. Less
  scope = lighter verification burden.

## 3. Components

```
[Mobile app]  --OAuth-->  [Google]            (user grants access)
     |                       |
     | auth code             | tokens
     v                       v
[Backend API] <----------- token exchange + refresh-token storage (encrypted)
     |  \
     |   \--> [Gmail API: users.watch] --> [Cloud Pub/Sub topic] --> push webhook
     |                                                                   |
     |  poll/history.list  <---------------------------------------------'
     v
[Parser] --> [Subscriptions DB] --> sync --> [Mobile app]
```

## 4. OAuth flow (mobile + backend)

- App uses **`expo-auth-session`** (works with Expo) to run Google OAuth and obtain
  an **authorization code** (PKCE).
- App sends the code to **our backend**, which exchanges it for **access + refresh
  tokens** and stores the refresh token **encrypted, server-side** (never in the app).
- Backend refreshes access tokens as needed and makes all Gmail API calls.
- Scopes: start with `gmail.metadata` (+ `openid email`); escalate to
  `gmail.readonly` only for full body parsing.

## 5. Email ingestion

Two options:

| Approach | How | When to use |
|---|---|---|
| **Polling** | Backend calls `messages.list` (filtered) every N seconds/minutes per account, tracks last seen. | Simplest; fine for a low-volume prototype. Wastes quota and lags at scale. |
| **Push (recommended for production)** | Call `users.watch` → Gmail publishes change notifications to a **Cloud Pub/Sub** topic → our webhook receives `{emailAddress, historyId}` → call `users.history.list` with stored `startHistoryId` to get changes → fetch new messages. | Efficient and near-real-time. |

Key details for push:

- `watch` returns a `historyId` + expiration; **store both** per user.
- `historyId` is a monotonic cursor — always persist the latest per account and
  pass it as `startHistoryId` to `history.list` for incremental sync.
- **Must call `watch` at least every 7 days** (recommend daily via cron) or
  notifications stop.

## 6. Parsing pipeline

1. **Pre-filter** to likely subscription emails: sender allowlist (billing@, no-reply@
   known providers), subject/keyword heuristics ("receipt", "your subscription",
   "renews", "payment confirmation").
2. **Extract** fields: merchant/brand, amount + currency, billing cycle, next renewal
   date, last-charged date. Techniques, in order of effort/accuracy:
   - per-provider templates/regex for the top brands (highest precision),
   - generic receipt parsing (amount/date/merchant heuristics),
   - optional LLM extraction for the long tail (send minimal text, not full inbox).
3. **Confidence + confirmation.** Low/medium confidence → land in a **"Review imports"**
   queue the user confirms before it's added. High confidence + known template → can
   auto-add. Never silently add ambiguous data.
4. **Dedupe** against existing subscriptions (match by normalized merchant + amount)
   to update rather than duplicate.

## 7. Data model additions

- `Subscription.source?: 'manual' | 'email' | 'offer'` — provenance.
- `Subscription.externalRef?: string` — message/thread id for traceability.
- **PendingImport** records: parsed candidates awaiting user confirmation.
- **EmailConnection** record: provider, account email, token ref, `historyId`,
  `watchExpiry`, status.
- Requires **user accounts + cloud sync** so server-created items reach the app.

## 8. Privacy & compliance

- Pass **CASA** before public launch (annual revalidation). Stay in Testing mode for
  the prototype.
- **Scope minimization** (`metadata` over `readonly` where feasible); request access
  incrementally with a clear rationale screen.
- **Data retention**: store only parsed subscription fields, not raw emails; let users
  disconnect and delete all derived data.
- In-app disclosure of what's accessed and why; Google brand/OAuth consent compliance.

## 9. Phasing

- **Phase 0 — Prototype (no CASA):** Google Cloud project + OAuth client; app
  `expo-auth-session` connect flow; backend token exchange; **polling** + per-provider
  parsers for ~10 top brands; "Review imports" UI. Limited to test users (<100).
- **Phase 1 — Robust ingestion:** switch to `users.watch` + Pub/Sub push; daily watch
  renewal; broaden parsers; dedupe/update logic.
- **Phase 2 — Production:** OAuth verification + CASA; accounts + cloud sync; scale
  hardening; offer-email auto-add reuses the same parser.

## 10. App-side changes (when we build)

- A **Connect Email** screen (the "Connect email" import method) with connected /
  disconnected states and a disconnect action.
- A **Review Imports** screen to confirm parsed candidates → calls `addSubscription`.
- Settings entry showing connection status.
- `getOffers()`-style data layer so the app talks to the backend, not Google directly.

## 11. What you (the owner) must provide

- A **Google Cloud project**, OAuth consent screen, and OAuth client credentials.
- A **backend host** (token storage, Pub/Sub webhook, parser, DB).
- Eventually: budget + time for **CASA** and OAuth verification to go public.

## Sources

- Google — Restricted scope verification: https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification
- Google CASA security assessment overview: https://deepstrike.io/blog/google-casa-security-assessment-2025
- Nylas — Google verification & security assessment guide: https://developer.nylas.com/docs/provider-guides/google/google-verification-security-assessment-guide/
- Google — Configure push notifications in Gmail API: https://developers.google.com/workspace/gmail/api/guides/push
- Google — Method: users.watch: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users/watch
- Unipile — Gmail API push notifications guide (Pub/Sub, watch, history): https://www.unipile.com/gmail-api-push-notifications/
