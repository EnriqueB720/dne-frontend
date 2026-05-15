import { gql } from '@apollo/client';
import type { ModelKey } from '../jotai/ai-usage.atom';
import type { ProviderData } from '@components';
import type { DeviceLocation } from '@hooks';
import { getApolloClient } from './apollo.client';

/**
 * Stateless model completion over GraphQL (the `aiComplete` mutation —
 * replaces the legacy `POST /chat` REST call). `cachedSystem` carries the
 * stable base prompt so the backend can mark it for provider-side prompt
 * caching; `system` is reserved for any per-call dynamic context.
 */
const AI_COMPLETE = gql`
  mutation aiComplete($data: AiCompletionInput!) {
    aiComplete(data: $data) {
      content
      model
      usage {
        inputTokens
        outputTokens
      }
    }
  }
`;

interface AiCompleteResult {
  content: string;
  model: ModelKey;
  usage?: ChatUsage;
}

async function runCompletion(
  model: ModelKey,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  opts: { system?: string; cachedSystem?: string; signal?: AbortSignal } = {},
): Promise<AiCompleteResult> {
  const { data, errors } = await getApolloClient().mutate<{
    aiComplete: { content: string; model: ModelKey; usage?: ChatUsage };
  }>({
    mutation: AI_COMPLETE,
    variables: {
      data: {
        model,
        messages,
        system: opts.system,
        cachedSystem: opts.cachedSystem,
      },
    },
    ...(opts.signal
      ? { context: { fetchOptions: { signal: opts.signal } } }
      : {}),
  });
  if (errors?.length) throw errors[0];
  if (!data?.aiComplete) throw new Error('aiComplete returned no data');
  return data.aiComplete;
}

/**
 * Build a one-line snippet describing the user's approximate device
 * location, suitable for appending to either the parser or provider prompts.
 * Returns an empty string if no location is available so callers can
 * unconditionally concatenate.
 */
function formatDeviceLocationHint(loc?: DeviceLocation | null): string {
  if (!loc) return '';
  const lat = loc.lat.toFixed(4);
  const lng = loc.lng.toFixed(4);
  const acc = Math.round(loc.accuracyMeters);
  return `Device approximate location (use as fallback when the user doesn't mention a city): latitude ${lat}, longitude ${lng}, accuracy ~${acc}m. Infer the most likely Costa Rican neighborhood/canton from these coordinates.`;
}

export interface ChatUsage {
  inputTokens?: number;
  outputTokens?: number;
}

/**
 * How a turn should be handled:
 *  - `service_request`  — the user wants provider options → UI shows cards.
 *  - `network_inquiry`  — the user is asking ABOUT the supplier network
 *                         ("do you have DJs in Heredia?", "are there
 *                         suppliers near me?") → we search the DB and let
 *                         the AI answer in text, but show NO cards.
 *  - `chat`             — general conversation, or a question about results
 *                         ALREADY shown ("compare the first and last one")
 *                         → no DB search, no cards.
 */
export type QueryIntent = 'service_request' | 'network_inquiry' | 'chat';

export interface ParsedQuery {
  service: string;
  people: string;
  location: string;
  budget: string;
  when: string;
  dietary?: string;
  intent: QueryIntent;
}

export interface ParseQueryResult {
  parsed: ParsedQuery;
  model: ModelKey;
  usage?: ChatUsage;
}

const PARSE_SYSTEM_PROMPT = `You are an intent parser for Solvo, a service marketplace in Costa Rica.
The user will provide a free-text message in a multi-turn conversation. Classify their INTENT and, when applicable, extract structured fields. Respond with ONLY a JSON object — no prose, no markdown fences, no commentary.

Schema:
{
  "intent": "one of 'service_request', 'network_inquiry', or 'chat' — see the intent rules below",
  "service": "short service category like 'Catering', 'DJ', 'Cleaning', 'AC repair', etc. — 1-3 words. Use empty string '' when no service category is implied.",
  "people": "string number of people (e.g. '35 people'), OR an empty string '' if not mentioned. NEVER write the word 'unspecified'.",
  "location": "string location/neighborhood if mentioned (e.g. 'Santa Ana'). If the user did NOT mention a location AND device coordinates are provided in the user message, infer the most likely Costa Rican canton/neighborhood from those coordinates. Otherwise empty string ''.",
  "budget": "string budget formatted as '₡XXX,XXX' if mentioned, OR an empty string '' if not mentioned. NEVER write the word 'unspecified'.",
  "when": "string time/date if mentioned (e.g. 'Saturday', 'next week'), OR an empty string '' if not mentioned",
  "dietary": "OPTIONAL: dietary or special needs as a short phrase, omit the field entirely if none"
}

Intent rules — apply in this order (first match wins):

1. CHAT — a question about results ALREADY shown, or about a specific named provider, or general conversation. These need NO new search.
   1a. References to already-shown results: "the first result", "the last one", "second option", "compare them", "what's the difference between these", "which is cheaper", "primer resultado", "última opción", "compara los dos". The user is asking about cards already on screen — NOT requesting new ones.
       Examples → chat:
       - "Throw me a comparison between the first result and the last one"
       - "Which of these is cheaper?"
       - "Compare the first two options"
       - "¿Cuál de estos me recomiendas?"
   1b. Questions ABOUT a specific named provider/business — even if a service-category word appears in or near the name ("DJ Carlos Mora", "Studio Luz", "Piki Tiki", "Sabor Catering").
       Signals (EN): "where is", "what does", "how much does", "is X verified", "tell me about", "does X do".
       Signals (ES): "dónde está", "dónde queda", "cuánto cobra", "qué incluye", "qué tal", "háblame de", "y X?".
       Examples → chat:
       - "Where is PikiTiki located?"
       - "Donde esta DJ Carlos Mora ubicado?"
       - "y Piki Tiki?"
       - "¿Cuánto cobra Sabor Catering?"
   1c. General conversation: how Solvo works, what "verified" means in general, greetings, thanks, off-topic chat.

2. NETWORK_INQUIRY — the user is asking ABOUT the supplier network/inventory in general (not naming a specific business, not picking one): whether suppliers exist, what's available, coverage. We will search the DB and answer in text — no cards.
   Signals (EN): "do you have", "are there any (suppliers/providers)", "what (suppliers/services/categories) do you have", "is there anyone who", "who's in your network".
   Signals (ES): "tienen", "hay (proveedores/suppliers)", "qué (proveedores/servicios) tienen", "hay alguien que", "tienen suppliers en".
   Examples → network_inquiry:
   - "Are there any suppliers in our network?"
   - "Do you have DJs in Heredia?"
   - "What categories of services do you cover?"
   - "¿Tienen proveedores de catering en San José?"
   - "Is there anyone who does AC repair?"

3. SERVICE_REQUEST — the user wants us to find/recommend providers FOR THEM to pick from, or is refining an earlier search. This is the "show me options I can act on" intent.
   Signals (EN): "I need", "find me", "show me", "recommend me", "plan a", "get me", "any X under ₡…".
   Signals (ES): "necesito", "busco", "muéstrame", "recomiéndame", "quiero", "encuéntrame", "consígueme".
   Examples → service_request:
   - "I need catering for 35"
   - "Find me a DJ"
   - "Necesito un DJ para sábado"
   - "Plan a birthday party"
   - "Show me cheaper options" (refining)
   - "What about Saturday?" (refining)

4. When genuinely in doubt and the message names a concrete service CATEGORY without any specific business name and isn't clearly a question about the network → service_request.

Disambiguation: "are there DJs in Heredia?" is network_inquiry (asking IF the network has them). "find me a DJ in Heredia" is service_request (asking us to surface options). "compare the DJs you showed" is chat (about already-shown results).

Other rules:
- For unknown fields, use empty string '' — do NOT invent values, do NOT write 'unspecified', 'flexible', 'any', etc.
- The user's stated location ALWAYS wins over device coordinates. Only fall back to coordinates when the user didn't mention a location.
- Keep stated values short and human-readable.
- Output must be valid JSON parseable by JSON.parse — NOTHING else.`;

const FALLBACK_QUERY: ParsedQuery = {
  service: 'Service',
  people: '',
  location: '',
  budget: '',
  when: '',
  intent: 'service_request',
};

/**
 * Belt-and-suspenders check for the LLM parser: certain phrasings are so
 * unambiguously chat-intent that we override whatever the model returned.
 * Catches cases where the model gets confused by category words appearing
 * inside a business name (e.g. "DJ Carlos Mora") and flips back to
 * service_request.
 */
const QUESTION_PREFIX_RE =
  /^\s*(?:y\s+|and\s+|¿|\?)?\s*(?:dónde|donde|where|cuál|cual|which|qué|que|what|cómo|como|how|cuándo|cuando|when|quién|quien|who|háblame|tell\s+me|cuéntame|cuentame)\b/i;

const SEARCH_VERB_RE =
  /\b(?:find|busco|necesito|need|show\s+me|muéstrame|muestrame|recomi[ée]ndame|recommend|encu[ée]ntrame|plan\s+(?:a|me)|i\s+want|quiero|book)\b/i;

const CAPITALIZED_NAME_RE = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,5})\b/;

/**
 * Country-agnostic extraction of an explicitly-stated location from free
 * text. Instead of matching against a hardcoded city list (which doesn't
 * scale beyond one market), we detect the GRAMMAR of a location mention:
 * a locative preposition followed by a proper-noun place name.
 *
 * Works globally — "...in Tokyo", "...en Madrid", "...near Austin",
 * "...cerca de Lima" all resolve. The place name must be capitalized, which
 * is what separates "in Tokyo" (a place) from "in catering" (a service).
 *
 * This is a deterministic safety net: the LLM parser is still the primary
 * extractor, but when the user clearly typed a place it should reach the
 * search even if the model drops it or device-coordinate inference would
 * otherwise win.
 *
 * Note: prepositions are spelled with explicit case variants rather than the
 * `i` flag, because the `i` flag also makes the `\p{Lu}` (uppercase letter)
 * escape case-insensitive — which would defeat the proper-noun requirement.
 */
const EXPLICIT_LOCATION_RE =
  /(?:\b(?:[Ii]n|[Aa]t|[Nn]ear|[Aa]round|[Ee]n)\b|\b[Cc]erca de\b|\b[Cc]lose to\b)\s+(\p{Lu}[\p{L}.'-]*(?:\s+(?:de|del|da|do|\p{Lu}[\p{L}.'-]*)){0,3})/u;

/**
 * Service-category words that can appear capitalized right after a
 * preposition ("interested In Catering") — bounded set in this marketplace,
 * so a tiny stop-list keeps them from being mistaken for a location.
 */
const NON_LOCATION_WORDS = new Set([
  'catering',
  'dj',
  'photography',
  'cleaning',
  'bakery',
  'moving',
  'decor',
  'service',
  'services',
]);

export function detectExplicitLocation(message: string): string | null {
  if (!message) return null;
  const match = message.match(EXPLICIT_LOCATION_RE);
  if (!match) return null;

  // Trim any trailing lowercase connector the greedy capture pulled in
  // (e.g. "San Pedro de" → "San Pedro").
  const place = match[1]
    .replace(/\s+(?:de|del|da|do)$/i, '')
    .trim();

  if (!place) return null;
  if (NON_LOCATION_WORDS.has(place.toLowerCase())) return null;
  return place;
}

function looksLikeQuestionAboutNamedEntity(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;

  // Explicit search-verb wins (e.g. "find me a DJ named Carlos").
  if (SEARCH_VERB_RE.test(trimmed)) return false;

  const startsWithQuestion = QUESTION_PREFIX_RE.test(trimmed);
  const hasCapitalizedName = CAPITALIZED_NAME_RE.test(trimmed);
  const isShortReferent = /^\s*(?:y|and|qué\s+tal|que\s+tal|what\s+about)\s+/i.test(
    trimmed,
  );

  // "Where is PikiTiki?" / "Donde esta DJ Carlos Mora?" → yes
  if (startsWithQuestion && hasCapitalizedName) return true;

  // "y Piki Tiki?" → yes (short referent follow-up)
  if (isShortReferent && hasCapitalizedName) return true;

  return false;
}

/**
 * Unambiguous reference to a result ALREADY on screen — "the first result",
 * "the last one", "second option", "primer resultado", "última opción". When
 * the user is talking about cards already shown, the turn is `chat`: they
 * want analysis of existing results, not a fresh search. Deterministic
 * override for when the LLM gets fooled by words like "comparison".
 */
const ORDINAL_RESULT_REF_RE =
  /\b(?:the\s+)?(?:first|second|third|fourth|fifth|last|1st|2nd|3rd|4th|5th|primer[oa]?|segund[oa]|tercer[oa]?|cuart[oa]|quint[oa]|[úu]ltim[oa])\s+(?:result|one|option|provider|card|pick|resultado|opci[óo]n|proveedor|tarjeta)s?\b/i;

function referencesShownResults(message: string): boolean {
  return ORDINAL_RESULT_REF_RE.test(message.trim());
}

function stripJsonFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export async function parseQueryWithAi(
  query: string,
  model: ModelKey,
  deviceLocation?: DeviceLocation | null,
  signal?: AbortSignal,
): Promise<ParseQueryResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { parsed: FALLBACK_QUERY, model };
  }

  const locationHint = formatDeviceLocationHint(deviceLocation);
  const userMessage = locationHint
    ? `${trimmed}\n\n[${locationHint}]`
    : trimmed;

  // PARSE_SYSTEM_PROMPT is fully static, so it's passed as `cachedSystem`
  // for provider-side prompt caching — the per-turn variation lives in the
  // user message (the location hint), not the system prompt.
  const data = await runCompletion(
    model,
    [{ role: 'user', content: userMessage }],
    { cachedSystem: PARSE_SYSTEM_PROMPT, signal },
  );

  const cleaned = stripJsonFences(data.content);

  // Normalize values that the model uses to mean "I don't know"
  const isEmpty = (v: unknown) => {
    if (v == null) return true;
    const s = String(v).trim().toLowerCase();
    return (
      s === '' ||
      s === 'unspecified' ||
      s === 'flexible' ||
      s === 'any' ||
      s === 'n/a' ||
      s === 'none' ||
      s === 'soon'
    );
  };

  let parsed: ParsedQuery;
  try {
    const obj = JSON.parse(cleaned);
    // Coerce anything the model returns into our three-valued intent.
    // Default to `service_request` for unrecognised values — keeping
    // provider generation on for ambiguous turns is the safer error.
    const rawIntent = String(obj.intent ?? '').toLowerCase().trim();
    let intent: QueryIntent =
      rawIntent === 'chat'
        ? 'chat'
        : rawIntent === 'network_inquiry'
          ? 'network_inquiry'
          : 'service_request';

    // Belt-and-suspenders: override the LLM when the latest user turn is
    // unambiguously `chat`. We pass the FULL conversation context to the LLM
    // (the parser is multi-turn) but the overrides only look at the last
    // user utterance, re-derived by taking the segment after the final ". ".
    const lastTurn = trimmed.split(/\.\s+/).pop() ?? trimmed;
    if (
      looksLikeQuestionAboutNamedEntity(lastTurn) ||
      // "compare the first and last result" — about cards already on screen,
      // never a new search.
      referencesShownResults(lastTurn)
    ) {
      intent = 'chat';
    }

    // Deterministic location override: if the user explicitly typed a place
    // ("...in <City>"), that ALWAYS wins — over both the LLM's extraction and
    // any device-coordinate inference. Prefer a location in the latest turn;
    // fall back to anywhere in the accumulated context.
    const explicitLocation =
      detectExplicitLocation(lastTurn) ?? detectExplicitLocation(trimmed);
    const llmLocation = isEmpty(obj.location) ? '' : String(obj.location);

    parsed = {
      intent,
      service: String(obj.service ?? FALLBACK_QUERY.service),
      people: isEmpty(obj.people) ? '' : String(obj.people),
      location: explicitLocation ?? llmLocation,
      budget: isEmpty(obj.budget) ? '' : String(obj.budget),
      when: isEmpty(obj.when) ? '' : String(obj.when),
      dietary: !isEmpty(obj.dietary) ? String(obj.dietary) : undefined,
    };
  } catch {
    parsed = FALLBACK_QUERY;
  }

  // Visibility into what the AI returned vs what we kept
  // eslint-disable-next-line no-console
  console.groupCollapsed(`[AI] parseQuery via ${model}`);
  // eslint-disable-next-line no-console
  console.log('raw response:', data.content);
  // eslint-disable-next-line no-console
  console.log('parsed object:', parsed);
  // eslint-disable-next-line no-console
  console.log('usage:', data.usage);
  // eslint-disable-next-line no-console
  console.groupEnd();

  return { parsed, model: data.model ?? model, usage: data.usage };
}

// ──────────────────────────────────────────────────────────────────────
// Provider generation
// ──────────────────────────────────────────────────────────────────────

export interface GenerateProvidersResult {
  providers: ProviderData[];
  model: ModelKey;
  usage?: ChatUsage;
}

/**
 * The provider-generation prompt is count-aware: the caller only asks the AI
 * to invent as many providers as the DB search came up short by. When the DB
 * fully covers the request, AI generation is skipped entirely upstream.
 *
 * IMPORTANT: AI-generated providers must NOT carry fabricated contact data
 * (phone / email / website). Those are AI *suggestions* — actionable fake
 * info (a fake phone number someone might actually call) is misleading and
 * potentially harmful. Real, contactable details only ever come from real DB
 * suppliers. The prompt below deliberately omits contact fields.
 */
function buildProvidersSystemPrompt(count: number): string {
  return `You are Solvo, a service marketplace assistant in Costa Rica. Given a user's parsed service request, suggest ${count} plausible local service provider${count === 1 ? '' : 's'} as illustrative options.

Respond with ONLY a JSON array of ${count} object${count === 1 ? '' : 's'} — no prose, no markdown fences, no commentary.

CRITICAL: each field's VALUE must be the actual data, not a description of the format. Never copy schema-description text into a value.

Here is a complete example of one valid output item — match this STYLE exactly, but generate fresh data appropriate for the user's request:

{
  "id": 1,
  "name": "Sabor Catering Co.",
  "rating": 4.8,
  "reviews": 287,
  "priceLabel": "₡285,000",
  "includes": ["Full service for 35", "3-course menu", "Setup & cleanup", "1 server"],
  "tags": ["AI Match", "Fast response"],
  "responseTime": "Replies in ~8 min",
  "location": "Santa Ana, 4 km away",
  "avatar": "🍽️",
  "verified": false
}

Field rules:
- "id": integer 1 to ${count}
- "name": Costa Rican-sounding business name (Spanish or bilingual). Real-feeling, not generic.
- "rating": decimal between 4.4 and 4.9
- "reviews": integer between 80 and 600
- "priceLabel": colones formatted with ₡ and commas (e.g. "₡165,000", "₡420,000"). Vary the values; anchor to the user's stated budget if any.
- "includes": array of 3 to 4 short feature strings, each under 7 words, specific to the service.
- "tags": array of 1 to 2 strings, picked ONLY from this set: ["AI Match", "Fast response", "Premium", "Best price", "Customizable", "Eco-friendly"].
- "responseTime": exactly "Replies in ~N min" where N is an integer between 5 and 45
- "location": "Neighborhood, X km away". IMPORTANT: when the user's request includes a location, EVERY provider's neighborhood MUST be that location or an immediately adjacent one — never a far-away city.
- "avatar": single emoji that matches the service category
- "verified": always false — these are AI suggestions, not verified listings
- DO NOT include "website", "email", or "phone" — never invent contact details. These are suggestions only; real contact info comes solely from verified providers.
- "recommended": omit it — the caller decides which card is the recommended one

Output exactly ${count} item${count === 1 ? '' : 's'}. These are SUPPLEMENTARY suggestions shown after real verified providers, so keep them realistic and modest.`;
}

const FALLBACK_PROVIDERS: ProviderData[] = [
  {
    id: 1,
    name: 'Sabor Catering Co.',
    rating: 4.9,
    reviews: 312,
    priceLabel: '₡285,000',
    includes: ['Full service', 'Menu + drinks', 'Setup & cleanup'],
    tags: ['AI Match'],
    responseTime: 'Replies in ~5 min',
    location: 'Santa Ana, 4 km away',
    avatar: '🍽️',
    verified: true,
    recommended: true,
  },
];

const ALLOWED_TAGS = new Set([
  'AI Match',
  'Fast response',
  'Premium',
  'Best price',
  'Customizable',
  'Eco-friendly',
]);

// NOTE: the old normalizeWebsite / normalizeEmail / normalizePhone helpers
// were removed — AI-suggested providers no longer carry contact info at all
// (see buildProvidersSystemPrompt + sanitizeProvider), so there's nothing to
// normalize. Real contact details come exclusively from DB suppliers.

function sanitizePriceLabel(value: unknown): string {
  if (typeof value !== 'string') return '₡250,000';
  const v = value.trim();
  // Reject if the model regurgitated the schema description
  if (/format|colones|XXX|example/i.test(v) && !/₡\s?\d/.test(v)) {
    return '₡250,000';
  }
  return v || '₡250,000';
}

function sanitizeProvider(raw: unknown, index: number): ProviderData | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  try {
    const tags = Array.isArray(r.tags)
      ? (r.tags as unknown[])
          .map((t) => String(t))
          .filter((t) => ALLOWED_TAGS.has(t))
      : [];
    const includes = Array.isArray(r.includes)
      ? (r.includes as unknown[]).map((i) => String(i)).slice(0, 4)
      : [];

    return {
      id: Number(r.id ?? index + 1),
      name: String(r.name ?? `Provider ${index + 1}`),
      rating: Number(r.rating ?? 4.7),
      reviews: Number(r.reviews ?? 100),
      priceLabel: sanitizePriceLabel(r.priceLabel),
      includes,
      tags,
      responseTime: String(r.responseTime ?? 'Replies in ~15 min'),
      location: String(r.location ?? 'Costa Rica'),
      avatar: String(r.avatar ?? '✨'),
      // AI-suggested providers are never "verified" — verification is a
      // real-supplier trust signal.
      verified: false,
      // `recommended` is NOT decided here — the merge step downstream owns
      // that, so exactly one card across the whole (DB + AI) list is flagged.
      recommended: false,
      // Contact details are NEVER fabricated for AI suggestions — actionable
      // fake info is misleading. These stay undefined; only real DB suppliers
      // carry phone / email / website.
      website: undefined,
      email: undefined,
      phone: undefined,
    };
  } catch {
    return null;
  }
}

export async function generateProvidersWithAi(
  parsed: ParsedQuery,
  model: ModelKey,
  deviceLocation?: DeviceLocation | null,
  count = 4,
  signal?: AbortSignal,
): Promise<GenerateProvidersResult> {
  // Caller asks for exactly the number of cards the DB search came up short
  // by. Guard against nonsense values.
  const wanted = Math.max(1, Math.min(Math.floor(count), 8));

  const locationHint = formatDeviceLocationHint(deviceLocation);
  const strictLocationLine = parsed.location
    ? `\n\nSTRICT: the user asked for "${parsed.location}" — every provider you invent MUST be located in ${parsed.location} (or an immediately adjacent canton). Do not invent providers in other cities.`
    : locationHint
      ? `\n\n[${locationHint} Bias the inventory's "location" field toward the cantons near these coordinates when the user didn't specify a city.]`
      : '';

  const userMessage = `Service request:
- Service: ${parsed.service}
- People: ${parsed.people}
- Location: ${parsed.location}
- Budget: ${parsed.budget}
- When: ${parsed.when}${parsed.dietary ? `\n- Dietary/special needs: ${parsed.dietary}` : ''}${strictLocationLine}

Generate ${wanted} matching provider${wanted === 1 ? '' : 's'} as a JSON array.`;

  // buildProvidersSystemPrompt(wanted) is stable for a given count, so it's
  // passed as `cachedSystem` — turns asking for the same N share the cache.
  const data = await runCompletion(
    model,
    [{ role: 'user', content: userMessage }],
    { cachedSystem: buildProvidersSystemPrompt(wanted), signal },
  );

  const cleaned = stripJsonFences(data.content);

  let providers: ProviderData[] = [];
  try {
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) {
      providers = arr
        .map((item, i) => sanitizeProvider(item, i))
        .filter((p): p is ProviderData => p !== null);
    }
  } catch {
    providers = [];
  }

  if (providers.length === 0) {
    providers = FALLBACK_PROVIDERS;
  }

  // Never hand back more than the caller asked for — the merge step expects
  // to fill an exact gap.
  providers = providers.slice(0, wanted);

  // Visibility into what the AI returned vs what we kept after sanitization
  const total = providers.length;
  const websiteCount = providers.filter((p) => p.website).length;
  const emailCount = providers.filter((p) => p.email).length;
  const phoneCount = providers.filter((p) => p.phone).length;
  // eslint-disable-next-line no-console
  console.groupCollapsed(`[AI] generateProviders via ${model}`);
  // eslint-disable-next-line no-console
  console.log('raw response:', data.content);
  // eslint-disable-next-line no-console
  console.log('sanitized providers:', providers);
  // eslint-disable-next-line no-console
  console.log(
    `contact fields kept — websites: ${websiteCount}/${total}, emails: ${emailCount}/${total}, phones: ${phoneCount}/${total}`,
  );
  // eslint-disable-next-line no-console
  console.log('usage:', data.usage);
  // eslint-disable-next-line no-console
  console.groupEnd();

  return { providers, model: data.model ?? model, usage: data.usage };
}

