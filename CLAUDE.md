# 🎨 SOLVO — UI Handoff Document for Claude Code

> **Purpose of this document:** This is a complete specification for replicating the Solvo web app UI inside an existing project. Read it fully before writing any code. The goal is to produce a UI that is _visually and functionally identical_ to the reference implementation, while integrating cleanly with the existing project's component architecture, styling system, and conventions.

---

## 📋 Step 1: Discovery (Do this BEFORE writing any code)

Before generating any UI, inspect the existing project:

1. **Read `package.json`** — determine framework (React/Next.js/Vue/etc.), styling approach (Tailwind/CSS modules/styled-components), and existing UI library (shadcn/ui, MUI, Chakra, custom).
2. **Map the folder structure** — identify where pages/routes live, where components live, where styles live.
3. **Identify existing components that can be reused** — buttons, cards, inputs, modals, navbars. Do NOT create duplicates.
4. **Check the routing system** — React Router, Next.js App Router, file-based routing, etc.
5. **Check for existing design tokens** — colors, fonts, spacing scales already defined. Match them where possible.
6. **Read 2-3 existing components** to learn the project's conventions: file naming, prop patterns, export style, comment style.

**Report your findings to the user before proceeding.** Then ask: "Should I match your existing design tokens, or import the reference palette exactly?"

---

## 🎯 Product Context

**Solvo** is an AI-powered service marketplace (think Thumbtack + Yelp + AI concierge + WhatsApp simplicity). Users describe what they need in natural language; the system interprets intent and returns curated providers, pricing tiers, and bundled package solutions. Core principle: _"I just ask for what I need, and Solvo figures it out for me."_

**Six screens to build:**

1. Landing page
2. Search / AI results page
3. Package view (bundled solutions)
4. Provider profile
5. User dashboard
6. Provider dashboard (B2B)

---

## 🎨 Design System

> Rebranded to **Solvo** (branch `solvo-rebrand`). The palette, typography and
> logo below supersede the original indigo/Fraunces spec. Source of truth is
> `src/shared/constants/solvo-theme.ts` — read it before styling anything.

### Aesthetic direction

**Confident, energetic, modern.** Clean geometric sans, generous whitespace,
and a two-color brand system: kinetic orange against intellectual purple.
Depth comes from hairline borders and soft shadows, not heavy elevation.

### How theming works

Every token in `solvoColors` is a `var(--solvo-*)` reference, never a literal.
The hexes are declared once in `solvoThemeCss` under `:root` (light) and
`[data-theme='dark']`, injected globally from `_document.tsx`. Because
components only ever hand out variable references, **any component reading
`solvoColors.x` is automatically theme-reactive** — no `useColorMode` call is
needed at the consumer, and the browser re-resolves on toggle without a
re-render.

The mode is resolved before first paint by an inline script in `_document.tsx`
(localStorage → `prefers-color-scheme` → light), so there is no flash.

### Color palette

Brand colors, per the Solvo brand guidelines:

```
Energy Orange   #FF8C00  — primary accent: CTAs, active states, highlights
Creative Purple #6F42C1  — brand identity: badges, AI moments, structural framing
Bright White    #FFFFFF  — card surfaces in light mode
Deep Midnight   #0B0B16  — canvas in dark mode
```

Use the semantic token, never the hex:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg` | `#F4F5F7` | `#0B0B16` | Page canvas, inset rows |
| `surface` | `#FFFFFF` | `#16162C` | Cards, panels, modals |
| `surfaceMuted` | `#EDEFF3` | `#1E1E38` | Insets inside a card |
| `border` | `#E2E8F0` | `#2D3748` | Hairlines, dividers, inputs |
| `text` | `#1A1A2E` | `#F8F9FA` | Headings and body |
| `textMuted` | `#4A5568` | `#CBD5E0` | Secondary copy |
| `textSubtle` | `#626D79` | `#A0AEC0` | Captions, metadata |
| `accent` | `#FF8C00` | `#FFA533` | Primary CTA fill, active states |
| `accentFg` | `#1A1A2E` | `#0B0B16` | **Label on an accent fill** |
| `accentSoft` / `accentBorder` / `accentText` | tints | tints | Accent chips and badges |
| `brand` | `#6F42C1` | `#9061F9` | Brand fills, AI moments |
| `brandFg` | `#FFFFFF` | `#0B0B16` | Label on a brand fill |
| `brandSoft` / `brandBorder` / `brandText` | tints | tints | Brand chips and cards |

`emerald` stays reserved for WhatsApp CTAs and success; `amber` and `rose`
remain status-only. `solvoTints` carries the five category-tile gradients.

**Contrast rule:** white on Energy Orange is 2.3:1 and fails WCAG AA. Orange
fills always take `accentFg` (near-black, 7.2:1). The `indigo*` keys still
exist as aliases onto the purple family so untouched call sites stay on-brand.

### Typography

**Two-font system. Do not substitute.**

- **Display / headings:** Plus Jakarta Sans (600/700/800), `letter-spacing: -0.02em`
  - Used for: hero headlines, section titles, prices, profile names, the wordmark
  - Exposed as `solvoFonts.display` (`solvoFonts.serif` is a back-compat alias)
- **UI / body:** Inter (400/500/600/700) — everything else, via `solvoFonts.sans`

```html
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Scale is in `solvoType` (H1 36/44 bold, H2 28/36 semibold, H3 22/28 medium,
body 16/24, caption 12/16). Emphasis phrases use **weight + brand color**, not
italic — the geometric sans has no true italic and the faux slant reads cheap.

### Logo

Assets live in `public/assets/brand/`. The `<Logo />` molecule pairs the
geometric 'S' mark (`logo-192.png`, kept small deliberately — the 1600px
master is ~700KB) with live "Solvo" text in Plus Jakarta Sans 800.

Guidelines §4: clear space equal to the height of the 'S' emblem on all sides;
minimum width 120px for the full lockup, 24px for the icon alone.

### Shape & elevation

- **Border radius:** `rounded-2xl` (16px) for cards, `rounded-3xl` (24px) for hero/feature cards, `rounded-full` for pills and avatars
- **Shadows:** Avoid generic `shadow-lg`. Use custom soft shadows:
  - Cards at rest: `border` token, no shadow
  - Cards hover: `borderHover` token, optional `-translate-y-0.5`
  - Hero input: `shadow-[0_20px_60px_-15px_rgba(30,27,75,0.15)]`
  - Floating panels: `solvoShadows.floatingPanel`

### Motion (use Framer Motion / `motion` package)

- Page transitions: `opacity 0→1, y: 8→0`, duration 0.3s
- Staggered card reveals on load: `delay: i * 0.08`
- Hero entrance: `opacity + y: 20→0`, duration 0.6s
- Loading spinner: rotating border, 2s linear infinite
- Avoid: bouncy springs, scale pulses, gimmicky hover effects. Motion should feel **premium and restrained.**

### Required dependencies

```bash
npm install framer-motion lucide-react
```

If the existing project uses different versions, match theirs. If it uses different icon/animation libraries, adapt the implementations to use those instead — but keep visual parity.

---

## 🧩 Component Architecture

Build these as **reusable components**, not inline JSX. If similar components already exist in the project, extend or wrap them rather than duplicating.

### Shared components needed

- `<Logo />` — geometric 'S' brand mark + "Solvo" wordmark in Plus Jakarta Sans 800
- `<NavBar />` — sticky top, blurred backdrop, logo left, nav center, avatar right
- `<Pill />` — small rounded badge, accepts `tone` prop: `default | indigo | accent | amber | emerald | rose | dark`
- `<ProviderCard />` — used on results page
- `<PackageCard />` — used on packages page
- `<LoadingState />` — used during AI "thinking"
- `<RefineFooter />` — floating chat assistant (bottom-right)

---

## 📱 Screen-by-Screen Specification

### 1. Landing Page (`/`)

**Layout structure:**

- Atmospheric background: three blurred radial glows from `solvoGlows` (purple top-right, orange bottom-left, orange behind the hero input), absolute positioned, `pointer-events-none`. They carry more alpha in dark mode — see `--solvo-glow-*`.
- Hero section (centered, max-width 5xl)
- Conversational input box (centered, max-width 2xl)
- Suggested prompt chips (wrap, centered)
- Trust strip (3-column grid with hairline dividers)
- Categories grid (5-column on desktop)
- Footer

**Hero specifics:**

- Small status badge above headline: pulsing emerald dot + "AI concierge · 12,400+ verified providers"
- Headline (display face, 5xl→7xl, leading-tight): **"Ask for anything."** newline **"Solvo finds who solves it."** — `solvoGradients.brand` (orange→purple, background-clip:text) + weight 800 on "Solvo finds"
- Subhead: "Describe what you need in your own words. We match you with the right people, instantly."

**Input box specifics:**

- Rounded-3xl, white, soft shadow, contains:
  - Multiline textarea, placeholder: _"I need catering for 40 people this Saturday..."_
  - Bottom row: paperclip icon, mic icon, "Press ⏎ to send" hint (right-aligned)
  - "Find options" button on the right: `accent` bg with `accentFg` label, rounded-2xl, arrow-right icon, hover:`accentHover`
- Enter key submits (Shift+Enter = newline)

**Suggested prompts (6 chips):**

```
🎂 Plan a birthday party
❄️ Fix my AC
🧽 Find a cleaning service
🎧 Get a DJ for an event
📸 Hire a photographer
🚚 Need movers this weekend
```

Style: `surface` bg, `border`, hover:`accentBorder` + `accentSoft`

**Trust strip (3 items, hairline-divided grid):**

- ShieldCheck icon — "Verified providers" / "Every business is identity-checked"
- Zap icon — "Replies in minutes" / "Average first response: 8 minutes"
- TrendingUp icon — "Compare instantly" / "Side-by-side options & pricing"

**Categories (5 cards):**
| Icon | Label | Count | Tint gradient |
|------|-------|-------|---------------|
| Calendar | Events | 2.4k providers | rose→orange |
| Home | Home services | 1.8k providers | sky→indigo |
| Briefcase | Business | 920 providers | emerald→teal |
| Scissors | Beauty & wellness | 1.2k providers | pink→fuchsia |
| Car | Auto | 640 providers | amber→yellow |

Each card: `surface` bg, `border`, gradient tinted icon square (12×12, rounded-xl), hover lifts -0.5.

---

### 2. Search Results (`/search` or `/results`)

**Top section:**

- Tiny "Your request" label + "Refine" toggle (Edit3 icon)
- Display query in font-serif, 2xl-3xl, in quotes. When refining, swap for input + "Update" button.

**AI interpretation card:**

- Gradient background: `brandSoft` → `surface` gradient
- Border: `brandBorder`, rounded-2xl, padding 5
- Indigo sparkles icon in rounded square
- Label: "VINI UNDERSTOOD" → change to **"SOLVO UNDERSTOOD"** (uppercase, tracking-wider, `brandText`)
- Parsed summary as a sentence with **bold** keywords (service, # of people, location, budget, when)
- Three refinement chips below: "+ Add dietary needs", "+ Specify time", "+ Adjust budget"

**Naive parser logic** (for demo — replace with real AI later):

```js
const parsed = {
  service: /cater/i.test(query)
    ? "Catering"
    : /dj/i.test(query)
      ? "DJ"
      : /clean/i.test(query)
        ? "Cleaning"
        : /ac|fix/i.test(query)
          ? "AC repair"
          : "Service",
  people: (query.match(/(\d+)/) || [])[1] || "35",
  location: "Santa Ana",
  budget: "₡300,000",
  when: /saturday/i.test(query) ? "Saturday" : "this week",
};
```

**Loading state (~1.8s):**

- Centered, py-16
- Rotating square border (`brandBorder` with `brand` top), Sparkles icon centered
- Headline: "Solvo is finding the best options..."
- Three checkmark items appearing with delay: "Reading your request" → "Matching with 12,400 providers" → "Ranking by fit & response time"

**Results header:**

- Left: "{N} options found" + "Sorted by AI relevance for your request"
- Right: "Filters" button (SlidersHorizontal icon) + "See packages" button (`accent`, sparkles icon)

**Provider card structure:**

- Rounded-3xl, white, padding 5-6
- **Recommended card:** `brandBorder` + `solvoShadows.recommendedHalo` (Creative Purple)
- Recommended ribbon: `-top-3 left-6`, `accent` pill: "✨ AI Recommended · Best match"
- Layout: avatar/price column (md:48 wide) + body
- Body shows: name + ShieldCheck (if verified), rating row (star + reviews + location + response time), checklist of 4 inclusions in 2-col grid, tags as Pills, action row
- Action row: "View profile" (text), "WhatsApp" button (emerald-500, MessageCircle icon), "Select" button (`accent`, ArrowRight icon)

**Provider mock data (4 providers):**

```js
[
  {
    id: 1,
    name: "Sabor Catering Co.",
    rating: 4.9,
    reviews: 312,
    priceLabel: "₡285,000",
    includes: [
      "Full service for 35 ppl",
      "3-course menu + drinks",
      "Setup & cleanup",
      "1 server included",
    ],
    tags: ["AI Match", "Fast response"],
    responseTime: "Replies in ~5 min",
    location: "Santa Ana, 4 km away",
    avatar: "🍽️",
    verified: true,
    recommended: true,
  },
  {
    id: 2,
    name: "Mesa Fina Eventos",
    rating: 4.8,
    reviews: 198,
    priceLabel: "₡320,000",
    includes: [
      "Premium menu",
      "Dessert table",
      "Wait staff (2)",
      "Linen & decor",
    ],
    tags: ["Premium"],
    responseTime: "Replies in ~12 min",
    location: "Escazú, 7 km away",
    avatar: "🥂",
    verified: true,
  },
  {
    id: 3,
    name: "Cocina Express CR",
    rating: 4.6,
    reviews: 540,
    priceLabel: "₡215,000",
    includes: ["Buffet style", "2 main dishes", "Self-serve setup"],
    tags: ["Best price"],
    responseTime: "Replies in ~20 min",
    location: "San José Centro, 12 km away",
    avatar: "🌮",
    verified: true,
  },
  {
    id: 4,
    name: "La Buena Mesa",
    rating: 4.7,
    reviews: 156,
    priceLabel: "₡298,000",
    includes: [
      "Themed menu options",
      "Dietary accommodations",
      "Coffee bar add-on",
    ],
    tags: ["Customizable"],
    responseTime: "Replies in ~30 min",
    location: "Santa Ana, 5 km away",
    avatar: "🥗",
    verified: true,
  },
];
```

**Floating refine assistant (`<RefineFooter />`):**

- Closed state: pill button bottom-right, `accent` bg, "✨ Refine with AI"
- Open state: 80-wide panel, rounded-3xl, header (indigo gradient strip with sparkles avatar + "Solvo Assistant" + online dot + close X), message list (max-h-72, scrollable), input + send button
- Initial AI message: "Want me to refine these results? I can adjust budget, location, dietary needs, or add more services."
- User send → fake AI reply after 800ms: "Got it — I'll update the results to focus on that. Anything else to adjust?"

---

### 3. Packages View (`/packages`)

**Header:**

- Tiny indigo "✨ Curated by Solvo AI" label
- Headline: "Complete solutions, not just providers." — `solvoGradients.brand` on the second line
- Subhead: "Three thoughtfully bundled packages for '[query]'. One contract, one payment, zero coordination."

**Three package cards in 3-column grid:**

- Middle card (Balanced) is featured: `accent` border, scaled 1.02, deep shadow
- Each card: emoji header, "BIRTHDAY PACKAGE" eyebrow, serif tier name (Essentials/Balanced/Premium), price (serif 3xl), "save ₡XX,XXX" in emerald
- Expandable "What's included" section (chevron rotates 180°), revealing line items in `surfaceMuted` rows with emoji + label + price
- Two buttons: "Book this package" (`accent` if featured, `surfaceMuted` otherwise) + "Customize package" (outline)

**Package data:**

```js
[
  {
    tier: "Essentials",
    emoji: "🎈",
    price: "₡245,000",
    saved: "₡18,000",
    tag: "Best value",
    items: [
      { icon: "🍽️", label: "Buffet catering", price: "₡165,000" },
      { icon: "🎈", label: "Basic decoration", price: "₡35,000" },
      { icon: "🔊", label: "Bluetooth speaker rental", price: "₡25,000" },
      { icon: "🎂", label: "Bakery cake", price: "₡20,000" },
    ],
  },
  {
    tier: "Balanced",
    emoji: "🎉",
    price: "₡380,000",
    saved: "₡42,000",
    tag: "Most popular",
    featured: true,
    items: [
      { icon: "🍽️", label: "Catering for 35", price: "₡215,000" },
      { icon: "🎈", label: "Decoration & balloons", price: "₡68,000" },
      { icon: "🎧", label: "DJ + sound system (4h)", price: "₡75,000" },
      { icon: "🎂", label: "Custom cake (3 tier)", price: "₡22,000" },
    ],
  },
  {
    tier: "Premium",
    emoji: "✨",
    price: "₡580,000",
    saved: "₡85,000",
    tag: "Premium",
    items: [
      { icon: "🥂", label: "Premium catering + bar", price: "₡340,000" },
      { icon: "🌸", label: "Full event styling", price: "₡120,000" },
      { icon: "🎧", label: "Live DJ + lights (5h)", price: "₡95,000" },
      { icon: "🎂", label: "Designer cake", price: "₡25,000" },
    ],
  },
];
```

**Bottom CTA:**

- Indigo gradient strip: "Want something else entirely? Tell Solvo what to add or remove and we'll rebuild your package in seconds." + "Customize" button.

---

### 4. Provider Profile (`/providers/:id`)

- Back link top: "← Back to results"
- **Photo gallery hero:** 4-column × 2-row grid, h-96, rounded-3xl, gap-2. Big featured tile spans col-span-2 row-span-2, rest are smaller. Use gradient backgrounds with food emojis (🍽️ 🥗 🍰 🥂 🌮). "Show all 24 photos" button bottom-right of last tile.
- **Two-column layout below (2:1):**
  - **Main column:**
    - Name (font-serif 4xl) + ShieldCheck verified
    - Rating row + location + "Joined 2021"
    - Bio paragraph (text-lg, leading-relaxed)
    - **Services section:** 2-col grid of service cards (name + "From ₡X,XXX")
    - **Pricing tiers section:** 3-col grid (Essentials / Standard [popular] / Premium), each with name, price, feature checklist
    - **Reviews section:** stack of review cards (avatar initial + name + date + star row + review text). Show 3.
  - **Sidebar (sticky top-24):**
    - "ESTIMATED FOR YOUR EVENT" eyebrow
    - Big serif price
    - "35 guests · Standard tier"
    - **Three CTA buttons stacked:**
      1. WhatsApp (emerald-500, full-width, MessageCircle icon)
      2. "Request booking" (`accent`)
      3. "Get custom quote" (outline)
    - Below divider: response time, response rate, identity verified

---

### 5. User Dashboard (`/dashboard`)

- Welcome header: "WELCOME BACK" eyebrow + "Hello, [Name]." (font-serif 4xl)
- "+ New request" button top-right (`accent`)
- **Tabs row** (border-b, animated underline indicator using `layoutId="dash-tab"`):
  - Active requests (with count pill)
  - Conversations (with count pill)
  - Saved (with count pill)
  - Past bookings

**Active requests tab:** stack of request cards, each with emoji avatar, title, status text, time ago. Show "New" pill or "✓ Booked" pill where applicable.

**Conversations tab:** rounded-2xl container, divided rows. Each row: emoji avatar, name (bold if unread), last message preview (truncated), timestamp, unread dot (`accent`).

**Saved tab:** 3-column grid of provider cards: emoji, name, category, rating row.

**Past bookings tab:** empty state (Inbox icon + "No past bookings yet").

**Mock data:**

```js
const ACTIVE_REQUESTS = [
  {
    id: 1,
    title: "Catering for 35 people",
    status: "3 quotes received",
    time: "2h ago",
    emoji: "🍽️",
    new: true,
  },
  {
    id: 2,
    title: "DJ for Saturday night",
    status: "Waiting for replies",
    time: "5h ago",
    emoji: "🎧",
  },
  {
    id: 3,
    title: "AC repair — urgent",
    status: "Booked with TecnoFrío",
    time: "Yesterday",
    emoji: "❄️",
    booked: true,
  },
];

const CONVERSATIONS = [
  {
    name: "Sabor Catering Co.",
    last: "We can do Saturday at 6pm. Should I send a contract?",
    time: "2 min ago",
    emoji: "🍽️",
    unread: true,
  },
  {
    name: "DJ Mauricio",
    last: "Yes, the package includes lights. Confirmed for 8pm-12am.",
    time: "1h ago",
    emoji: "🎧",
    unread: true,
  },
  {
    name: "Studio Luz",
    last: "Sent you the portfolio — let me know what you think!",
    time: "Yesterday",
    emoji: "📸",
  },
  {
    name: "TecnoFrío",
    last: "Job complete. Thank you!",
    time: "3 days ago",
    emoji: "❄️",
  },
];

const SAVED = [
  {
    name: "Sabor Catering Co.",
    rating: 4.9,
    category: "Catering",
    emoji: "🍽️",
  },
  {
    name: "Studio Luz Photography",
    rating: 4.8,
    category: "Photography",
    emoji: "📸",
  },
  { name: "DJ Mauricio", rating: 4.7, category: "Music", emoji: "🎧" },
];
```

---

### 6. Provider Dashboard (`/provider`)

- Header: "PROVIDER WORKSPACE" eyebrow + business name (font-serif 4xl)
- **Plan badge** top-right: amber gradient pill: "👑 Pro plan · Upgrade"

**Stats grid (4 cards):**
| Label | Value | Change | Icon | Tone |
|-------|-------|--------|------|------|
| Response rate | 98% | +2% | Zap | emerald |
| Conversion | 34% | +5% | TrendingUp | indigo |
| Active leads | 12 | +3 | Inbox | amber |
| Earnings (Nov) | ₡2.4M | +18% | DollarSign | rose |

Each card: tinted icon square top-left, emerald change pill top-right, serif value, label below.

**Two-column lower section (2:3 ratio):**

**Left — Lead inbox:**

- "Incoming leads" header + Filter button
- Stack of lead cards (each clickable, selected one gets `accent` border + `surfaceMuted` bg)
- Card content: customer name + urgent rose pill if applicable, request preview, location + time

**Right — Lead detail panel:**

- Customer name (font-serif 2xl) + urgent badge
- Lead received timestamp
- Right-aligned: "Budget" + serif price
- **Request box** (`surfaceMuted`): "THE REQUEST" eyebrow, full request text, metadata pills (location, date, guests)
- **AI suggestion box** (indigo gradient): "Solvo suggests: Match to your 'Standard' tier (₡285k for 35 ppl). Customer has 92% likelihood of accepting based on similar past leads."
- **Action row:** "Accept & send quote" (`accent`, full-width) + "Reject" (outline) + chat icon button

**Below detail panel — weekly chart:**

- "Lead flow this week" title + "vs. last week" subtitle
- Bar chart (7 bars, indigo gradient, varying heights), day labels M T W T F S S underneath

**Lead mock data:**

```js
[
  {
    id: 1,
    customer: "Laura M.",
    request: "Catering for 35 people, Saturday Nov 15",
    budget: "₡300,000",
    time: "12 min ago",
    urgent: true,
    location: "Santa Ana",
  },
  {
    id: 2,
    customer: "Diego S.",
    request: "Corporate lunch — 60 people",
    budget: "₡480,000",
    time: "1h ago",
    location: "Escazú",
  },
  {
    id: 3,
    customer: "Patricia V.",
    request: "Wedding cocktail reception, 80 ppl",
    budget: "₡950,000",
    time: "3h ago",
    location: "Cariari",
  },
  {
    id: 4,
    customer: "Roberto F.",
    request: "Birthday — 25 people, casual",
    budget: "₡180,000",
    time: "5h ago",
    location: "Curridabat",
  },
];
```

---

## 🔌 Integration Rules

1. **Match the existing project's conventions** for file naming, exports (default vs named), prop types/TypeScript usage.
2. **Reuse existing primitives** if the project has Button, Input, Card, etc. Don't create parallel versions.
3. **Match the existing routing system.** If Next.js App Router → `app/page.tsx`, `app/search/page.tsx`, etc. If React Router → set up routes in the existing router config.
4. **Match existing state management.** If the project uses Zustand/Redux/Context, integrate with it. Otherwise, use local `useState`.
5. **Color tokens:** if the project has a Tailwind config with custom colors, extend it rather than replacing. Map indigo/stone/emerald/amber/rose to existing tokens if equivalents exist.
6. **Don't break existing pages.** New routes are additive.
7. **Preserve responsiveness:** mobile-first, works at 375px, scales up cleanly to 1440px+.

---

## ✅ Acceptance Criteria

The integration is done when:

- [ ] All 6 screens render and are reachable via the project's routing system
- [ ] Fonts load (Plus Jakarta Sans + Inter) and display headings render correctly
- [ ] Energy Orange appears on: primary CTAs, active states, the dashboard tab underline, the AI-recommended ribbon
- [ ] Creative Purple appears on: the AI interpretation card, recommended-card halo, sponsored ribbon, brand gradients
- [ ] Every screen is legible in BOTH light and dark mode, with no unthemed white panels
- [ ] The color-mode toggle persists across reloads and does not flash on load
- [ ] Emerald-500 appears ONLY on WhatsApp CTAs
- [ ] Loading state plays for ~1.8s when submitting a search
- [ ] Floating "Refine with AI" button works (opens chat, sends fake reply after 800ms)
- [ ] Tab underline animates when switching tabs in user dashboard
- [ ] Provider cards show staggered entrance animations
- [ ] Recommended provider card has the Creative Purple halo and the Energy Orange ribbon
- [ ] Package middle card is visually elevated (border + scale)
- [ ] Mobile: all screens are usable at 375px width with no horizontal scroll
- [ ] No console errors, no TypeScript errors (if TS), no failed imports

---

## 🚫 Things to NOT do

- Don't use generic Tailwind utilities like `shadow-md` or `shadow-lg` — use the custom soft shadows defined above
- Don't hardcode hex values. Every color must come from `solvoColors` / `solvoTints`, or dark mode silently breaks at that call site.
- Don't put white text on Energy Orange — it is 2.3:1 and fails WCAG AA. Use `solvoColors.accentFg`.
- Don't use `bg="white"` or `bg={solvoColors.text}` for surfaces and buttons. Those invert badly in dark mode; use `surface` and `accent`.
- Don't substitute the fonts. Plus Jakarta Sans and Inter are deliberate.
- Don't add icons that aren't in the spec. The lucide-react set is curated.
- Don't add bouncy/spring animations. Motion is restrained and editorial.
- Don't put emerald anywhere except WhatsApp buttons.
- Don't create new components if existing ones in the project can be extended.
- Don't break the project's existing build.

---

## 📞 If anything is ambiguous

Ask the user before proceeding. Better to clarify than to ship something off-spec. Specifically ask if you encounter:

- Conflicts between this spec and the existing project's design system
- Missing dependencies that the existing project can't easily add
- Routing patterns that don't fit the framework being used
- Existing components with the same names as ones in this spec

---

**End of handoff document. Build with care — the design is the product.**
