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
  useSuppliersQuery,
  ContactChannel,
} from '@generated';
import { useUserLocation } from '@hooks';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';
import type { UiMessage } from '@/shared/lib/chat';
import { fromStoredJson, type ChatSupplier, categoryName } from '@/shared/lib/supplier';
import { runChatTurn } from '@/shared/services/chat.service';
import { logSupplierContact } from '@/shared/services/contact.service';
import {
  deleteConversation as apiDeleteConversation,
  getConversation,
  getOrCreateDeviceId,
  listConversations,
  type ConversationSummary,
} from '@/shared/services/conversation.service';

const ZONE_STORAGE_KEY = 'solvo:zone';
const GUEST_BANNER_KEY = 'solvo:guest-banner-dismissed';

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

  /**
   * One turn = one chatTurn call. The API parses the message, searches the
   * DB in one province, grounds the reply on those suppliers and saves the
   * turn (see dne-backend src/api/assistant). We only send the message and
   * where the user is.
   */
  const handleSend = React.useCallback(
    async (content: string) => {
      if (!content.trim() || waitingForAI) return;
      setMessages((prev) => [...prev, { role: 'user', content, createdAt: new Date().toISOString() }]);
      setWaitingForAI(true);
      setMode('chat');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const turn = await runChatTurn(
          {
            conversationId: currentConvId,
            message: content,
            deviceId: getOrCreateDeviceId(),
            province: zone.mode === 'picked' ? zone.code : null,
            lat: zone.mode === 'device' && deviceLocation ? deviceLocation.lat : null,
            lng: zone.mode === 'device' && deviceLocation ? deviceLocation.lng : null,
          },
          controller.signal,
        );

        setMessages((prev) => [
          ...prev,
          ...turn.replies.map(
            (r): UiMessage => ({
              messageId: r.messageId,
              role: 'assistant',
              content: r.content,
              model: r.model,
              createdAt: r.createdAt,
              suppliers: fromStoredJson(r.providersJson),
              service: r.service ?? undefined,
              zoneName: r.zoneName ?? null,
            }),
          ),
        ]);

        if (!currentConvId) {
          skipNextLoadRef.current = turn.conversationId;
          setCurrentConvId(turn.conversationId);
          setConversations((prev) => [
            { conversationId: turn.conversationId, title: turn.title, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [] },
            ...prev,
          ]);
        } else {
          bumpConversation(turn.conversationId);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('[chat] turn failed:', err);
          setMessages((prev) => [...prev, { role: 'assistant', content: t('chat.error'), createdAt: new Date().toISOString() }]);
        }
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setWaitingForAI(false);
      }
    },
    [currentConvId, waitingForAI, zone, deviceLocation, t],
  );

  /**
   * Stop: cancel the request. The API only saves a turn once the reply is
   * ready and the client is still connected, so nothing needs rolling back.
   */
  const handleStop = React.useCallback(() => {
    abortRef.current?.abort(new DOMException('User stopped the response', 'AbortError'));
    abortRef.current = null;
    setWaitingForAI(false);
    setMessages((prev) => (prev.length && prev[prev.length - 1].role === 'user' ? prev.slice(0, -1) : prev));
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
