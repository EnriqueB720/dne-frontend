import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import { Box, Flex, Text, SolvoNavBar } from '@components';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';
import {
  QuoteStatus,
  useCreateQuoteMutation,
  useQuoteLazyQuery,
  useQuotesBySupplierLazyQuery,
  useRequestLazyQuery,
  useWithdrawQuoteMutation,
  useCreateConversationMutation,
  useQuoteEventForSupplierSubscription,
} from '@generated';

const STATUS_OPTIONS: QuoteStatus[] = [
  QuoteStatus.Sent,
  QuoteStatus.Viewed,
  QuoteStatus.Accepted,
  QuoteStatus.Rejected,
  QuoteStatus.Expired,
  QuoteStatus.Withdrawn,
];

const STATUS_TONE: Record<string, { bg: string; fg: string }> = {
  SENT:      { bg: solvoColors.indigoLight, fg: solvoColors.indigo },
  VIEWED:    { bg: solvoColors.indigoLight, fg: solvoColors.indigo },
  ACCEPTED:  { bg: solvoColors.successLight, fg: solvoColors.successText },
  REJECTED:  { bg: solvoColors.roseLight, fg: solvoColors.roseText },
  EXPIRED:   { bg: '#F5F5F4', fg: solvoColors.textSubtle },
  WITHDRAWN: { bg: '#F5F5F4', fg: solvoColors.textSubtle },
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

type ItemDraft = {
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
};

const emptyItem = (): ItemDraft => ({ description: '', quantity: '', unitPrice: '', total: '' });

export default function QuotesPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const supplierId = user?.supplierId ?? null;

  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const [requestId, setRequestId] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [currency, setCurrency] = useState('CRC');
  const [message, setMessage] = useState('');
  const [validUntil, setValidUntil] = useState('');
  // Modal toggle for the create-quote form. Defaults closed; auto-opens when
  // the URL has `?requestId=` (deep-link from the Open leads "Send quote" CTA).
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>([]);
  // Available time windows the supplier is offering for this quote. The
  // customer picks one when accepting, and that slot becomes the booking
  // date + a calendar event on the supplier's calendar.
  const [slots, setSlots] = useState<Array<{ startsAt: string; endsAt: string }>>([]);
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | ''>('');

  const [createQuote, createState] = useCreateQuoteMutation();
  const [fetchList, listState] = useQuotesBySupplierLazyQuery({ fetchPolicy: 'network-only' });
  const [fetchDetail, detailState] = useQuoteLazyQuery({ fetchPolicy: 'network-only' });
  const [fetchRequestForQuote, requestForQuoteState] = useRequestLazyQuery({
    fetchPolicy: 'network-only',
  });
  const [withdrawQuote, withdrawState] = useWithdrawQuoteMutation();
  const [createConversation, createConvState] = useCreateConversationMutation();
  const router = useRouter();

  // True when the requestId was supplied externally (URL param) — the input
  // becomes read-only so the supplier can't accidentally retarget the quote.
  const requestIdLocked = Boolean(router.query.requestId);

  // Customer name pulled from the request being quoted, displayed in the modal
  // header so the supplier knows who they're quoting.
  const customerName: string | undefined =
    (requestForQuoteState.data?.request as any)?.customer?.user?.name ?? undefined;

  // Prefill the create form when the supplier lands here via /quotes?requestId=N
  // (e.g. clicking "Send a quote →" from the Open leads inbox on /requests).
  useEffect(() => {
    const rId = router.query.requestId;
    if (!rId) return;
    const idStr = Array.isArray(rId) ? rId[0] : rId;
    if (idStr && idStr !== requestId) setRequestId(idStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.requestId]);

  const handleMessageCustomer = async (requestId: number) => {
    if (!supplierId) return;
    try {
      const { data } = await createConversation({
        variables: { data: { requestId, supplierId } as any },
      });
      const convId = data?.createConversation.conversationId;
      if (convId) {
        router.push({ pathname: '/messages', query: { id: convId } });
      }
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Failed to start conversation' });
    }
  };

  const list = listState.data?.quotesBySupplier ?? [];
  const detail = detailState.data?.quote;

  const handleLoad = async () => {
    if (!supplierId) return;
    await fetchList({
      variables: {
        supplierId,
        status: filterStatus === '' ? null : filterStatus,
      },
    });
  };

  // Auto-load whenever the supplier becomes available or the filter changes
  useEffect(() => {
    if (supplierId) handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId, filterStatus]);

  // Live updates — any change to one of this supplier's quotes (accept,
  // withdraw, expire) refetches the list + detail. Replaces the 15s poll.
  useQuoteEventForSupplierSubscription({
    variables: { supplierId: supplierId ?? 0 },
    skip: !supplierId,
    onData: () => {
      if (supplierId) handleLoad();
      if (selectedQuoteId) {
        fetchDetail({ variables: { where: { quoteId: selectedQuoteId } } });
      }
    },
  });

  // Prefill the create form AND auto-open the modal when arriving from a
  // "Send quote" link (e.g. /quotes?requestId=42) on the Open leads tab.
  useEffect(() => {
    const rid = router.query.requestId;
    if (!rid) return;
    const value = Array.isArray(rid) ? rid[0] : rid;
    if (value) {
      if (value !== requestId) setRequestId(value);
      setShowCreateModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.requestId]);

  // Fetch the request details (customer name, etc.) whenever requestId
  // changes to a valid number, so the modal can display who the supplier
  // is quoting.
  useEffect(() => {
    const idNum = Number(requestId);
    if (!Number.isFinite(idNum) || idNum <= 0) return;
    fetchRequestForQuote({ variables: { where: { requestId: idNum } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  // Close the modal on Escape
  useEffect(() => {
    if (!showCreateModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !createState.loading) setShowCreateModal(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showCreateModal, createState.loading]);

  const handleCreate = async () => {
    if (!supplierId) return setFeedback({ kind: 'err', text: 'You must be a supplier to create quotes' });
    if (!requestId || !totalPrice || !validUntil) {
      return setFeedback({ kind: 'err', text: 'requestId, totalPrice, validUntil are required' });
    }

    const itemsPayload = items
      .filter((it) => it.description.trim() !== '')
      .map((it) => ({
        description: it.description,
        quantity: Number(it.quantity || 1),
        unitPrice: Number(it.unitPrice || 0),
        total: Number(it.total || 0),
      }));

    const slotsPayload = slots
      .filter((s) => s.startsAt && s.endsAt)
      .map((s) => ({
        startsAt: new Date(s.startsAt).toISOString(),
        endsAt: new Date(s.endsAt).toISOString(),
      }));

    try {
      const { data } = await createQuote({
        variables: {
          data: {
            requestId: Number(requestId),
            supplierId,
            totalPrice: Number(totalPrice),
            currency: currency || undefined,
            message: message || undefined,
            validUntil,
            items: itemsPayload.length > 0 ? itemsPayload : undefined,
            offeredSlots: slotsPayload.length > 0 ? slotsPayload : undefined,
          } as any,
        },
      });
      setFeedback({ kind: 'ok', text: `Created quote #${data?.createQuote.quoteId}` });
      setRequestId('');
      setTotalPrice('');
      setMessage('');
      setValidUntil('');
      setItems([]);
      setSlots([]);
      setShowCreateModal(false);
      await handleLoad();
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Create failed' });
    }
  };

  const handleSelect = async (quoteId: number) => {
    setSelectedQuoteId(quoteId);
    await fetchDetail({ variables: { where: { quoteId } } });
  };

  const handleWithdraw = async () => {
    if (!selectedQuoteId) return;
    try {
      await withdrawQuote({ variables: { data: { quoteId: selectedQuoteId } } });
      setFeedback({ kind: 'ok', text: `Withdrew quote #${selectedQuoteId}` });
      await Promise.all([
        fetchDetail({ variables: { where: { quoteId: selectedQuoteId } } }),
        handleLoad(),
      ]);
    } catch (err: any) {
      setFeedback({ kind: 'err', text: err?.message ?? 'Withdraw failed' });
    }
  };

  const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const busy = createState.loading || listState.loading || detailState.loading || withdrawState.loading;

  // ── Gating: not signed in / not a supplier ─────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/quotes" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              Sign in to manage quotes
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted} marginBottom="20px">
              Suppliers send and track quotes from this page.
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

  if (!supplierId) {
    return (
      <Box minHeight="100vh" bg={solvoColors.bg}>
        <SolvoNavBar activePath="/quotes" />
        <Flex minHeight="60vh" align="center" justify="center" padding="24px">
          <Box style={sectionStyle} maxWidth="420px" textAlign="center">
            <Text fontFamily={solvoFonts.serif} fontSize="24px" color={solvoColors.text} marginBottom="8px">
              This page is for suppliers
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Your account doesn't have a supplier profile. Customers can browse their requests at <Link href="/requests" style={{ color: solvoColors.indigo, fontWeight: 600 }}>/requests</Link>.
            </Text>
          </Box>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={solvoColors.bg}>
      <SolvoNavBar activePath="/quotes" />

      <Box maxWidth="1200px" margin="0 auto" padding="32px 24px">
        <Flex justify="space-between" align="flex-start" gap="16px" wrap="wrap" marginBottom="24px">
          <Box>
            <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.1em" textTransform="uppercase" marginBottom="8px">
              Hi, {user.name}
            </Text>
            <Text as="h1" fontFamily={solvoFonts.serif} fontSize="36px" color={solvoColors.text} marginBottom="6px">
              Quotes
            </Text>
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Create quotes against requests and manage your sent quotes.
            </Text>
          </Box>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            style={{
              ...buttonBaseStyle,
              background: solvoColors.text,
              color: solvoColors.surface,
              whiteSpace: 'nowrap',
            }}
          >
            + New quote
          </button>
        </Flex>

        <Box style={sectionStyle} marginBottom="20px">
          <Flex gap="10px" align="center" wrap="wrap">
            <label style={{ ...labelStyle, marginBottom: 0 }}>Filter:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === '' ? '' : (e.target.value as QuoteStatus))}
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
            {/* Create-quote modal — pattern matches the "Select provider" dialog on / */}
            <AnimatePresence>
              {showCreateModal && (
                <motion.div
                  key="create-quote-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(28, 25, 23, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                  }}
                  onClick={() => !createState.loading && setShowCreateModal(false)}
                >
                  <motion.div
                    key="create-quote-panel"
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      maxWidth: '560px',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      background: solvoColors.surface,
                      borderRadius: '20px',
                      boxShadow: solvoShadows.heroInput,
                    }}
                  >
                    <Flex
                      align="center"
                      justify="space-between"
                      padding="18px 22px"
                      borderBottom={`1px solid ${solvoColors.border}`}
                    >
                      <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                        New quote
                      </Text>
                      <Box
                        as="button"
                        onClick={() => !createState.loading && setShowCreateModal(false)}
                        width="30px"
                        height="30px"
                        borderRadius="9px"
                        bg="transparent"
                        border={`1px solid ${solvoColors.border}`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        color={solvoColors.text}
                        style={{ padding: 0 }}
                      >
                        <X size={16} />
                      </Box>
                    </Flex>

                    <Box padding="20px 22px">

              {/* Customer + request context — surfaced once we've fetched the
                  request behind the requestId. Mirrors the layout used in the
                  shared QuoteCreateModal molecule. */}
              {(customerName || (requestForQuoteState.data?.request as any)?.rawQuery) && (
                <Box
                  padding="12px 14px"
                  borderRadius="12px"
                  bg={solvoColors.bg}
                  border={`1px solid ${solvoColors.border}`}
                  marginBottom="14px"
                >
                  {customerName && (
                    <Text fontSize="11px" fontWeight={600} color={solvoColors.textMuted} textTransform="uppercase" letterSpacing="0.04em" marginBottom="4px">
                      Customer · {customerName}
                    </Text>
                  )}
                  {(requestForQuoteState.data?.request as any)?.rawQuery && (
                    <Text fontSize="13px" color={solvoColors.text}>
                      "{(requestForQuoteState.data!.request as any).rawQuery}"
                    </Text>
                  )}
                </Box>
              )}

              <Flex gap="12px" wrap="wrap" marginBottom="12px">
                <Box flex="1" minWidth="120px">
                  <label style={labelStyle}>Request ID *</label>
                  <input
                    type="number"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    readOnly={requestIdLocked}
                    style={{
                      ...inputBaseStyle,
                      background: requestIdLocked ? solvoColors.bg : solvoColors.surface,
                      color: requestIdLocked ? solvoColors.textMuted : solvoColors.text,
                      cursor: requestIdLocked ? 'not-allowed' : 'text',
                    }}
                  />
                </Box>
                <Box flex="1" minWidth="120px">
                  <label style={labelStyle}>Total price *</label>
                  <input type="number" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} style={inputBaseStyle} />
                </Box>
                <Box flex="1" minWidth="100px">
                  <label style={labelStyle}>Currency</label>
                  <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} style={inputBaseStyle} />
                </Box>
              </Flex>

              <Box marginBottom="12px">
                <label style={labelStyle}>Valid until *</label>
                <input
                  type="datetime-local"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  style={inputBaseStyle}
                />
              </Box>

              <Box marginBottom="12px">
                <label style={labelStyle}>Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  style={{ ...inputBaseStyle, resize: 'vertical' }}
                />
              </Box>

              <Flex justify="space-between" align="center" marginBottom="8px">
                <Text fontSize="sm" fontWeight={600} color={solvoColors.textMuted}>
                  Line items
                </Text>
                <button
                  type="button"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                  style={{
                    ...buttonBaseStyle,
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: solvoColors.surface,
                    color: solvoColors.text,
                    border: `1px solid ${solvoColors.border}`,
                  }}
                >
                  + Add item
                </button>
              </Flex>

              {items.map((it, idx) => (
                <Flex gap="6px" wrap="wrap" marginBottom="6px" key={idx} align="flex-end">
                  <Box flex="3" minWidth="160px">
                    <input
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => updateItem(idx, { description: e.target.value })}
                      style={{ ...inputBaseStyle, fontSize: '13px' }}
                    />
                  </Box>
                  <Box flex="1" minWidth="70px">
                    <input
                      placeholder="Qty"
                      type="number"
                      value={it.quantity}
                      onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                      style={{ ...inputBaseStyle, fontSize: '13px' }}
                    />
                  </Box>
                  <Box flex="1" minWidth="80px">
                    <input
                      placeholder="Unit"
                      type="number"
                      value={it.unitPrice}
                      onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
                      style={{ ...inputBaseStyle, fontSize: '13px' }}
                    />
                  </Box>
                  <Box flex="1" minWidth="80px">
                    <input
                      placeholder="Total"
                      type="number"
                      value={it.total}
                      onChange={(e) => updateItem(idx, { total: e.target.value })}
                      style={{ ...inputBaseStyle, fontSize: '13px' }}
                    />
                  </Box>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                    style={{
                      ...buttonBaseStyle,
                      padding: '8px 10px',
                      fontSize: '12px',
                      background: solvoColors.surface,
                      color: solvoColors.roseText,
                      border: `1px solid ${solvoColors.border}`,
                    }}
                  >
                    ×
                  </button>
                </Flex>
              ))}

              {/* Available time slots — supplier offers, customer picks one when accepting */}
              <Flex justify="space-between" align="center" marginTop="16px" marginBottom="8px">
                <Box>
                  <Text fontSize="sm" fontWeight={600} color={solvoColors.textMuted}>
                    Available time slots
                  </Text>
                  <Text fontSize="xs" color={solvoColors.textSubtle}>
                    The customer picks one when accepting your quote.
                  </Text>
                </Box>
                <button
                  type="button"
                  onClick={() =>
                    setSlots((prev) => [...prev, { startsAt: '', endsAt: '' }])
                  }
                  style={{
                    ...buttonBaseStyle,
                    padding: '6px 12px',
                    fontSize: '12px',
                    background: solvoColors.surface,
                    color: solvoColors.text,
                    border: `1px solid ${solvoColors.border}`,
                  }}
                >
                  + Add slot
                </button>
              </Flex>

              {slots.map((s, idx) => (
                <Flex gap="6px" wrap="wrap" marginBottom="6px" key={idx} align="flex-end">
                  <Box flex="1" minWidth="180px">
                    <label style={{ ...labelStyle, fontSize: '11px' }}>Starts</label>
                    <input
                      type="datetime-local"
                      value={s.startsAt}
                      onChange={(e) =>
                        setSlots((prev) =>
                          prev.map((sl, i) =>
                            i === idx ? { ...sl, startsAt: e.target.value } : sl,
                          ),
                        )
                      }
                      style={{ ...inputBaseStyle, fontSize: '13px' }}
                    />
                  </Box>
                  <Box flex="1" minWidth="180px">
                    <label style={{ ...labelStyle, fontSize: '11px' }}>Ends</label>
                    <input
                      type="datetime-local"
                      value={s.endsAt}
                      onChange={(e) =>
                        setSlots((prev) =>
                          prev.map((sl, i) =>
                            i === idx ? { ...sl, endsAt: e.target.value } : sl,
                          ),
                        )
                      }
                      style={{ ...inputBaseStyle, fontSize: '13px' }}
                    />
                  </Box>
                  <button
                    type="button"
                    onClick={() =>
                      setSlots((prev) => prev.filter((_, i) => i !== idx))
                    }
                    style={{
                      ...buttonBaseStyle,
                      padding: '8px 10px',
                      fontSize: '12px',
                      background: solvoColors.surface,
                      color: solvoColors.roseText,
                      border: `1px solid ${solvoColors.border}`,
                    }}
                  >
                    ×
                  </button>
                </Flex>
              ))}

              <Flex justify="flex-end" marginTop="16px">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={busy}
                  style={{
                    ...buttonBaseStyle,
                    background: solvoColors.indigo,
                    color: solvoColors.surface,
                    opacity: busy ? 0.5 : 1,
                  }}
                >
                  {createState.loading ? 'Creating…' : 'Create quote'}
                </button>
              </Flex>
                    </Box>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <Box style={sectionStyle}>
              <Flex justify="space-between" align="center" marginBottom="14px">
                <Text fontFamily={solvoFonts.serif} fontSize="20px">
                  My quotes
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {list.length} result{list.length === 1 ? '' : 's'}
                </Text>
              </Flex>

              {list.length === 0 ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  No quotes yet. Tap "+ New quote" to send your first one — or head to "Open leads" on /requests to quote a specific customer request.
                </Text>
              ) : (
                <Flex direction="column" gap="8px">
                  {list.map((q) => {
                    const tone = STATUS_TONE[q.status] ?? STATUS_TONE.EXPIRED;
                    const isSelected = q.quoteId === selectedQuoteId;
                    return (
                      <Box
                        key={q.quoteId}
                        onClick={() => handleSelect(q.quoteId)}
                        padding="12px 14px"
                        borderRadius="10px"
                        border={`1px solid ${isSelected ? solvoColors.text : solvoColors.border}`}
                        bg={isSelected ? '#FAFAF9' : solvoColors.surface}
                        cursor="pointer"
                      >
                        <Flex justify="space-between" align="center" gap="10px">
                          <Box minWidth="0" flex="1">
                            <Text fontSize="sm" fontWeight={600} color={solvoColors.text} truncate>
                              {(q as any).request?.customer?.user?.name ?? 'Customer'}
                            </Text>
                            {(q as any).request?.rawQuery && (
                              <Text fontSize="xs" color={solvoColors.textMuted} marginTop="2px" truncate>
                                {(q as any).request.rawQuery}
                              </Text>
                            )}
                            <Text fontSize="xs" color={solvoColors.textSubtle} marginTop="2px">
                              {q.currency} {q.totalPrice} · valid until {formatDate(q.validUntil)}
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
                            {q.status}
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
                Quote detail
              </Text>

              {!detail ? (
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  Select a quote to view details.
                </Text>
              ) : (
                <>
                  <Text fontSize="xs" color={solvoColors.textSubtle} letterSpacing="0.04em" textTransform="uppercase">
                    Quote #{detail.quoteId}
                  </Text>
                  {(detail as any).request?.rawQuery && (
                    <Text fontFamily={solvoFonts.serif} fontSize="18px" color={solvoColors.text} marginTop="4px" marginBottom="8px">
                      {(detail as any).request.rawQuery}
                    </Text>
                  )}

                  <DetailRow label="Status" value={detail.status} />
                  <DetailRow
                    label="Customer"
                    value={(detail as any).request?.customer?.user?.name ?? `#${(detail as any).request?.customerId ?? '?'}`}
                  />
                  <DetailRow label="Total" value={`${detail.currency} ${detail.totalPrice}`} />
                  <DetailRow label="Valid until" value={formatDate(detail.validUntil)} />
                  <DetailRow label="Viewed" value={formatDate(detail.viewedAt)} />
                  <DetailRow label="Responded" value={formatDate(detail.respondedAt)} />
                  <DetailRow label="Created" value={formatDate(detail.createdAt)} />
                  {detail.message && <DetailRow label="Message" value={detail.message} />}

                  {detail.items && detail.items.length > 0 && (
                    <Box marginTop="12px">
                      <Text fontSize="xs" color={solvoColors.textSubtle} textTransform="uppercase" letterSpacing="0.04em" marginBottom="6px">
                        Items
                      </Text>
                      {detail.items.map((it) => (
                        <Flex key={it.quoteItemId} justify="space-between" fontSize="xs" marginBottom="4px">
                          <Text>{it.description} × {it.quantity}</Text>
                          <Text>{it.total}</Text>
                        </Flex>
                      ))}
                    </Box>
                  )}

                  <button
                    type="button"
                    onClick={() => handleMessageCustomer(detail.requestId)}
                    disabled={busy || createConvState.loading}
                    style={{
                      ...buttonBaseStyle,
                      width: '100%',
                      marginTop: '16px',
                      background: solvoColors.indigo,
                      color: solvoColors.surface,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      opacity: busy || createConvState.loading ? 0.5 : 1,
                    }}
                  >
                    <MessageSquare size={14} />
                    Message customer
                  </button>

                  <button
                    type="button"
                    onClick={handleWithdraw}
                    disabled={
                      busy ||
                      detail.status === QuoteStatus.Withdrawn ||
                      detail.status === QuoteStatus.Accepted ||
                      detail.status === QuoteStatus.Expired
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
                        detail.status === QuoteStatus.Withdrawn ||
                        detail.status === QuoteStatus.Accepted ||
                        detail.status === QuoteStatus.Expired
                          ? 0.5
                          : 1,
                    }}
                  >
                    Withdraw quote
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
