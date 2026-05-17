import * as React from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import {
  useNotificationsByUserQuery,
  useUnreadNotificationCountQuery,
  useNotificationCreatedSubscription,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '@generated';

/**
 * Map a notification's `entityType` + `entityId` to the in-app route the
 * user should land on when they click the row in the bell dropdown. Returns
 * null if there's nothing useful to navigate to.
 */
function routeForNotification(
  entityType?: string | null,
  entityId?: number | null,
): string | null {
  if (!entityType || !entityId) return null;
  switch (entityType) {
    case 'Request':
      return `/requests?id=${entityId}`;
    case 'Booking':
      return `/bookings?id=${entityId}`;
    case 'Conversation':
      return `/messages?id=${entityId}`;
    case 'Quote':
      // No standalone quote detail page yet — fall back to the supplier's
      // quotes inbox.
      return `/quotes?id=${entityId}`;
    default:
      return null;
  }
}

export interface NotificationBellProps {
  userId: number;
}

function formatTime(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  const diffMs = Date.now() - d.getTime();
  const diffH = diffMs / 3600000;
  if (diffH < 1) {
    const m = Math.floor(diffMs / 60000);
    return m <= 0 ? 'just now' : `${m}m ago`;
  }
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  const diffD = diffH / 24;
  if (diffD < 7) return `${Math.floor(diffD)}d ago`;
  return d.toLocaleDateString();
}

/**
 * Bell icon + unread counter + dropdown showing recent in-app notifications.
 *
 * - Subscribes to `notificationCreated($userId)` for live updates and
 *   prepends new arrivals to the local list.
 * - Single-click on a row marks it read; "Mark all read" clears the counter.
 */
const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  // "all" includes read+unread (Inbox model). "unread" hides read rows.
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const { data: listData, refetch: refetchList } = useNotificationsByUserQuery({
    variables: { userId, limit: 30, unreadOnly: filter === 'unread' },
    fetchPolicy: 'cache-and-network',
  });
  const { data: countData, refetch: refetchCount } =
    useUnreadNotificationCountQuery({
      variables: { userId },
      fetchPolicy: 'cache-and-network',
    });

  // Live updates — Apollo merges into cache; we also refetch the count.
  useNotificationCreatedSubscription({
    variables: { userId },
    onData: () => {
      refetchList();
      refetchCount();
    },
  });

  const [markRead] = useMarkNotificationAsReadMutation();
  const [markAllRead, markAllState] = useMarkAllNotificationsAsReadMutation();

  const notifications = listData?.notificationsByUser ?? [];
  const unreadCount = countData?.unreadNotificationCount ?? 0;

  // Close on outside click / Escape
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleRowClick = async (
    notification: {
      notificationId: number;
      entityType?: string | null;
      entityId?: number | null;
      readAt?: Date | string | null;
    },
  ) => {
    // Navigate first so the click feels instant, then close the dropdown.
    const route = routeForNotification(notification.entityType, notification.entityId);
    if (route) {
      void router.push(route);
    }
    setOpen(false);

    // Mark read in the background. Skip if already read.
    if (notification.readAt) return;
    try {
      await markRead({
        variables: { data: { notificationId: notification.notificationId, userId } },
      });
      refetchList();
      refetchCount();
    } catch {
      // non-critical
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead({ variables: { data: { userId } } });
      refetchList();
      refetchCount();
    } catch {
      // non-critical
    }
  };

  return (
    <Box position="relative" ref={wrapperRef as any}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.1 }}
        style={{
          position: 'relative',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: open ? solvoColors.bg : 'transparent',
          border: `1px solid ${solvoColors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: solvoColors.text,
          padding: 0,
        }}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <Box
            position="absolute"
            top="-4px"
            right="-4px"
            minWidth="18px"
            height="18px"
            padding="0 5px"
            borderRadius="9999px"
            bg={solvoColors.roseText}
            color={solvoColors.surface}
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
              fontFamily: solvoFonts.sans,
              fontSize: '10px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Box>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="notif-panel"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              transformOrigin: 'top right',
              zIndex: 41,
              width: '340px',
              maxWidth: 'calc(100vw - 32px)',
              background: solvoColors.surface,
              border: `1px solid ${solvoColors.border}`,
              borderRadius: '14px',
              padding: '6px',
              boxShadow: solvoShadows.floatingPanel,
            }}
          >
            {/* Header */}
            <Flex
              align="center"
              justify="space-between"
              padding="8px 10px 6px"
            >
              <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={markAllState.loading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: solvoColors.indigo,
                    fontFamily: solvoFonts.sans,
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: markAllState.loading ? 0.5 : 1,
                  }}
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </Flex>

            {/* Filter toggle — All vs Unread */}
            <Flex gap="4px" padding="0 10px 8px">
              {(['all', 'unread'] as const).map((key) => {
                const active = filter === key;
                const label = key === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    style={{
                      flex: 1,
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: active ? solvoColors.bg : 'transparent',
                      color: active ? solvoColors.text : solvoColors.textMuted,
                      border: `1px solid ${active ? solvoColors.border : 'transparent'}`,
                      cursor: 'pointer',
                      fontFamily: solvoFonts.sans,
                      fontSize: '11px',
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </Flex>

            {/* List */}
            <Box maxHeight="380px" overflowY="auto">
              {notifications.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  padding="32px 12px"
                  gap="6px"
                >
                  <Box color={solvoColors.textSubtle}>
                    <Bell size={18} />
                  </Box>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>
                    {filter === 'unread' ? "You're all caught up." : 'No notifications yet.'}
                  </Text>
                </Flex>
              ) : (
                notifications.map((n) => {
                  const isUnread = !n.readAt;
                  return (
                    <Box
                      key={n.notificationId}
                      onClick={() => handleRowClick(n)}
                      padding="10px 12px"
                      borderRadius="10px"
                      cursor="pointer"
                      bg={isUnread ? solvoColors.indigoLight : 'transparent'}
                      marginBottom="2px"
                      _hover={{ bg: solvoColors.bg }}
                      style={{ transition: 'background 0.15s' }}
                    >
                      <Flex align="flex-start" gap="8px">
                        {isUnread && (
                          <Box
                            width="6px"
                            height="6px"
                            borderRadius="9999px"
                            bg={solvoColors.indigo}
                            marginTop="6px"
                            flexShrink={0}
                          />
                        )}
                        <Box flex="1" minWidth="0">
                          {n.subject && (
                            <Text
                              fontSize="xs"
                              fontWeight={600}
                              color={solvoColors.text}
                              marginBottom="2px"
                              truncate
                            >
                              {n.subject}
                            </Text>
                          )}
                          <Text
                            fontSize="xs"
                            color={solvoColors.textMuted}
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {n.body}
                          </Text>
                          <Text
                            fontSize="10px"
                            color={solvoColors.textSubtle}
                            marginTop="3px"
                          >
                            {formatTime(n.createdAt)}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  );
                })
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default NotificationBell;
