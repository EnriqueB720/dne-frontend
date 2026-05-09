import type { ModelKey } from '../jotai/ai-usage.atom';
import type { ProviderData } from '@components';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface ChatUsage {
  inputTokens?: number;
  outputTokens?: number;
}

export interface ParsedQuery {
  service: string;
  people: string;
  location: string;
  budget: string;
  when: string;
  dietary?: string;
}

export interface ParseQueryResult {
  parsed: ParsedQuery;
  model: ModelKey;
  usage?: ChatUsage;
}

const PARSE_SYSTEM_PROMPT = `You are an intent parser for Solvo, a service marketplace in Costa Rica.
The user will provide a free-text request describing a service they need.
Extract structured fields and respond with ONLY a JSON object — no prose, no markdown fences, no commentary.

Schema:
{
  "service": "short service category like 'Catering', 'DJ', 'Cleaning', 'AC repair', etc. — 1-3 words",
  "people": "string number of people (e.g. '35 people'), OR an empty string '' if not mentioned. NEVER write the word 'unspecified'.",
  "location": "string location/neighborhood if mentioned (e.g. 'Santa Ana'), OR an empty string '' if not mentioned",
  "budget": "string budget formatted as '₡XXX,XXX' if mentioned, OR an empty string '' if not mentioned. NEVER write the word 'unspecified'.",
  "when": "string time/date if mentioned (e.g. 'Saturday', 'next week'), OR an empty string '' if not mentioned",
  "dietary": "OPTIONAL: dietary or special needs as a short phrase, omit the field entirely if none"
}

Rules:
- Always include service.
- For unknown fields, use empty string '' — do NOT invent values, do NOT write 'unspecified', 'flexible', 'any', etc.
- Keep stated values short and human-readable.
- Output must be valid JSON parseable by JSON.parse — NOTHING else.`;

const FALLBACK_QUERY: ParsedQuery = {
  service: 'Service',
  people: '',
  location: '',
  budget: '',
  when: '',
};

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
): Promise<ParseQueryResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { parsed: FALLBACK_QUERY, model };
  }

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      system: PARSE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: trimmed }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Parse request failed (${res.status})`);
  }

  const data: { content: string; model: ModelKey; usage?: ChatUsage } =
    await res.json();

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
    parsed = {
      service: String(obj.service ?? FALLBACK_QUERY.service),
      people: isEmpty(obj.people) ? '' : String(obj.people),
      location: isEmpty(obj.location) ? '' : String(obj.location),
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

const PROVIDERS_SYSTEM_PROMPT = `You are Solvo, a service marketplace assistant in Costa Rica. Given a user's parsed service request, invent 4 plausible local service providers.

Respond with ONLY a JSON array of 4 objects — no prose, no markdown fences, no commentary.

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
  "website": "https://saborcatering.cr",
  "email": "hola@saborcatering.cr",
  "phone": "+506 2289-4521",
  "verified": true,
  "recommended": true
}

Field rules:
- "id": integer 1 to 4
- "name": Costa Rican-sounding business name (Spanish or bilingual). Real-feeling, not generic.
- "rating": decimal between 4.4 and 4.9
- "reviews": integer between 80 and 600
- "priceLabel": colones formatted with ₡ and commas (e.g. "₡165,000", "₡420,000"). Vary across the 4 items: one cheaper, one premium, two mid-range. Anchor to the user's stated budget if any.
- "includes": array of 3 to 4 short feature strings, each under 7 words, specific to the service.
- "tags": array of 1 to 2 strings, picked ONLY from this set: ["AI Match", "Fast response", "Premium", "Best price", "Customizable", "Eco-friendly"]. Use "AI Match" only on the first item.
- "responseTime": exactly "Replies in ~N min" where N is an integer between 5 and 45
- "location": "Neighborhood, X km away" — neighborhoods like Santa Ana, Escazú, San José Centro, Curridabat, Cariari, Heredia, Alajuela
- "avatar": single emoji that matches the service category
- "website": OPTIONAL plausible URL with https:// and a .cr or .com domain matching the business name. Omit the field entirely if you cannot invent a natural-sounding domain. NEVER use placeholder URLs (no example.com, no your-website, no TBD). If unsure, omit it — the system will fall back to a web-search link.
- "email": OPTIONAL plausible business email matching the domain when possible (e.g. "hola@saborcatering.cr", "info@djmauricio.com", "contacto@tecnofrioCR.com"). Use lowercase. NEVER use placeholder emails (no example@example.com, no test@test.com, no your-email). Omit the field if you cannot invent a natural one.
- "phone": OPTIONAL Costa Rican phone number in the format "+506 XXXX-XXXX" (8 digits split by a hyphen). Costa Rican landlines start with 2; mobiles start with 6, 7, or 8. Examples: "+506 2289-4521", "+506 8412-7733", "+506 7022-9088". NEVER use 555 numbers or other obvious fakes. Omit the field if you cannot invent a realistic number.
- "verified": always true
- "recommended": true on the FIRST item only; omit on the others

Output exactly 4 items. First item is the best match for the user's request.`;

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

// Returns a normalized URL string if valid, or null. Auto-prepends https://
// when the AI returns a bare domain like "saborcatering.cr".
function normalizeWebsite(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  let v = value.trim();
  if (!v) return null;

  if (/example\.(com|cr|org|net)/i.test(v)) return null;
  if (/your-?website|placeholder|TBD|N\/A/i.test(v)) return null;

  v = v.replace(/^["'<(]+|["'>)]+$/g, '');

  if (!/^https?:\/\//i.test(v)) {
    if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/.*)?$/i.test(v)) {
      v = `https://${v}`;
    } else {
      return null;
    }
  }

  try {
    const u = new URL(v);
    if (!u.hostname.includes('.')) return null;
    return u.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  if (!v) return null;

  // Reject obvious placeholders
  if (/example\.(com|cr|org|net)/i.test(v)) return null;
  if (/test@|your-?email|placeholder|TBD|N\/A/i.test(v)) return null;

  // Basic shape: local@domain.tld
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)) return null;
  return v;
}

function normalizePhone(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  if (!v) return null;

  // Reject placeholder strings
  if (/your-?phone|placeholder|TBD|N\/A|XXX|123-?4567|555-?\d{4}/i.test(v)) {
    return null;
  }

  // Must have at least 8 digits (Costa Rican local numbers)
  const digits = v.replace(/\D/g, '');
  if (digits.length < 8) return null;
  if (digits.length > 15) return null; // E.164 max is 15

  return v;
}

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

    const website = normalizeWebsite(r.website) ?? undefined;
    const email = normalizeEmail(r.email) ?? undefined;
    const phone = normalizePhone(r.phone) ?? undefined;

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
      verified: r.verified !== false,
      recommended: index === 0 ? true : Boolean(r.recommended),
      website,
      email,
      phone,
    };
  } catch {
    return null;
  }
}

export async function generateProvidersWithAi(
  parsed: ParsedQuery,
  model: ModelKey,
): Promise<GenerateProvidersResult> {
  const userMessage = `Service request:
- Service: ${parsed.service}
- People: ${parsed.people}
- Location: ${parsed.location}
- Budget: ${parsed.budget}
- When: ${parsed.when}${parsed.dietary ? `\n- Dietary/special needs: ${parsed.dietary}` : ''}

Generate 4 matching providers as a JSON array.`;

  const res = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      system: PROVIDERS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Provider generation failed (${res.status})`);
  }

  const data: { content: string; model: ModelKey; usage?: ChatUsage } =
    await res.json();

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

