import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
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

const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  waitingForAI,
  packageKeys = new Set(),
  onTogglePackage,
  onSelectProvider,
}) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or AI starts/stops
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, waitingForAI]);

  // Show the "SOLVO UNDERSTOOD" interpretation card only on the FIRST AI message
  // that carries a parsedQuery. Follow-up messages still receive parsedQuery so
  // their Select buttons can fire createRequest, but we don't re-render the card.
  const firstParsedIdx = messages.findIndex(
    (m) => m.role === 'assistant' && !!m.parsedQuery,
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
                      bg={solvoColors.text}
                      color="white"
                    >
                      <Text fontSize="sm" lineHeight="1.6">
                        {msg.content}
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  /* ── AI bubble ── */
                  <Flex gap="10px" align="flex-start">
                    {/* Avatar */}
                    <Flex
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
                          padding="12px 16px"
                          borderRadius="4px 18px 18px 18px"
                          bg="white"
                          borderWidth="1px"
                          borderColor={solvoColors.border}
                          marginBottom={msg.providers && msg.providers.length > 0 ? '14px' : '0'}
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
            <Flex gap="10px" align="flex-start">
              <Flex
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
                bg="white"
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
