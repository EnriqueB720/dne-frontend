import { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Box, Flex, Text, Pill, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  RequestStatus,
  QuoteStatus,
  useRequestLazyQuery,
  useRequestsByCustomerLazyQuery,
  useUpdateRequestStatusMutation,
  useCloseRequestMutation,
  useQuotesByRequestLazyQuery,
  useAcceptQuoteMutation,
  useMarkQuotesViewedMutation,
} from '@generated';

const STATUS_OPTIONS: RequestStatus[] = [
  RequestStatus.Gathering,
  RequestStatus.Matching,
  RequestStatus.AwaitingQuotes,
  RequestStatus.QuotesReceived,
  RequestStatus.Booked,
  RequestStatus.Closed,
];

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  GATHERING:        { bg: solvoColors.amberLight, fg: solvoColors.amberText },
  MATCHING:         { bg: solvoColors.indigoLight, fg: solvoColors.indigo },
  AWAITING_QUOTES:  { bg: solvoColors.indigoLight, fg: solvoColors.indigo },
  QUOTES_RECEIVED:  { bg: solvoColors.emeraldLight, fg: solvoColors.emeraldText },
  BOOKED:           { bg: solvoColors.successLight, fg: solvoColors.successText },
  CLOSED:           { bg: '#F5F5F4', fg: solvoColors.textSubtle },
};

const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '14px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

const buttonBaseStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: solvoFonts.sans,
};

const sectionStyle: React.CSSProperties = {
  background: solvoColors.surface,
  border: `1px solid ${solvoColors.border}`,
  borderRadius: '16px',
  padding: '20px',
};

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString() : '—';

export default function RequestsTestPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const customerId = user?.customerId ?? null;

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<RequestStatus | ''>('');
  const [toast, setToast] = useState<{ count: number; ts: number } | null>(null);
  const previousUnreadByRequest = useRef<Map<number, number>>(new Map());

  const [fetchRequests, listState] = useRequestsByCustomerLazyQuery({
    fetchPolicy: 'network-only',
    pollInterval: 15_000, // poll every 15s for new quotes
    notifyOnNetworkStatusChange: true,
  });
  const [fetchRequest, detailState] = useRequestLazyQuery({ fetchPolicy: 'network-only' });
  const [updateStatus, updateState] = useUpdateRequestStatusMutation();
  const [closeRequest, closeState] = useCloseRequestMutation();
  const [fetchQuotes, quotesState] = useQuotesByRequestLazyQuery({ fetchPolicy: 'network-only' });
  const [acceptQuote, acceptState] = useAcceptQuoteMutation();
  const [markQuotesViewed] = useMarkQuotesViewedMutation();

  const requests = listState.data?.requestsByCustomer ?? [];
  const detail = detailState.data?.request;
  const quotes = quotesState.data?.quotesByRequest ?? [];

  // Per-request unread (SENT) count
  const unreadByRequest = new Map<number, number>();
  for (const r of requests as any[]) {
    const sentCount =
      r.quotes?.filter((q: { status: string }) => q.status === 'SENT').length ?? 0;
    unreadByRequest.set(r.requestId, sentCount);
  }

  // Detect unread quotes (on first load) or new unread quotes (between polls) → fire toast
  useEffect(() => {
    if (requests.length === 0) return;

    let delta = 0;
    for (const [reqId, count] of unreadByRequest) {
      const prev = previousUnreadByRequest.current.get(reqId) ?? 0;
      if (count > prev) delta += count - prev;
    }
    if (delta > 0) {
      setToast({ count: delta, ts: Date.now() });
    }
    previousUnreadByRequest.current = new Map(unreadByRequest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(Array.from(unreadByRequest.entries()))]);

  // Auto-dismiss toast after 5s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLoadRequests = async () => {
    if (!customerId) return;
    await fetchRequests({
      variables: {
        customerId,
        status: filterStatus === '' ? null : filterStatus,
      },
    });
  };

  // Auto-load whenever the logged-in customer becomes available or the filter changes
  useEffect(() => {
    if (customerId) handleLoadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, filterStatus]);

  const handleSelectRequest = async (requestId: number) => {
    setSelectedRequestId(requestId);
    await Promise.all([
      fetchRequest({ variables: { where: { requestId } } }),
      fetchQuotes({ variables: { requestId, status: null } }),
    ]);
    // Mark any SENT quotes for this request as VIEWED so the badge clears
    const had = unreadByRequest.get(requestId) ?? 0;
    if (had > 0) {
      try {
        await markQuotesViewed({ variables: { data: { requestId } } });
        await handleLoadRequests();
      } catch {
        // non-fatal: badge will clear on next poll anyway
      }
    }
  };

  const handleAcceptQuote = async (quoteId: number) => {
    try {
      const { data } = await acceptQuote({ variables: { data: { quoteId } } });
      setFeedback({ kind: 'ok', text: `Accepted quote #${quoteId} → booking #${data?.acceptQuote.bookingId}` });
      if (selectedRequestId) {
        await Promise.all([
          fetchRequest({ variables: { where: { requestId: selectedRequestId } } }),
          fetchQuotes({ variables: { requestId: selectedRequestId, status: null } }),
        ]);
      }
      await handleLoadRequests();
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Accept failed' });
    }
  };

  const handleUpdateStatus = async (status: RequestStatus) => {
    if (!selectedRequestId) return;
    try {
      await updateStatus({ variables: { data: { requestId: selectedRequestId, status } } });
      setFeedback({ kind: 'ok', text: `Status → ${status}` });
      await fetchRequest({ variables: { where: { requestId: selectedRequestId } } });
      await handleLoadRequests();
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Update failed' });
    }
  };

  const handleClose = async () => {
    if (!selectedRequestId) return;
    const reason = window.prompt('Close reason (optional)') ?? undefined;
    try {
      await closeRequest({ variables: { data: { requestId: selectedRequestId, reason } } });
      setFeedback({ kind: 'ok', text: `Closed request #${selectedRequestId}` });
      await fetchRequest({ variables: { where: { requestId: selectedRequestId } } });
      await handleLoadRequests();
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Close failed' });
    }
  };

  const busy =
    updateState.loading ||
    closeState.loading ||
    detailState.loading ||
    listState.loading ||
    quotesState.loading ||
    acceptState.loading;

  // ── Gating: not signed in / not a customer ────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/requests" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to view your requests
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="20px">
              Your service requests, received quotes, and bookings live here once you're logged in.
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
        <SolvoNavBar activePath="/requests" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              This page is for customers
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Your account doesn't have a customer profile. Suppliers can manage quotes from <Link href="/quotes" style={{ color: solvoColors.indigo, fontWeight: 600 }}>/quotes</Link> instead.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/requests" />

      <Box maxWidth="1200px" margin="0 auto" padding="32px 24px">
        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.1em" textTransform="uppercase" marginBottom="8px">
          Hi, {user.name}
        </Text>
        <Text as="h1" fontFamily={solvoFonts.serif} fontSize="36px" color={solvoColors.text} marginBottom="6px">
          My requests
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="24px">
          Requests are created from the AI chat on the home page — click "Select" on a provider card there. Manage and accept quotes here.
        </Text>

        {/* Filter bar */}
        <Box style={sectionStyle} marginBottom="20px">
          <Flex gap="10px" align="center" wrap="wrap">
            <label style={{ ...labelStyle, marginBottom: 0 }}>Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === '' ? '' : (e.target.value as RequestStatus))}
              style={{ ...inputBaseStyle, maxWidth: '220px' }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleLoadRequests}
              disabled={busy}
              style={{
                ...buttonBaseStyle,
                background: solvoColors.surface,
                color: solvoColors.text,
                border: `1px solid ${solvoColors.border}`,
                opacity: busy ? 0.5 : 1,
              }}
            >
              {busy ? 'Refreshing…' : 'Refresh'}
            </button>
          </Flex>
        </Box>

        {feedback && (
          <Box
            marginBottom="20px"
            padding="12px 14px"
            borderRadius="10px"
            bg={feedback.kind === 'ok' ? solvoColors.successLight : solvoColors.roseLight}
            color={feedback.kind === 'ok' ? solvoColors.successText : solvoColors.roseText}
          >
            <Text fontSize="sm">{feedback.text}</Text>
          </Box>
        )}

        <Flex gap="20px" direction={{ base: 'column', md: 'row' }} align="flex-start">
          {/* LEFT: list */}
          <Box flex="1" minWidth="0" width="100%">
            {/* List */}
            <Box style={sectionStyle}>
              <Flex justify="space-between" align="center" marginBottom="14px">
                <Text fontFamily={solvoFonts.serif} fontSize="20px">
                  Requests
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {requests.length} result{requests.length === 1 ? '' : 's'}
                </Text>
              </Flex>

              {requests.length === 0 ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  No requests yet. Start a new one from the AI chat on the home page.
                </Text>
              ) : (
                <Flex direction="column" gap="8px">
                  {requests.map((r) => {
                    const tone = STATUS_TONE[r.status] ?? STATUS_TONE.CLOSED;
                    const isSelected = r.requestId === selectedRequestId;
                    const unread = unreadByRequest.get(r.requestId) ?? 0;
                    return (
                      <Box
                        key={r.requestId}
                        onClick={() => handleSelectRequest(r.requestId)}
                        position="relative"
                        padding="12px 14px"
                        borderRadius="10px"
                        border={`1px solid ${isSelected ? solvoColors.text : unread > 0 ? solvoColors.indigoBorder : solvoColors.border}`}
                        bg={isSelected ? '#FAFAF9' : solvoColors.surface}
                        cursor="pointer"
                      >
                        {unread > 0 && (
                          <Box
                            position="absolute"
                            top="-6px"
                            left="-6px"
                            minWidth="22px"
                            height="22px"
                            padding="0 6px"
                            borderRadius="9999px"
                            bg={solvoColors.indigo}
                            color={solvoColors.surface}
                            fontSize="11px"
                            fontWeight={700}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            style={{ boxShadow: `0 0 0 2px ${solvoColors.surface}` }}
                          >
                            {unread}
                          </Box>
                        )}
                        <Flex justify="space-between" align="center" gap="10px">
                          <Box minWidth="0" flex="1">
                            <Flex align="center" gap="6px" marginBottom="2px">
                              <Text fontSize="sm" fontWeight={600} color={solvoColors.text} truncate>
                                #{r.requestId} — {r.rawQuery}
                              </Text>
                              {unread > 0 && (
                                <Box
                                  padding="1px 7px"
                                  borderRadius="9999px"
                                  bg={solvoColors.indigoLight}
                                  color={solvoColors.indigo}
                                  fontSize="10px"
                                  fontWeight={700}
                                  letterSpacing="0.04em"
                                  flexShrink={0}
                                >
                                  NEW
                                </Box>
                              )}
                            </Flex>
                            <Text fontSize="xs" color={solvoColors.textSubtle}>
                              {r.city ?? 'No city'} · {r.guestCount ?? '—'} guests · {formatDate(r.createdAt)}
                            </Text>
                          </Box>
                          <Box
                            padding="4px 10px"
                            borderRadius="9999px"
                            bg={tone.bg}
                            color={tone.fg}
                            fontSize="11px"
                            fontWeight={600}
                          >
                            {r.status}
                          </Box>
                        </Flex>
                      </Box>
                    );
                  })}
                </Flex>
              )}
            </Box>
          </Box>

          {/* RIGHT: detail */}
          <Box width={{ base: '100%', md: '380px' }} flexShrink={0}>
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="20px" marginBottom="12px">
                Request detail
              </Text>

              {!detail ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  Select a request to view details.
                </Text>
              ) : (
                <>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.04em" textTransform="uppercase">
                    Request #{detail.requestId}
                  </Text>
                  <Text fontSize="md" color={solvoColors.text} marginTop="4px" marginBottom="12px">
                    {detail.rawQuery}
                  </Text>

                  <DetailRow label="Status" value={detail.status} />
                  <DetailRow label="Category" value={detail.category?.categoryName ?? `#${detail.categoryId ?? '—'}`} />
                  <DetailRow label="City" value={detail.city ?? '—'} />
                  <DetailRow label="Service date" value={formatDate(detail.serviceDate)} />
                  <DetailRow label="Guests" value={String(detail.guestCount ?? '—')} />
                  <DetailRow
                    label="Budget"
                    value={
                      detail.budgetMin || detail.budgetMax
                        ? `${detail.budgetMin ?? '—'} → ${detail.budgetMax ?? '—'}`
                        : '—'
                    }
                  />
                  <DetailRow label="Complete" value={detail.isComplete ? 'Yes' : 'No'} />
                  <DetailRow label="Created" value={formatDate(detail.createdAt)} />
                  <DetailRow label="Updated" value={formatDate(detail.updatedAt)} />
                  {detail.closedAt && <DetailRow label="Closed" value={formatDate(detail.closedAt)} />}
                  {detail.closedReason && <DetailRow label="Reason" value={detail.closedReason} />}

                  <Box marginTop="16px">
                    <label style={labelStyle}>Change status</label>
                    <select
                      value={detail.status}
                      onChange={(e) => handleUpdateStatus(e.target.value as RequestStatus)}
                      disabled={busy}
                      style={inputBaseStyle}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Box>

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={busy || detail.status === RequestStatus.Closed}
                    style={{
                      ...buttonBaseStyle,
                      width: '100%',
                      marginTop: '12px',
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      border: `1px solid ${solvoColors.border}`,
                      opacity: busy || detail.status === RequestStatus.Closed ? 0.5 : 1,
                    }}
                  >
                    Close request
                  </button>
                </>
              )}
            </Box>

            {/* Quotes received */}
            {detail && (
              <Box style={sectionStyle} marginTop="20px">
                <Flex justify="space-between" align="center" marginBottom="12px">
                  <Text fontFamily={solvoFonts.serif} fontSize="20px">
                    Quotes received
                  </Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>
                    {quotes.length}
                  </Text>
                </Flex>

                {quotes.length === 0 ? (
                  <Text fontSize="sm" color={solvoColors.textSubtle}>
                    No quotes yet for this request.
                  </Text>
                ) : (
                  <Flex direction="column" gap="8px">
                    {quotes.map((q) => {
                      const canAccept =
                        (q.status === QuoteStatus.Sent || q.status === QuoteStatus.Viewed) &&
                        detail.status !== RequestStatus.Booked &&
                        detail.status !== RequestStatus.Closed;
                      return (
                        <Box
                          key={q.quoteId}
                          padding="12px"
                          borderRadius="10px"
                          border={`1px solid ${solvoColors.border}`}
                        >
                          <Flex justify="space-between" align="center" marginBottom="6px">
                            <Text fontSize="sm" fontWeight={600}>
                              Quote #{q.quoteId} · Supplier #{q.supplierId}
                            </Text>
                            <Box
                              padding="2px 8px"
                              borderRadius="9999px"
                              bg={solvoColors.indigoLight}
                              color={solvoColors.indigo}
                              fontSize="10px"
                              fontWeight={600}
                            >
                              {q.status}
                            </Box>
                          </Flex>
                          <Text fontSize="xs" color={solvoColors.textSubtle} marginBottom="4px">
                            {q.currency} {q.totalPrice} · valid until {formatDate(q.validUntil)}
                          </Text>
                          {q.message && (
                            <Text fontSize="xs" color={solvoColors.textMuted} marginBottom="6px">
                              "{q.message}"
                            </Text>
                          )}
                          <button
                            type="button"
                            onClick={() => handleAcceptQuote(q.quoteId)}
                            disabled={busy || !canAccept}
                            style={{
                              ...buttonBaseStyle,
                              width: '100%',
                              marginTop: '6px',
                              padding: '8px 12px',
                              fontSize: '13px',
                              background: solvoColors.indigo,
                              color: solvoColors.surface,
                              opacity: busy || !canAccept ? 0.5 : 1,
                            }}
                          >
                            Accept quote
                          </button>
                        </Box>
                      );
                    })}
                  </Flex>
                )}
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      {/* New-quote toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={`toast-${toast.ts}`}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: 'fixed',
              top: '80px',
              right: '24px',
              zIndex: 1000,
              maxWidth: '340px',
            }}
            onClick={() => setToast(null)}
          >
            <Flex
              align="flex-start"
              gap="10px"
              padding="14px 16px"
              borderRadius="14px"
              bg={solvoColors.surface}
              border={`1px solid ${solvoColors.indigoBorder}`}
              cursor="pointer"
              style={{ boxShadow: solvoShadows.floatingPanel }}
            >
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
                <Bell size={15} />
              </Flex>
              <Box>
                <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                  {toast.count === 1 ? 'New quote received' : `${toast.count} new quotes received`}
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="2px">
                  Click the highlighted request to review.
                </Text>
              </Box>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justify="space-between" align="flex-start" gap="10px" paddingY="4px">
      <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em">
        {label}
      </Text>
      <Text fontSize="sm" color={solvoColors.text} textAlign="right" maxWidth="60%">
        {value}
      </Text>
    </Flex>
  );
}
