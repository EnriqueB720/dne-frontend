import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, MoreVertical, Plus, Sparkles, Trash2 } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
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

  // Row menu state — mirrors the pattern used in /messages
  const [menuFor, setMenuFor] = React.useState<string | null>(null);
  const [confirmDeleteFor, setConfirmDeleteFor] = React.useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<{ top: number; left: number } | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const closeMenu = React.useCallback(() => {
    setMenuFor(null);
    setConfirmDeleteFor(null);
    setMenuAnchor(null);
  }, []);

  const openMenuAtElement = (el: HTMLElement, conversationId: string) => {
    const rect = el.getBoundingClientRect();
    const POPOVER_WIDTH = 240;
    const left = Math.max(
      8,
      Math.min(window.innerWidth - POPOVER_WIDTH - 8, rect.right - POPOVER_WIDTH),
    );
    setMenuAnchor({ top: rect.bottom + 4, left });
    setMenuFor(conversationId);
    setConfirmDeleteFor(null);
  };

  const openMenuAtMouse = (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    const POPOVER_WIDTH = 240;
    const left = Math.max(8, Math.min(window.innerWidth - POPOVER_WIDTH - 8, e.clientX));
    setMenuAnchor({ top: e.clientY, left });
    setMenuFor(conversationId);
    setConfirmDeleteFor(null);
  };

  React.useEffect(() => {
    if (menuFor === null) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    const handleScroll = () => closeMenu();
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuFor, closeMenu]);

  const handleDelete = (id: string) => {
    onDelete(id);
    closeMenu();
  };

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
      position="relative"
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
              const isMenuOpen = menuFor === conv.conversationId;
              const lastMsg = conv.messages?.[0];

              return (
                <motion.div
                  key={conv.conversationId}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <Box
                    position="relative"
                    padding="10px 12px"
                    borderRadius="10px"
                    cursor="pointer"
                    marginBottom="2px"
                    bg={isActive ? solvoColors.indigoLight : isHovered ? solvoColors.bg : 'transparent'}
                    onClick={() => onSelect(conv.conversationId)}
                    onContextMenu={(e) => openMenuAtMouse(e, conv.conversationId)}
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
                            paddingRight: '20px',
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

                    {/* Kebab button — always rendered on hover / when menu is open */}
                    {(isHovered || isMenuOpen) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isMenuOpen) closeMenu();
                          else openMenuAtElement(e.currentTarget, conv.conversationId);
                        }}
                        aria-label="Conversation actions"
                        title="Conversation actions"
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '22px',
                          height: '22px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'transparent',
                          padding: 0,
                          color: solvoColors.textSubtle,
                        }}
                      >
                        <MoreVertical size={14} />
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

      {/* Floating row-action menu — page-level fixed so it isn't clipped by the sidebar's overflow */}
      <AnimatePresence>
        {menuFor !== null && menuAnchor && (
          <motion.div
            ref={menuRef as any}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: menuAnchor.top,
              left: menuAnchor.left,
              zIndex: 1000,
              width: '240px',
              background: solvoColors.surface,
              border: `1px solid ${solvoColors.border}`,
              borderRadius: '12px',
              padding: '6px',
              boxShadow: solvoShadows.floatingPanel,
            }}
          >
            {confirmDeleteFor === menuFor ? (
              <Box padding="8px 10px">
                <Text fontSize="xs" color={solvoColors.text} fontWeight={600} marginBottom="4px">
                  Delete this chat?
                </Text>
                <Text fontSize="11px" color={solvoColors.textSubtle} marginBottom="10px">
                  This conversation will be permanently deleted. This can't be undone.
                </Text>
                <Flex gap="6px">
                  <button
                    type="button"
                    onClick={closeMenu}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      border: `1px solid ${solvoColors.border}`,
                      fontSize: '12px',
                      fontWeight: 600,
                      fontFamily: solvoFonts.sans,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(menuFor)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: solvoColors.roseText,
                      color: solvoColors.surface,
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      fontFamily: solvoFonts.sans,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </Flex>
              </Box>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDeleteFor(menuFor)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: solvoFonts.sans,
                }}
              >
                <Flex align="center" gap="8px" color={solvoColors.roseText}>
                  <Trash2 size={13} />
                  <Text fontSize="13px" fontWeight={600}>
                    Delete conversation
                  </Text>
                </Flex>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ChatSidebar;
