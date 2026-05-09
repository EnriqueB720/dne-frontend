import * as React from 'react';
import { motion } from 'framer-motion';
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
  type ConversationSummary,
} from '@/shared/services/conversation.service';

// ── System prompt for chat AI ──────────────────────────────────────────────
const SOLVO_CHAT_SYSTEM_PROMPT = `You are Solvo, an AI concierge for a service marketplace in Costa Rica.

RULES — follow exactly:
1. LANGUAGE: Detect the language of the user's latest message and reply in that EXACT language. If their message is in English, reply in English. If Spanish, reply in Spanish. Never mix languages.
2. BREVITY: Keep every response to 1–3 sentences maximum.
3. PROVIDER CARDS: Provider option cards are shown AUTOMATICALLY below your message — do NOT list or describe specific businesses yourself. Just acknowledge the user's request and invite them to check the cards.
4. QUESTIONS: Ask at most ONE clarifying question per turn. If you already have a service type and a city, do not ask more questions — just say you found matches.
5. FORMAT: No bullet points, no markdown headers, no numbered lists.

Example good responses:
- "Here are Chinese restaurant options in San José for 2 people around ₡20,000. Let me know if you'd like to adjust anything!"
- "Got it — I've updated the options to focus on budget-friendly picks. Anything else to refine?"
- "Sure! Here are cleaning services available in Escazú this weekend."`;

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

  // ── Load conversations on mount ────────────────────────────────────────
  React.useEffect(() => {
    listConversations()
      .then((convs) => {
        if (convs.length > 0) {
          setConversations(convs);
          setCurrentConvId(convs[0].conversationId);
          setMode('chat');
        }
      })
      .catch(() => {/* network error — stay in hero mode */});
  }, []);

  // ── Load messages when conversation changes ────────────────────────────
  React.useEffect(() => {
    if (!currentConvId) {
      setMessages([]);
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
      .catch(() => {});
  }, [currentConvId]);

  // ── Send message ───────────────────────────────────────────────────────
  const handleSend = React.useCallback(
    async (content: string) => {
      if (!content.trim() || waitingForAI) return;

      // Capture current messages before the state update
      const currentMessages = messages;
      const isFirstTurn = currentMessages.length === 0 && currentConvId === null;

      // Generate providers if: first turn, OR conversation already showed cards before
      // (so follow-up refinements also get updated cards)
      const hasPriorProviders = currentMessages.some(
        (m) => m.role === 'assistant' && m.providers && m.providers.length > 0,
      );
      const shouldGenerateProviders = isFirstTurn || hasPriorProviders;

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

      try {
        // Create conversation if needed
        let convId = currentConvId;
        if (!convId) {
          const title =
            content.length > 60 ? `${content.slice(0, 57)}…` : content;
          const conv = await createConversation(title, currentModel);
          convId = conv.conversationId;
          setCurrentConvId(convId);
          setConversations((prev) => [conv, ...prev]);
        }

        // AI text response (always)
        const aiTextPromise = apiSendMessage(
          convId,
          content,
          currentModel,
          SOLVO_CHAT_SYSTEM_PROMPT,
        );

        // Provider generation — first turn AND follow-up refinements
        const providerPromise: Promise<{
          parsed: ParsedQuery;
          providers: ProviderData[];
        } | null> = shouldGenerateProviders
          ? parseQueryWithAi(contextQuery, currentModel).then((parseResult) =>
              generateProvidersWithAi(parseResult.parsed, currentModel).then(
                (genResult) => ({
                  parsed: parseResult.parsed,
                  providers: genResult.providers,
                }),
              ),
            )
          : Promise.resolve(null);

        const [aiResult, provData] = await Promise.all([
          aiTextPromise,
          providerPromise,
        ]);

        const aiMsg: UiMessage = {
          messageId: aiResult.messageId,
          role: 'assistant',
          content: aiResult.content,
          model: aiResult.model,
          // Show the "SOLVO UNDERSTOOD" card only on the first turn
          parsedQuery: isFirstTurn ? (provData?.parsed ?? undefined) : undefined,
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
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '⚠️ Something went wrong. Please try again.',
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setWaitingForAI(false);
      }
    },
    [currentConvId, messages, waitingForAI, currentModel],
  );

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
  if (mode === 'hero') {
    return (
      <motion.div
        key="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <HeroSection onSubmit={handleSend} onStartChat={handleNewChat} />
      </motion.div>
    );
  }

  return (
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
        <SolvoNavBar activePath="/" onGoHome={handleGoHome} onNewChat={handleNewChat} />
        <Flex flex="1" overflow="hidden">
          {currentConvId === null && messages.length === 0 ? (
            <ChatEmptyState onSend={handleSend} onGoHome={handleGoHome} />
          ) : (
            <ChatThread
              messages={messages}
              waitingForAI={waitingForAI}
              packageKeys={packageKeys}
              onTogglePackage={handleTogglePackage}
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
          disabled={waitingForAI}
          model={currentModel}
          onModelChange={setCurrentModel}
        />
      </Flex>
    </motion.div>
  );
}
