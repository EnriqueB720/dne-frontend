import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { Box, Flex, Text } from '@atoms';
import { solvoColors } from '@constants';
import ContactLinks from '../../molecules/contactLinks/contactLinks.component';
import SupplierCard from '../../molecules/supplierCard/supplierCard.component';
import { useI18n } from '@/shared/i18n';
import type { UiMessage } from '@/shared/lib/chat';
import type { ChatSupplier } from '@/shared/lib/supplier';

/** Text with **bold** spans and newlines. */
function renderContent(text: string): React.ReactNode {
  return text.split('\n').map((line, i, lines) => (
    <React.Fragment key={i}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part,
      )}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

function UnderstoodCard({ msg }: { msg: UiMessage }) {
  const { t } = useI18n();
  if (!msg.service) return null;
  return (
    <Box
      borderRadius="12px"
      padding="10px 14px"
      borderWidth="1px"
      borderColor={solvoColors.brandBorder}
      bg={solvoColors.brandSoft}
      marginBottom="10px"
    >
      <Text fontSize="10px" color={solvoColors.brandText} fontWeight={700} letterSpacing="0.1em" marginBottom="2px">
        {t('chat.understood')}
      </Text>
      <Text fontSize="sm" color={solvoColors.text}>
        {t('chat.lookingFor', { service: msg.service })}{' '}
        {msg.zoneName ? t('chat.inZone', { zone: msg.zoneName }) : t('chat.nationwide')}
      </Text>
    </Box>
  );
}

export interface ChatThreadProps {
  messages: UiMessage[];
  waitingForAI: boolean;
  onContact: (s: ChatSupplier) => void;
  onViewProfile: (s: ChatSupplier) => void;
}

const ChatThread: React.FC<ChatThreadProps> = ({ messages, waitingForAI, onContact, onViewProfile }) => {
  const { t } = useI18n();
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const lastAiRef = React.useRef<HTMLDivElement>(null);
  const wasWaiting = React.useRef(false);

  React.useEffect(() => {
    const finished = wasWaiting.current && !waitingForAI;
    wasWaiting.current = waitingForAI;
    // When a reply lands, show its text first — the cards follow below.
    if (finished && messages[messages.length - 1]?.role === 'assistant') {
      lastAiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, waitingForAI]);

  const lastAiIdx = messages.reduce((acc, m, i) => (m.role === 'assistant' ? i : acc), -1);

  return (
    <Box flex="1" overflowY="auto" padding={{ base: '16px', md: '28px' }}>
      <Box maxWidth="760px" margin="0 auto" width="100%">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.messageId ?? `m-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{ marginBottom: '20px' }}
            >
              {msg.role === 'user' ? (
                <Flex justify="flex-end">
                  <Box
                    maxWidth="80%"
                    padding="11px 15px"
                    borderRadius="18px 18px 4px 18px"
                    bg={solvoColors.accentSoft}
                    border="1px solid"
                    borderColor={solvoColors.accentBorder}
                  >
                    <Text fontSize="sm" lineHeight="1.6" color={solvoColors.text}>
                      {msg.content}
                    </Text>
                  </Box>
                </Flex>
              ) : (
                <Flex gap={{ base: '0', sm: '10px' }} align="flex-start">
                  <Flex
                    display={{ base: 'none', sm: 'flex' }}
                    width="32px"
                    height="32px"
                    borderRadius="10px"
                    bg={solvoColors.brandSoft}
                    color={solvoColors.brand}
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Sparkles size={15} />
                  </Flex>
                  <Box flex="1" minWidth={0}>
                    <UnderstoodCard msg={msg} />
                    {msg.content && (
                      <Box
                        ref={i === lastAiIdx ? lastAiRef : undefined}
                        padding="11px 15px"
                        borderRadius="4px 18px 18px 18px"
                        bg={solvoColors.surface}
                        borderWidth="1px"
                        borderColor={solvoColors.border}
                        marginBottom={msg.suppliers?.length || msg.contactFor ? '12px' : 0}
                      >
                        <Text fontSize="sm" lineHeight="1.65" color={solvoColors.text}>
                          {renderContent(msg.content)}
                        </Text>
                      </Box>
                    )}

                    {msg.contactFor && (
                      <Box
                        padding="12px"
                        borderRadius="14px"
                        bg={solvoColors.surface}
                        borderWidth="1px"
                        borderColor={solvoColors.border}
                      >
                        <ContactLinks
                          supplierId={msg.contactFor.supplierId}
                          supplier={msg.contactFor}
                          source="chat"
                        />
                      </Box>
                    )}

                    {msg.suppliers && msg.suppliers.length > 0 && (
                      <Flex direction="column" gap="10px">
                        {msg.suppliers.map((s, si) => (
                          <SupplierCard
                            key={s.supplierId}
                            supplier={s}
                            index={si}
                            onContact={onContact}
                            onViewProfile={onViewProfile}
                          />
                        ))}
                      </Flex>
                    )}
                  </Box>
                </Flex>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {waitingForAI && (
          <Flex gap="10px" align="center" marginBottom="20px" color={solvoColors.textSubtle}>
            <Flex gap="4px">
              {[0, 0.15, 0.3].map((delay) => (
                <motion.div
                  key={delay}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: solvoColors.brand }}
                />
              ))}
            </Flex>
            <Text fontSize="sm">{t('chat.thinking')}</Text>
          </Flex>
        )}

        <div ref={bottomRef} />
      </Box>
    </Box>
  );
};

export default ChatThread;
