import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Paperclip,
  Mic,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Calendar,
  Home as HomeIcon,
  Briefcase,
  Scissors,
  Car,
} from 'lucide-react';
import {
  Box,
  Flex,
  Text,
  Textarea,
  SolvoNavBar,
  ChatSidebar,
  ChatThread,
  ChatComposer,
  PackagePanel,
  type ProviderData,
} from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { useAtom } from 'jotai';
import type { ModelKey } from '@/shared/jotai/ai-usage.atom';
import type { UiMessage } from '@/shared/jotai/conversation.atom';
import { packageAtom, packageKey } from '@/shared/jotai/package.atom';
import {
  parseQueryWithAi,
  generateProvidersWithAi,
  type ParsedQuery,
} from '@/shared/services/ai.service';
import {
  listConversations,
  createConversation,
  getConversation,
  sendMessage as apiSendMessage,
  deleteConversation as apiDeleteConversation,
  updateMessageProviders,
  rollbackLastTurn,
  linkConversationToRequest,
  type ConversationSummary,
} from '@/shared/services/conversation.service';
import {
  useCreateRequestMutation,
  useCreateQuoteMutation,
  useSearchSuppliersLazyQuery,
} from '@generated';
import Link from 'next/link';
import AuthContext from '@/shared/contexts/auth.context';
import { useUserLocation } from '@hooks';

// ── System prompt for chat AI ──────────────────────────────────────────────
const SOLVO_CHAT_SYSTEM_PROMPT = `You are Solvo, an AI concierge for a service marketplace in Costa Rica.

RULES — follow exactly:
1. LANGUAGE: Detect the language of the user's latest message and reply in that EXACT language. If their message is in English, reply in English. If Spanish, reply in Spanish. Never mix languages.
2. BREVITY: Keep responses to 1–3 sentences for service requests. For conversational questions you may use up to 4–5 sentences if needed to answer properly.
3. TIMING — CRITICAL: Your reply and the provider cards are delivered TOGETHER, in the SAME message, at the SAME instant. There is NO "later". NEVER say "hold on", "one moment", "please wait", "I'll find", "let me search", "give me a second", or anything implying results are still coming. Always speak in the PRESENT or PAST tense about what is already on screen.
4. THREE MODES OF REPLY — the context block below your prompt tells you which one applies:
   a) Service request — a "## Search result" block tells you EXACTLY how many provider cards are shown to the user right now.
      - If the count is 1 or more: the cards are ALREADY visible below your message. Acknowledge what you found in present tense ("Here are 4 Italian options near Santo Domingo") and invite them to look. Do NOT list or describe the specific businesses yourself.
      - If the count is 0: there are NO cards. Tell the user plainly that you couldn't find matches, and offer to broaden it. Do NOT pretend results exist.
   b) Network lookup — a "## Network lookup" block lists suppliers found in the Solvo network for an informational question ("do you have DJs in Heredia?", "are there suppliers in our network?"). NO cards are shown. Answer in plain text: summarise what the network has (counts, names, categories, locations) using ONLY the listed data. If the block says zero matches, say so honestly. Do NOT say "see the cards" — there are none.
   c) Conversation — no context block, or a "## Known providers" block. General questions (how Solvo works, what's verified), greetings, thanks, comparisons of results ALREADY shown, or questions about a specific provider already shown. NO cards appear. Answer fully in plain text. Do NOT mention "the cards" or "the options below".
5. PROVIDER FACTS — NO HALLUCINATION:
   - When the user asks about a specific named provider, or to compare providers, you may ONLY use the data in the "## Known providers" / "## Search result" / "## Network lookup" block below, when present.
   - If the provider IS in that block, answer using its fields verbatim. Do not invent addresses, hours, or services that aren't there.
   - If the provider is NOT in that block (or no block is present), say you don't have detailed info on it and offer to search. Never make up the answer.
   - NEVER guess what category a named provider belongs to. Use ONLY the data you have.
6. QUESTIONS: Ask at most ONE clarifying question per turn.
7. FORMAT: No bullet points, no markdown headers, no numbered lists.

Service-request examples:
- (4 cards shown) "Here are 4 Italian options near Santo Domingo, Heredia — take a look below and tell me if you'd like to adjust anything."
- (0 cards shown) "I couldn't find Italian options near Santo Domingo specifically. Want me to widen the search to the rest of Heredia, or try a different cuisine?"

Network-lookup examples:
- User: "Are there any suppliers in our network?" (block lists 8) → "Yes — there are verified suppliers across catering, DJs, photography and more. For example, Sabor Catering in Santa Ana and DJ Carlos Mix in Alajuela. Want me to pull up options for something specific?"
- User: "Do you have AC repair in Cartago?" (block: 0 matches) → "I don't see any AC repair suppliers in Cartago in our network right now. Want me to check nearby areas?"

Conversational examples:
- User: "How does Solvo work?" → "You describe what you need in your own words and I match you with verified providers in your area. They send quotes, you pick one, and you can chat with them through the platform."
- User: "Compare the first and last result" (both in the block) → "The first, Sabor Catering, is ₡210,000 with a 4.7 rating; the last, Cocina Express, is ₡175,000 at 4.4. Sabor costs more but rates higher — Cocina is the cheaper pick."
- User: "Where is XYZ Cafe?" (XYZ Cafe NOT in the block) → "I don't have details on XYZ Cafe handy — want me to look for similar providers instead?"
- User: "Thanks!" → "You're welcome! Let me know whenever you need something else."`;

// ── Static hero data ────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  '🎂 Plan a birthday party',
  '❄️ Fix my AC',
  '🧽 Find a cleaning service',
  '🎧 Get a DJ for an event',
  '📸 Hire a photographer',
  '🚚 Need movers this weekend',
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'Verified providers', subtitle: 'Every business is identity-checked' },
  { icon: Zap, title: 'Replies in minutes', subtitle: 'Average first response: 8 minutes' },
  { icon: TrendingUp, title: 'Compare instantly', subtitle: 'Side-by-side options & pricing' },
];

const CATEGORIES = [
  { icon: Calendar, label: 'Events', count: '2.4k providers', from: '#FFE4E6', to: '#FED7AA' },
  { icon: HomeIcon, label: 'Home services', count: '1.8k providers', from: '#E0F2FE', to: '#C7D2FE' },
  { icon: Briefcase, label: 'Business', count: '920 providers', from: '#D1FAE5', to: '#CCFBF1' },
  { icon: Scissors, label: 'Beauty & wellness', count: '1.2k providers', from: '#FCE7F3', to: '#FAE8FF' },
  { icon: Car, label: 'Auto', count: '640 providers', from: '#FEF3C7', to: '#FEF9C3' },
];

// ── DB Supplier → ProviderCard mapping ────────────────────────────────────
function pickAvatarForSupplier(name: string, services: { name: string }[] = []): string {
  const blob = `${name} ${services.map((s) => s.name).join(' ')}`.toLowerCase();
  if (/cater|food|menu|buffet|chef/.test(blob)) return '🍽️';
  if (/dj|music|sound/.test(blob)) return '🎧';
  if (/photo/.test(blob)) return '📸';
  if (/clean/.test(blob)) return '🧽';
  if (/ac|fix|repair/.test(blob)) return '❄️';
  if (/cake|bakery|sweet/.test(blob)) return '🎂';
  if (/floral|flower|decor/.test(blob)) return '🌸';
  if (/move|moving/.test(blob)) return '🚚';
  return '✨';
}

function dbSupplierToProviderData(s: any, index: number): ProviderData {
  const services: any[] = s.services ?? [];
  const prices = services.map((srv) => Number(srv.basePrice)).filter((n) => Number.isFinite(n) && n > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;

  const includes: string[] =
    services.length > 0
      ? services.slice(0, 4).map((srv) => srv.name)
      : s.tagline
        ? [s.tagline]
        : [];

  const tags: string[] = [];
  if (index === 0) tags.push('AI Match');
  if (s.premium) tags.push('Premium');

  const rating = s.rating ? Number(s.rating) : 4.7;

  return {
    id: s.supplierId,
    name: s.companyName,
    rating,
    reviews: s.reviewCount ?? 0,
    priceLabel: lowestPrice
      ? `From ₡${lowestPrice.toLocaleString('en-US')}`
      : 'Contact for pricing',
    includes,
    tags,
    responseTime: s.responseTimeMinutes
      ? `Replies in ~${s.responseTimeMinutes} min`
      : 'Replies within a day',
    location: s.city ?? 'Costa Rica',
    avatar: pickAvatarForSupplier(s.companyName ?? '', services),
    verified: !!s.verified,
    recommended: index === 0,
    website: s.websiteUrl ?? undefined,
    email: s.businessEmail ?? undefined,
    phone: s.businessPhone ?? s.whatsappNumber ?? undefined,
    isRealSupplier: true,
  };
}

// ── AI grounding from provider cards ──────────────────────────────────────
//
// When the user asks follow-up questions about a specific provider that's
// already been shown ("where is PikiTiki located?", "how much does Sabor
// Catering charge?"), the AI needs the actual data to answer factually —
// otherwise it hallucinates. We format the providers as a compact reference
// block appended to the system prompt.

/** Format a provider list into a compact, one-line-per-provider block. */
function formatProvidersForGrounding(providers: ProviderData[]): string {
  return providers
    .map((p, idx) => {
      const parts: string[] = [
        `${idx + 1}. ${p.name}`,
        `location: ${p.location}`,
        `price: ${p.priceLabel}`,
        `rating: ${p.rating} (${p.reviews} reviews)`,
        `response: ${p.responseTime}`,
      ];
      if (p.includes.length > 0) {
        parts.push(`includes: ${p.includes.join(', ')}`);
      }
      if (p.tags.length > 0) parts.push(`tags: ${p.tags.join(', ')}`);
      if (p.phone) parts.push(`phone: ${p.phone}`);
      if (p.email) parts.push(`email: ${p.email}`);
      if (p.website) parts.push(`website: ${p.website}`);
      parts.push(
        p.isRealSupplier ? 'source: in our network' : 'source: AI suggestion',
      );
      return parts.join(' | ');
    })
    .join('\n');
}

/**
 * Walk message history backwards and format the most recent assistant
 * message that carried provider cards. Used for conversational turns where
 * the user references a provider shown earlier.
 */
function buildProviderGrounding(messages: UiMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'assistant') continue;
    if (!m.providers || m.providers.length === 0) continue;
    return formatProvidersForGrounding(m.providers);
  }
  return '';
}

// The chat AI's system prompt is split into two parts so the backend can
// cache the stable half (provider-side prompt caching, see #1):
//   - cachedSystem  = SOLVO_CHAT_SYSTEM_PROMPT (constant, every turn)
//   - system        = the per-turn dynamic CONTEXT block built below
// The two builders return ONLY that dynamic block (or '' for none).

/**
 * Conversational-turn context: grounds the AI in providers shown earlier so
 * it can answer "where is X?" factually. No card-count framing — this turn
 * isn't producing cards.
 */
function groundingContext(grounding: string): string {
  if (!grounding) return '';
  return `## Known providers (answer questions about these specific businesses using ONLY this data — do not invent details):\n${grounding}`;
}

/**
 * Service-request context: tells the AI EXACTLY how many cards are being
 * shown alongside its message (including zero), so it speaks accurately and
 * never promises results that aren't there. Built AFTER the search + AI fill
 * resolve, so the count is final.
 */
function searchResultContext(
  providers: ProviderData[],
  parsed: ParsedQuery,
): string {
  const count = providers.length;
  const requestLine = [
    parsed.service && `service: ${parsed.service}`,
    parsed.location && `location: ${parsed.location}`,
    parsed.people && `people: ${parsed.people}`,
    parsed.budget && `budget: ${parsed.budget}`,
  ]
    .filter(Boolean)
    .join(' | ');

  if (count === 0) {
    return (
      `## Search result\n` +
      `0 provider cards are shown. The search for [${requestLine || 'this request'}] returned nothing. ` +
      `Tell the user plainly you couldn't find matches and offer to broaden the search — DO NOT imply results are still loading.`
    );
  }

  // Honesty check: did EVERY card actually match the requested location?
  // The backend ranks city-matches first but degrades gracefully to
  // "service matches elsewhere", so the cards may be in nearby areas.
  let locationNote = '';
  if (parsed.location) {
    const wanted = parsed.location.toLowerCase();
    const allMatch = providers.every((p) =>
      p.location.toLowerCase().includes(wanted),
    );
    if (!allMatch) {
      locationNote =
        ` NOTE: not all of these are located in "${parsed.location}" exactly — some are in nearby areas. ` +
        `Be honest about that (e.g. "I didn't find any right in ${parsed.location}, but here are some close by").`;
    }
  }

  return (
    `## Search result\n` +
    `${count} provider card${count === 1 ? '' : 's'} ${count === 1 ? 'is' : 'are'} shown to the user RIGHT NOW, below your message, for [${requestLine || 'this request'}].` +
    locationNote +
    ` Acknowledge them in present tense. The cards:\n${formatProvidersForGrounding(providers)}`
  );
}

/**
 * Network-lookup context: the user asked ABOUT the supplier network
 * ("are there suppliers in our network?", "do you have DJs in Heredia?").
 * We searched the DB and pass the matches as reference data — the AI
 * answers in plain text. NO cards are rendered for this turn.
 */
function networkInquiryContext(
  providers: ProviderData[],
  parsed: ParsedQuery,
): string {
  const filterLine = [
    parsed.service && `service: ${parsed.service}`,
    parsed.location && `location: ${parsed.location}`,
  ]
    .filter(Boolean)
    .join(' | ');
  const scope = filterLine ? ` for [${filterLine}]` : '';

  if (providers.length === 0) {
    return (
      `## Network lookup\n` +
      `A search of the Solvo supplier network${scope} returned NO matches. ` +
      `Tell the user honestly there are no suppliers matching that in the network right now, and offer to check nearby areas or a different service. No cards are shown.`
    );
  }

  return (
    `## Network lookup\n` +
    `The user is asking about the Solvo supplier network. A search${scope} found these ${providers.length} verified supplier(s). ` +
    `Answer their question in plain text using ONLY this data — summarise counts, names, categories, locations as relevant. NO cards are shown to the user.\n` +
    formatProvidersForGrounding(providers)
  );
}

// ── Hero section (extracted for clarity) ──────────────────────────────────
interface HeroSectionProps {
  onSubmit: (query: string) => void;
  /** Switch the page into chat mode (empty state, no current conversation) */
  onStartChat: () => void;
}

function HeroSection({ onSubmit, onStartChat }: HeroSectionProps) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSubmit(query.trim());
  };

  return (
    <Box position="relative" minHeight="100vh" bg={solvoColors.bg} overflow="hidden">
      {/* Atmospheric blurred gradients */}
      <Box
        position="absolute"
        top="-200px"
        right="-200px"
        width="600px"
        height="600px"
        borderRadius="full"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        position="absolute"
        bottom="-200px"
        left="-200px"
        width="600px"
        height="600px"
        borderRadius="full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12), transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SolvoNavBar activePath="/" onNewChat={onStartChat} />

      <Box
        maxWidth="1200px"
        margin="0 auto"
        padding={{ base: '32px 20px', md: '56px 24px' }}
        position="relative"
        zIndex={1}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Flex direction="column" align="center" gap="20px" textAlign="center" marginBottom="40px">
            <Flex
              align="center"
              gap="8px"
              padding="6px 14px"
              bg="white"
              borderRadius="full"
              borderWidth="1px"
              borderColor={solvoColors.border}
              fontSize="12px"
              color={solvoColors.textMuted}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: solvoColors.emerald,
                }}
              />
              AI concierge · 12,400+ verified providers
            </Flex>

            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '40px', md: '72px' }}
              lineHeight="1.05"
              fontWeight="500"
              color={solvoColors.text}
              maxWidth="900px"
              letterSpacing="-0.02em"
            >
              Ask for anything.
              <br />
              <Text
                as="span"
                fontStyle="italic"
                color={solvoColors.indigo}
                fontFamily={solvoFonts.serif}
              >
                Solvo finds
              </Text>{' '}
              who solves it.
            </Text>

            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color={solvoColors.textMuted}
              maxWidth="640px"
            >
              Describe what you need in your own words. We match you with the right people, instantly.
            </Text>
          </Flex>
        </motion.div>

        {/* Input box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Box
            maxWidth="720px"
            margin="0 auto"
            bg="white"
            borderRadius="24px"
            padding="20px"
            boxShadow={solvoShadows.heroInput}
            borderWidth="1px"
            borderColor={solvoColors.border}
          >
            <Textarea
              width="100%"
              minHeight="60px"
              border="none"
              outline="none"
              resize="none"
              fontSize="md"
              fontFamily={solvoFonts.sans}
              color={solvoColors.text}
              placeholder="I need catering for 40 people this Saturday..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              style={{ background: 'transparent' }}
            />
            <Flex align="center" justify="space-between" marginTop="12px">
              <Flex gap="14px" align="center" color={solvoColors.textSubtle}>
                <Box cursor="pointer" _hover={{ color: solvoColors.text }}>
                  <Paperclip size={18} />
                </Box>
                <Box cursor="pointer" _hover={{ color: solvoColors.text }}>
                  <Mic size={18} />
                </Box>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  Press ⏎ to send
                </Text>
              </Flex>
              <Flex
                as="button"
                align="center"
                gap="8px"
                bg={solvoColors.text}
                color="white"
                padding="10px 18px"
                borderRadius="14px"
                fontSize="sm"
                fontWeight="500"
                cursor="pointer"
                onClick={handleSubmit}
                _hover={{ bg: solvoColors.indigo }}
              >
                Find options
                <ArrowRight size={14} />
              </Flex>
            </Flex>
          </Box>
        </motion.div>

        {/* Suggested prompts */}
        <Flex
          wrap="wrap"
          gap="8px"
          justify="center"
          marginTop="24px"
          marginBottom="80px"
        >
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <motion.div
              key={prompt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Flex
                as="button"
                padding="8px 14px"
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="full"
                fontSize="sm"
                color={solvoColors.textMuted}
                cursor="pointer"
                onClick={() => {
                  const text = prompt.replace(/^[^\s]+\s/, '');
                  setQuery(text);
                }}
                _hover={{ borderColor: solvoColors.indigoBorder, bg: '#F5F3FF' }}
              >
                {prompt}
              </Flex>
            </motion.div>
          ))}
        </Flex>

        {/* Trust strip */}
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          marginBottom="80px"
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor={solvoColors.border}
        >
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Flex
                key={item.title}
                direction="column"
                gap="8px"
                padding="32px 24px"
                borderRight={{ base: 'none', md: i < 2 ? '1px solid' : 'none' }}
                borderColor={solvoColors.border}
              >
                <Box color={solvoColors.indigo}>
                  <Icon size={20} />
                </Box>
                <Text fontWeight="600" color={solvoColors.text}>
                  {item.title}
                </Text>
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  {item.subtitle}
                </Text>
              </Flex>
            );
          })}
        </Box>

        {/* Categories */}
        <Box marginBottom="80px">
          <Text
            fontFamily={solvoFonts.serif}
            fontSize="3xl"
            fontWeight="500"
            color={solvoColors.text}
            marginBottom="24px"
          >
            Browse by category
          </Text>
          <Box
            display="grid"
            gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
            gap="12px"
          >
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <Flex
                    direction="column"
                    gap="14px"
                    padding="20px"
                    bg="white"
                    borderWidth="1px"
                    borderColor={solvoColors.border}
                    borderRadius="20px"
                    cursor="pointer"
                    _hover={{ borderColor: solvoColors.borderHover }}
                  >
                    <Flex
                      width="48px"
                      height="48px"
                      borderRadius="14px"
                      align="center"
                      justify="center"
                      style={{
                        background: `linear-gradient(135deg, ${cat.from}, ${cat.to})`,
                      }}
                      color={solvoColors.text}
                    >
                      <Icon size={22} />
                    </Flex>
                    <Box>
                      <Text fontWeight="600" color={solvoColors.text} fontSize="sm">
                        {cat.label}
                      </Text>
                      <Text fontSize="xs" color={solvoColors.textSubtle}>
                        {cat.count}
                      </Text>
                    </Box>
                  </Flex>
                </motion.div>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        borderTop="1px solid"
        borderColor={solvoColors.border}
        padding="32px 24px"
        textAlign="center"
        position="relative"
        zIndex={1}
      >
        <Text fontSize="sm" color={solvoColors.textSubtle}>
          © {new Date().getFullYear()} Solvo · Designed in Costa Rica
        </Text>
      </Box>
    </Box>
  );
}

// ── Chat empty state (shown when no conversation is open) ──────────────────
const CHAT_PROMPTS = [
  { emoji: '🎂', label: 'Plan a birthday party' },
  { emoji: '❄️', label: 'Fix my AC' },
  { emoji: '🎧', label: 'Get a DJ for an event' },
  { emoji: '📸', label: 'Hire a photographer' },
  { emoji: '🧽', label: 'Find a cleaning service' },
  { emoji: '🚚', label: 'Need movers this weekend' },
];

interface ChatEmptyStateProps {
  onSend: (query: string) => void;
  onGoHome: () => void;
}

function ChatEmptyState({ onSend, onGoHome }: ChatEmptyStateProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      flex="1"
      gap="28px"
      padding={{ base: '24px', md: '48px' }}
      overflow="auto"
    >
      {/* Back to landing */}
      <button
        onClick={onGoHome}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '13px',
          color: solvoColors.textSubtle,
          padding: '6px 10px',
          borderRadius: '8px',
          alignSelf: 'flex-start',
        }}
      >
        ← Back to homepage
      </button>

      {/* Logo + headline */}
      <Flex direction="column" align="center" gap="12px" textAlign="center">
        <Flex
          width="52px"
          height="52px"
          borderRadius="16px"
          bg={solvoColors.indigoLight}
          color={solvoColors.indigo}
          align="center"
          justify="center"
        >
          <Sparkles size={24} />
        </Flex>
        <Text
          fontFamily={solvoFonts.serif}
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="500"
          color={solvoColors.text}
          letterSpacing="-0.01em"
        >
          What can Solvo help you with?
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} maxWidth="420px">
          Describe what you need and we'll match you with the best local providers instantly.
        </Text>
      </Flex>

      {/* Suggested prompts */}
      <Flex wrap="wrap" gap="8px" justify="center" maxWidth="560px">
        {CHAT_PROMPTS.map((p) => (
          <motion.button
            key={p.label}
            onClick={() => onSend(p.label)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '999px',
              border: `1px solid ${solvoColors.border}`,
              background: 'white',
              fontSize: '13px',
              color: solvoColors.textMuted,
              cursor: 'pointer',
              fontFamily: solvoFonts.sans,
            }}
          >
            {p.emoji} {p.label}
          </motion.button>
        ))}
      </Flex>
    </Flex>
  );
}

// ── Main page component ────────────────────────────────────────────────────
export default function Home() {
  const [mode, setMode] = React.useState<'hero' | 'chat'>('hero');
  const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);
  const [currentConvId, setCurrentConvId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<UiMessage[]>([]);
  const [waitingForAI, setWaitingForAI] = React.useState(false);
  const [currentModel, setCurrentModel] = React.useState<ModelKey>('claude-haiku');

  // When handleSend creates a brand-new conversation, it sets currentConvId
  // mid-send — which would trigger the "load messages" effect and overwrite
  // the optimistic user message with the (still empty) DB state. We stamp the
  // freshly-created id here so that effect skips exactly one fetch; local
  // state already holds the correct messages for that turn.
  const skipNextMessageLoadRef = React.useRef<string | null>(null);

  // Controls the in-flight AI turn so the "stop" button can cancel the
  // underlying network requests (parse / search / generate / send), not just
  // hide the spinner.
  const abortRef = React.useRef<AbortController | null>(null);
  // The conversation id of the in-flight turn — handleStop needs it to roll
  // the aborted turn back server-side (closure-safe; refs don't go stale).
  const activeTurnConvIdRef = React.useRef<string | null>(null);

  // ── Request creation (from "Select" on a provider card) ────────────────
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const [createRequest, createRequestState] = useCreateRequestMutation();
  const [createQuote, createQuoteState] = useCreateQuoteMutation();
  const [searchSuppliers] = useSearchSuppliersLazyQuery({ fetchPolicy: 'network-only' });

  // Device geolocation — requested lazily on the first send so the user
  // sees the browser permission prompt in the context of a real action,
  // not as soon as they land on the page. The cached fix is reused for up
  // to 30 minutes by the hook's internal TTL.
  const { location: deviceLocation, status: locationStatus, request: requestLocation } =
    useUserLocation();
  const [createdRequest, setCreatedRequest] = React.useState<{
    requestId: number;
    providerName: string;
  } | null>(null);
  const [requestError, setRequestError] = React.useState<string | null>(null);

  // Confirmation modal state — opened when "Select" is clicked on a card
  const [selectModal, setSelectModal] = React.useState<{
    provider: ProviderData;
    isRealSupplier: boolean;
    rawQuery: string;
    city: string;
    serviceDate: string;
    guestCount: string;
    message: string;
    budget: string;
  } | null>(null);
  const submittingRequest = createRequestState.loading || createQuoteState.loading;

  const handleSelectProvider = React.useCallback(
    (provider: ProviderData, msg: UiMessage) => {
      setRequestError(null);

      const userMsgs = messages.filter((m) => m.role === 'user');
      const rawQuery =
        userMsgs.length > 0
          ? userMsgs[userMsgs.length - 1].content
          : `Interested in ${provider.name}`;

      const parsed = msg.parsedQuery;
      const cityRaw = parsed?.location?.split(',')[0]?.trim();
      const guestNum = parsed?.people ? Number(parsed.people.replace(/\D/g, '')) : NaN;
      const budgetNum = parsed?.budget ? Number(parsed.budget.replace(/[^\d]/g, '')) : NaN;

      setSelectModal({
        provider,
        isRealSupplier: !!provider.isRealSupplier,
        rawQuery,
        city: cityRaw && cityRaw.length > 0 ? cityRaw : '',
        serviceDate: '',
        guestCount: Number.isFinite(guestNum) && guestNum > 0 ? String(guestNum) : '',
        message: '',
        budget: Number.isFinite(budgetNum) && budgetNum > 0 ? String(budgetNum) : '',
      });
    },
    [messages],
  );

  const handleConfirmRequest = React.useCallback(async () => {
    if (!selectModal) return;

    // Resolve customerId (auth first, fall back to localStorage / prompt for testing)
    let customerId = user?.customerId ?? null;
    if (!customerId) {
      if (isAuthenticated && user && !user.isCustomer) {
        setRequestError(
          'Your account is registered as a supplier — switch to a customer account to create requests.',
        );
        return;
      }
      let customerIdStr =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('solvo.test.customerId')
          : null;
      if (!customerIdStr) {
        customerIdStr =
          window.prompt('Enter your customer ID (or sign in to skip this prompt):') ?? '';
        if (!customerIdStr.trim()) return;
        window.localStorage.setItem('solvo.test.customerId', customerIdStr.trim());
      }
      customerId = Number(customerIdStr);
      if (!Number.isFinite(customerId) || customerId <= 0) {
        setRequestError('Invalid customer ID');
        return;
      }
    }

    if (!selectModal.serviceDate) {
      setRequestError('Pick a service date so the supplier can confirm availability.');
      return;
    }

    const guestCount = selectModal.guestCount ? Number(selectModal.guestCount) : null;
    const budget = selectModal.budget ? Number(selectModal.budget) : null;
    const city = selectModal.city.trim() || null;

    setRequestError(null);
    try {
      const { data } = await createRequest({
        variables: {
          data: {
            customerId,
            rawQuery: selectModal.rawQuery,
            city,
            serviceDate: selectModal.serviceDate,
            guestCount,
            budgetMin: budget,
            budgetMax: budget,
          } as any,
        },
      });
      const requestId = data?.createRequest.requestId;
      if (!requestId) throw new Error('Failed to create request');

      // Link this Request back to the conversation that produced it, so the
      // AI chat connects to the Request → Quote → Booking pipeline.
      // Best-effort — the request is already created either way.
      if (currentConvId) {
        linkConversationToRequest(currentConvId, requestId).catch(() => {
          /* non-critical — request exists, link is just a convenience */
        });
      }

      // Auto-create a quote when the provider is a real DB supplier
      if (selectModal.isRealSupplier && selectModal.provider.id > 0) {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 14);
        const priceDigits = selectModal.provider.priceLabel.replace(/[^\d]/g, '');
        const totalPrice = priceDigits ? Number(priceDigits) : (budget ?? 0);

        await createQuote({
          variables: {
            data: {
              requestId,
              supplierId: selectModal.provider.id,
              totalPrice,
              currency: 'CRC',
              message: selectModal.message || `Quote for "${selectModal.rawQuery}".`,
              validUntil: validUntil.toISOString(),
            } as any,
          },
        }).catch(() => {
          /* non-fatal — request is created, supplier can quote manually */
        });
      }

      setCreatedRequest({ requestId, providerName: selectModal.provider.name });
      setSelectModal(null);
    } catch (err: any) {
      setRequestError(err?.message ?? 'Failed to create request');
    }
  }, [selectModal, user, isAuthenticated, createRequest, createQuote, currentConvId]);

  // ── Package builder ────────────────────────────────────────────────────
  const [pkgState, setPkgState] = useAtom(packageAtom);
  const packageKeys = React.useMemo(
    () => new Set(pkgState.items.map((i) => i.packageKey)),
    [pkgState.items],
  );

  const handleTogglePackage = React.useCallback(
    (provider: ProviderData) => {
      const key = packageKey(provider);
      setPkgState((prev) => {
        const exists = prev.items.some((i) => i.packageKey === key);
        return {
          items: exists
            ? prev.items.filter((i) => i.packageKey !== key)
            : [...prev.items, { ...provider, packageKey: key }],
        };
      });
    },
    [setPkgState],
  );

  const handleRemovePackageItem = React.useCallback(
    (key: string) => {
      setPkgState((prev) => ({
        items: prev.items.filter((i) => i.packageKey !== key),
      }));
    },
    [setPkgState],
  );

  const handleClearPackage = React.useCallback(() => {
    setPkgState({ items: [] });
  }, [setPkgState]);

  // ── Load conversations on mount + whenever auth state flips ───────────
  // Re-running on `isAuthenticated` change is what makes login show the
  // user's chats (which are scoped server-side by userId) and logout fall
  // back to the device-scoped guest list.
  React.useEffect(() => {
    listConversations()
      .then((convs) => {
        setConversations(convs);
        if (convs.length > 0) {
          setCurrentConvId(convs[0].conversationId);
          setMode('chat');
        } else {
          setCurrentConvId(null);
        }
      })
      .catch((err) => {
        // Surface to console so a misconfigured backend / GraphQL error
        // doesn't silently leave the user looking at an empty sidebar.
        console.error('[chat] failed to load conversations:', err);
      });
  }, [isAuthenticated]);

  // ── Load messages when conversation changes ────────────────────────────
  React.useEffect(() => {
    if (!currentConvId) {
      setMessages([]);
      return;
    }
    // Skip exactly one fetch for a conversation we just created mid-send —
    // its messages already live in local state (the optimistic user message
    // + the AI reply). Fetching here would race the persistence and wipe the
    // user's first message from the UI.
    if (skipNextMessageLoadRef.current === currentConvId) {
      skipNextMessageLoadRef.current = null;
      return;
    }
    getConversation(currentConvId)
      .then((conv) => {
        setMessages(
          conv.messages.map((m) => ({
            messageId: m.messageId,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            model: m.model,
            createdAt: m.createdAt,
            // Restore provider cards that were persisted to DB
            providers:
              m.role === 'assistant' && m.providersJson
                ? (() => {
                    try {
                      return JSON.parse(m.providersJson);
                    } catch {
                      return undefined;
                    }
                  })()
                : undefined,
          })),
        );
      })
      .catch((err) => {
        console.error('[chat] failed to load conversation messages:', err);
      });
  }, [currentConvId]);

  // ── Send message ───────────────────────────────────────────────────────
  const handleSend = React.useCallback(
    async (content: string) => {
      if (!content.trim() || waitingForAI) return;

      // Capture current messages before the state update
      const currentMessages = messages;

      // For the parser, pass the full conversation context so it can
      // accumulate info across multiple user turns.
      const contextQuery = [
        ...currentMessages.filter((m) => m.role === 'user').map((m) => m.content),
        content,
      ].join('. ');

      // Optimistic user message
      const nowStr = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { role: 'user', content, createdAt: nowStr },
      ]);
      setWaitingForAI(true);

      // Switch to chat mode immediately
      setMode('chat');

      // Kick off geolocation in parallel with the chat round-trip. We use
      // whatever fix we already have for THIS round (no awaiting) so the
      // user never waits on the geolocation prompt — but the next turn
      // will benefit from the resolved coordinates.
      const locationForThisTurn = deviceLocation;
      if (!deviceLocation && locationStatus !== 'denied' && locationStatus !== 'requesting') {
        requestLocation().catch(() => {});
      }

      // Fresh AbortController for this turn — the "stop" button aborts it,
      // which cancels every in-flight request that was handed `signal`.
      const controller = new AbortController();
      abortRef.current = controller;
      const signal = controller.signal;

      try {
        // Create conversation if needed
        let convId = currentConvId;
        if (!convId) {
          const title =
            content.length > 60 ? `${content.slice(0, 57)}…` : content;
          const conv = await createConversation(title, currentModel);
          convId = conv.conversationId;
          // Tell the load-messages effect to skip this id's fetch — local
          // state already holds the optimistic user message for this turn,
          // and the AI reply is appended below. Without this, the effect
          // races persistence and the user's first message disappears.
          skipNextMessageLoadRef.current = convId;
          setCurrentConvId(convId);
          setConversations((prev) => [conv, ...prev]);
        }
        // Record the turn's conversation id so handleStop can roll it back.
        activeTurnConvIdRef.current = convId;

        // Total provider cards we ever want to show per turn.
        const TOTAL_CARDS = 5;

        // ── Step 1: parse intent + fields FIRST ──────────────────────────
        // Everything downstream (whether to search, whether to ground the
        // chat AI in DB results) depends on this, so it can't run in
        // parallel with the chat call anymore.
        const parseResult = await parseQueryWithAi(
          contextQuery,
          currentModel,
          locationForThisTurn,
          signal,
        );
        const parsed = parseResult.parsed;

        let aiResult: Awaited<ReturnType<typeof apiSendMessage>>;
        let provData: { parsed: ParsedQuery; providers: ProviderData[] } | null =
          null;

        if (parsed.intent === 'chat') {
          // ── Conversational turn ────────────────────────────────────────
          // No cards. Ground the AI in whatever providers were shown
          // earlier so it can answer "where is PikiTiki?" / "compare the
          // first and last result" factually.
          // eslint-disable-next-line no-console
          console.log('[intent] chat — no provider generation');
          aiResult = await apiSendMessage(
            convId,
            content,
            currentModel,
            groundingContext(buildProviderGrounding(currentMessages)),
            signal,
            SOLVO_CHAT_SYSTEM_PROMPT,
          );
        } else if (parsed.intent === 'network_inquiry') {
          // ── Network lookup ─────────────────────────────────────────────
          // The user is asking ABOUT the supplier network ("are there
          // suppliers in our network?", "do you have DJs in Heredia?"). We
          // search the DB and let the AI answer in text — but show NO cards;
          // this is informational, not a pick-a-provider flow.
          const rawLocation = (parsed.location || '').trim();
          const normalizedCity = rawLocation
            .split(',')[0]
            .replace(/^(in|at|near|around)\s+/i, '')
            .trim();
          const searchVars = {
            serviceQuery: parsed.service?.trim() || null,
            city: normalizedCity || null,
            guestCount: null,
            // Pull a wider set than the card cap — this is reference data for
            // the AI to summarise, not a list of cards.
            limit: 10,
          };
          // eslint-disable-next-line no-console
          console.log('[intent] network_inquiry — searchSuppliers:', searchVars);

          let dbSuppliers: any[] = [];
          try {
            const res = await searchSuppliers({
              variables: { data: searchVars as any },
              context: { fetchOptions: { signal } },
            });
            dbSuppliers = res?.data?.searchSuppliers ?? [];
          } catch (dbErr) {
            // eslint-disable-next-line no-console
            console.error('[DB] network_inquiry search ERROR:', dbErr);
          }

          const dbProviders = dbSuppliers.map((s, i) =>
            dbSupplierToProviderData(s, i),
          );
          // eslint-disable-next-line no-console
          console.log(
            `[intent] network_inquiry — ${dbProviders.length} suppliers found, no cards`,
          );

          aiResult = await apiSendMessage(
            convId,
            content,
            currentModel,
            networkInquiryContext(dbProviders, parsed),
            signal,
            SOLVO_CHAT_SYSTEM_PROMPT,
          );
          // provData stays null — informational answer, no cards rendered.
        } else {
          // ── Service request: DB-first, AI fills only the gap ───────────
          const rawLocation = (parsed.location || '').trim();
          const normalizedCity = rawLocation
            .split(',')[0]
            .replace(/^(in|at|near|around)\s+/i, '')
            .trim();
          const guests = parsed.people
            ? parseInt(parsed.people.replace(/\D/g, ''), 10)
            : NaN;
          const searchVars = {
            serviceQuery: parsed.service?.trim() || null,
            city: normalizedCity || null,
            guestCount:
              Number.isFinite(guests) && guests > 0 ? guests : null,
            limit: TOTAL_CARDS,
          };
          // eslint-disable-next-line no-console
          console.log('[DB] searchSuppliers input:', searchVars);

          // Step 2: DB search (awaited up front — it's fast, and the chat
          // AI needs the results to answer without contradicting the cards).
          // The backend handles location matching: accent-insensitive,
          // city-matches ranked first, and it degrades gracefully to
          // "service matches elsewhere" rather than returning nothing — so
          // no client-side retry is needed.
          let dbSuppliers: any[] = [];
          try {
            const res = await searchSuppliers({
              variables: { data: searchVars as any },
              context: { fetchOptions: { signal } },
            });
            dbSuppliers = res?.data?.searchSuppliers ?? [];
          } catch (dbErr) {
            // eslint-disable-next-line no-console
            console.error('[DB] searchSuppliers ERROR:', dbErr);
          }

          const dbProviders = dbSuppliers.map((s, i) =>
            dbSupplierToProviderData(s, i),
          );
          // Strict: DB results are authoritative. AI only fills the gap up
          // to TOTAL_CARDS — and not at all when the DB already covers it.
          const needFromAi = Math.max(0, TOTAL_CARDS - dbProviders.length);
          // eslint-disable-next-line no-console
          console.log(
            `[providers] db=${dbProviders.length} needFromAi=${needFromAi}`,
          );

          // Step 3: AI top-up sized to exactly the gap. Awaited BEFORE the
          // chat reply so the chat AI knows the final card count — otherwise
          // it hedges with "hold on a moment..." and the user waits for
          // results that already (didn't) arrive.
          let fillRes: Awaited<ReturnType<typeof generateProvidersWithAi>> | null =
            null;
          if (needFromAi > 0) {
            try {
              fillRes = await generateProvidersWithAi(
                parsed,
                currentModel,
                locationForThisTurn,
                needFromAi,
                signal,
              );
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('[AI] generateProvidersWithAi ERROR:', err);
              fillRes = null;
            }
          }

          // Step 4: merge — DB first, AI fills, dedupe by name, cap, and
          // flag EXACTLY one card as recommended.
          const aiProviders: ProviderData[] = fillRes?.providers ?? [];
          const dbNames = new Set(
            dbProviders.map((p) => p.name.toLowerCase()),
          );
          const dedupedAi = aiProviders
            .filter((p) => !dbNames.has(p.name.toLowerCase()))
            // Negative ids so AI cards never collide with real supplierIds.
            .map((p, i) => ({ ...p, id: -1000 - i, isRealSupplier: false }));

          const merged = [...dbProviders, ...dedupedAi]
            .slice(0, TOTAL_CARDS)
            // Single source of truth for the "recommended" ribbon — only the
            // first card gets it, every other card is explicitly cleared.
            .map((p, i) => ({ ...p, recommended: i === 0 }));

          provData = { parsed, providers: merged };

          // Step 5: NOW call the chat AI — grounded in the FINAL card set
          // (count included, even when it's zero). This is what keeps the
          // reply honest: "Here are 4 options" / "I couldn't find any".
          // eslint-disable-next-line no-console
          console.log(
            `[providers] final card count = ${merged.length}`,
          );
          aiResult = await apiSendMessage(
            convId,
            content,
            currentModel,
            searchResultContext(merged, parsed),
            signal,
            SOLVO_CHAT_SYSTEM_PROMPT,
          );
        }

        const aiMsg: UiMessage = {
          messageId: aiResult.messageId,
          role: 'assistant',
          content: aiResult.content,
          model: aiResult.model,
          // Store parsedQuery on every AI message with providers — needed for the
          // Select → createRequest flow. ChatThread only renders the visual
          // "SOLVO UNDERSTOOD" card on the first message that carries it.
          parsedQuery: provData?.parsed ?? undefined,
          providers: provData?.providers ?? undefined,
          createdAt: aiResult.createdAt,
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Persist provider cards to DB so they survive conversation reload
        if (aiResult.messageId && provData?.providers && convId) {
          updateMessageProviders(
            convId,
            aiResult.messageId,
            JSON.stringify(provData.providers),
          ).catch(() => {/* non-critical */});
        }

        // Bump updatedAt in sidebar
        setConversations((prev) =>
          prev
            .map((c) =>
              c.conversationId === convId
                ? { ...c, updatedAt: new Date().toISOString() }
                : c,
            )
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
            ),
        );
      } catch (_err) {
        // On an intentional stop, handleStop already rolled the turn back
        // (local + server) — leave no trace here. Only surface real errors.
        if (!controller.signal.aborted) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '⚠️ Something went wrong. Please try again.',
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } finally {
        // Only clear the ref if it's still THIS turn's controller — a newer
        // turn may have replaced it.
        if (abortRef.current === controller) abortRef.current = null;
        setWaitingForAI(false);
      }
    },
    [
      currentConvId,
      messages,
      waitingForAI,
      currentModel,
      deviceLocation,
      locationStatus,
      requestLocation,
      searchSuppliers,
    ],
  );

  // ── Stop the in-flight AI turn ─────────────────────────────────────────
  // Aborts the controller (cancelling parse / search / generate / send),
  // drops the spinner, and ROLLS THE TURN BACK — both locally (remove the
  // optimistic user message) and server-side (delete the persisted user
  // message, since `sendAiMessage` saves it before calling the model). The
  // result: stopping leaves no half-finished turn behind.
  const handleStop = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setWaitingForAI(false);

    // Drop the optimistic user message from local state.
    setMessages((prev) =>
      prev.length > 0 && prev[prev.length - 1].role === 'user'
        ? prev.slice(0, -1)
        : prev,
    );

    // And undo it server-side (best-effort — fire and forget).
    const convId = activeTurnConvIdRef.current;
    if (convId) {
      rollbackLastTurn(convId).catch(() => {/* non-critical */});
    }
    activeTurnConvIdRef.current = null;
  }, []);

  // ── Go back to hero landing ────────────────────────────────────────────
  const handleGoHome = React.useCallback(() => {
    setMode('hero');
    setCurrentConvId(null);
    setMessages([]);
  }, []);

  // ── New conversation ───────────────────────────────────────────────────
  const handleNewChat = React.useCallback(() => {
    setCurrentConvId(null);
    setMessages([]);
    setMode('chat'); // also switches us in from hero mode
  }, []);

  // ── Delete conversation ────────────────────────────────────────────────
  const handleDelete = React.useCallback(
    async (id: string) => {
      try {
        await apiDeleteConversation(id);
      } catch {
        /* ignore */
      }
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.conversationId !== id);
        if (currentConvId === id) {
          if (remaining.length > 0) {
            setCurrentConvId(remaining[0].conversationId);
          } else {
            setCurrentConvId(null);
            setMode('hero');
          }
        }
        return remaining;
      });
    },
    [currentConvId],
  );

  // ── Select conversation ────────────────────────────────────────────────
  const handleSelectConv = React.useCallback((id: string) => {
    setCurrentConvId(id);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────
  const selectModalEl = (
    <AnimatePresence>
      {selectModal && (
        <motion.div
          key="select-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(28, 25, 23, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => !submittingRequest && setSelectModal(null)}
        >
          <motion.div
            key="select-panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: solvoColors.surface,
              borderRadius: '20px',
              boxShadow: solvoShadows.heroInput,
            }}
          >
            <Flex align="center" justify="space-between" padding="18px 22px" borderBottom={`1px solid ${solvoColors.border}`}>
              <Flex align="center" gap="10px">
                <Box fontSize="22px">{selectModal.provider.avatar}</Box>
                <Box>
                  <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                    {selectModal.provider.name}
                  </Text>
                  <Text fontSize="xs" color={selectModal.isRealSupplier ? solvoColors.emeraldText : solvoColors.amberText}>
                    {selectModal.isRealSupplier
                      ? `Real supplier · ${selectModal.provider.priceLabel}`
                      : `AI-generated · ${selectModal.provider.priceLabel}`}
                  </Text>
                </Box>
              </Flex>
              <Box
                as="button"
                onClick={() => !submittingRequest && setSelectModal(null)}
                width="30px"
                height="30px"
                borderRadius="9px"
                bg="transparent"
                border={`1px solid ${solvoColors.border}`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
              >
                ✕
              </Box>
            </Flex>

            <Box padding="20px 22px">
              {!selectModal.isRealSupplier && (
                <Box padding="10px 12px" borderRadius="10px" bg={solvoColors.amberLight} marginBottom="14px">
                  <Text fontSize="xs" color={solvoColors.amberText}>
                    This is an AI-suggested example. A request will be created, but no quote will auto-generate (the supplier doesn't exist in the DB yet).
                  </Text>
                </Box>
              )}

              <Box marginBottom="12px">
                <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                  Your request
                </Text>
                <textarea
                  value={selectModal.rawQuery}
                  onChange={(e) => setSelectModal({ ...selectModal, rawQuery: e.target.value })}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '11px 13px',
                    borderRadius: '10px',
                    border: `1px solid ${solvoColors.border}`,
                    background: solvoColors.surface,
                    color: solvoColors.text,
                    fontFamily: solvoFonts.sans,
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </Box>

              <Flex gap="10px" wrap="wrap" marginBottom="12px">
                <Box flex="1" minWidth="180px">
                  <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                    Service date *
                  </Text>
                  <input
                    type="datetime-local"
                    value={selectModal.serviceDate}
                    onChange={(e) => setSelectModal({ ...selectModal, serviceDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      border: `1px solid ${solvoColors.border}`,
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      fontFamily: solvoFonts.sans,
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </Box>
                <Box flex="1" minWidth="120px">
                  <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                    Guests
                  </Text>
                  <input
                    type="number"
                    value={selectModal.guestCount}
                    onChange={(e) => setSelectModal({ ...selectModal, guestCount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      border: `1px solid ${solvoColors.border}`,
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      fontFamily: solvoFonts.sans,
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </Box>
              </Flex>

              <Flex gap="10px" wrap="wrap" marginBottom="14px">
                <Box flex="1" minWidth="180px">
                  <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                    City
                  </Text>
                  <input
                    type="text"
                    value={selectModal.city}
                    onChange={(e) => setSelectModal({ ...selectModal, city: e.target.value })}
                    placeholder="Santa Ana"
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      border: `1px solid ${solvoColors.border}`,
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      fontFamily: solvoFonts.sans,
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </Box>
                <Box flex="1" minWidth="120px">
                  <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                    Budget (₡)
                  </Text>
                  <input
                    type="number"
                    value={selectModal.budget}
                    onChange={(e) => setSelectModal({ ...selectModal, budget: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      border: `1px solid ${solvoColors.border}`,
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      fontFamily: solvoFonts.sans,
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </Box>
              </Flex>

              <Box marginBottom="16px">
                <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                  Message to supplier (optional)
                </Text>
                <textarea
                  value={selectModal.message}
                  onChange={(e) => setSelectModal({ ...selectModal, message: e.target.value })}
                  rows={2}
                  placeholder="Any extra context, dietary needs, theme, etc."
                  style={{
                    width: '100%',
                    padding: '11px 13px',
                    borderRadius: '10px',
                    border: `1px solid ${solvoColors.border}`,
                    background: solvoColors.surface,
                    color: solvoColors.text,
                    fontFamily: solvoFonts.sans,
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </Box>

              {requestError && (
                <Box padding="10px 12px" borderRadius="10px" bg={solvoColors.roseLight} color={solvoColors.roseText} marginBottom="14px">
                  <Text fontSize="sm">{requestError}</Text>
                </Box>
              )}

              <Flex gap="10px">
                <Box
                  as="button"
                  onClick={() => !submittingRequest && setSelectModal(null)}
                  padding="11px 18px"
                  borderRadius="12px"
                  bg={solvoColors.surface}
                  color={solvoColors.text}
                  border={`1px solid ${solvoColors.border}`}
                  fontWeight={600}
                  fontSize="14px"
                  cursor="pointer"
                >
                  Cancel
                </Box>
                <button
                  type="button"
                  onClick={handleConfirmRequest}
                  disabled={submittingRequest}
                  style={{
                    flex: 1,
                    padding: '11px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    background: solvoColors.text,
                    color: solvoColors.surface,
                    fontWeight: 600,
                    fontSize: '14px',
                    fontFamily: solvoFonts.sans,
                    cursor: 'pointer',
                    opacity: submittingRequest ? 0.5 : 1,
                  }}
                >
                  {submittingRequest ? 'Sending…' : 'Send request to supplier'}
                </button>
              </Flex>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const feedbackBanner = (
    <>
      {createRequestState.loading && (
        <Box
          position="fixed"
          top="80px"
          right="24px"
          padding="10px 16px"
          borderRadius="10px"
          bg={solvoColors.text}
          color={solvoColors.surface}
          fontSize="sm"
          zIndex={1000}
          style={{ boxShadow: solvoShadows.floatingPanel }}
        >
          Creating request…
        </Box>
      )}
      {createdRequest && (
        <Box
          position="fixed"
          top="80px"
          right="24px"
          padding="14px 18px"
          borderRadius="12px"
          bg={solvoColors.surface}
          border={`1px solid ${solvoColors.emerald}`}
          maxWidth="360px"
          zIndex={1000}
          style={{ boxShadow: solvoShadows.floatingPanel }}
        >
          <Text fontSize="sm" fontWeight={600} color={solvoColors.text} marginBottom="4px">
            Request #{createdRequest.requestId} created
          </Text>
          <Text fontSize="xs" color={solvoColors.textMuted} marginBottom="10px">
            Interested in {createdRequest.providerName}. Suppliers can now send quotes.
          </Text>
          <Flex gap="10px">
            <Link href="/requests" style={{ textDecoration: 'none' }}>
              <Text
                as="span"
                fontSize="xs"
                fontWeight={600}
                color={solvoColors.indigo}
                cursor="pointer"
              >
                View request →
              </Text>
            </Link>
            <Text
              as="span"
              fontSize="xs"
              color={solvoColors.textSubtle}
              cursor="pointer"
              onClick={() => setCreatedRequest(null)}
            >
              Dismiss
            </Text>
          </Flex>
        </Box>
      )}
      {requestError && (
        <Box
          position="fixed"
          top="80px"
          right="24px"
          padding="12px 16px"
          borderRadius="10px"
          bg={solvoColors.roseLight}
          color={solvoColors.roseText}
          maxWidth="360px"
          zIndex={1000}
          style={{ boxShadow: solvoShadows.floatingPanel }}
        >
          <Text fontSize="sm" fontWeight={600} marginBottom="4px">
            Couldn't create request
          </Text>
          <Text fontSize="xs">{requestError}</Text>
          <Text
            as="span"
            fontSize="xs"
            color={solvoColors.roseText}
            cursor="pointer"
            onClick={() => setRequestError(null)}
            marginTop="6px"
            display="inline-block"
          >
            Dismiss
          </Text>
        </Box>
      )}
    </>
  );

  if (mode === 'hero') {
    return (
      <>
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <HeroSection onSubmit={handleSend} onStartChat={handleNewChat} />
        </motion.div>
        {feedbackBanner}
        {selectModalEl}
      </>
    );
  }

  return (
    <>
    <motion.div
      key="chat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100vh', display: 'flex', overflow: 'hidden' }}
    >
      {/* Left: conversation history */}
      <ChatSidebar
        conversations={conversations}
        currentConvId={currentConvId}
        onSelect={handleSelectConv}
        onNew={handleNewChat}
        onDelete={handleDelete}
        onGoHome={handleGoHome}
      />

      {/* Center: nav + thread (or empty state) + composer */}
      <Flex direction="column" flex="1" overflow="hidden" height="100vh">
        <SolvoNavBar activePath="/" onGoHome={handleGoHome} onNewChat={handleNewChat} hideLogo />
        <Flex flex="1" overflow="hidden">
          {currentConvId === null && messages.length === 0 ? (
            <ChatEmptyState onSend={handleSend} onGoHome={handleGoHome} />
          ) : (
            <ChatThread
              messages={messages}
              waitingForAI={waitingForAI}
              packageKeys={packageKeys}
              onTogglePackage={handleTogglePackage}
              onSelectProvider={handleSelectProvider}
            />
          )}

          {/* Right: package panel — only beside active threads, not empty state */}
          {(currentConvId !== null || messages.length > 0) && (
            <PackagePanel
              items={pkgState.items}
              onRemove={handleRemovePackageItem}
              onClear={handleClearPackage}
              onRequestQuotes={() =>
                alert(
                  `Requesting quotes for ${pkgState.items.length} provider(s): ${pkgState.items.map((i) => i.name).join(', ')}`,
                )
              }
            />
          )}
        </Flex>
        <ChatComposer
          onSend={handleSend}
          onStop={handleStop}
          disabled={waitingForAI}
          model={currentModel}
          onModelChange={setCurrentModel}
        />
      </Flex>
    </motion.div>
    {feedbackBanner}
    {selectModalEl}
    </>
  );
}
