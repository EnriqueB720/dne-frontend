import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowRight, Map as MapIcon, ShieldCheck, Star, Sparkles, X } from 'lucide-react';

import { Box, ChatComposer, ChatSidebar, ChatThread, Flex, SolvoNavBar, Text, type ZoneState } from '@components';
import { solvoColors, solvoFonts, solvoGlows, solvoGradients, solvoShadows } from '@constants';
import {
  useCategoriesQuery,
  useProvincesQuery,
  useResolveProvinceLazyQuery,
  useSearchSuppliersLazyQuery,
  useSuppliersQuery,
  ContactChannel,
  type SearchSuppliersQuery,
} from '@generated';
import { useUserLocation } from '@hooks';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';
import type { UiMessage } from '@/shared/lib/chat';
import { fromStoredJson, toChatSupplier, type ChatSupplier, categoryName } from '@/shared/lib/supplier';
import { isAdditiveFollowupRequest, parseQueryWithAi, wantsMoreResults, type ParsedQuery } from '@/shared/services/ai.service';
import { logSupplierContact } from '@/shared/services/contact.service';
import {
  createConversation,
  deleteConversation as apiDeleteConversation,
  getConversation,
  listConversations,
  rollbackLastTurn,
  sendMessage as apiSendMessage,
  updateMessageProviders,
  type ConversationSummary,
} from '@/shared/services/conversation.service';

// ─────────────────────────────────────────────────────────────────────────
// How a turn works (see docs/ARCHITECTURE.md → "AI chat"):
//  1. parseQueryWithAi → intent + what/where (backend: Claude, Gemini fallback)
//  2. service_request / network_inquiry → searchSuppliers (DB only, strict to
//     the resolved province: typed place → picked zone → device GPS)
//  3. sendMessage with a grounding block describing EXACTLY those suppliers
//  4. render the reply + one card per supplier found (no padding, no
//     invented suppliers — zero results means zero cards)
// ─────────────────────────────────────────────────────────────────────────

/** Max cards per search. We show every match up to this — never fill gaps. */
const RESULT_LIMIT = 10;
/** The API rejects grounding blocks over 12k chars (cost guard). */
const MAX_GROUNDING_CHARS = 11500;
const ZONE_STORAGE_KEY = 'solvo:zone';
const GUEST_BANNER_KEY = 'solvo:guest-banner-dismissed';

/** "find", "busco", "muéstrame"… — a new search even when cards are on screen. */
const SEARCH_ACTION_RE =
  /\b(?:look(?:\s+(?:for|inside|at|around))?|search(?:\s+for)?|find(?:\s+me)?|show(?:\s+me)?|get(?:\s+me)?|give(?:\s+me)?|need|want|looking(?:\s+for)?|b[uú]sca(?:me|nos|r)?|necesito|ocupo|quiero|dame|mu[eé]str[aá](?:me|nos)?)\b/i;

/** "never mind", "olvídalo"… — drop earlier turns from the parser's context. */
const CONTEXT_CLEAR_RE =
  /\b(?:never\s+mind|forget\s+(?:that|it|the|those|everything|all)?|scratch\s+that|start\s+over|olvida(?:te|lo|los|la|las)?(?:\s+(?:eso|lo\s+anterior|todo))?|mejor\s+no|al\s+final)\b/i;

const SOLVO_CHAT_SYSTEM_PROMPT = `You are Solvo, an assistant that connects people in Costa Rica with local service providers (plumbers, electricians, cleaners, DJs…) and product or material suppliers (bakeries, hardware stores, building materials…).

RULES — follow exactly:
1. LANGUAGE: reply in the language of the user's latest message (Spanish or English). Never mix. In Spanish use "usted".
2. ONLY REAL SUPPLIERS: you may only mention suppliers listed in the context blocks below or earlier in this conversation. NEVER invent a business, a phone number, an email, a website, a price or a review. If nothing matches, say so honestly.
3. ZONE: searches are limited to one province. The "## Search result" block says which one. If 0 suppliers were found there, say that plainly for that province and suggest a neighboring province (they can just name it) or describing the need with other words. If the zone is "unknown", the results are from the whole country — say so and ask which province they need it in.
4. CARDS: in a service request, the supplier cards are shown BELOW your message at the same moment. Speak in present tense ("Here are 3 plumbers that serve Heredia"). Do not list every business again; you may highlight one or two with a short reason (rating, specialty, preferred). NEVER say "one moment", "let me search" or anything implying results are still coming.
5. NETWORK QUESTIONS ("## Network lookup"): no cards are shown — answer in text from the listed data (counts, names, provinces).
6. CONTACT: Solvo connects people directly, there is no booking. When asked how to reach a supplier, give the phone / WhatsApp / email / website from the data, or tell them to tap "Contact" on the card. Never say contact info is hidden. If a supplier has no contact field, say you don't have it.
7. FOLLOW-UPS ("## Known suppliers"): answer questions about suppliers already shown using only that data.
8. STYLE: 1–3 sentences for searches, up to 5 for questions. At most one clarifying question. No markdown headers, no bullet lists.`;

function formatSuppliersForGrounding(list: ChatSupplier[]): string {
  return list
    .map((s, i) => {
      const parts = [
        `${i + 1}. ${s.companyName}`,
        s.tagline && `tagline: ${s.tagline}`,
        `based in: ${[s.city, s.provinceName].filter(Boolean).join(', ') || 'unknown'}`,
        s.serviceProvinceNames?.length && `serves: ${s.serviceProvinceNames.join(', ')}`,
        s.categories?.length && `categories: ${s.categories.map((c) => c.nameEn).join(', ')}`,
        s.skills?.length && `specialties: ${s.skills.join(', ')}`,
        (s.reviewCount ?? 0) > 0 ? `rating: ${Number(s.rating).toFixed(1)} (${s.reviewCount} reviews)` : 'rating: no reviews yet',
        s.services?.length &&
          `services: ${s.services.map((sv) => (sv.priceFrom ? `${sv.name} from ₡${Number(sv.priceFrom).toLocaleString('en-US')}${sv.priceUnit ? `/${sv.priceUnit}` : ''}` : sv.name)).join('; ')}`,
        s.verified && 'verified by Solvo',
        s.preferred && 'preferred supplier',
        s.businessPhone && `phone: ${s.businessPhone}`,
        s.whatsappNumber && `whatsapp: ${s.whatsappNumber}`,
        s.businessEmail && `email: ${s.businessEmail}`,
        s.websiteUrl && `website: ${s.websiteUrl}`,
      ];
      return parts.filter(Boolean).join(' | ');
    })
    .join('\n');
}

function zoneLine(zoneName: string | null): string {
  return zoneName ? `zone: ${zoneName} province (only suppliers serving it were searched)` : 'zone: unknown (searched the whole country)';
}

function searchResultContext(list: ChatSupplier[], parsed: ParsedQuery, zoneName: string | null): string {
  const what = parsed.service ? `"${parsed.service}"` : 'any supplier';
  if (list.length === 0) {
    return `## Search result\n${zoneLine(zoneName)}\nrequest: ${what}\n0 suppliers found — NO cards are shown. Say so honestly; do not invent any.`;
  }
  return `## Search result\n${zoneLine(zoneName)}\nrequest: ${what}\n${list.length} supplier card(s) are shown below your message right now:\n${formatSuppliersForGrounding(list)}`;
}

function networkContext(list: ChatSupplier[], parsed: ParsedQuery, zoneName: string | null): string {
  return (
    `## Network lookup\n${zoneLine(zoneName)}\nquestion about: ${parsed.service || 'the supplier network'}\n` +
    (list.length === 0
      ? '0 suppliers match. Say so honestly. No cards are shown.'
      : `${list.length} matching supplier(s), NO cards are shown — answer in text:\n${formatSuppliersForGrounding(list)}`)
  );
}

function lastShownSuppliers(messages: UiMessage[]): ChatSupplier[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role === 'assistant' && m.suppliers?.length) return m.suppliers;
  }
  return [];
}

// ── Landing ──────────────────────────────────────────────────────────────

function Hero({ onSubmit }: { onSubmit: (q: string) => void }) {
  const { t, messages, lang } = useI18n();
  const [query, setQuery] = React.useState('');
  const { data: cats } = useCategoriesQuery({ fetchPolicy: 'cache-first' });
  const icons = [ShieldCheck, MapIcon, Star];

  const submit = () => query.trim() && onSubmit(query.trim());

  return (
    <Box position="relative" minHeight="100vh" bg={solvoColors.bg} overflow="hidden">
      <Box
        position="absolute"
        top="-240px"
        right="-240px"
        width="900px"
        height="900px"
        borderRadius="full"
        style={{ background: `radial-gradient(circle, ${solvoGlows.brand}, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }}
      />
      <Box
        position="absolute"
        bottom="-240px"
        left="-240px"
        width="900px"
        height="900px"
        borderRadius="full"
        style={{ background: `radial-gradient(circle, ${solvoGlows.accent}, transparent 70%)`, filter: 'blur(70px)', pointerEvents: 'none' }}
      />
      <SolvoNavBar />

      <Box maxWidth="1100px" margin="0 auto" padding={{ base: '32px 18px', md: '56px 24px' }} position="relative" zIndex={1}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Flex direction="column" align="center" gap="18px" textAlign="center" marginBottom="32px">
            <Flex align="center" gap="8px" padding="6px 14px" bg={solvoColors.surface} borderRadius="full" borderWidth="1px" borderColor={solvoColors.border} fontSize="12px" color={solvoColors.textMuted}>
              <Box width="8px" height="8px" borderRadius="full" bg={solvoColors.emerald} />
              {t('home.badge')}
            </Flex>
            <Text fontFamily={solvoFonts.display} fontSize={{ base: '38px', md: '66px' }} lineHeight="1.05" fontWeight={500} color={solvoColors.text} maxWidth="880px" letterSpacing="-0.02em">
              {t('home.titleA')}
              <br />
              <Text
                as="span"
                fontWeight={800}
                style={{ background: solvoGradients.brand, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {t('home.titleB')}
              </Text>{' '}
              {t('home.titleC')}
            </Text>
            <Text fontSize={{ base: 'md', md: 'lg' }} color={solvoColors.textMuted} maxWidth="640px">
              {t('home.subtitle')}
            </Text>
          </Flex>
        </motion.div>

        <Box maxWidth="720px" margin="0 auto" bg={solvoColors.surface} borderRadius="24px" padding="18px" borderWidth="1px" borderColor={solvoColors.border} style={{ boxShadow: solvoShadows.heroInput }}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={t('home.placeholder')}
            rows={2}
            style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: solvoFonts.sans, fontSize: '16px', color: solvoColors.text }}
          />
          <Flex align="center" justify="space-between" marginTop="10px">
            <Text fontSize="xs" color={solvoColors.textSubtle}>
              {t('home.hint')}
            </Text>
            <button
              onClick={submit}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: solvoColors.accent, color: solvoColors.accentFg, padding: '10px 18px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
            >
              {t('home.cta')} <ArrowRight size={14} />
            </button>
          </Flex>
        </Box>

        <Flex wrap="wrap" gap="8px" justify="center" marginTop="20px">
          {messages.home.prompts.map((p) => (
            <button
              key={p}
              onClick={() => onSubmit(p.replace(/^\S+\s/, ''))}
              style={{ padding: '8px 14px', background: solvoColors.surface, border: `1px solid ${solvoColors.border}`, borderRadius: '9999px', fontSize: '14px', color: solvoColors.textMuted, cursor: 'pointer' }}
            >
              {p}
            </button>
          ))}
        </Flex>

        <Text textAlign="center" fontSize="sm" color={solvoColors.textSubtle} marginTop="18px">
          {t('home.loginHint')}
        </Text>

        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} marginTop="56px" borderTop="1px solid" borderBottom="1px solid" borderColor={solvoColors.border}>
          {messages.home.trust.map((item, i) => {
            const Icon = icons[i] ?? Sparkles;
            return (
              <Flex key={item.title} direction="column" gap="6px" padding="26px 22px" borderRight={{ base: 'none', md: i < 2 ? '1px solid' : 'none' }} borderColor={solvoColors.border}>
                <Box color={solvoColors.brand}>
                  <Icon size={20} />
                </Box>
                <Text fontWeight={600} color={solvoColors.text}>
                  {item.title}
                </Text>
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  {item.sub}
                </Text>
              </Flex>
            );
          })}
        </Box>

        {(cats?.categories?.length ?? 0) > 0 && (
          <Box marginTop="56px">
            <Text fontFamily={solvoFonts.display} fontSize="2xl" fontWeight={600} color={solvoColors.text} marginBottom="18px">
              {t('home.categoriesTitle')}
            </Text>
            <Flex wrap="wrap" gap="8px">
              {cats!.categories.map((c) => (
                <button
                  key={c.categoryId}
                  onClick={() => onSubmit(categoryName(c, lang))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: solvoColors.surface, border: `1px solid ${solvoColors.border}`, borderRadius: '14px', fontSize: '14px', color: solvoColors.text, cursor: 'pointer' }}
                >
                  <span>{c.icon}</span> {categoryName(c, lang)}
                </button>
              ))}
            </Flex>
          </Box>
        )}

        <Flex justify="center" marginTop="48px" gap="6px" wrap="wrap" fontSize="sm" color={solvoColors.textMuted}>
          <Text>{t('home.supplierCta')}</Text>
          <Link href="/register?type=supplier" style={{ color: solvoColors.brandText, fontWeight: 700, textDecoration: 'none' }}>
            {t('home.supplierCtaLink')} →
          </Link>
        </Flex>
      </Box>

      <Box borderTop="1px solid" borderColor={solvoColors.border} padding="28px 24px" textAlign="center" position="relative" zIndex={1}>
        <Text fontSize="sm" color={solvoColors.textSubtle}>
          {t('home.footer', { year: new Date().getFullYear() })}
        </Text>
      </Box>
    </Box>
  );
}

// ── Empty chat ───────────────────────────────────────────────────────────

function ChatEmptyState({ onSend, onGoHome, zoneCode, zoneName }: { onSend: (q: string) => void; onGoHome: () => void; zoneCode: string | null; zoneName: string | null }) {
  const { t, messages } = useI18n();
  const router = useRouter();
  const { data } = useSuppliersQuery({ variables: { province: zoneCode, limit: 6 }, fetchPolicy: 'cache-and-network' });
  const list = data?.suppliers ?? [];

  return (
    <Flex direction="column" align="center" flex="1" gap="24px" padding={{ base: '20px', md: '40px' }} overflow="auto">
      <button onClick={onGoHome} style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', color: solvoColors.textSubtle, fontSize: '13px', cursor: 'pointer' }}>
        {t('chat.backHome')}
      </button>
      <Flex direction="column" align="center" gap="10px" textAlign="center">
        <Flex width="52px" height="52px" borderRadius="16px" bg={solvoColors.brandSoft} color={solvoColors.brand} align="center" justify="center">
          <Sparkles size={24} />
        </Flex>
        <Text fontFamily={solvoFonts.display} fontSize={{ base: '2xl', md: '3xl' }} fontWeight={600} color={solvoColors.text}>
          {t('chat.emptyTitle')}
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} maxWidth="440px">
          {t('chat.emptySub')}
        </Text>
      </Flex>
      <Flex wrap="wrap" gap="8px" justify="center" maxWidth="600px">
        {messages.home.prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSend(p.replace(/^\S+\s/, ''))}
            style={{ padding: '8px 14px', borderRadius: '9999px', border: `1px solid ${solvoColors.border}`, background: solvoColors.surface, fontSize: '13px', color: solvoColors.textMuted, cursor: 'pointer' }}
          >
            {p}
          </button>
        ))}
      </Flex>
      {list.length > 0 && (
        <Box width="100%" maxWidth="720px">
          <Text fontSize="11px" fontWeight={700} letterSpacing="0.08em" color={solvoColors.textSubtle} marginBottom="10px">
            {t('chat.browse', { zone: (zoneName ?? t('common.allCountry')).toUpperCase() })}
          </Text>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap="10px">
            {list.map((s) => (
              <Box
                key={s.supplierId}
                onClick={() => router.push(`/providers/${s.supplierId}`)}
                padding="14px"
                bg={solvoColors.surface}
                borderWidth="1px"
                borderColor={s.preferred ? solvoColors.brandBorder : solvoColors.border}
                borderRadius="14px"
                cursor="pointer"
                _hover={{ borderColor: solvoColors.borderHover }}
              >
                <Text fontWeight={600} fontSize="14px" color={solvoColors.text} truncate>
                  {s.companyName}
                </Text>
                <Text fontSize="12px" color={solvoColors.textSubtle} truncate>
                  {[s.city, s.provinceName].filter(Boolean).join(', ')}
                </Text>
                <Text fontSize="12px" color={solvoColors.brandText} marginTop="6px">
                  {t('chat.viewProfile')}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Flex>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const { isAuthenticated } = React.useContext(AuthContext);

  const [mode, setMode] = React.useState<'hero' | 'chat'>('hero');
  const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);
  const [currentConvId, setCurrentConvId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<UiMessage[]>([]);
  const [waitingForAI, setWaitingForAI] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [guestBannerHidden, setGuestBannerHidden] = React.useState(true);

  const skipNextLoadRef = React.useRef<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const activeConvRef = React.useRef<string | null>(null);
  const newConvRef = React.useRef<string | null>(null);

  const [searchSuppliers] = useSearchSuppliersLazyQuery({ fetchPolicy: 'network-only' });

  // ── Zone: picked province ▸ device location ▸ whole country ─────────────
  const { data: provincesData } = useProvincesQuery({ fetchPolicy: 'cache-first' });
  const provinces = React.useMemo(() => provincesData?.provinces ?? [], [provincesData]);
  const { location: deviceLocation, status: locationStatus, request: requestLocation } = useUserLocation();
  const [resolveProvince, { data: deviceZone }] = useResolveProvinceLazyQuery({ fetchPolicy: 'cache-first' });
  const [picked, setPicked] = React.useState<string | null>(null); // code | 'none' | null(=device)

  React.useEffect(() => {
    try {
      setPicked(localStorage.getItem(ZONE_STORAGE_KEY));
      setGuestBannerHidden(localStorage.getItem(GUEST_BANNER_KEY) === '1');
    } catch {
      /* storage blocked */
    }
    // Solvo is location-first: ask for the device position up front. The
    // user can always override it with the "Zona" selector.
    requestLocation().catch(() => undefined);
  }, [requestLocation]);

  React.useEffect(() => {
    if (deviceLocation) resolveProvince({ variables: { lat: deviceLocation.lat, lng: deviceLocation.lng } });
  }, [deviceLocation, resolveProvince]);

  const zone: ZoneState = React.useMemo(() => {
    if (picked && picked !== 'none') {
      return { mode: 'picked', code: picked, name: provinces.find((p) => p.code === picked)?.name ?? picked };
    }
    if (picked === 'none') return { mode: 'none' };
    if (deviceZone?.resolveProvince) {
      return { mode: 'device', code: deviceZone.resolveProvince.code, name: deviceZone.resolveProvince.name };
    }
    return { mode: 'none', locating: locationStatus === 'requesting', denied: locationStatus === 'denied' };
  }, [picked, provinces, deviceZone, locationStatus]);

  const pickZone = (code: string | null) => {
    const value = code ?? 'none';
    setPicked(value);
    try {
      localStorage.setItem(ZONE_STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };
  const selectDeviceZone = () => {
    setPicked(null);
    try {
      localStorage.removeItem(ZONE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    requestLocation().catch(() => undefined);
  };

  // ── Conversations ──────────────────────────────────────────────────────
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
      .catch((err) => console.error('[chat] failed to load conversations:', err));
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!currentConvId) {
      setMessages([]);
      return;
    }
    if (skipNextLoadRef.current === currentConvId) {
      skipNextLoadRef.current = null;
      return;
    }
    getConversation(currentConvId)
      .then((conv) =>
        setMessages(
          conv.messages.map((m) => ({
            messageId: m.messageId,
            role: m.role,
            content: m.content,
            model: m.model,
            createdAt: m.createdAt,
            suppliers: m.role === 'assistant' ? fromStoredJson(m.providersJson) : undefined,
          })),
        ),
      )
      .catch((err) => console.error('[chat] failed to load messages:', err));
  }, [currentConvId]);

  const bumpConversation = (convId: string) =>
    setConversations((prev) =>
      prev
        .map((c) => (c.conversationId === convId ? { ...c, updatedAt: new Date().toISOString() } : c))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    );

  /** DB search in the right zone. Text in the message beats the picked zone. */
  const runSearch = React.useCallback(
    async (parsed: Pick<ParsedQuery, 'service' | 'location'>, limit: number, signal: AbortSignal) => {
      const typed = parsed.location?.trim() || null;
      const res = await searchSuppliers({
        variables: {
          data: {
            query: parsed.service?.trim() || null,
            location: typed,
            province: !typed && zone.mode === 'picked' ? zone.code : null,
            lat: !typed && zone.mode === 'device' && deviceLocation ? deviceLocation.lat : null,
            lng: !typed && zone.mode === 'device' && deviceLocation ? deviceLocation.lng : null,
            limit,
          },
        },
        context: { fetchOptions: { signal } },
      });
      const result: SearchSuppliersQuery['searchSuppliers'] | undefined = res.data?.searchSuppliers;
      return {
        suppliers: (result?.suppliers ?? []).map(toChatSupplier),
        zoneName: result?.province?.name ?? null,
      };
    },
    [searchSuppliers, zone, deviceLocation],
  );

  const handleSend = React.useCallback(
    async (content: string) => {
      if (!content.trim() || waitingForAI) return;
      const history = messages;

      // Parser context: the last two user turns (unless the user reset or
      // added a brand-new topic), so "y en Cartago?" keeps the service.
      const fresh = CONTEXT_CLEAR_RE.test(content) || isAdditiveFollowupRequest(content);
      const recentUser = fresh ? [] : history.filter((m) => m.role === 'user').slice(-2).map((m) => m.content);
      const shown = lastShownSuppliers(history);

      setMessages((prev) => [...prev, { role: 'user', content, createdAt: new Date().toISOString() }]);
      setWaitingForAI(true);
      setMode('chat');

      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;

      try {
        let convId = currentConvId;
        if (!convId) {
          const conv = await createConversation(content.length > 60 ? `${content.slice(0, 57)}…` : content);
          convId = conv.conversationId;
          if (signal.aborted) {
            apiDeleteConversation(convId).catch(() => undefined);
            return;
          }
          skipNextLoadRef.current = convId;
          setCurrentConvId(convId);
          setConversations((prev) => [conv, ...prev]);
          newConvRef.current = convId;
        }
        activeConvRef.current = convId;

        const { parsed } = await parseQueryWithAi(content, recentUser, signal);

        // Once cards are on screen most follow-ups are questions about them —
        // unless the user clearly asks for a new search.
        if (wantsMoreResults(content) || isAdditiveFollowupRequest(content)) {
          parsed.intent = 'service_request';
        } else if (shown.length && parsed.intent === 'service_request' && !SEARCH_ACTION_RE.test(content)) {
          parsed.intent = 'chat';
        }

        const send = (text: string, system: string) =>
          apiSendMessage(convId!, text, { system: system.slice(0, MAX_GROUNDING_CHARS), cachedSystem: SOLVO_CHAT_SYSTEM_PROMPT, signal });

        const push = async (reply: Awaited<ReturnType<typeof send>>, extra: Partial<UiMessage>) => {
          setMessages((prev) => [
            ...prev,
            { messageId: reply.messageId, role: 'assistant', content: reply.content, model: reply.model, createdAt: reply.createdAt, ...extra },
          ]);
          if (extra.suppliers?.length && reply.messageId) {
            updateMessageProviders(convId!, reply.messageId, JSON.stringify(extra.suppliers)).catch(() => undefined);
          }
        };

        if (parsed.intent === 'chat') {
          const ctx = shown.length
            ? `## Known suppliers (already shown — answer only from this data):\n${formatSuppliersForGrounding(shown)}`
            : '## Conversation\nAnswer from the conversation history. If they need a supplier, ask what and where.';
          await push(await send(content, ctx), {});
        } else if (parsed.intent === 'network_inquiry') {
          const { suppliers, zoneName } = await runSearch(parsed, 15, signal);
          await push(await send(content, networkContext(suppliers, parsed, zoneName)), {});
        } else if (parsed.subrequests && parsed.subrequests.length >= 2) {
          // "fontanero y electricista": one search + one reply per topic.
          for (const sub of parsed.subrequests.slice(0, 3)) {
            if (signal.aborted) break;
            const subParsed: ParsedQuery = { ...parsed, ...sub, subrequests: undefined, intent: 'service_request', location: sub.location ?? parsed.location } as ParsedQuery;
            const { suppliers, zoneName } = await runSearch(subParsed, RESULT_LIMIT, signal);
            const reply = await send(`(${subParsed.service}) ${content}`, searchResultContext(suppliers, subParsed, zoneName));
            await push(reply, { suppliers, parsed: subParsed, zoneName });
          }
        } else {
          const { suppliers, zoneName } = await runSearch(parsed, RESULT_LIMIT, signal);
          await push(await send(content, searchResultContext(suppliers, parsed, zoneName)), { suppliers, parsed, zoneName });
        }

        bumpConversation(convId);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('[chat] turn failed:', err);
          setMessages((prev) => [...prev, { role: 'assistant', content: t('chat.error'), createdAt: new Date().toISOString() }]);
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        newConvRef.current = null;
        setWaitingForAI(false);
      }
    },
    [currentConvId, messages, waitingForAI, runSearch, t],
  );

  /** Stop: cancel every in-flight request and roll the turn back server-side. */
  const handleStop = React.useCallback(() => {
    abortRef.current?.abort(new DOMException('User stopped the response', 'AbortError'));
    abortRef.current = null;
    setWaitingForAI(false);
    setMessages((prev) => (prev.length && prev[prev.length - 1].role === 'user' ? prev.slice(0, -1) : prev));
    const convId = activeConvRef.current;
    activeConvRef.current = null;
    if (!convId) return;
    if (newConvRef.current === convId) {
      newConvRef.current = null;
      apiDeleteConversation(convId).catch(() => undefined);
      setConversations((prev) => prev.filter((c) => c.conversationId !== convId));
      setCurrentConvId(null);
    } else {
      rollbackLastTurn(convId).catch(() => undefined);
    }
  }, []);

  /** "Contact": log the lead and show the supplier's contact links inline. */
  const handleContact = React.useCallback(
    (s: ChatSupplier) => {
      logSupplierContact(s.supplierId, ContactChannel.ChatContact, 'chat');
      const hasAny = !!(s.businessPhone || s.whatsappNumber || s.businessEmail || s.websiteUrl);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t(hasAny ? 'chat.contactIntro' : 'chat.noContact', { name: s.companyName }),
          contactFor: hasAny ? s : undefined,
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    [t],
  );

  const goHome = () => {
    setMode('hero');
    setCurrentConvId(null);
    setMessages([]);
  };
  const newChat = () => {
    setCurrentConvId(null);
    setMessages([]);
    setMode('chat');
  };
  const deleteChat = async (id: string) => {
    await apiDeleteConversation(id).catch(() => undefined);
    setConversations((prev) => {
      const rest = prev.filter((c) => c.conversationId !== id);
      if (currentConvId === id) setCurrentConvId(rest[0]?.conversationId ?? null);
      return rest;
    });
  };

  if (mode === 'hero') return <Hero onSubmit={handleSend} />;

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden' }} lang={lang}>
      <ChatSidebar
        conversations={conversations}
        currentConvId={currentConvId}
        onSelect={setCurrentConvId}
        onNew={newChat}
        onDelete={deleteChat}
        onGoHome={goHome}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Flex direction="column" flex="1" minWidth={0} height="100vh" overflow="hidden">
        <SolvoNavBar onGoHome={goHome} onNewChat={newChat} hideLogo onMenuClick={() => setSidebarOpen(true)} />

        {!isAuthenticated && !guestBannerHidden && (
          <Flex align="center" justify="center" gap="10px" padding="8px 16px" bg={solvoColors.brandSoft} color={solvoColors.brandText} fontSize="13px" wrap="wrap">
            <Text>{t('chat.guestBanner')}</Text>
            <Link href="/login" style={{ fontWeight: 700, color: solvoColors.brandText }}>
              {t('chat.guestBannerCta')}
            </Link>
            <button
              onClick={() => {
                setGuestBannerHidden(true);
                try {
                  localStorage.setItem(GUEST_BANNER_KEY, '1');
                } catch {
                  /* ignore */
                }
              }}
              aria-label={t('chat.dismiss')}
              style={{ border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </Flex>
        )}

        <Flex flex="1" minWidth={0} overflow="hidden">
          {currentConvId === null && messages.length === 0 ? (
            <ChatEmptyState onSend={handleSend} onGoHome={goHome} zoneCode={zone.code ?? null} zoneName={zone.name ?? null} />
          ) : (
            <ChatThread
              messages={messages}
              waitingForAI={waitingForAI}
              onContact={handleContact}
              onViewProfile={(s) => router.push(`/providers/${s.supplierId}`)}
            />
          )}
        </Flex>

        <ChatComposer
          onSend={handleSend}
          onStop={handleStop}
          disabled={waitingForAI}
          zone={zone}
          provinces={provinces}
          onPickZone={pickZone}
          onUseDeviceZone={selectDeviceZone}
        />
      </Flex>
    </div>
  );
}
