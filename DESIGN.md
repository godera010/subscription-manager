# Design System: Prism Finance – Subscription Manager

## 1. Visual Theme & Atmosphere

**"Night Garden"** — an immersive dark-first aesthetic that feels simultaneously calm and alive. Think bioluminescent moss in a moonlit cave: deep, near-black teal backgrounds (#091614) absorb all ambient light, while neon-lime accents (#a0d57c) glow with soft organic energy. The interface is **minimalist but alive** — generous whitespace, precision typography, and subtle ambient animations give every screen a quietly premium, fintech-grade presence. Cards appear to float above the background through glassmorphic layering rather than harsh shadows. The overall density is intentionally low: every element earns its place.

---

## 2. Color Palette & Roles

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| **Void Black** | `#091614` | Primary background — the deepest layer, used for the main app canvas |
| **Dark Teal Surface** | `#152220` | Card / elevated surface — primary card background |
| **Forest Card** | `#1f2c2a` | Surface high — second-level card elevation, modals |
| **Charcoal Ridge** | `#2a3735` | Surface highest — chip backgrounds, input fields |
| **Neon Lime** | `#a0d57c` | Primary accent — interactive elements, active states, glow |
| **Muted Sage** | `#538334` | Primary container — active tab pill, CTA button fill |
| **Ghost White** | `#d7e6e2` | Primary text — headings, key numbers |
| **Misty Sage** | `#c2c9b8` | Secondary text — labels, metadata, placeholder text |
| **Coral Error** | `#ffb4ab` | Error state — validation messages |
| **Slate Outline** | `#42493c` | Outline variant — borders, dividers |

**Glow colors (ambient only):**
- Primary glow: `rgba(160,213,124,0.18)` — used for background halos on CTA buttons
- Primary glow strong: `rgba(160,213,124,0.35)` — peak of idle pulse animation
- Surface glass: `rgba(255,255,255,0.04)` — glassmorphic card backgrounds
- Surface glass border: `rgba(255,255,255,0.07)` — card borders

---

## 3. Typography Rules

**Font family:** Inter — clean, humanist sans-serif chosen for its outstanding legibility at all weights and its technical/financial associations. All text uses Inter across Regular (400), SemiBold (600), and Bold (700).

**Scale & usage:**
- **Headline / Hero numbers**: 32–36px, weight 600–700, letter-spacing –0.6 to –1. Numbers always use `fontVariant: ['tabular-nums']` to prevent layout shift.
- **Section titles**: 20–24px, weight 600, letter-spacing –0.3
- **Body / default**: 15–16px, weight 400–500, line-height 22–24
- **Labels / metadata**: 11–13px, weight 500, letter-spacing +0.6, often `textTransform: 'uppercase'` for field labels
- **Micro / captions**: 10–12px, weight 400–500, color: Misty Sage

**Character:** Numbers feel precise and financial. Labels feel like a premium product UI manual.

---

## 4. Component Stylings

### Buttons
- **Primary CTA** ("Add Subscription", "Get Started", "Claim Offer"): Pill-shaped (borderRadius: 24), Muted Sage (#538334) fill, Ghost White text (weight 600, 16–18px). At idle, glows with animated neon-lime shadow (`shadowColor: rgba(160,213,124,0.30)`, pulsing shadowRadius 8–18px). On press: springs to 96% scale with bouncy physics (damping 12, stiffness 400).
- **Secondary / outlined**: Generously rounded corners (borderRadius 12), transparent fill, Slate Outline border (1px), Ghost White icon/text. Soft press scale to 96%.
- **Ghost / tertiary**: No border, no background. Misty Sage text. Scale press only.

### Cards / Containers
- **Glass card**: borderRadius 14–16, background `rgba(255,255,255,0.04)`, border `rgba(255,255,255,0.07)` 1px, subtle dark drop-shadow. Contains an off-centre radial glow bleed (`rgba(160,213,124,0.06)`) for organic warmth.
- **Surface card**: borderRadius 14, background Dark Teal Surface (#152220).
- **Row items** (subscriptions): borderRadius 14, background Dark Teal Surface, left accent strip (3px wide, category colour, opacity 0.8), slightly elevated via 1px border.

### Inputs / Forms
- **Text fields**: borderRadius 12, border 1px `rgba(255,255,255,0.10)`, background Charcoal Ridge. On focus: border transitions to Neon Lime over 200ms. Height 52px. Placeholder: Misty Sage at 50% opacity.
- **Segment / pill selector** (billing cycle): Pill track (borderRadius 24), contains a sliding Muted Sage indicator that spring-animates between options (damping 20, stiffness 280). Text labels float above the indicator at z-index 1.
- **Filter chips**: borderRadius 20, outlined style inactive, filled Muted Sage active. Press scale 0.92.
- **Category chips**: Same pill shape. Press scale 0.93 with spring.

### Icons
- All icons use `expo-symbols` (SF Symbols on iOS/macOS). Fallback emoji for Android/Web.
- Icon boxes: 44–48px square, borderRadius 14, background Charcoal Ridge, icon coloured in category accent or Neon Lime.

### Bottom Navigation
- Full-width, frosted glass (backdrop-filter blur 16px on web), Dark Void at 88% opacity.
- A spring-sliding Muted Sage pill (72% of tab width, borderRadius 12) moves behind the active tab icon+label.
- Icons scale to 118% on becoming active (bouncy spring, then settle), 100% when inactive.

---

## 5. Layout Principles

- **Horizontal padding**: 16px for all screen content. Cards never bleed to edges.
- **Vertical rhythm**: 16–24px gap between sections on scrolling screens. 8–16px within cards.
- **Content max-width**: 800px (for tablet / web).
- **Card corner radius spectrum**: 8px (micro chips), 12px (inputs, pills), 14px (rows), 16px (hero cards).
- **Safe area**: All screens respect top + bottom safe-area insets via `useSafeAreaInsets`. Bottom tab inset added to scrollable content bottom padding.
- **Visual hierarchy**: One bright neon-lime element per screen view acts as the primary anchor. Everything else fades progressively toward Misty Sage.
- **Whitespace**: Intentionally generous. Cards breathe. The darkness *is* the space.

---

## 6. Motion & Animation Principles

- **Press response**: All interactive elements scale to 96% on press with bouncy spring (damping 12, stiffness 400), spring back on release (damping 20, stiffness 200).
- **Screen entry**: Elements enter with `FadeInDown`/`FadeInUp` + springified stagger (50–100ms per item). Nothing appears instantly.
- **Idle ambience**: Hero numbers, CTA buttons, and background glow orbs animate slowly at rest (1400–2500ms periods) to keep screens feeling alive without distraction.
- **Data reveal**: Progress bars sweep from 0% on mount. Chart bars grow from the bottom staggered. This communicates that data is being computed, not static.
- **Navigation**: Stack transitions use `slide_from_right`. Tab switches trigger the pill slide.
- **Duration constants**: Fast 150ms (colour swap), Normal 250ms (opacity), Slow 400ms (layout). Spring presets: Bouncy (damping 12 / stiffness 400), Smooth (damping 20 / stiffness 280), Gentle (damping 25 / stiffness 160).
