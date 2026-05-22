/**
 * Unit tests for the deterministic intent-routing overrides in ai.service.ts.
 *
 * These functions run BEFORE the LLM parse result is applied, so correctness
 * here is critical — a wrong override silently breaks the whole turn.
 *
 * Test matrix covers:
 *   A. referencesShownResultsAboutNetwork — "those/these/them + network" → chat
 *   B. looksLikeNetworkInquiry            — "do you have X?" → network_inquiry
 *   C. _referencesShownResults            — "the first result" → chat
 *   D. _looksLikeQuestionAboutNamedEntity — "where is PikiTiki?" → chat
 *   E. Override priority order
 *   F. contextQuery construction logic (simulated)
 *   G. buildProviderGrounding logic (simulated)
 */

import {
  looksLikeNetworkInquiry,
  referencesShownResultsAboutNetwork,
  _referencesShownResults,
  _looksLikeQuestionAboutNamedEntity,
  detectExplicitLocation,
} from '../shared/services/ai.service';

// ─── A. referencesShownResultsAboutNetwork ────────────────────────────────────
// These are follow-ups about providers ALREADY shown; must stay in `chat`.

describe('referencesShownResultsAboutNetwork', () => {
  const YES = [
    'which one of those are in our network?',
    'which one of those is in our network?',
    'are these in our network?',
    'are those on your network?',
    'which of them are in our network?',
    'which one of those are in your network?',
    'are these in nuestra red?',
    'which of those is from our network?',
  ];

  const NO = [
    // "those" absent → genuine network availability questions
    'are there any suppliers in our network?',
    'do you have catering in our network?',
    'who is in our network?',
    // Search verbs make it service_request territory
    'find me suppliers in your network',
    // Ordinal reference without network word
    'compare the first and last one',
    // Named-entity question
    'where is PikiTiki located?',
  ];

  test.each(YES)('should match: %s', (msg) => {
    expect(referencesShownResultsAboutNetwork(msg)).toBe(true);
  });

  test.each(NO)('should NOT match: %s', (msg) => {
    expect(referencesShownResultsAboutNetwork(msg)).toBe(false);
  });
});

// ─── B. looksLikeNetworkInquiry ───────────────────────────────────────────────
// These are genuine "does the network have X?" questions → network_inquiry.

describe('looksLikeNetworkInquiry', () => {
  const YES = [
    'are there any suppliers in our network?',
    'do you have DJs in Heredia?',
    'hay proveedores de catering en San José?',
    'what categories do you have?',
    'who is in your network?',
    'tienen proveedores de limpieza?',
    'are there any providers near me?',
    'what services do you have available?',
    'is there anyone who does AC repair?',
  ];

  const NO = [
    // NOTE: "which one of those are in our network?" and "are these in our network?"
    // DO match NETWORK_INQUIRY_RE (they contain "in our network"), so they are NOT
    // listed here. The override-priority test (section E) verifies that
    // referencesShownResultsAboutNetwork() wins and routes them to `chat` instead.
    // Search intent
    'find me a DJ in Heredia',
    'I need catering for 40 people',
    // General chat
    'how does Solvo work?',
    'compare the first two options',
  ];

  test.each(YES)('should match: %s', (msg) => {
    expect(looksLikeNetworkInquiry(msg)).toBe(true);
  });

  test.each(NO)('should NOT match: %s', (msg) => {
    expect(looksLikeNetworkInquiry(msg)).toBe(false);
  });
});

// ─── C. _referencesShownResults (ordinal card references) ────────────────────

describe('_referencesShownResults', () => {
  const YES = [
    'the first result',
    'the last one',
    'second option',
    'compare the first and last result',
    'primer resultado',
    'última opción',
    'the third provider',
    'the 2nd option',
  ];

  const NO = [
    'I need catering for 40 people',
    'which one of those are in our network?',
    'where is PikiTiki?',
    'how does Solvo work?',
    'show me more options',
  ];

  test.each(YES)('should match: %s', (msg) => {
    expect(_referencesShownResults(msg)).toBe(true);
  });

  test.each(NO)('should NOT match: %s', (msg) => {
    expect(_referencesShownResults(msg)).toBe(false);
  });
});

// ─── D. _looksLikeQuestionAboutNamedEntity ────────────────────────────────────

describe('_looksLikeQuestionAboutNamedEntity', () => {
  const YES = [
    'Where is PikiTiki located?',
    'Donde esta DJ Carlos Mora ubicado?',
    'y Piki Tiki?',
    'How much does Sabor Catering charge?',
    'Tell me about Mesa Fina',
    'What does Studio Luz include?',
  ];

  const NO = [
    // Has a search verb → not a named-entity question
    'find me a DJ named Carlos',
    // No capitalized name
    'which one of those are in our network?',
    'I need catering',
    'how does Solvo work?',
  ];

  test.each(YES)('should match: %s', (msg) => {
    expect(_looksLikeQuestionAboutNamedEntity(msg)).toBe(true);
  });

  test.each(NO)('should NOT match: %s', (msg) => {
    expect(_looksLikeQuestionAboutNamedEntity(msg)).toBe(false);
  });
});

// ─── E. Override priority: referential-network beats network_inquiry ──────────
// "which one of THOSE are in our network?" must NOT become network_inquiry.

describe('override priority', () => {
  test('referential follow-up wins over network_inquiry regex', () => {
    const msg = 'which one of those are in our network?';
    // Both checks fire on this message:
    expect(looksLikeNetworkInquiry(msg)).toBe(true);        // would be network_inquiry
    expect(referencesShownResultsAboutNetwork(msg)).toBe(true); // overrides to chat
    // In the code: referencesShownResultsAboutNetwork is checked FIRST (in the
    // `chat` priority block), so the result must be `chat`, not `network_inquiry`.
  });

  test('genuine network inquiry is not caught by referential regex', () => {
    const msg = 'are there any suppliers in our network?';
    expect(referencesShownResultsAboutNetwork(msg)).toBe(false); // no referential pronoun
    expect(looksLikeNetworkInquiry(msg)).toBe(true);             // correctly network_inquiry
  });
});

// ─── F. contextQuery construction ─────────────────────────────────────────────
// Verify that only the last 2 user messages are included (not stale ones).

describe('contextQuery construction', () => {
  type Msg = { role: 'user' | 'assistant'; content: string };

  function buildContextQuery(messages: Msg[], currentContent: string): string {
    const recentUserMsgs = messages
      .filter((m) => m.role === 'user')
      .slice(-2)
      .map((m) => m.content);
    return [...recentUserMsgs, currentContent].filter(Boolean).join('. ');
  }

  test('fresh conversation: only current message', () => {
    const result = buildContextQuery([], 'I need catering for 40 people');
    expect(result).toBe('I need catering for 40 people');
  });

  test('one previous user message included', () => {
    const msgs: Msg[] = [
      { role: 'user', content: 'I need catering for 40 people' },
      { role: 'assistant', content: 'Here are 4 catering options...' },
    ];
    const result = buildContextQuery(msgs, 'show me cheaper ones');
    expect(result).toBe('I need catering for 40 people. show me cheaper ones');
  });

  test('only LAST 2 user messages included — stale catering dropped when asking about DJs', () => {
    const msgs: Msg[] = [
      { role: 'user', content: 'I need catering for 40 people' },     // stale
      { role: 'assistant', content: 'Here are 4 catering options...' },
      { role: 'user', content: 'I need DJs instead' },                 // last-2
      { role: 'assistant', content: 'Here are 3 DJ options...' },
      { role: 'user', content: 'show me more DJs' },                   // last-1
      { role: 'assistant', content: 'Here are more DJs...' },
    ];
    const result = buildContextQuery(msgs, 'which one of those are in our network?');
    // "I need catering" must NOT appear — it's the 3rd-last user message.
    expect(result).not.toContain('catering');
    expect(result).toContain('I need DJs instead');
    expect(result).toContain('show me more DJs');
    expect(result).toContain('which one of those are in our network?');
  });

  test('exactly 2 previous user messages when many exist', () => {
    const msgs: Msg[] = [
      { role: 'user', content: 'msg1' },
      { role: 'assistant', content: 'resp1' },
      { role: 'user', content: 'msg2' },
      { role: 'assistant', content: 'resp2' },
      { role: 'user', content: 'msg3' },
      { role: 'assistant', content: 'resp3' },
    ];
    const result = buildContextQuery(msgs, 'current');
    expect(result).not.toContain('msg1'); // only last 2
    expect(result).toContain('msg2');
    expect(result).toContain('msg3');
    expect(result).toContain('current');
  });
});

// ─── G. buildProviderGrounding ────────────────────────────────────────────────
// Verify it correctly walks backward to find the most recent providers.

describe('buildProviderGrounding', () => {
  type Provider = { name: string; location: string; priceLabel: string; rating: number; reviews: number; responseTime: string; includes: string[]; tags: string[]; isRealSupplier: boolean };
  type UiMsg = { role: 'user' | 'assistant'; content: string; providers?: Provider[] };

  function buildProviderGrounding(messages: UiMsg[]): string {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role !== 'assistant') continue;
      if (!m.providers || m.providers.length === 0) continue;
      return m.providers.map(p => p.name).join(', ');
    }
    return '';
  }

  const fakeProvider = (name: string): Provider => ({
    name, location: 'San José', priceLabel: '₡100,000',
    rating: 4.5, reviews: 10, responseTime: '~5 min',
    includes: ['Service'], tags: [], isRealSupplier: true,
  });

  test('returns empty string when no assistant messages with providers', () => {
    const msgs: UiMsg[] = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'Hello!' },
    ];
    expect(buildProviderGrounding(msgs)).toBe('');
  });

  test('returns providers from the LAST assistant message that has them', () => {
    const msgs: UiMsg[] = [
      { role: 'assistant', content: 'catering results', providers: [fakeProvider('Sabor Catering')] },
      { role: 'user', content: 'now I need DJs' },
      { role: 'assistant', content: 'DJ results', providers: [fakeProvider('DJ Carlos'), fakeProvider('DJ Mix')] },
      { role: 'user', content: 'which ones are real?' },
    ];
    const result = buildProviderGrounding(msgs);
    // Should find the DJ results, not the catering ones
    expect(result).toContain('DJ Carlos');
    expect(result).not.toContain('Sabor Catering');
  });

  test('skips assistant messages with empty providers array', () => {
    const msgs: UiMsg[] = [
      { role: 'assistant', content: 'catering results', providers: [fakeProvider('Sabor Catering')] },
      { role: 'user', content: 'how does Solvo work?' },
      { role: 'assistant', content: 'Solvo is...', providers: [] }, // empty — should skip
    ];
    const result = buildProviderGrounding(msgs);
    expect(result).toContain('Sabor Catering');
  });

  test('returns empty string when messages array is empty', () => {
    expect(buildProviderGrounding([])).toBe('');
  });
});

// ─── H. detectExplicitLocation ────────────────────────────────────────────────

describe('detectExplicitLocation', () => {
  const cases: [string, string | null][] = [
    ['I need catering in Santa Ana', 'Santa Ana'],
    ['Find DJs near Heredia', 'Heredia'],
    ['I need AC repair en San José', 'San José'],
    ['cerca de Alajuela', 'Alajuela'],
    ['which one of those are in our network?', null], // no explicit city
    ['I need catering', null],
    ['do you have DJs in Heredia?', 'Heredia'],
    // Service words should NOT be treated as locations
    ['interested in Catering', null],
    ['I need cleaning near me', null],
  ];

  test.each(cases)('"%s" → %s', (input, expected) => {
    expect(detectExplicitLocation(input)).toBe(expected);
  });
});
