import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MoreVertical, RotateCcw, Send, ShieldAlert, Trash2 } from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  ConversationStatus,
  useConversationsByCustomerLazyQuery,
  useConversationsBySupplierLazyQuery,
  useMessagesByConversationLazyQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useArchiveConversationMutation,
  useRestoreConversationMutation,
} from '@generated';

type ChatRole = 'customer' | 'supplier';

const sectionStyle: React.CSSProperties = {
  background: solvoColors.surface,
  border: `1px solid ${solvoColors.border}`,
  borderRadius: '16px',
  padding: '0',
  overflow: 'hidden',
};

const formatTime = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  return sameDay
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useContext(AuthContext);

  const role: ChatRole = user?.customerId
    ? 'customer'
    : user?.supplierId
      ? 'supplier'
      : 'customer';
  const actorId = role === 'customer' ? user?.customerId ?? null : user?.supplierId ?? null;
  const viewerUserId = user?.userId ?? null;

  // Selected conversation comes from the URL so refreshing keeps state
  const selectedId = router.query.id ? Number(router.query.id) : null;

  const [feedback, setFeedback] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Inbox filter: 'active' (default) or 'archived' — declared up here so the
  // useEffect dependency array can read filterStatus without hitting the TDZ.
  const [inboxFilter, setInboxFilter] = useState<'active' | 'archived'>('active');
  const filterStatus =
    inboxFilter === 'active' ? ConversationStatus.Active : ConversationStatus.Archived;

  // ── Inbox list ──────────────────────────────────────────────────────
  const [fetchByCustomer, byCustomerState] = useConversationsByCustomerLazyQuery({
    fetchPolicy: 'network-only',
    pollInterval: 15_000,
  });
  const [fetchBySupplier, bySupplierState] = useConversationsBySupplierLazyQuery({
    fetchPolicy: 'network-only',
    pollInterval: 15_000,
  });
  const conversations: any[] =
    role === 'customer'
      ? byCustomerState.data?.conversationsByCustomer ?? []
      : bySupplierState.data?.conversationsBySupplier ?? [];

  useEffect(() => {
    if (!actorId) return;
    if (role === 'customer') {
      fetchByCustomer({ variables: { customerId: actorId, viewerUserId: viewerUserId!, status: filterStatus } });
    } else {
      fetchBySupplier({ variables: { supplierId: actorId, viewerUserId: viewerUserId!, status: filterStatus } });
    }
  }, [actorId, role, filterStatus, fetchByCustomer, fetchBySupplier]);

  // ── Thread messages (only when a conversation is selected) ───────────
  const [fetchMessages, messagesState] = useMessagesByConversationLazyQuery({
    fetchPolicy: 'network-only',
    pollInterval: 5_000, // faster polling on the open thread
  });
  const messages = (messagesState.data?.messagesByConversation ?? []) as any[];

  const [sendMessage, sendState] = useSendMessageMutation();
  const [markRead] = useMarkMessagesAsReadMutation();
  const [archiveConversation, archiveState] = useArchiveConversationMutation();
  const [restoreConversation, restoreState] = useRestoreConversationMutation();

  // Row menu: which conversation's "..." menu is open, and what stage
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [confirmDeleteFor, setConfirmDeleteFor] = useState<number | null>(null);
  // Where to position the floating menu (page-level fixed coordinates)
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setMenuFor(null);
    setConfirmDeleteFor(null);
    setMenuAnchor(null);
  };

  const openMenuAtElement = (el: HTMLElement, conversationId: number) => {
    const rect = el.getBoundingClientRect();
    const POPOVER_WIDTH = 240;
    const left = Math.max(8, Math.min(window.innerWidth - POPOVER_WIDTH - 8, rect.right - POPOVER_WIDTH));
    setMenuAnchor({ top: rect.bottom + 4, left });
    setMenuFor(conversationId);
    setConfirmDeleteFor(null);
  };

  const openMenuAtMouse = (e: React.MouseEvent, conversationId: number) => {
    e.preventDefault();
    const POPOVER_WIDTH = 240;
    const left = Math.max(8, Math.min(window.innerWidth - POPOVER_WIDTH - 8, e.clientX));
    setMenuAnchor({ top: e.clientY, left });
    setMenuFor(conversationId);
    setConfirmDeleteFor(null);
  };

  // Close menu on outside-click, Escape, scroll
  useEffect(() => {
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
  }, [menuFor]);

  const handleArchive = async (conversationId: number) => {
    try {
      await archiveConversation({
        variables: { data: { conversationId, userId: viewerUserId! } },
      });
      // If the archived conversation was open, close the thread view
      if (selectedId === conversationId) {
        router.push('/messages', undefined, { shallow: true });
      }
      closeMenu();
      if (actorId && role === 'customer') {
        fetchByCustomer({ variables: { customerId: actorId, viewerUserId: viewerUserId!, status: filterStatus } });
      } else if (actorId && role === 'supplier') {
        fetchBySupplier({ variables: { supplierId: actorId, viewerUserId: viewerUserId!, status: filterStatus } });
      }
      setFeedback('Conversation deleted.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err?.message ?? 'Failed to delete');
    }
  };

  const handleRestore = async (conversationId: number) => {
    try {
      await restoreConversation({ variables: { data: { conversationId, userId: viewerUserId! } } });
      closeMenu();
      if (actorId && role === 'customer') {
        fetchByCustomer({ variables: { customerId: actorId, viewerUserId: viewerUserId!, status: filterStatus } });
      } else if (actorId && role === 'supplier') {
        fetchBySupplier({ variables: { supplierId: actorId, viewerUserId: viewerUserId!, status: filterStatus } });
      }
      setFeedback('Conversation restored.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err?.message ?? 'Failed to restore');
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    fetchMessages({ variables: { conversationId: selectedId, limit: 200 } });
  }, [selectedId, fetchMessages]);

  // Mark messages read on open + every poll where new ones arrive
  useEffect(() => {
    if (!selectedId || !viewerUserId) return;
    if (messages.length === 0) return;
    markRead({
      variables: { data: { conversationId: selectedId, viewerUserId } },
    }).catch(() => {});
  }, [selectedId, viewerUserId, messages.length, markRead]);

  // Auto-scroll thread to the bottom when messages change
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSelectConversation = (conversationId: number) => {
    router.push({ pathname: '/messages', query: { id: conversationId } }, undefined, {
      shallow: true,
    });
  };

  const handleSend = async () => {
    if (!selectedId || !viewerUserId) return;
    const content = draft.trim();
    if (!content) return;
    try {
      await sendMessage({
        variables: {
          data: { conversationId: selectedId, senderUserId: viewerUserId, content } as any,
        },
      });
      setDraft('');
      await fetchMessages({ variables: { conversationId: selectedId, limit: 200 } });
    } catch (err: any) {
      setFeedback(err?.message ?? 'Failed to send');
    }
  };

  const selectedConv = useMemo(
    () => conversations.find((c: any) => c.conversationId === selectedId),
    [conversations, selectedId],
  );

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/messages" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} padding="24px" maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to view your messages
            </Text>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Box
                display="inline-block"
                padding="10px 18px"
                borderRadius="10px"
                bg={solvoColors.text}
                color={solvoColors.surface}
                fontWeight={600}
                fontSize="14px"
                cursor="pointer"
                marginTop="10px"
              >
                Sign in
              </Box>
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  if (!actorId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/messages" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} padding="24px" maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              No messages yet
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Your account doesn't have a customer or supplier profile yet.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/messages" />

      <Box maxWidth="1200px" margin="0 auto" padding="32px 24px">
        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.1em" textTransform="uppercase" marginBottom="8px">
          Hi, {user.name}
        </Text>
        <Text as="h1" fontFamily={solvoFonts.serif} fontSize="36px" color={solvoColors.text} marginBottom="6px">
          Messages
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="24px">
          Your conversations with {role === 'customer' ? 'suppliers' : 'customers'} about specific requests.
        </Text>

        {feedback && (
          <Box marginBottom="14px" padding="10px 14px" borderRadius="10px" bg={solvoColors.roseLight} color={solvoColors.roseText}>
            <Text fontSize="sm">{feedback}</Text>
          </Box>
        )}

        <Flex
          gap="20px"
          align="stretch"
          direction={{ base: 'column', md: 'row' }}
          style={{ minHeight: '70vh' }}
        >
          {/* ── Inbox list ───────────────────────────────────────────── */}
          <Box
            style={sectionStyle}
            width={{ base: '100%', md: '340px' }}
            flexShrink={0}
            display={{ base: selectedId ? 'none' : 'block', md: 'block' }}
          >
            <Box padding="14px 16px" borderBottom={`1px solid ${solvoColors.border}`}>
              <Flex align="center" justify="space-between" marginBottom="10px">
                <Text fontFamily={solvoFonts.serif} fontSize="18px" color={solvoColors.text}>
                  Inbox
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {conversations.length}
                </Text>
              </Flex>

              {/* Active / Archived filter toggle */}
              <Flex
                padding="3px"
                borderRadius="9px"
                bg={solvoColors.bg}
                border={`1px solid ${solvoColors.border}`}
                gap="2px"
              >
                {(['active', 'archived'] as const).map((opt) => {
                  const isOn = inboxFilter === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setInboxFilter(opt)}
                      style={{
                        flex: 1,
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: isOn ? solvoColors.surface : 'transparent',
                        color: isOn ? solvoColors.text : solvoColors.textSubtle,
                        fontSize: '12px',
                        fontWeight: 600,
                        fontFamily: solvoFonts.sans,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        boxShadow: isOn ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </Flex>
            </Box>

            {conversations.length === 0 ? (
              <Box padding="20px 18px">
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  {inboxFilter === 'archived'
                    ? 'No archived conversations.'
                    : role === 'customer'
                      ? 'No conversations yet. Open a quote on /requests and message the supplier to start one.'
                      : 'No conversations yet. They appear once a customer messages you about one of your quotes.'}
                </Text>
              </Box>
            ) : (
              <Flex direction="column">
                <AnimatePresence initial={false}>
                  {conversations.map((c: any) => {
                    const isActive = c.conversationId === selectedId;
                    const menuOpen = menuFor === c.conversationId;
                    const confirming = confirmDeleteFor === c.conversationId;
                    return (
                      <motion.div
                        key={c.conversationId}
                        layout
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box
                          onClick={() => handleSelectConversation(c.conversationId)}
                          onContextMenu={(e) => openMenuAtMouse(e, c.conversationId)}
                          position="relative"
                          padding="14px 18px"
                          borderBottom={`1px solid ${solvoColors.border}`}
                          cursor="pointer"
                          bg={isActive ? solvoColors.bg : 'transparent'}
                          _hover={{ bg: solvoColors.bg }}
                        >
                          <Flex justify="space-between" align="center" gap="8px" marginBottom="2px">
                            <Text fontSize="sm" fontWeight={600} color={solvoColors.text} truncate>
                              {role === 'customer'
                                ? (c.supplier?.companyName ?? 'Supplier')
                                : (c.customer?.user?.name ?? 'Customer')}
                            </Text>
                            <Flex align="center" gap="4px" flexShrink={0}>
                              <Text fontSize="xs" color={solvoColors.textSubtle}>
                                {formatTime(c.lastMessageAt ?? c.createdAt)}
                              </Text>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (menuOpen) closeMenu();
                                  else openMenuAtElement(e.currentTarget, c.conversationId);
                                }}
                                aria-label="Conversation actions"
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '6px',
                                  background: 'transparent',
                                  border: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: solvoColors.textSubtle,
                                }}
                              >
                                <MoreVertical size={14} />
                              </button>
                            </Flex>
                          </Flex>
                          {c.request?.rawQuery && (
                            <Text fontSize="xs" color={solvoColors.textMuted} marginBottom="4px" truncate>
                              {c.request.rawQuery}
                            </Text>
                          )}
                          <Flex align="center" gap="6px">
                            <Box
                              padding="1px 7px"
                              borderRadius="9999px"
                              bg={
                                c.status === ConversationStatus.Active
                                  ? solvoColors.indigoLight
                                  : '#F5F5F4'
                              }
                              color={
                                c.status === ConversationStatus.Active
                                  ? solvoColors.indigo
                                  : solvoColors.textSubtle
                              }
                              fontSize="10px"
                              fontWeight={600}
                            >
                              {c.status}
                            </Box>
                            {c.contactShareWarnings > 0 && (
                              <Flex align="center" gap="3px" color={solvoColors.amberText}>
                                <ShieldAlert size={11} />
                                <Text fontSize="10px" fontWeight={600}>
                                  {c.contactShareWarnings}
                                </Text>
                              </Flex>
                            )}
                          </Flex>
                        </Box>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </Flex>
            )}
          </Box>

          {/* ── Thread view ─────────────────────────────────────────── */}
          <Box
            style={sectionStyle}
            flex="1"
            display={{ base: selectedId ? 'flex' : 'none', md: 'flex' }}
            flexDirection="column"
            minWidth="0"
          >
            {!selectedConv ? (
              <Flex flex="1" align="center" justify="center" padding="24px">
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  Pick a conversation on the left to view messages.
                </Text>
              </Flex>
            ) : (
              <>
                {/* Thread header */}
                <Flex
                  align="center"
                  gap="10px"
                  padding="14px 18px"
                  borderBottom={`1px solid ${solvoColors.border}`}
                >
                  <Box
                    as="button"
                    onClick={() => router.push('/messages', undefined, { shallow: true })}
                    width="32px"
                    height="32px"
                    borderRadius="9px"
                    bg="transparent"
                    border={`1px solid ${solvoColors.border}`}
                    display={{ base: 'flex', md: 'none' }}
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                  >
                    <ArrowLeft size={14} color={solvoColors.text} />
                  </Box>
                  <Box flex="1" minWidth="0">
                    <Text fontSize="sm" fontWeight={600} color={solvoColors.text} truncate>
                      {role === 'customer'
                        ? (selectedConv.supplier?.companyName ?? 'Supplier')
                        : (selectedConv.customer?.user?.name ?? 'Customer')}
                    </Text>
                    <Text fontSize="xs" color={solvoColors.textSubtle} truncate>
                      {selectedConv.request?.rawQuery ?? 'Service request'}
                    </Text>
                  </Box>
                  <Link
                    href={{ pathname: '/requests', query: { id: selectedConv.requestId } }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Text fontSize="xs" color={solvoColors.indigo} fontWeight={600}>
                      View request →
                    </Text>
                  </Link>
                </Flex>

                {/* Messages list */}
                <Box
                  flex="1"
                  padding="20px 18px"
                  overflowY="auto"
                  bg={solvoColors.bg}
                  style={{ minHeight: '50vh', maxHeight: '60vh' }}
                >
                  <AnimatePresence initial={false}>
                    {messages.map((m: any) => {
                      const isMine = m.senderUserId === viewerUserId;
                      return (
                        <motion.div
                          key={m.messageId}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Flex justify={isMine ? 'flex-end' : 'flex-start'} marginBottom="8px">
                            <Box
                              maxWidth="75%"
                              padding="10px 14px"
                              borderRadius={isMine ? '18px 18px 4px 18px' : '4px 18px 18px 18px'}
                              bg={isMine ? solvoColors.text : solvoColors.surface}
                              color={isMine ? solvoColors.surface : solvoColors.text}
                              border={isMine ? 'none' : `1px solid ${solvoColors.border}`}
                            >
                              <Text fontSize="sm" lineHeight="1.5" style={{ whiteSpace: 'pre-wrap' }}>
                                {m.content}
                              </Text>
                              {m.filtered && (
                                <Text
                                  fontSize="10px"
                                  color={isMine ? solvoColors.amberLight : solvoColors.amberText}
                                  marginTop="4px"
                                  fontStyle="italic"
                                >
                                  ⚠ {m.filteredReason}
                                </Text>
                              )}
                              <Text
                                fontSize="10px"
                                color={isMine ? 'rgba(255,255,255,0.6)' : solvoColors.textSubtle}
                                marginTop="2px"
                                textAlign="right"
                              >
                                {formatTime(m.createdAt)}
                                {isMine && m.readAt ? ' · seen' : ''}
                              </Text>
                            </Box>
                          </Flex>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={threadEndRef} />
                </Box>

                {/* Composer */}
                <Box padding="14px 16px" borderTop={`1px solid ${solvoColors.border}`}>
                  <Flex gap="10px" align="flex-end">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message…"
                      rows={1}
                      style={{
                        flex: 1,
                        padding: '11px 14px',
                        borderRadius: '12px',
                        border: `1px solid ${solvoColors.border}`,
                        background: solvoColors.surface,
                        color: solvoColors.text,
                        fontFamily: solvoFonts.sans,
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'none',
                        maxHeight: '120px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={sendState.loading || !draft.trim()}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        background: solvoColors.text,
                        color: solvoColors.surface,
                        fontWeight: 600,
                        fontSize: '14px',
                        fontFamily: solvoFonts.sans,
                        cursor: 'pointer',
                        opacity: sendState.loading || !draft.trim() ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Send size={14} />
                      Send
                    </button>
                  </Flex>
                  <Text fontSize="10px" color={solvoColors.textSubtle} marginTop="6px">
                    Phone numbers and emails are automatically hidden to keep your conversation on-platform.
                  </Text>
                </Box>
              </>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Floating row-action menu — page-level so it isn't clipped by the inbox container's overflow */}
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
            {inboxFilter === 'archived' ? (
              // Archived view — single Restore action, no confirmation needed
              <button
                type="button"
                onClick={() => handleRestore(menuFor)}
                disabled={restoreState.loading}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: solvoFonts.sans,
                  opacity: restoreState.loading ? 0.5 : 1,
                }}
              >
                <Flex align="center" gap="8px" color={solvoColors.indigo}>
                  <RotateCcw size={13} />
                  <Text fontSize="13px" fontWeight={600}>
                    {restoreState.loading ? 'Restoring…' : 'Restore conversation'}
                  </Text>
                </Flex>
              </button>
            ) : confirmDeleteFor === menuFor ? (
              <Box padding="8px 10px">
                <Text fontSize="xs" color={solvoColors.text} fontWeight={600} marginBottom="4px">
                  Delete conversation?
                </Text>
                <Text fontSize="11px" color={solvoColors.textSubtle} marginBottom="10px">
                  The other party loses access. You can restore it later from the Archived tab.
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
                    onClick={() => handleArchive(menuFor)}
                    disabled={archiveState.loading}
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
                      opacity: archiveState.loading ? 0.5 : 1,
                    }}
                  >
                    {archiveState.loading ? 'Deleting…' : 'Delete'}
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
}
