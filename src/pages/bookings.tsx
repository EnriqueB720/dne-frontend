import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  BookingStatus,
  useBookingLazyQuery,
  useBookingsByCustomerLazyQuery,
  useBookingsBySupplierLazyQuery,
  useCancelBookingMutation,
  useCompleteBookingMutation,
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

  const [fetchByCustomer, byCustomerState] = useBookingsByCustomerLazyQuery({ fetchPolicy: 'network-only' });
  const [fetchBySupplier, bySupplierState] = useBookingsBySupplierLazyQuery({ fetchPolicy: 'network-only' });
  const [fetchDetail, detailState] = useBookingLazyQuery({ fetchPolicy: 'network-only' });
  const [cancelBooking, cancelState] = useCancelBookingMutation();
  const [completeBooking, completeState] = useCompleteBookingMutation();

  const list =
    mode === 'customer'
      ? byCustomerState.data?.bookingsByCustomer ?? []
      : bySupplierState.data?.bookingsBySupplier ?? [];

  const detail = detailState.data?.booking;

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

  const handleSelect = async (bookingId: number) => {
    setSelectedBookingId(bookingId);
    await fetchDetail({ variables: { where: { bookingId } } });
  };

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
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Complete failed' });
    }
  };

  const busy =
    byCustomerState.loading ||
    bySupplierState.loading ||
    detailState.loading ||
    cancelState.loading ||
    completeState.loading;

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

              {!detail ? (
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
                  <DetailRow label="Request" value={`#${detail.requestId}`} />
                  <DetailRow label="Quote" value={`#${detail.quoteId}`} />
                  <DetailRow
                    label="Customer"
                    value={(detail as any).customer?.user?.name ?? `#${detail.customerId}`}
                  />
                  <DetailRow
                    label="Supplier"
                    value={(detail as any).supplier?.companyName ?? `#${detail.supplierId}`}
                  />
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
