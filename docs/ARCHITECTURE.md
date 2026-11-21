# Solvo web — Architecture

Next.js 16 (pages router) + Chakra UI v3 + Apollo Client. Talks only to the
GraphQL API in `dne-backend` (plus `POST /files/upload` for photos). API docs:
`../dne-backend/docs/ARCHITECTURE.md`.

## What the app is

1. **Chat (`/`)** — a person writes what they need ("fontanero en Heredia",
   "pan dulce cerca de mí"). Solvo replies and shows a card for every real
   supplier in the DB that serves that province, with direct contact links.
   Works without an account.
2. **Supplier profile (`/providers/[id]`)** — public: info, photos, services
   with "from" prices, provinces served, contact links, rating and reviews.
   Signed-in customers can leave one review per supplier.
3. **My business (`/provider`)** — the supplier edits everything the chat uses
   to find them: description, categories (1–5), specialties (AI can suggest),
   province + provinces served, contacts, services, photos. Shows contacts
   received and verification status.
4. **My contacts (`/dashboard`)** — signed-in customers: suppliers they
   contacted ("saved interactions") and "How did it go?" review prompts.
5. **Admin (`/admin`)** — analytics, verification queue, preferred suppliers.
6. Account & auth: `/profile`, `/login`, `/register`, `/complete-profile`
   (after Google/GitHub), `/forgot-password`, `/reset-password/[token]`.

Removed routes (`/requests`, `/quotes`, `/calendar`, `/bookings`,
`/messages`, `/packages`, `/provider/settings`) redirect in `next.config.ts`.
Their code is on the `archive/pre-mvp-simplification` branch.

## Folder map

```
src/pages/                 one file per route (see above)
src/shared/
  components/
    atoms/                 Box, Flex, Text, … (thin Chakra wrappers)
    molecules/             Logo, ColorModeToggle, SupplierCard, ContactLinks,
                           SocialAuthButtons, PasswordField, AccountTypePicker
    organisms/             SolvoNavBar, ChatSidebar, ChatThread, ChatComposer
    ui.tsx                 shared form/card primitives: TextField, Btn, Card,
                           Notice, PageTitle, Stars, StarInput, Chip, AuthShell
  i18n/                    messages.es.ts (source), messages.en.ts, useI18n
  lib/                     supplier.ts (card shape, contact links, prices),
                           chat.ts (UiMessage), api.ts (uploads, media URLs)
  services/                ai.service (intent parser), conversation.service
                           (persisted chats), contact.service (lead logging)
  contexts/                AuthProvider (JWT in localStorage '@token'), NextAuth bridge
  queries/*.graphql        every GraphQL operation → codegen
  generated/               graphql-schema.tsx (codegen output, don't edit)
  constants/solvo-theme.ts design tokens (CSS variables, light/dark)
```

## A chat turn (`src/pages/index.tsx` → `handleSend`)

```
user message
  │
  ├─ parseQueryWithAi(current, earlier[])          aiComplete (Claude → Gemini)
  │     → intent: service_request | network_inquiry | chat
  │     → service ("fontanero"), location ("Heredia" — only if typed)
  │
  ├─ service_request ─ runSearch()                  searchSuppliers
  │     query = service
  │     location = typed place      (wins)
  │     province = zone picked in the "Zona" selector
  │     lat/lng = device position   (if no place typed and zone = device)
  │     → { province, suppliers[] }  (strict to that province, ≤ 10)
  │
  ├─ sendAiMessage(system = grounding block)        reply persisted server-side
  │     "## Search result: zone Heredia, 2 cards: …name|serves|phone…"
  │
  └─ render reply + one SupplierCard per supplier (zero results = zero cards)
```

- **network_inquiry** ("¿tienen electricistas en Cartago?") searches the same
  way but answers in text, no cards.
- **chat** (questions about suppliers already shown) grounds the reply on the
  last cards shown.
- Several services in one message → one search + reply per service.
- "Contact" on a card logs a `CHAT_CONTACT` lead and shows the supplier's
  contact links inline; every link tap logs its channel too.
- Stop button aborts all in-flight requests and rolls the turn back.
- The cards under a reply are saved (`providers_json`) so reloads show them.

### Zone (province) selection

`ZoneState` in `ChatComposer`:

| Mode | When | Sent to search |
|---|---|---|
| `device` | default; browser geolocation granted | `lat/lng` (API maps to nearest canton → province) |
| `picked` | user chose a province in the selector | `province` code |
| `none` | "Todo el país", or location denied and nothing picked | nothing → nationwide |

The choice is remembered in `localStorage['solvo:zone']`. A place typed in the
message always beats the selector for that turn.

## Languages

`src/shared/i18n`. Spanish is the default and the source dictionary; English
must mirror it (TypeScript type + a unit test check the keys).

- First visit: `localStorage['solvo:lang']` → browser language
  (`navigator.languages`) → Spanish. `<I18nBoot/>` in `_app` applies it after
  hydration (server render is always Spanish, so markup matches).
- The ES/EN switch in the nav saves the choice; `/profile` also saves it on
  the account (`updateMe.language`).
- Use `const { t, messages, lang, locale } = useI18n()`;
  `t('chat.browse', { zone })` interpolates `{zone}`.
- The AI replies in the language of the user's message, independent of the UI.

## Auth

Customers never need an account. `AuthProvider` keeps the API JWT in
`localStorage['@token']`, renews it every 15 min / on tab focus, and after
login merges this device's guest chats and contacts into the account
(`mergeGuestData`). Google/GitHub go through NextAuth (`/api/auth`), which
exchanges the provider token for the API JWT; brand-new social users are sent
to `/complete-profile` to choose customer or supplier.

## GraphQL workflow

1. Add/edit an operation in `src/shared/queries/*.graphql`.
2. With the API running on :5000: `npm run generate-graphql-schema`.
3. Import the generated hook from `@generated`.

Apollo normalizes entities by `<entity>Id` (`_app.tsx` `typePolicies`).
