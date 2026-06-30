import { useContext, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthContext from '@/shared/contexts/auth.context';
import { motion } from 'framer-motion';
import { Inbox, Plus, Sparkles } from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar, Pill } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import {
  BookingStatus,
  ConversationStatus,
  RequestStatus,
  useRequestsByCustomerQuery,
  useConversationsByCustomerQuery,
  useBookingsByCustomerQuery,
  useFavoritesByCustomerQuery,
} from '@generated';

type TabId = 'active' | 'conversations' | 'saved' | 'past';

const timeAgo = (iso?: string | null): string => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const h = diffMs / 3_600_000;
  if (h < 1) {
    const m = Math.max(1, Math.floor(diffMs / 60_000));
    return `${m}m ago`;
  }
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = h / 24;
  if (d < 7) return `${Math.floor(d)}d ago`;
  return new Date(iso).toLocaleDateString();
};

/** Inline emoji picked from a simple keyword sniff on the request text. */
function pickEmoji(rawQuery: string): string {
  const q = rawQuery.toLowerCase();
  if (/cater|food|chef|cook/.test(q)) return '🍽️';
  if (/dj|music|sound/.test(q)) return '🎧';
  if (/clean/.test(q)) return '🧽';
  if (/photo|camera/.test(q)) return '📸';
  if (/ac\b|air|hvac|fix|repair/.test(q)) return '❄️';
  if (/birth|party|event|wedding/.test(q)) return '🎉';
  if (/move|mover/.test(q)) return '🚚';
  if (/cake|bake/.test(q)) return '🎂';
  if (/flower|decor/.test(q)) return '🌸';
  return '🗂️';
}

function statusLabel(req: { status: RequestStatus; quotes: Array<{ status: string }> }): string {
  const sentOrViewed = req.quotes.filter(
    (q) => q.status === 'SENT' || q.status === 'VIEWED',
  ).length;
  switch (req.status) {
    case RequestStatus.Gathering:
      return 'Gathering details…';
    case RequestStatus.Matching:
      return 'Matching with suppliers…';
    case RequestStatus.AwaitingQuotes:
      return sentOrViewed > 0
        ? `${sentOrViewed} quote${sentOrViewed === 1 ? '' : 's'} received`
        : 'Waiting for quotes';
    case RequestStatus.QuotesReceived:
      return `${sentOrViewed} quote${sentOrViewed === 1 ? '' : 's'} received`;
    case RequestStatus.Booked:
      return 'Booked';
    case RequestStatus.Closed:
      return 'Closed';
    default:
      return req.status;
  }
}

export default function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const customerId = user?.customerId ?? null;
  const supplierId = user?.supplierId ?? null;
  const viewerUserId = user?.userId ?? null;
  const displayName = user?.name?.split(' ')[0] ?? 'there';

  // Routing rules for /dashboard:
  //  • Admins → /admin (their workspace, even if isCustomer is true from signup)
  //  • Supplier-only users → /provider workspace
  //  • Everyone else → the customer view rendered below
  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.isAdmin) {
      router.replace('/admin');
      return;
    }
    if (!customerId && supplierId) {
      router.replace('/provider');
    }
  }, [isAuthenticated, user?.isAdmin, customerId, supplierId, router]);

  const [tab, setTab] = useState<TabId>('active');

  // ── Queries ─────────────────────────────────────────────────────────
  const requestsQuery = useRequestsByCustomerQuery({
    variables: { customerId: customerId ?? 0 },
    skip: !customerId,
    fetchPolicy: 'cache-and-network',
  });

  const conversationsQuery = useConversationsByCustomerQuery({
    variables: {
      customerId: customerId ?? 0,
      viewerUserId: viewerUserId ?? 0,
      status: ConversationStatus.Active,
    },
    skip: !customerId || !viewerUserId,
    fetchPolicy: 'cache-and-network',
  });

  const bookingsQuery = useBookingsByCustomerQuery({
    variables: { customerId: customerId ?? 0 },
    skip: !customerId,
    fetchPolicy: 'cache-and-network',
  });

  const favoritesQuery = useFavoritesByCustomerQuery({
    variables: { customerId: customerId ?? 0 },
    skip: !customerId,
    fetchPolicy: 'cache-and-network',
  });

  const allRequests = requestsQuery.data?.requestsByCustomer ?? [];
  const conversations = conversationsQuery.data?.conversationsByCustomer ?? [];
  const allBookings = bookingsQuery.data?.bookingsByCustomer ?? [];
  const favorites = favoritesQuery.data?.favoritesByCustomer ?? [];

  // Active = not yet booked / closed. Past = COMPLETED or CANCELLED.
  const activeRequests = useMemo(
    () =>
      allRequests.filter(
        (r: any) =>
          r.status !== RequestStatus.Closed &&
          r.status !== RequestStatus.Booked,
      ),
    [allRequests],
  );
  const pastBookings = useMemo(
    () =>
      allBookings.filter(
        (b: any) =>
          b.status === BookingStatus.Completed ||
          b.status === BookingStatus.Cancelled,
      ),
    [allBookings],
  );

  const tabs: Array<{ id: TabId; label: string; count: number; showCount: boolean }> = [
    { id: 'active', label: 'Active requests', count: activeRequests.length, showCount: true },
    { id: 'conversations', label: 'Conversations', count: conversations.length, showCount: true },
    { id: 'saved', label: 'Saved', count: favorites.length, showCount: true },
    { id: 'past', label: 'Past bookings', count: pastBookings.length, showCount: true },
  ];

  // ── Gates ───────────────────────────────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/dashboard" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box
            bg="white"
            borderWidth="1px"
            borderColor={solvoColors.border}
            borderRadius="16px"
            padding="24px"
            maxWidth="420px"
            textAlign="center"
          >
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to see your dashboard
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
              >
                Sign in
              </Box>
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  }

  if (!customerId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/dashboard" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box
            bg="white"
            borderWidth="1px"
            borderColor={solvoColors.border}
            borderRadius="16px"
            padding="24px"
            maxWidth="460px"
            textAlign="center"
          >
            <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text} marginBottom="6px">
              This dashboard is for customers
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Your account doesn't have a Customer profile. If you're a supplier,
              head to{' '}
              <Link href="/provider" style={{ color: solvoColors.indigo }}>
                Provider workspace
              </Link>
              .
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/dashboard" />

      <Box maxWidth="1100px" margin="0 auto" padding={{ base: '32px 16px', md: '48px 24px' }}>
        {/* Header */}
        <Flex
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap="14px"
          marginBottom="32px"
        >
          <Box>
            <Text
              fontSize="xs"
              color={solvoColors.textSubtle}
              letterSpacing="0.08em"
              fontWeight="600"
              marginBottom="4px"
            >
              WELCOME BACK
            </Text>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize={{ base: '32px', md: '44px' }}
              fontWeight="500"
              color={solvoColors.text}
              letterSpacing="-0.01em"
            >
              Hello, {displayName}.
            </Text>
          </Box>
          <Flex
            as="button"
            align="center"
            gap="6px"
            padding="10px 18px"
            bg={solvoColors.text}
            color="white"
            borderRadius="12px"
            fontSize="sm"
            fontWeight="500"
            cursor="pointer"
            onClick={() => router.push('/')}
            _hover={{ bg: solvoColors.indigo }}
          >
            <Plus size={14} /> New request
          </Flex>
        </Flex>

        {/* Tabs */}
        <Flex
          gap="24px"
          borderBottom="1px solid"
          borderColor={solvoColors.border}
          marginBottom="24px"
          overflowX="auto"
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <Box
                key={t.id}
                as="button"
                position="relative"
                padding="14px 0"
                cursor="pointer"
                onClick={() => setTab(t.id)}
                whiteSpace="nowrap"
              >
                <Flex align="center" gap="6px">
                  <Text
                    fontSize="sm"
                    fontWeight="500"
                    color={active ? solvoColors.text : solvoColors.textSubtle}
                  >
                    {t.label}
                  </Text>
                  {t.showCount && t.count > 0 && (
                    <Box
                      bg={active ? solvoColors.text : '#F5F5F4'}
                      color={active ? 'white' : solvoColors.textMuted}
                      fontSize="11px"
                      fontWeight="500"
                      padding="2px 7px"
                      borderRadius="full"
                    >
                      {t.count}
                    </Box>
                  )}
                </Flex>
                {active && (
                  <motion.div
                    layoutId="dash-tab"
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: solvoColors.text,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Flex>

        {/* ── Active requests ──────────────────────────────────────── */}
        {tab === 'active' && (
          <>
            {requestsQuery.loading && allRequests.length === 0 ? (
              <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
            ) : activeRequests.length === 0 ? (
              <Flex direction="column" align="center" gap="12px" padding="64px 20px">
                <Box color={solvoColors.textSubtle}>
                  <Sparkles size={32} />
                </Box>
                <Text color={solvoColors.textSubtle} fontSize="sm">
                  No active requests. Start one from the AI chat.
                </Text>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <Box
                    padding="8px 16px"
                    borderRadius="10px"
                    bg={solvoColors.text}
                    color="white"
                    fontSize="13px"
                    fontWeight={600}
                    cursor="pointer"
                  >
                    + New request
                  </Box>
                </Link>
              </Flex>
            ) : (
              <Flex direction="column" gap="10px">
                {activeRequests.map((r: any) => (
                  <Link
                    key={r.requestId}
                    href={{ pathname: '/requests', query: { id: r.requestId } }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Flex
                      align="center"
                      gap="14px"
                      padding="16px 20px"
                      bg="white"
                      borderWidth="1px"
                      borderColor={solvoColors.border}
                      borderRadius="14px"
                      _hover={{ borderColor: solvoColors.borderHover }}
                      cursor="pointer"
                    >
                      <Flex
                        width="44px"
                        height="44px"
                        borderRadius="12px"
                        bg={solvoColors.bg}
                        align="center"
                        justify="center"
                        fontSize="22px"
                      >
                        {pickEmoji(r.rawQuery)}
                      </Flex>
                      <Box flex="1" minWidth="0">
                        <Text fontWeight="500" color={solvoColors.text} fontSize="sm" truncate>
                          {r.rawQuery}
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          {statusLabel(r)}
                        </Text>
                      </Box>
                      {r.status === RequestStatus.QuotesReceived && (
                        <Pill tone="indigo">New</Pill>
                      )}
                      <Text fontSize="xs" color={solvoColors.textSubtle}>
                        {timeAgo(r.createdAt)}
                      </Text>
                    </Flex>
                  </Link>
                ))}
              </Flex>
            )}
          </>
        )}

        {/* ── Conversations ────────────────────────────────────────── */}
        {tab === 'conversations' && (
          <>
            {conversationsQuery.loading && conversations.length === 0 ? (
              <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
            ) : conversations.length === 0 ? (
              <Flex direction="column" align="center" gap="12px" padding="64px 20px">
                <Box color={solvoColors.textSubtle}>
                  <Inbox size={32} />
                </Box>
                <Text color={solvoColors.textSubtle} fontSize="sm">
                  No conversations yet. They start once a quote is sent.
                </Text>
              </Flex>
            ) : (
              <Box
                bg="white"
                borderWidth="1px"
                borderColor={solvoColors.border}
                borderRadius="14px"
                overflow="hidden"
              >
                {conversations.map((c: any, i: number) => (
                  <Link
                    key={c.conversationId}
                    href={{ pathname: '/messages', query: { id: c.conversationId } }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Flex
                      align="center"
                      gap="14px"
                      padding="14px 18px"
                      borderBottom={
                        i < conversations.length - 1 ? '1px solid' : 'none'
                      }
                      borderColor={solvoColors.border}
                      cursor="pointer"
                      _hover={{ bg: solvoColors.bg }}
                    >
                      <Flex
                        width="40px"
                        height="40px"
                        borderRadius="full"
                        bg={solvoColors.bg}
                        align="center"
                        justify="center"
                        fontSize="20px"
                      >
                        {pickEmoji(c.request?.rawQuery ?? '')}
                      </Flex>
                      <Box flex="1" minWidth="0">
                        <Text fontWeight="500" color={solvoColors.text} fontSize="sm" truncate>
                          {c.supplier?.companyName ?? 'Supplier'}
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle} truncate>
                          {c.request?.rawQuery ?? `Request #${c.requestId}`}
                        </Text>
                      </Box>
                      <Text fontSize="xs" color={solvoColors.textSubtle}>
                        {timeAgo(c.lastMessageAt ?? c.createdAt)}
                      </Text>
                    </Flex>
                  </Link>
                ))}
              </Box>
            )}
          </>
        )}

        {/* ── Saved providers ──────────────────────────────────────── */}
        {tab === 'saved' && (
          <>
            {favoritesQuery.loading && favorites.length === 0 ? (
              <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
            ) : favorites.length === 0 ? (
              <Flex direction="column" align="center" gap="10px" padding="64px 20px">
                <Box color={solvoColors.textSubtle}>
                  <Inbox size={32} />
                </Box>
                <Text color={solvoColors.textSubtle} fontSize="sm" textAlign="center">
                  Save providers you like from their profile and they'll show up here.
                </Text>
              </Flex>
            ) : (
              <Box
                display="grid"
                gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                gap="12px"
              >
                {favorites.map((f: any) => {
                  const s = f.supplier;
                  const primaryCategory = s?.categories?.find((c: any) => c.isPrimary)
                    ?? s?.categories?.[0];
                  return (
                    <Link
                      key={f.favoriteId}
                      href={{ pathname: `/providers/${f.supplierId}` }}
                      style={{ textDecoration: 'none' }}
                    >
                      <Flex
                        direction="column"
                        align="center"
                        gap="10px"
                        padding="24px"
                        bg="white"
                        borderWidth="1px"
                        borderColor={solvoColors.border}
                        borderRadius="16px"
                        cursor="pointer"
                        _hover={{ borderColor: solvoColors.borderHover }}
                      >
                        <Flex
                          width="56px"
                          height="56px"
                          borderRadius="full"
                          bg={solvoColors.indigoLight}
                          color={solvoColors.indigo}
                          align="center"
                          justify="center"
                          fontSize="22px"
                          fontWeight={600}
                        >
                          {(s?.companyName ?? '?').slice(0, 1)}
                        </Flex>
                        <Text fontWeight={600} fontSize="sm" color={solvoColors.text} textAlign="center" truncate>
                          {s?.companyName ?? `Supplier #${f.supplierId}`}
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          {primaryCategory?.category?.categoryName ?? s?.city ?? '—'}
                        </Text>
                        {s?.rating != null && (
                          <Flex align="center" gap="3px">
                            <Text fontSize="xs" color={solvoColors.amberText}>★</Text>
                            <Text fontSize="xs" fontWeight={500}>
                              {Number(s.rating).toFixed(1)}
                            </Text>
                            {!!s.reviewCount && (
                              <Text fontSize="xs" color={solvoColors.textSubtle}>
                                ({s.reviewCount})
                              </Text>
                            )}
                          </Flex>
                        )}
                      </Flex>
                    </Link>
                  );
                })}
              </Box>
            )}
          </>
        )}

        {/* ── Past bookings ────────────────────────────────────────── */}
        {tab === 'past' && (
          <>
            {bookingsQuery.loading && allBookings.length === 0 ? (
              <Text fontSize="sm" color={solvoColors.textSubtle}>Loading…</Text>
            ) : pastBookings.length === 0 ? (
              <Flex direction="column" align="center" gap="12px" padding="64px 20px">
                <Box color={solvoColors.textSubtle}>
                  <Inbox size={32} />
                </Box>
                <Text color={solvoColors.textSubtle} fontSize="sm">
                  No past bookings yet.
                </Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="10px">
                {pastBookings.map((b: any) => (
                  <Link
                    key={b.bookingId}
                    href={{ pathname: '/bookings', query: { id: b.bookingId } }}
                    style={{ textDecoration: 'none' }}
                  >
                    <Flex
                      align="center"
                      gap="14px"
                      padding="16px 20px"
                      bg="white"
                      borderWidth="1px"
                      borderColor={solvoColors.border}
                      borderRadius="14px"
                      _hover={{ borderColor: solvoColors.borderHover }}
                      cursor="pointer"
                    >
                      <Flex
                        width="44px"
                        height="44px"
                        borderRadius="12px"
                        bg={solvoColors.bg}
                        align="center"
                        justify="center"
                        fontSize="22px"
                      >
                        {pickEmoji(b.request?.rawQuery ?? '')}
                      </Flex>
                      <Box flex="1" minWidth="0">
                        <Text fontWeight="500" color={solvoColors.text} fontSize="sm" truncate>
                          {b.supplier?.companyName ?? 'Supplier'} ·{' '}
                          <Text as="span" color={solvoColors.textSubtle}>
                            {b.request?.rawQuery}
                          </Text>
                        </Text>
                        <Text fontSize="xs" color={solvoColors.textSubtle}>
                          {b.currency} {b.totalPrice} · {timeAgo(b.serviceDate)}
                        </Text>
                      </Box>
                      <Pill
                        tone={b.status === BookingStatus.Completed ? 'emerald' : 'default'}
                      >
                        {b.status === BookingStatus.Completed ? '✓ Completed' : 'Cancelled'}
                      </Pill>
                    </Flex>
                  </Link>
                ))}
              </Flex>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
