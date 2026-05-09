import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, Sparkles } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';
import type { ConversationSummary } from '@/shared/services/conversation.service';

export interface ChatSidebarProps {
  conversations: ConversationSummary[];
  currentConvId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  /** Navigate back to the full landing / hero page */
  onGoHome: () => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / 3600000;
  if (diffH < 1) return 'just now';
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  const diffD = diffH / 24;
  if (diffD < 7) return `${Math.floor(diffD)}d ago`;
  return d.toLocaleDateString();
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  currentConvId,
  onSelect,
  onNew,
  onDelete,
  onGoHome,
}) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <Box
      width="260px"
      flexShrink={0}
      height="100vh"
      display="flex"
      flexDirection="column"
      borderRight="1px solid"
      borderColor={solvoColors.border}
      bg="white"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        padding="16px"
        borderBottom="1px solid"
        borderColor={solvoColors.border}
        flexShrink={0}
      >
        <button
          onClick={onGoHome}
          title="Back to home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '8px',
          }}
        >
          <Box
            width="28px"
            height="28px"
            borderRadius="8px"
            bg={solvoColors.indigoLight}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={solvoColors.indigo}
          >
            <Sparkles size={14} />
          </Box>
          <Text
            fontFamily={solvoFonts.serif}
            fontSize="md"
            fontWeight="500"
            color={solvoColors.text}
          >
            Solvo
          </Text>
        </button>

        <Box
          as="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="28px"
          height="28px"
          borderRadius="8px"
          cursor="pointer"
          color={solvoColors.textMuted}
          style={{ border: 'none', background: 'transparent', padding: 0 }}
          onClick={onNew}
          title="New conversation"
        >
          <Plus size={16} />
        </Box>
      </Flex>

      {/* Conversation list */}
      <Box flex="1" overflowY="auto" padding="8px">
        {conversations.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="120px"
            gap="8px"
          >
            <Text fontSize="xs" color={solvoColors.textSubtle} textAlign="center">
              No conversations yet.
              <br />
              Ask Solvo something!
            </Text>
          </Flex>
        ) : (
          <AnimatePresence initial={false}>
            {conversations.map((conv, i) => {
              const isActive = conv.conversationId === currentConvId;
              const isHovered = hoveredId === conv.conversationId;
              const lastMsg = conv.messages?.[0];

              return (
                <motion.div
                  key={conv.conversationId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Box
                    position="relative"
                    padding="10px 12px"
                    borderRadius="10px"
                    cursor="pointer"
                    marginBottom="2px"
                    bg={isActive ? solvoColors.indigoLight : isHovered ? solvoColors.bg : 'transparent'}
                    onClick={() => onSelect(conv.conversationId)}
                    onMouseEnter={() => setHoveredId(conv.conversationId)}
                    onMouseLeave={() => setHoveredId(null)}
                    transition="background 0.15s"
                  >
                    <Flex align="center" gap="8px">
                      <Box color={isActive ? solvoColors.indigo : solvoColors.textSubtle} flexShrink={0}>
                        <MessageSquare size={14} />
                      </Box>
                      <Box flex="1" minWidth="0">
                        <Text
                          fontSize="sm"
                          fontWeight={isActive ? '600' : '400'}
                          color={isActive ? solvoColors.text : solvoColors.textMuted}
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {conv.title}
                        </Text>
                        {lastMsg && (
                          <Text
                            fontSize="xs"
                            color={solvoColors.textSubtle}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatTime(conv.updatedAt)}
                          </Text>
                        )}
                      </Box>
                    </Flex>

                    {/* Delete button (shown on hover) */}
                    {isHovered && (
                      <button
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: solvoColors.textSubtle,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.conversationId);
                        }}
                        title="Delete conversation"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </Box>

      {/* Footer */}
      <Box
        padding="12px 16px"
        borderTop="1px solid"
        borderColor={solvoColors.border}
        flexShrink={0}
      >
        <Text fontSize="xs" color={solvoColors.textSubtle}>
          Powered by AI · Costa Rica
        </Text>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
