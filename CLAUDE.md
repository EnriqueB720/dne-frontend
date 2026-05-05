# 🎨 TULA — UI Handoff Document for Claude Code

> **Purpose of this document:** This is a complete specification for replicating the Tula web app UI inside an existing project. Read it fully before writing any code. The goal is to produce a UI that is _visually and functionally identical_ to the reference implementation, while integrating cleanly with the existing project's component architecture, styling system, and conventions.

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

**Tula** is an AI-powered service marketplace (think Thumbtack + Yelp + AI concierge + WhatsApp simplicity). Users describe what they need in natural language; the system interprets intent and returns curated providers, pricing tiers, and bundled package solutions. Core principle: _"I just ask for what I need, and Tula figures it out for me."_

**Six screens to build:**

1. Landing page
2. Search / AI results page
3. Package view (bundled solutions)
4. Provider profile
5. User dashboard
6. Provider dashboard (B2B)

---

## 🎨 Design System

### Aesthetic direction

**Refined editorial** — Stripe Press meets Airbnb. Warm minimalism, not stark white SaaS. Confident typography. Generous whitespace. Single accent color used sparingly. Soft atmospheric depth via blurred gradients, not flat color blocks.

### Color palette

Use stone/neutral as the canvas (not pure white), indigo as the singular accent, emerald reserved exclusively for the WhatsApp CTA.

```
Background canvas:  stone-50    (#FAFAF9) — main app background
Surface:            white       — cards, panels
Borders:            stone-200   — subtle dividers
Body text:          stone-900   — primary text
Muted text:         stone-600   — secondary
Subtle text:        stone-500   — tertiary, captions
Accent (primary):   indigo-700  — links, hovers, AI elements
Accent (CTA dark):  stone-900   — primary buttons
WhatsApp green:     emerald-500 — ONLY for WhatsApp contact CTAs
Warning/premium:    amber-100/700 — premium tags, plan badges
Urgent:             rose-50/700 — urgent flags
Success:            emerald-50/600 — checkmarks, positive deltas
```

### Typography

**Two-font system. Do not substitute.**

- **Display / headlines:** Fraunces (serif, opsz, italic variants used)
  - Used for: hero headlines, section titles, prices, profile names
  - Load via Google Fonts
- **UI / body:** Inter (sans-serif, weights 400/500/600/700)
  - Used for: everything else
  - Load via Google Fonts

```html
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

```css
.font-serif {
  font-family: "Fraunces", Georgia, serif;
  font-optical-sizing: auto;
}
.font-sans {
  font-family: "Inter", system-ui, sans-serif;
}
```

Use `italic` styling on the serif for emphasis phrases (e.g., _"Tula finds"_).

### Shape & elevation

- **Border radius:** `rounded-2xl` (16px) for cards, `rounded-3xl` (24px) for hero/feature cards, `rounded-full` for pills and avatars
- **Shadows:** Avoid generic `shadow-lg`. Use custom soft shadows:
  - Cards at rest: `border border-stone-200` (no shadow)
  - Cards hover: `border-stone-300`, optional `-translate-y-0.5`
  - Hero input: `shadow-[0_20px_60px_-15px_rgba(30,27,75,0.15)]`
  - Floating panels: `shadow-2xl shadow-stone-900/10`

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

- `<Logo />` — sparkles icon in indigo gradient square + "Tula" wordmark in serif
- `<NavBar />` — sticky top, blurred backdrop, logo left, nav center, avatar right
- `<Pill />` — small rounded badge, accepts `tone` prop: `default | indigo | amber | emerald | rose | dark`
- `<ProviderCard />` — used on results page
- `<PackageCard />` — used on packages page
- `<LoadingState />` — used during AI "thinking"
- `<RefineFooter />` — floating chat assistant (bottom-right)

---

## 📱 Screen-by-Screen Specification

### 1. Landing Page (`/`)

**Layout structure:**

- Atmospheric background: two blurred radial gradients (indigo top-right, amber bottom-left), absolute positioned, `-z-10`, `pointer-events-none`
- Hero section (centered, max-width 5xl)
- Conversational input box (centered, max-width 2xl)
- Suggested prompt chips (wrap, centered)
- Trust strip (3-column grid with hairline dividers)
- Categories grid (5-column on desktop)
- Footer

**Hero specifics:**

- Small status badge above headline: pulsing emerald dot + "AI concierge · 12,400+ verified providers"
- Headline (font-serif, 5xl→7xl, leading-tight): **"Ask for anything."** newline **"_Tula finds_ who solves it."** — italic + indigo on "Tula finds"
- Subhead: "Describe what you need in your own words. We match you with the right people, instantly."

**Input box specifics:**

- Rounded-3xl, white, soft shadow, contains:
  - Multiline textarea, placeholder: _"I need catering for 40 people this Saturday..."_
  - Bottom row: paperclip icon, mic icon, "Press ⏎ to send" hint (right-aligned)
  - "Find options" button on the right: stone-900 bg, rounded-2xl, arrow-right icon, hover:bg-indigo-700
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

Style: white bg, stone-200 border, hover:border-indigo-300 hover:bg-indigo-50/50

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

Each card: white bg, stone-200 border, gradient tinted icon square (12×12, rounded-xl), hover lifts -0.5.

---

### 2. Search Results (`/search` or `/results`)

**Top section:**

- Tiny "Your request" label + "Refine" toggle (Edit3 icon)
- Display query in font-serif, 2xl-3xl, in quotes. When refining, swap for input + "Update" button.

**AI interpretation card:**

- Gradient background: `from-indigo-50 via-white to-stone-50`
- Border: `border-indigo-100`, rounded-2xl, padding 5
- Indigo sparkles icon in rounded square
- Label: "VINI UNDERSTOOD" → change to **"TULA UNDERSTOOD"** (uppercase, tracking-wider, indigo-700)
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
- Rotating square border (indigo-200 with indigo-600 top), Sparkles icon centered
- Headline: "Tula is finding the best options..."
- Three checkmark items appearing with delay: "Reading your request" → "Matching with 12,400 providers" → "Ranking by fit & response time"

**Results header:**

- Left: "{N} options found" + "Sorted by AI relevance for your request"
- Right: "Filters" button (SlidersHorizontal icon) + "See packages" button (stone-900, sparkles icon)

**Provider card structure:**

- Rounded-3xl, white, padding 5-6
- **Recommended card:** indigo-300 border + soft indigo halo: `shadow-[0_0_0_4px_rgba(79,70,229,0.06)]`
- Recommended ribbon: `-top-3 left-6`, stone-900 bg pill: "✨ AI Recommended · Best match"
- Layout: avatar/price column (md:48 wide) + body
- Body shows: name + ShieldCheck (if verified), rating row (star + reviews + location + response time), checklist of 4 inclusions in 2-col grid, tags as Pills, action row
- Action row: "View profile" (text), "WhatsApp" button (emerald-500, MessageCircle icon), "Select" button (stone-900, ArrowRight icon)

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

- Closed state: pill button bottom-right, stone-900 bg, "✨ Refine with AI"
- Open state: 80-wide panel, rounded-3xl, header (indigo gradient strip with sparkles avatar + "Tula Assistant" + online dot + close X), message list (max-h-72, scrollable), input + send button
- Initial AI message: "Want me to refine these results? I can adjust budget, location, dietary needs, or add more services."
- User send → fake AI reply after 800ms: "Got it — I'll update the results to focus on that. Anything else to adjust?"

---

### 3. Packages View (`/packages`)

**Header:**

- Tiny indigo "✨ Curated by Tula AI" label
- Headline: "Complete solutions, _not just providers._" (italic + indigo on second line)
- Subhead: "Three thoughtfully bundled packages for '[query]'. One contract, one payment, zero coordination."

**Three package cards in 3-column grid:**

- Middle card (Balanced) is featured: stone-900 border, scaled 1.02, deep shadow
- Each card: emoji header, "BIRTHDAY PACKAGE" eyebrow, serif tier name (Essentials/Balanced/Premium), price (serif 3xl), "save ₡XX,XXX" in emerald
- Expandable "What's included" section (chevron rotates 180°), revealing line items in stone-50 rows with emoji + label + price
- Two buttons: "Book this package" (stone-900 if featured, stone-100 otherwise) + "Customize package" (outline)

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

- Indigo gradient strip: "Want something else entirely? Tell Tula what to add or remove and we'll rebuild your package in seconds." + "Customize" button.

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
      2. "Request booking" (stone-900)
      3. "Get custom quote" (outline)
    - Below divider: response time, response rate, identity verified

---

### 5. User Dashboard (`/dashboard`)

- Welcome header: "WELCOME BACK" eyebrow + "Hello, [Name]." (font-serif 4xl)
- "+ New request" button top-right (stone-900)
- **Tabs row** (border-b, animated underline indicator using `layoutId="dash-tab"`):
  - Active requests (with count pill)
  - Conversations (with count pill)
  - Saved (with count pill)
  - Past bookings

**Active requests tab:** stack of request cards, each with emoji avatar, title, status text, time ago. Show "New" pill or "✓ Booked" pill where applicable.

**Conversations tab:** rounded-2xl container, divided rows. Each row: emoji avatar, name (bold if unread), last message preview (truncated), timestamp, unread dot (indigo-600).

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
- Stack of lead cards (each clickable, selected one gets stone-900 border + stone-50 bg)
- Card content: customer name + urgent rose pill if applicable, request preview, location + time

**Right — Lead detail panel:**

- Customer name (font-serif 2xl) + urgent badge
- Lead received timestamp
- Right-aligned: "Budget" + serif price
- **Request box** (stone-50): "THE REQUEST" eyebrow, full request text, metadata pills (location, date, guests)
- **AI suggestion box** (indigo gradient): "Tula suggests: Match to your 'Standard' tier (₡285k for 35 ppl). Customer has 92% likelihood of accepting based on similar past leads."
- **Action row:** "Accept & send quote" (stone-900, full-width) + "Reject" (outline) + chat icon button

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
- [ ] Fonts load (Fraunces + Inter) and serif headlines render correctly
- [ ] Indigo accent appears in: AI interpretation card, recommended provider halo, hover states, "Tula" wordmark in italic headlines
- [ ] Emerald-500 appears ONLY on WhatsApp CTAs
- [ ] Loading state plays for ~1.8s when submitting a search
- [ ] Floating "Refine with AI" button works (opens chat, sends fake reply after 800ms)
- [ ] Tab underline animates when switching tabs in user dashboard
- [ ] Provider cards show staggered entrance animations
- [ ] Recommended provider card has the indigo halo and ribbon
- [ ] Package middle card is visually elevated (border + scale)
- [ ] Mobile: all screens are usable at 375px width with no horizontal scroll
- [ ] No console errors, no TypeScript errors (if TS), no failed imports

---

## 🚫 Things to NOT do

- Don't use generic Tailwind utilities like `shadow-md` or `shadow-lg` — use the custom soft shadows defined above
- Don't add purple. The accent is **indigo**, not purple. Don't gradient them together.
- Don't substitute the fonts. Fraunces and Inter are deliberate.
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
