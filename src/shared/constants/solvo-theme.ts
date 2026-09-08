/**
 * Solvo design tokens.
 *
 * Every value here is a CSS custom property reference, not a literal. The
 * actual hexes live in `solvoThemeCss` below, declared once under `:root`
 * (light) and once under `[data-theme='dark']`. Because the JS objects only
 * ever hand out `var(--solvo-*)` strings, every component that reads
 * `solvoColors.x` becomes theme-reactive for free — the browser re-resolves
 * the variable when the `data-theme` attribute flips, with no re-render and
 * no `useColorMode` call at the consumer.
 *
 * Palette per the Solvo brand guidelines:
 *   Energy Orange  #FF8C00 — CTAs, active states, focal points
 *   Creative Purple #6F42C1 — brand identity, badges, structural framing
 *
 * Note on `accentFg`: white on Energy Orange is only 2.3:1, which fails WCAG
 * AA outright. Orange CTAs therefore carry a near-black label (7.2:1). This is
 * deliberate — it is the only way to keep the exact brand hex on buttons.
 */

// ── Colors ─────────────────────────────────────────────────────────────────

export const solvoColors = {
  // Surfaces
  bg: 'var(--solvo-bg)',
  surface: 'var(--solvo-surface)',
  surfaceMuted: 'var(--solvo-surface-muted)',
  border: 'var(--solvo-border)',
  /** Translucent canvas for sticky, blurred chrome such as the navbar. */
  surfaceTranslucent: 'var(--solvo-surface-translucent)',
  /** Backdrop behind modals and mobile drawers. */
  overlay: 'var(--solvo-overlay)',
  borderHover: 'var(--solvo-border-hover)',

  // Text
  text: 'var(--solvo-text)',
  textMuted: 'var(--solvo-text-muted)',
  textSubtle: 'var(--solvo-text-subtle)',

  // Energy Orange — primary accent: CTAs, active states, highlights
  accent: 'var(--solvo-accent)',
  accentHover: 'var(--solvo-accent-hover)',
  accentSoft: 'var(--solvo-accent-soft)',
  accentBorder: 'var(--solvo-accent-border)',
  accentText: 'var(--solvo-accent-text)',
  /** Label color for text sitting ON an accent fill. */
  accentFg: 'var(--solvo-accent-fg)',

  // Creative Purple — brand identity: badges, AI moments, structural framing
  brand: 'var(--solvo-brand)',
  brandHover: 'var(--solvo-brand-hover)',
  brandSoft: 'var(--solvo-brand-soft)',
  brandBorder: 'var(--solvo-brand-border)',
  brandMid: 'var(--solvo-brand-mid)',
  brandText: 'var(--solvo-brand-text)',
  /** Label color for text sitting ON a brand fill. */
  brandFg: 'var(--solvo-brand-fg)',

  /**
   * Legacy indigo keys from the pre-rebrand palette. They now resolve to the
   * Creative Purple family so untouched call sites stay on-brand. Prefer the
   * `brand*` names in new code.
   */
  indigo: 'var(--solvo-brand)',
  indigoLight: 'var(--solvo-brand-soft)',
  indigoBorder: 'var(--solvo-brand-border)',
  indigoMid: 'var(--solvo-brand-mid)',

  // Semantic status colors
  emerald: 'var(--solvo-emerald)',
  emeraldLight: 'var(--solvo-emerald-light)',
  emeraldText: 'var(--solvo-emerald-text)',
  amberLight: 'var(--solvo-amber-light)',
  amberText: 'var(--solvo-amber-text)',
  roseLight: 'var(--solvo-rose-light)',
  roseText: 'var(--solvo-rose-text)',
  successLight: 'var(--solvo-success-light)',
  successText: 'var(--solvo-success-text)',
};

/** Per-category tile gradients, keyed to the marketplace verticals. */
export const solvoTints = {
  events: { from: 'var(--solvo-tint-events-from)', to: 'var(--solvo-tint-events-to)' },
  home: { from: 'var(--solvo-tint-home-from)', to: 'var(--solvo-tint-home-to)' },
  business: { from: 'var(--solvo-tint-business-from)', to: 'var(--solvo-tint-business-to)' },
  beauty: { from: 'var(--solvo-tint-beauty-from)', to: 'var(--solvo-tint-beauty-to)' },
  auto: { from: 'var(--solvo-tint-auto-from)', to: 'var(--solvo-tint-auto-to)' },
};

/**
 * Atmospheric background glows — the large blurred orbs behind the hero and
 * the auth cards, and the brand's main source of depth. They carry more alpha
 * in dark mode, where a subtle tint simply vanishes against #0B0B16.
 */
export const solvoGlows = {
  brand: 'var(--solvo-glow-brand)',
  accent: 'var(--solvo-glow-accent)',
};

/**
 * The logo's orange-to-purple sweep, for hero emphasis text and brand
 * surfaces. Applied to text via `background-clip: text`.
 */
export const solvoGradients = {
  brand: 'var(--solvo-gradient-brand)',
};

export const solvoShadows = {
  cardRest: 'none',
  heroInput: 'var(--solvo-shadow-hero)',
  floatingPanel: 'var(--solvo-shadow-panel)',
  recommendedHalo: 'var(--solvo-shadow-halo)',
};

// ── Typography ─────────────────────────────────────────────────────────────

export const solvoFonts = {
  /** Plus Jakarta Sans — headings, display, prices, brand wordmark. */
  display: "'Plus Jakarta Sans', system-ui, sans-serif",
  /** Inter — body copy, UI chrome, everything else. */
  sans: "'Inter', system-ui, sans-serif",
  /**
   * Pre-rebrand alias for the display face (was Fraunces). Retained so the
   * existing `fontFamily={solvoFonts.serif}` call sites keep compiling.
   * Prefer `display` in new code.
   */
  serif: "'Plus Jakarta Sans', system-ui, sans-serif",
};

/** Type scale from the brand guidelines, §3. */
export const solvoType = {
  h1: { fontSize: '36px', lineHeight: '44px', fontWeight: 700 },
  h2: { fontSize: '28px', lineHeight: '36px', fontWeight: 600 },
  h3: { fontSize: '22px', lineHeight: '28px', fontWeight: 500 },
  body: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
  caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
};

export const solvoRadii = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
};

// ── The variable declarations themselves ───────────────────────────────────

/**
 * Injected once, globally, from `_app.tsx`. Light mode lives on `:root` so it
 * is the default even before the color-mode script runs; dark overrides only
 * the values that actually change.
 */
export const solvoThemeCss = `
:root {
  --solvo-bg: #F4F5F7;
  --solvo-surface: #FFFFFF;
  --solvo-surface-muted: #EDEFF3;
  --solvo-border: #E2E8F0;
  --solvo-border-hover: #CBD5E1;
  --solvo-surface-translucent: rgba(244, 245, 247, 0.82);
  --solvo-overlay: rgba(26, 26, 46, 0.45);
  --solvo-glow-brand: rgba(111, 66, 193, 0.22);
  --solvo-glow-accent: rgba(255, 140, 0, 0.18);
  --solvo-gradient-brand: linear-gradient(120deg, #FF8C00 0%, #6F42C1 100%);

  --solvo-text: #1A1A2E;
  --solvo-text-muted: #4A5568;
  --solvo-text-subtle: #626D79;

  --solvo-accent: #FF8C00;
  --solvo-accent-hover: #E67E00;
  --solvo-accent-soft: #FFF4E5;
  --solvo-accent-border: #FFD8A8;
  --solvo-accent-text: #C2410C;
  --solvo-accent-fg: #1A1A2E;

  --solvo-brand: #6F42C1;
  --solvo-brand-hover: #5D37A6;
  --solvo-brand-soft: #F1EBFB;
  --solvo-brand-border: #D9C9F5;
  --solvo-brand-mid: #9061F9;
  --solvo-brand-text: #5B34A4;
  --solvo-brand-fg: #FFFFFF;

  --solvo-emerald: #10B981;
  --solvo-emerald-light: #ECFDF5;
  --solvo-emerald-text: #047857;
  --solvo-amber-light: #FEF3C7;
  --solvo-amber-text: #B45309;
  --solvo-rose-light: #FFF1F2;
  --solvo-rose-text: #BE123C;
  --solvo-success-light: #ECFDF5;
  --solvo-success-text: #047857;

  /* Category tile tints — one pair per marketplace vertical. */
  --solvo-tint-events-from: #FFE4E6;
  --solvo-tint-events-to: #FED7AA;
  --solvo-tint-home-from: #E0F2FE;
  --solvo-tint-home-to: #C7D2FE;
  --solvo-tint-business-from: #D1FAE5;
  --solvo-tint-business-to: #CCFBF1;
  --solvo-tint-beauty-from: #FCE7F3;
  --solvo-tint-beauty-to: #FAE8FF;
  --solvo-tint-auto-from: #FEF3C7;
  --solvo-tint-auto-to: #FEF9C3;

  --solvo-shadow-hero: 0 20px 60px -15px rgba(26, 26, 46, 0.15);
  --solvo-shadow-panel: 0 25px 50px -12px rgba(11, 11, 22, 0.10);
  --solvo-shadow-halo: 0 0 0 4px rgba(111, 66, 193, 0.10);

  color-scheme: light;
}

[data-theme='dark'] {
  --solvo-bg: #0B0B16;
  --solvo-surface: #16162C;
  --solvo-surface-muted: #1E1E38;
  --solvo-border: #2D3748;
  --solvo-border-hover: #3E4A5F;
  --solvo-surface-translucent: rgba(11, 11, 22, 0.82);
  --solvo-overlay: rgba(0, 0, 0, 0.65);
  --solvo-glow-brand: rgba(144, 97, 249, 0.34);
  --solvo-glow-accent: rgba(255, 165, 51, 0.24);
  --solvo-gradient-brand: linear-gradient(120deg, #FFA533 0%, #B08CFC 100%);

  --solvo-text: #F8F9FA;
  --solvo-text-muted: #CBD5E0;
  --solvo-text-subtle: #A0AEC0;

  --solvo-accent: #FFA533;
  --solvo-accent-hover: #FFB85C;
  --solvo-accent-soft: #2A1F10;
  --solvo-accent-border: #4A3418;
  --solvo-accent-text: #FFA533;
  --solvo-accent-fg: #0B0B16;

  --solvo-brand: #9061F9;
  --solvo-brand-hover: #A47FFB;
  --solvo-brand-soft: #1E1633;
  --solvo-brand-border: #3B2A63;
  --solvo-brand-mid: #B08CFC;
  --solvo-brand-text: #B08CFC;
  --solvo-brand-fg: #0B0B16;

  --solvo-emerald: #34D399;
  --solvo-emerald-light: #0C2B22;
  --solvo-emerald-text: #6EE7B7;
  --solvo-amber-light: #2E2410;
  --solvo-amber-text: #FCD34D;
  --solvo-rose-light: #2E1620;
  --solvo-rose-text: #FDA4AF;
  --solvo-success-light: #0C2B22;
  --solvo-success-text: #6EE7B7;

  --solvo-tint-events-from: #3B1D22;
  --solvo-tint-events-to: #3E2A16;
  --solvo-tint-home-from: #14283A;
  --solvo-tint-home-to: #1E2447;
  --solvo-tint-business-from: #102E24;
  --solvo-tint-business-to: #123029;
  --solvo-tint-beauty-from: #331A2A;
  --solvo-tint-beauty-to: #2C1B38;
  --solvo-tint-auto-from: #33290F;
  --solvo-tint-auto-to: #332E12;

  --solvo-shadow-hero: 0 20px 60px -15px rgba(0, 0, 0, 0.55);
  --solvo-shadow-panel: 0 25px 50px -12px rgba(0, 0, 0, 0.50);
  --solvo-shadow-halo: 0 0 0 4px rgba(144, 97, 249, 0.22);

  color-scheme: dark;
}
`;
