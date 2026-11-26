# CLAUDE.md — Solvo web

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) first. API side:
`../dne-backend/CLAUDE.md`.

## Product in one paragraph

Solvo only connects a customer with a supplier (services like plumbing or DJs,
or products/materials like bread or cement). The AI chat finds the **real**
suppliers in the DB that serve the customer's **province** (typed place →
picked zone → device location) and shows their contact details; the customer
contacts them directly. No bookings, quotes, payments or in-app messaging.
Customers don't need an account (signing in only adds saved contacts and
reviews). Suppliers edit their page at `/provider`; admins use `/admin`.

## Rules that matter

- **Never show invented suppliers.** Cards come only from `searchSuppliers`;
  zero results → zero cards and an honest reply.
- **No AI logic in the browser.** A chat turn is one `chatTurn` call
  (`src/shared/services/chat.service.ts`); prompts, intent rules and the
  model (Claude, Gemini fallback) live in `dne-backend/src/api/assistant`.
  Never send a prompt from the client.
- **Keep it minimal.** No supplier photos, bookings, quotes or in-app chat —
  removed on purpose (old code on `archive/pre-mvp-simplification`).
- **Every user-facing string goes through i18n** (`useI18n().t`). Spanish is
  the source (`src/shared/i18n/messages.es.ts`, "usted" register), English
  mirrors it (`messages.en.ts`) — the type and `npm test` enforce identical keys.
- **Contact taps are leads.** Use `<ContactLinks>` (it logs the contact);
  don't render raw `tel:` / `mailto:` links for suppliers.
- **Ownership is server-side.** `my…` mutations take no supplier/user id.
- **GraphQL only through codegen**: add operations to
  `src/shared/queries/*.graphql`, then `npm run generate-graphql-schema`.
- Shared form/card primitives live in `src/shared/components/ui.tsx`
  (`TextField`, `Btn`, `Card`, `Notice`, `PageTitle`, `Chip`, `Stars`…).

## Commands

```bash
npm run dev                       # :3000, API must run on :5000
npx tsc --noEmit                  # type-check
npm test                          # unit tests
npm run generate-graphql-schema   # after API schema changes (API running)
npm run build                     # production build
```

Testing in the Claude browser pane: show the pane first — `next dev` only
hydrates when the page gets animation frames.

## Workflow

New branch per piece of work, commit and push; the team opens PRs themselves.

## 🎨 Design System

Source of truth: `src/shared/constants/solvo-theme.ts` — read it before
styling anything.

### Aesthetic direction

**Confident, energetic, modern.** Clean geometric sans, generous whitespace,
and a two-color brand system: kinetic orange against intellectual purple.
Depth comes from hairline borders and soft shadows, not heavy elevation.

### How theming works

Every token in `solvoColors` is a `var(--solvo-*)` reference, never a literal.
The hexes are declared once in `solvoThemeCss` under `:root` (light) and
`[data-theme='dark']`, injected globally from `_document.tsx`. **Any component
reading `solvoColors.x` is automatically theme-reactive.** The mode is resolved
before first paint by an inline script in `_document.tsx` (localStorage →
`prefers-color-scheme` → light), so there is no flash.

### Color palette

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

`emerald` is reserved for WhatsApp and success; `amber` and `rose` are
status-only.

**Contrast rule:** white on Energy Orange is 2.3:1 and fails WCAG AA. Orange
fills always take `accentFg`.

### Typography

- **Display / headings:** Plus Jakarta Sans (600/700/800), `letter-spacing: -0.02em` — `solvoFonts.display`
- **UI / body:** Inter (400/500/600/700) — `solvoFonts.sans`
- Emphasis uses weight + brand color, not italic.

### Logo

`<Logo />` pairs the 'S' mark (`public/assets/brand/logo-192.png`) with live
"Solvo" text in Plus Jakarta Sans 800. Minimum 120px for the lockup, 24px for
the icon alone.

### Shape, elevation, motion

- Radius: 16px cards, 24px hero/feature cards, full for pills and avatars.
- Cards at rest: `border` token, no shadow. Floating panels: `solvoShadows.floatingPanel`.
- Motion (framer-motion): fades `y: 8→0` ~0.25–0.3s, staggered card reveals
  `delay: i * 0.06`. No bouncy springs or scale pulses.

## 🚫 Things to NOT do

- Don't hardcode hex values. Every color comes from `solvoColors`, or dark mode breaks.
- Don't put white text on Energy Orange — use `solvoColors.accentFg`.
- Don't use `bg="white"` for surfaces; use `surface`.
- Don't substitute the fonts.
- Don't put emerald anywhere except WhatsApp/success.
- Don't hardcode UI text — add it to both dictionaries.
- Don't create a new component if `ui.tsx`, a molecule or an organism can be extended.
- Don't break the build: run `npx tsc --noEmit` and `npm test` before committing.
