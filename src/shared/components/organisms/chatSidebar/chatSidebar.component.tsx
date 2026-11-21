import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';

import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoShadows } from '@constants';
import Logo from '../../molecules/logo/logo.component';
import { useI18n } from '@/shared/i18n';
import type { ConversationSummary } from '@/shared/services/conversation.service';

export interface ChatSidebarProps {
  conversations: ConversationSummary[];
  currentConvId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onGoHome: () => void;
  /** Drawer state below `lg`; always visible inline on `lg`+. */
  isOpen?: boolean;
  onClose?: () => void;
}

function bucket(iso: string): 'today' | 'yesterday' | 'earlier' {
  const d = new Date(iso);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (d >= start) return 'today';
  start.setDate(start.getDate() - 1);
  return d >= start ? 'yesterday' : 'earlier';
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConvId,
  onSelect,
  onNew,
  onDelete,
  onGoHome,
  isOpen = false,
  onClose,
}) => {
  const { t } = useI18n();
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const groups = (['today', 'yesterday', 'earlier'] as const)
    .map((key) => ({ key, items: conversations.filter((c) => bucket(c.updatedAt) === key) }))
    .filter((g) => g.items.length > 0);

  const body = (
    <Flex direction="column" height="100%" width="270px" bg={solvoColors.surface} borderRight="1px solid" borderColor={solvoColors.border}>
      <Flex align="center" justify="space-between" padding="16px" gap="8px">
        <Logo size="sm" onClick={onGoHome} />
        <Flex gap="6px">
          <button
            onClick={onNew}
            title={t('nav.newChat')}
            aria-label={t('nav.newChat')}
            style={{ border: 'none', borderRadius: '10px', padding: '8px', background: solvoColors.accent, color: solvoColors.accentFg, cursor: 'pointer', display: 'flex' }}
          >
            <Plus size={16} />
          </button>
          {onClose && (
            <Box display={{ base: 'block', lg: 'none' }}>
              <button onClick={onClose} aria-label={t('common.close')} style={{ border: 'none', background: 'transparent', color: solvoColors.textMuted, cursor: 'pointer', padding: '8px', display: 'flex' }}>
                <X size={16} />
              </button>
            </Box>
          )}
        </Flex>
      </Flex>

      <Box flex="1" overflowY="auto" padding="0 10px 16px">
        {conversations.length === 0 && (
          <Text fontSize="xs" color={solvoColors.textSubtle} textAlign="center" marginTop="24px">
            {t('chat.noChats')}
          </Text>
        )}
        {groups.map((g) => (
          <Box key={g.key} marginBottom="12px">
            <Text fontSize="10px" fontWeight={700} letterSpacing="0.08em" color={solvoColors.textSubtle} padding="6px 8px">
              {t(`chat.${g.key}`).toUpperCase()}
            </Text>
            {g.items.map((c) => {
              const active = c.conversationId === currentConvId;
              return (
                <Flex
                  key={c.conversationId}
                  align="center"
                  gap="8px"
                  padding="9px 10px"
                  borderRadius="10px"
                  cursor="pointer"
                  bg={active ? solvoColors.accentSoft : 'transparent'}
                  _hover={{ bg: active ? solvoColors.accentSoft : solvoColors.bg }}
                  onClick={() => {
                    onSelect(c.conversationId);
                    onClose?.();
                  }}
                >
                  <Box color={solvoColors.textSubtle} flexShrink={0}>
                    <MessageSquare size={14} />
                  </Box>
                  <Text fontSize="13px" color={solvoColors.text} flex="1" truncate>
                    {c.title}
                  </Text>
                  {confirmId === c.conversationId ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmId(null);
                        onDelete(c.conversationId);
                      }}
                      style={{ border: 'none', borderRadius: '8px', padding: '3px 8px', fontSize: '11px', fontWeight: 600, background: solvoColors.roseLight, color: solvoColors.roseText, cursor: 'pointer' }}
                    >
                      {t('common.delete')}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmId(c.conversationId);
                      }}
                      title={t('chat.deleteChat')}
                      aria-label={t('chat.deleteChat')}
                      style={{ border: 'none', background: 'transparent', color: solvoColors.textSubtle, cursor: 'pointer', padding: '2px', display: 'flex' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </Flex>
              );
            })}
          </Box>
        ))}
      </Box>
    </Flex>
  );

  return (
    <>
      <Box display={{ base: 'none', lg: 'block' }} height="100vh" flexShrink={0}>
        {body}
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Box display={{ base: 'block', lg: 'none' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{ position: 'fixed', inset: 0, background: solvoColors.overlay, zIndex: 1000 }}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 1001, boxShadow: solvoShadows.floatingPanel }}
            >
              {body}
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;
