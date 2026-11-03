import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Phone, Mail, MessageCircle, Globe } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { ProviderCard } from '@molecules';
import type { ProviderData } from '@molecules';
import { solvoColors, solvoFonts } from '@constants';
import type { UiMessage } from '@/shared/jotai/conversation.atom';

/** Render text that may contain **bold** markdown spans and newlines. */
function renderContent(text: string): React.ReactNode {
  return text.split('\n').map((line, lineIdx, lines) => (
    <React.Fragment key={lineIdx}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIdx) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={partIdx}>{part.slice(2, -2)}</strong>
        ) : (
          part
        ),
      )}
      {lineIdx < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export interface ChatThreadProps {
  messages: UiMessage[];
  waitingForAI: boolean;
  /** Keys of providers currently in the package (for toggle state) */
  packageKeys?: Set<string>;
  /** Called when user clicks "Add/Remove" on a provider card */
  onTogglePackage?: (provider: ProviderData) => void;
  /** Called when user clicks "Select" on a provider card — starts a Request. */
  onSelectProvider?: (provider: ProviderData, message: UiMessage) => void;
  /** Called when user clicks "View profile" on a provider card. */
  onViewProfile?: (provider: ProviderData) => void;
}

/** Render the "SOLVO UNDERSTOOD" interpretation block */
function ParsedQueryCard({ parsed }: { parsed: NonNullable<UiMessage['parsedQuery']> }) {
  const parts: React.ReactNode[] = [
    <span key="service">Looking for <b>{parsed.service}</b></span>,
  ];
  if (parsed.people) parts.push(<span key="ppl"> for <b>{parsed.people}</b></span>);
  if (parsed.location) parts.push(<span key="loc"> in <b>{parsed.location}</b></span>);
  if (parsed.budget) parts.push(<span key="bud">, around <b>{parsed.budget}</b></span>);
  if (parsed.when) parts.push(<span key="when">, on <b>{parsed.when}</b></span>);
  if (parsed.dietary) parts.push(<span key="diet"> · <b>{parsed.dietary}</b></span>);

  return (
    <Box
      borderRadius="12px"
      padding="12px 16px"
      borderWidth="1px"
      borderColor={solvoColors.indigoBorder}
      marginBottom="12px"
      style={{
        background: `linear-gradient(135deg, ${solvoColors.indigoLight}, white)`,
      }}
    >
      <Text
        fontSize="10px"
        color={solvoColors.indigo}
        fontWeight="600"
        letterSpacing="0.1em"
        marginBottom="4px"
      >
        SOLVO UNDERSTOOD
      </Text>
      <Text fontSize="sm" color={solvoColors.text} lineHeight="1.55">
        {parts}.
      </Text>
    </Box>
  );
}

/** WhatsApp has no separate number field yet — it rides on the primary phone. */
function whatsAppHref(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
}

/**
 * Clickable contact card shown after "Contact" is clicked — tapping an
 * option opens the matching app (dialer, mail client, WhatsApp, browser)
 * directly, so the user can reach the supplier however they prefer.
 */
function ContactRevealCard({ provider }: { provider: ProviderData }) {
  const channels: Array<{
    key: string;
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
  }> = [];

  if (provider.phone) {
    channels.push({
      key: 'phone',
      label: 'Call',
      value: provider.phone,
      href: `tel:${provider.phone.replace(/[^\d+]/g, '')}`,
      icon: <Phone size={14} />,
    });
    channels.push({
      key: 'whatsapp',
      label: 'WhatsApp',
      value: provider.phone,
      href: whatsAppHref(provider.phone),
      icon: <MessageCircle size={14} />,
    });
  }
  if (provider.email) {
    channels.push({
      key: 'email',
      label: 'Email',
      value: provider.email,
      href: `mailto:${provider.email}`,
      icon: <Mail size={14} />,
    });
  }
  if (provider.website) {
    const url = provider.website.trim();
    channels.push({
      key: 'website',
      label: 'Website',
      value: url.replace(/^https?:\/\//, ''),
      href: /^https?:\/\//i.test(url) ? url : `https://${url}`,
      icon: <Globe size={14} />,
    });
  }

  if (channels.length === 0) return null;

  return (
    <Box
      padding="12px 14px"
      borderRadius="14px"
      bg={solvoColors.surface}
      borderWidth="1px"
      borderColor={solvoColors.border}
      marginBottom="14px"
    >
      <Text
        fontSize="10px"
        color={solvoColors.textSubtle}
        fontWeight="600"
        letterSpacing="0.08em"
        marginBottom="8px"
      >
        {provider.name.toUpperCase()}
      </Text>
      <Flex direction="column" gap="6px">
        {channels.map((c) => (
          <a
            key={c.key}
            href={c.href}
            target={c.key === 'website' ? '_blank' : undefined}
            rel={c.key === 'website' ? 'noopener noreferrer' : undefined}
            style={{ textDecoration: 'none' }}
          >
            <Flex
              align="center"
              gap="8px"
              padding="8px 10px"
              borderRadius="10px"
              bg={solvoColors.bg}
              color={solvoColors.text}
              _hover={{ bg: solvoColors.accentSoft }}
            >
              <Box color={solvoColors.accent}>{c.icon}</Box>
              <Text fontSize="xs" fontWeight="600" color={solvoColors.textSubtle}>
                {c.label}
              </Text>
              <Text fontSize="sm" style={{ wordBreak: 'break-all' }}>
                {c.value}
              </Text>
            </Flex>
          </a>
        ))}
      </Flex>
    </Box>
  );
}

const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  waitingForAI,
  packageKeys = new Set(),
  onTogglePackage,
  onSelectProvider,
  onViewProfile,
}) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);
  // Attached to the last AI message's text bubble — we scroll here when AI
  // responds so the user sees the text first, not the bottom of the card list.
  const latestAiMsgRef = React.useRef<HTMLDivElement>(null);
  // Track previous waitingForAI to detect the transition waiting→done.
  const prevWaitingRef = React.useRef(false);

  React.useEffect(() => {
    const wasWaiting = prevWaitingRef.current;
    prevWaitingRef.current = waitingForAI;

    if (waitingForAI) {
      // AI started thinking — scroll to bottom so the spinner is visible.
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (wasWaiting && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        // AI just finished — scroll to the top of the AI text bubble so the
        // user reads the response first; cards are below and require a scroll.
        latestAiMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // Default (conversation load, user message): scroll to bottom.
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, waitingForAI]);

  // Show the "SOLVO UNDERSTOOD" interpretation card only on the FIRST AI message
  // that carries a parsedQuery. Follow-up messages still receive parsedQuery so
  // their Select buttons can fire createRequest, but we don't re-render the card.
  const firstParsedIdx = messages.findIndex(
    (m) => m.role === 'assistant' && !!m.parsedQuery,
  );

  // Index of the last AI message — latestAiMsgRef is attached to it so we
  // can scroll to its text bubble (not the bottom of its card list).
  const lastAiIdx = messages.reduce(
    (acc, m, i) => (m.role === 'assistant' ? i : acc),
    -1,
  );

  return (
    <Box
      flex="1"
      overflowY="auto"
      padding={{ base: '16px', md: '32px' }}
      display="flex"
      flexDirection="column"
      gap="0"
    >
      <Box maxWidth="760px" margin="0 auto" width="100%">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';

            return (
              <motion.div
                key={msg.messageId ?? `msg-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ marginBottom: '20px' }}
              >
                {isUser ? (
                  /* ── User bubble ── */
                  <Flex justify="flex-end">
                    <Box
                      maxWidth="75%"
                      padding="12px 16px"
                      borderRadius="18px 18px 4px 18px"
                      bg={solvoColors.accentSoft}
                      color={solvoColors.text}
                      border="1px solid"
                      borderColor={solvoColors.accentBorder}
                    >
                      <Text fontSize="sm" lineHeight="1.6">
                        {msg.content}
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  /* ── AI bubble ── */
                  <Flex gap={{ base: '0', sm: '10px' }} align="flex-start">
                    {/* Avatar — hidden on phone view so the AI content
                        can use the full container width instead of being
                        offset 42px to the right of the user bubbles. */}
                    <Flex
                      display={{ base: 'none', sm: 'flex' }}
                      width="32px"
                      height="32px"
                      borderRadius="10px"
                      bg={solvoColors.indigoLight}
                      color={solvoColors.indigo}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      marginTop="2px"
                    >
                      <Sparkles size={15} />
                    </Flex>

                    <Box flex="1" minWidth="0">
                      {/* Model label */}
                      {msg.model && (
                        <Text
                          fontSize="11px"
                          color={solvoColors.textSubtle}
                          marginBottom="4px"
                        >
                          Solvo · {msg.model}
                        </Text>
                      )}

                      {/* Parsed query interpretation card — only on the first AI message */}
                      {msg.parsedQuery && i === firstParsedIdx && (
                        <ParsedQueryCard parsed={msg.parsedQuery} />
                      )}

                      {/* Text content */}
                      {msg.content && (
                        <Box
                          ref={i === lastAiIdx ? latestAiMsgRef : undefined}
                          padding="12px 16px"
                          borderRadius="4px 18px 18px 18px"
                          bg={solvoColors.surface}
                          borderWidth="1px"
                          borderColor={solvoColors.border}
                          marginBottom={
                            (msg.providers && msg.providers.length > 0) || msg.contactReveal
                              ? '14px'
                              : '0'
                          }
                        >
                          <Text
                            fontSize="sm"
                            lineHeight="1.65"
                            color={solvoColors.text}
                          >
                            {renderContent(msg.content)}
                          </Text>
                        </Box>
                      )}

                      {/* Clickable contact card — shown after "Contact" is clicked */}
                      {msg.contactReveal && <ContactRevealCard provider={msg.contactReveal} />}

                      {/* Provider cards */}
                      {msg.providers && msg.providers.length > 0 && (
                        <Flex direction="column" gap="12px">
                          {msg.providers.map((p, pi) => {
                            const key = `${p.name}__${p.priceLabel}`;
                            return (
                              <ProviderCard
                                key={p.id}
                                provider={p}
                                index={pi}
                                isInPackage={packageKeys.has(key)}
                                onTogglePackage={onTogglePackage}
                                onSelect={
                                  onSelectProvider
                                    ? (prov) => onSelectProvider(prov, msg)
                                    : undefined
                                }
                                onViewProfile={onViewProfile}
                              />
                            );
                          })}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Thinking indicator */}
        {waitingForAI && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '20px' }}
          >
            <Flex gap={{ base: '0', sm: '10px' }} align="flex-start">
              <Flex
                display={{ base: 'none', sm: 'flex' }}
                width="32px"
                height="32px"
                borderRadius="10px"
                bg={solvoColors.indigoLight}
                color={solvoColors.indigo}
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Sparkles size={15} />
              </Flex>
              <Box
                padding="14px 18px"
                borderRadius="4px 18px 18px 18px"
                bg={solvoColors.surface}
                borderWidth="1px"
                borderColor={solvoColors.border}
              >
                <Flex gap="4px" align="center">
                  {[0, 0.15, 0.3].map((delay) => (
                    <motion.div
                      key={delay}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay }}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: solvoColors.indigo,
                      }}
                    />
                  ))}
                </Flex>
              </Box>
            </Flex>
          </motion.div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !waitingForAI && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="200px"
            gap="8px"
            opacity={0.5}
          >
            <Sparkles size={24} color={solvoColors.indigo} />
            <Text fontSize="sm" color={solvoColors.textSubtle}>
              Start typing to ask Solvo anything
            </Text>
          </Flex>
        )}

        <div ref={bottomRef} />
      </Box>
    </Box>
  );
};

export default ChatThread;
