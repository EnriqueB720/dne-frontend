import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExternalLink, Pencil, Star, Trash2 } from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar, ReviewCreateModal, ConfirmModal } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  BookingStatus,
  useBookingLazyQuery,
  useBookingsByCustomerLazyQuery,
  useBookingsBySupplierLazyQuery,
  useCancelBookingMutation,
  useCompleteBookingMutation,
  useDeleteReviewMutation,
  useBookingEventForCustomerSubscription,
  useBookingEventForSupplierSubscription,
} from '@generated';

type Mode = 'customer' | 'supplier';

const STATUS_OPTIONS: BookingStatus[] = [
  BookingStatus.Confirmed,
  BookingStatus.InProgress,
  BookingStatus.Completed,
  BookingStatus.Cancelled,
  BookingStatus.Disputed,
];

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  CONFIRMED:   { bg: solvoColors.indigoLight, fg: solvoColors.indigo },
  IN_PROGRESS: { bg: solvoColors.amberLight, fg: solvoColors.amberText },
  COMPLETED:   { bg: solvoColors.successLight, fg: solvoColors.successText },
  CANCELLED:   { bg: solvoColors.roseLight, fg: solvoColors.roseText },
  DISPUTED:    { bg: solvoColors.roseLight, fg: solvoColors.roseText },
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

const formatDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleString() : '—');

export default function BookingsPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const customerId = user?.customerId ?? null;
  const supplierId = user?.supplierId ?? null;

  // Default to whichever role the user has; prefer customer when both exist
  const availableModes: Mode[] = [
    ...(customerId ? (['customer'] as Mode[]) : []),
    ...(supplierId ? (['supplier'] as Mode[]) : []),
  ];
  const [mode, setMode] = useState<Mode>(availableModes[0] ?? 'customer');

  // If the user role changes, snap mode to a valid one
  useEffect(() => {
    if (availableModes.length > 0 && !availableModes.includes(mode)) {
      setMode(availableModes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId, supplierId]);

  const actorId = mode === 'customer' ? customerId : supplierId;

  const [filterStatus, setFilterStatus] = useState<BookingStatus | ''>('');
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  // When set, the review modal edits this review instead of creating one.
  const [reviewBeingEdited, setReviewBeingEdited] = useState<any | null>(null);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState(false);

  const [fetchByCustomer, byCustomerState] = useBookingsByCustomerLazyQuery({ fetchPolicy: 'network-only' });
  const [fetchBySupplier, bySupplierState] = useBookingsBySupplierLazyQuery({ fetchPolicy: 'network-only' });
  // cache-and-network: already-viewed bookings render instantly from cache
  // while a background refetch keeps them fresh — no blank panel on click.
  const [fetchDetail, detailState] = useBookingLazyQuery({ fetchPolicy: 'cache-and-network' });
  const [cancelBooking, cancelState] = useCancelBookingMutation();
  const [completeBooking, completeState] = useCompleteBookingMutation();
  const [deleteReview, deleteReviewState] = useDeleteReviewMutation();

  // Fall back to previousData so the list doesn't flash empty mid-refetch.
  const list =
    mode === 'customer'
      ? (byCustomerState.data ?? byCustomerState.previousData)?.bookingsByCustomer ?? []
      : (bySupplierState.data ?? bySupplierState.previousData)?.bookingsBySupplier ?? [];

  const detail = detailState.data?.booking;
  // First visit to a booking that isn't cached yet — show a skeleton instead
  // of collapsing the panel.
  const detailFirstLoad = detailState.loading && !detail;

  const handleLoad = async () => {
    if (!actorId) return;
    const status = filterStatus === '' ? null : filterStatus;
    if (mode === 'customer') {
      await fetchByCustomer({ variables: { customerId: actorId, status } });
    } else {
      await fetchBySupplier({ variables: { supplierId: actorId, status } });
    }
  };

  // Auto-load whenever mode, role IDs, or filter change
  useEffect(() => {
    if (actorId) {
      setSelectedBookingId(null);
      handleLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actorId, mode, filterStatus]);

  // Live updates — any booking the customer/supplier is on changes, refetch.
  useBookingEventForCustomerSubscription({
    variables: { customerId: customerId ?? 0 },
    skip: mode !== 'customer' || !customerId,
    onData: () => {
      handleLoad();
      if (selectedBookingId) {
        fetchDetail({ variables: { where: { bookingId: selectedBookingId } } });
      }
    },
  });
  useBookingEventForSupplierSubscription({
    variables: { supplierId: supplierId ?? 0 },
    skip: mode !== 'supplier' || !supplierId,
    onData: () => {
      handleLoad();
      if (selectedBookingId) {
        fetchDetail({ variables: { where: { bookingId: selectedBookingId } } });
      }
    },
  });

  const handleSelect = async (bookingId: number) => {
    setSelectedBookingId(bookingId);
    await fetchDetail({ variables: { where: { bookingId } } });
  };

  // Deep-link support: notification rows land on /bookings?id=N — select
  // that booking as soon as the router and role are ready.
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady || !actorId) return;
    const id = Number(router.query.id);
    if (id && id !== selectedBookingId) {
      handleSelect(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.id, actorId]);

  const handleCancel = async () => {
    if (!selectedBookingId) return;
    const reason = window.prompt('Cancel reason (optional)') ?? undefined;
    try {
      await cancelBooking({
        variables: {
          data: {
            bookingId: selectedBookingId,
            reason,
            cancelledBy: mode === 'customer' ? 'CUSTOMER' : 'SUPPLIER',
          },
        },
      });
      setFeedback({ kind: 'ok', text: `Cancelled booking #${selectedBookingId}` });
      await Promise.all([
        fetchDetail({ variables: { where: { bookingId: selectedBookingId } } }),
        handleLoad(),
      ]);
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Cancel failed' });
    }
  };

  const handleComplete = async () => {
    if (!selectedBookingId) return;
    try {
      await completeBooking({ variables: { data: { bookingId: selectedBookingId } } });
      setFeedback({ kind: 'ok', text: `Completed booking #${selectedBookingId}` });
      await Promise.all([
        fetchDetail({ variables: { where: { bookingId: selectedBookingId } } }),
        handleLoad(),
      ]);
      // The natural next step for a customer is the review — open it right away.
      if (mode === 'customer') {
        setReviewBeingEdited(null);
        setReviewModalOpen(true);
      }
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Complete failed' });
    }
  };

  const handleDeleteReview = async () => {
    const review = (detail as any)?.review;
    if (!review || !customerId) return;
    try {
      await deleteReview({
        variables: { data: { reviewId: review.reviewId, customerId } },
      });
      setConfirmDeleteReview(false);
      setFeedback({ kind: 'ok', text: 'Review removed' });
      await Promise.all([
        fetchDetail({ variables: { where: { bookingId: detail!.bookingId } } }),
        handleLoad(),
      ]);
    } catch (err: any) {
      setConfirmDeleteReview(false);
      setFeedback({ kind: 'err', text: err?.message ?? 'Failed to remove review' });
    }
  };

  // Mutations in flight — disables the action buttons. Deliberately does NOT
  // include query loading, so clicking around never dims the page.
  const busy = cancelState.loading || completeState.loading || deleteReviewState.loading;
  // List refetch in flight — only the Refresh button reflects this.
  const listBusy = byCustomerState.loading || bySupplierState.loading;

  // ── Gating: not signed in / no roles ───────────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/bookings" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to view your bookings
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="20px">
              Confirmed deals between customers and suppliers live here.
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

  if (availableModes.length === 0) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/bookings" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              No bookings to show
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Your account has neither a customer nor a supplier profile.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/bookings" />

      <Box maxWidth="1200px" margin="0 auto" padding="32px 24px">
        <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.1em" textTransform="uppercase" marginBottom="8px">
          Hi, {user.name}
        </Text>
        <Text as="h1" fontFamily={solvoFonts.serif} fontSize="36px" color={solvoColors.text} marginBottom="6px">
          Bookings
        </Text>
        <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="24px">
          Confirmed deals between customers and suppliers. Cancel or mark complete here.
        </Text>

        <Box style={sectionStyle} marginBottom="20px">
          {availableModes.length > 1 && (
            <Flex gap="10px" align="center" wrap="wrap" marginBottom="14px">
              {availableModes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  style={{
                    ...buttonBaseStyle,
                    padding: '8px 14px',
                    background: mode === m ? solvoColors.text : solvoColors.surface,
                    color: mode === m ? solvoColors.surface : solvoColors.text,
                    border: `1px solid ${mode === m ? solvoColors.text : solvoColors.border}`,
                  }}
                >
                  As {m}
                </button>
              ))}
            </Flex>
          )}

          <Flex gap="10px" align="center" wrap="wrap">
            <label style={{ ...labelStyle, marginBottom: 0 }}>Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === '' ? '' : (e.target.value as BookingStatus))}
              style={{ ...inputBaseStyle, maxWidth: '220px' }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleLoad}
              disabled={listBusy}
              style={{
                ...buttonBaseStyle,
                background: solvoColors.surface,
                color: solvoColors.text,
                border: `1px solid ${solvoColors.border}`,
                opacity: listBusy ? 0.5 : 1,
              }}
            >
              {listBusy ? 'Refreshing…' : 'Refresh'}
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
          <Box flex="1" minWidth="0" width="100%">
            <Box style={sectionStyle}>
              <Flex justify="space-between" align="center" marginBottom="14px">
                <Text fontFamily={solvoFonts.serif} fontSize="20px">
                  Bookings
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {list.length} result{list.length === 1 ? '' : 's'}
                </Text>
              </Flex>

              {list.length === 0 ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  No bookings yet. They appear after a customer accepts a quote.
                </Text>
              ) : (
                <Flex direction="column" gap="8px">
                  {list.map((b) => {
                    const tone = STATUS_TONE[b.status] ?? STATUS_TONE.CANCELLED;
                    const isSelected = b.bookingId === selectedBookingId;
                    return (
                      <Box
                        key={b.bookingId}
                        onClick={() => handleSelect(b.bookingId)}
                        padding="12px 14px"
                        borderRadius="10px"
                        border={`1px solid ${isSelected ? solvoColors.text : solvoColors.border}`}
                        bg={isSelected ? '#FAFAF9' : solvoColors.surface}
                        cursor="pointer"
                      >
                        <Flex justify="space-between" align="center" gap="10px">
                          <Box minWidth="0" flex="1">
                            <Text fontSize="sm" fontWeight={600} color={solvoColors.text} truncate>
                              {mode === 'customer'
                                ? ((b as any).supplier?.companyName ?? `Supplier #${b.supplierId}`)
                                : ((b as any).customer?.user?.name ?? `Customer #${b.customerId}`)}
                            </Text>
                            <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="2px" truncate>
                              {(b as any).request?.rawQuery ?? `Request #${b.requestId}`}
                            </Text>
                            <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="2px">
                              {b.location} · {b.currency} {b.totalPrice} · {formatDate(b.serviceDate)}
                            </Text>
                          </Box>
                          <Flex direction="column" align="flex-end" gap="4px" flexShrink={0}>
                            <Box
                              padding="4px 10px"
                              borderRadius="9999px"
                              bg={tone.bg}
                              color={tone.fg}
                              fontSize="11px"
                              fontWeight={600}
                            >
                              {b.status}
                            </Box>
                            {(b as any).review && (
                              <Box
                                padding="4px 10px"
                                borderRadius="9999px"
                                bg={solvoColors.amberLight}
                                color={solvoColors.amberText}
                                fontSize="11px"
                                fontWeight={600}
                              >
                                ★ {(b as any).review.rating}
                              </Box>
                            )}
                          </Flex>
                        </Flex>
                      </Box>
                    );
                  })}
                </Flex>
              )}
            </Box>
          </Box>

          <Box width={{ base: '100%', md: '380px' }} flexShrink={0}>
            <Box style={sectionStyle}>
              <Text fontFamily={solvoFonts.serif} fontSize="20px" marginBottom="12px">
                Booking detail
              </Text>

              {detailFirstLoad ? (
                // Skeleton keeps the panel height stable while the first
                // fetch of this booking is in flight.
                <Flex direction="column" gap="10px">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Flex key={i} justify="space-between" gap="10px">
                      <Box width="30%" height="12px" borderRadius="6px" bg={solvoColors.bg} />
                      <Box width="45%" height="12px" borderRadius="6px" bg={solvoColors.bg} />
                    </Flex>
                  ))}
                </Flex>
              ) : !detail ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  Select a booking to view details.
                </Text>
              ) : (
                <>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.04em" textTransform="uppercase">
                    Booking #{detail.bookingId}
                  </Text>

                  <DetailRow label="Status" value={detail.status} />
                  <DetailRow label="Payment" value={detail.paymentStatus} />
                  <DetailRow
                    label="Request"
                    value={
                      (detail as any).request?.rawQuery
                        ? `#${detail.requestId} — ${(detail as any).request.rawQuery}`
                        : `#${detail.requestId}`
                    }
                  />
                  <DetailRow
                    label="Quote"
                    value={
                      (detail as any).quote
                        ? `#${detail.quoteId} · ${(detail as any).quote.currency ?? detail.currency} ${(detail as any).quote.totalPrice ?? detail.totalPrice}`
                        : `#${detail.quoteId}`
                    }
                  />
                  <DetailRow
                    label="Customer"
                    value={
                      (detail as any).customer?.user?.name
                        ? `${(detail as any).customer.user.name} · #${detail.customerId}`
                        : `#${detail.customerId}`
                    }
                  />
                  <Flex justify="space-between" align="flex-start" gap="10px" paddingY="4px">
                    <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em">
                      Supplier
                    </Text>
                    <Box textAlign="right" maxWidth="60%">
                      <Text fontSize="sm" color={solvoColors.text}>
                        {(detail as any).supplier?.companyName ?? `#${detail.supplierId}`}
                      </Text>
                      <Link
                        href={`/providers/${detail.supplierId}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: solvoColors.indigo,
                          textDecoration: 'none',
                        }}
                      >
                        View profile & reviews <ExternalLink size={11} />
                      </Link>
                    </Box>
                  </Flex>
                  <DetailRow label="Service date" value={formatDate(detail.serviceDate)} />
                  {detail.serviceEndDate && <DetailRow label="End date" value={formatDate(detail.serviceEndDate)} />}
                  <DetailRow label="Location" value={detail.location} />
                  <DetailRow label="Guests" value={String(detail.guestCount ?? '—')} />
                  <DetailRow label="Total" value={`${detail.currency} ${detail.totalPrice}`} />
                  <DetailRow label="Platform fee" value={`${detail.currency} ${detail.platformFee}`} />
                  <DetailRow label="Supplier payout" value={`${detail.currency} ${detail.supplierPayout}`} />
                  <DetailRow label="Created" value={formatDate(detail.createdAt)} />
                  {detail.cancelledAt && <DetailRow label="Cancelled" value={formatDate(detail.cancelledAt)} />}
                  {detail.cancelledBy && <DetailRow label="By" value={detail.cancelledBy} />}
                  {detail.cancellationReason && <DetailRow label="Reason" value={detail.cancellationReason} />}
                  {detail.completedAt && <DetailRow label="Completed" value={formatDate(detail.completedAt)} />}

                  {/* Review — shown once the service is done */}
                  {(detail as any).review ? (
                    <Box
                      marginTop="16px"
                      padding="12px 14px"
                      borderRadius="10px"
                      bg={solvoColors.amberLight}
                    >
                      <Flex align="center" gap="6px" marginBottom="4px">
                        <Flex gap="2px">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={14}
                              color={solvoColors.amberText}
                              fill={n <= (detail as any).review.rating ? solvoColors.amberText : 'transparent'}
                            />
                          ))}
                        </Flex>
                        <Text fontSize="xs" fontWeight={600} color={solvoColors.amberText}>
                          {mode === 'customer' ? 'Your review' : 'Customer review'}
                        </Text>
                      </Flex>
                      {(detail as any).review.text && (
                        <Text fontSize="sm" color={solvoColors.text}>
                          "{(detail as any).review.text}"
                        </Text>
                      )}
                      <SubRatingsLine review={(detail as any).review} />
                      <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="4px">
                        {formatDate((detail as any).review.createdAt)}
                      </Text>
                      {mode === 'customer' && (
                        <Flex gap="8px" marginTop="10px">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              setReviewBeingEdited((detail as any).review);
                              setReviewModalOpen(true);
                            }}
                            style={{
                              ...buttonBaseStyle,
                              padding: '6px 12px',
                              fontSize: '12px',
                              background: solvoColors.surface,
                              color: solvoColors.text,
                              border: `1px solid ${solvoColors.border}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              opacity: busy ? 0.5 : 1,
                            }}
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setConfirmDeleteReview(true)}
                            style={{
                              ...buttonBaseStyle,
                              padding: '6px 12px',
                              fontSize: '12px',
                              background: solvoColors.surface,
                              color: solvoColors.roseText,
                              border: `1px solid ${solvoColors.border}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              opacity: busy ? 0.5 : 1,
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </Flex>
                      )}
                    </Box>
                  ) : (
                    mode === 'customer' &&
                    detail.status === BookingStatus.Completed && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewBeingEdited(null);
                          setReviewModalOpen(true);
                        }}
                        disabled={busy}
                        style={{
                          ...buttonBaseStyle,
                          width: '100%',
                          marginTop: '16px',
                          background: solvoColors.amberLight,
                          color: solvoColors.amberText,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          opacity: busy ? 0.5 : 1,
                        }}
                      >
                        <Star size={14} /> Leave a review
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={handleComplete}
                    disabled={
                      busy ||
                      detail.status === BookingStatus.Completed ||
                      detail.status === BookingStatus.Cancelled
                    }
                    style={{
                      ...buttonBaseStyle,
                      width: '100%',
                      marginTop: '16px',
                      background: solvoColors.indigo,
                      color: solvoColors.surface,
                      opacity:
                        busy ||
                        detail.status === BookingStatus.Completed ||
                        detail.status === BookingStatus.Cancelled
                          ? 0.5
                          : 1,
                    }}
                  >
                    Mark complete
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={
                      busy ||
                      detail.status === BookingStatus.Cancelled ||
                      detail.status === BookingStatus.Completed
                    }
                    style={{
                      ...buttonBaseStyle,
                      width: '100%',
                      marginTop: '8px',
                      background: solvoColors.surface,
                      color: solvoColors.text,
                      border: `1px solid ${solvoColors.border}`,
                      opacity:
                        busy ||
                        detail.status === BookingStatus.Cancelled ||
                        detail.status === BookingStatus.Completed
                          ? 0.5
                          : 1,
                    }}
                  >
                    Cancel booking
                  </button>
                </>
              )}
            </Box>
          </Box>
        </Flex>
      </Box>

      {reviewModalOpen && detail && customerId && (
        <ReviewCreateModal
          bookingId={detail.bookingId}
          customerId={customerId}
          supplierName={(detail as any).supplier?.companyName}
          bookingSummary={(detail as any).request?.rawQuery}
          serviceDate={detail.serviceDate}
          existingReview={reviewBeingEdited}
          onSaved={async () => {
            setFeedback({
              kind: 'ok',
              text: reviewBeingEdited
                ? `Review updated for booking #${detail.bookingId}`
                : `Review submitted for booking #${detail.bookingId}`,
            });
            await Promise.all([
              fetchDetail({ variables: { where: { bookingId: detail.bookingId } } }),
              handleLoad(),
            ]);
          }}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewBeingEdited(null);
          }}
        />
      )}

      {confirmDeleteReview && (detail as any)?.review && (
        <ConfirmModal
          title="Remove review?"
          message={`Your review of ${(detail as any).supplier?.companyName ?? 'this supplier'} will be deleted and their rating recalculated. This can't be undone.`}
          preview={
            <>
              <Flex gap="2px" marginBottom={(detail as any).review.text ? '6px' : '0'}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={13}
                    color={solvoColors.amberText}
                    fill={n <= (detail as any).review.rating ? solvoColors.amberText : 'transparent'}
                  />
                ))}
              </Flex>
              {(detail as any).review.text && (
                <Text fontSize="13px" color={solvoColors.text}>
                  "{(detail as any).review.text}"
                </Text>
              )}
            </>
          }
          confirmLabel="Remove review"
          loading={deleteReviewState.loading}
          onConfirm={handleDeleteReview}
          onCancel={() => setConfirmDeleteReview(false)}
        />
      )}
    </Box>
  );
}

/** Compact "Quality 4★ · Value 5★" line for whichever sub-ratings exist. */
function SubRatingsLine({ review }: { review: any }) {
  const parts = [
    ['Quality', review.ratingQuality],
    ['Communication', review.ratingCommunication],
    ['Value', review.ratingValue],
    ['Punctuality', review.ratingPunctuality],
  ].filter(([, v]) => v != null) as Array<[string, number]>;

  if (parts.length === 0) return null;
  return (
    <Text fontSize="xs" color={solvoColors.textMuted} marginTop="6px">
      {parts.map(([label, v]) => `${label} ${v}★`).join(' · ')}
    </Text>
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
