import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Trash2, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { useCreateQuoteMutation } from '@generated';

export interface QuoteCreateModalProps {
  requestId: number;
  supplierId: number;
  /** Optional preview of the request — shown at the top so the supplier
   *  knows what they're quoting on. */
  requestPreview?: string;
  /** Optional preview metadata row: location, guest count, date, etc. */
  requestMeta?: string;
  /** Name of the customer who created the request — shown next to the
   *  Request # in the modal header so the supplier knows who they're
   *  quoting. */
  customerName?: string;
  /** Called after a successful create. */
  onCreated: (quoteId: number) => void;
  onClose: () => void;
}

type ItemDraft = {
  description: string;
  quantity: string;
  unitPrice: string;
  total: string;
};

const emptyItem = (): ItemDraft => ({
  description: '',
  quantity: '',
  unitPrice: '',
  total: '',
});

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${solvoColors.border}`,
  background: solvoColors.surface,
  color: solvoColors.text,
  fontFamily: solvoFonts.sans,
  fontSize: '14px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: solvoColors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '6px',
  display: 'block',
};

const buttonBase: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: 600,
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: solvoFonts.sans,
};

/**
 * Pop-up form a supplier uses to send a quote on a specific request — used on
 * the `/requests` "Open leads" tab. Style mirrors the customer's request
 * confirmation modal on `/` so the two flows feel symmetric.
 */
const QuoteCreateModal: React.FC<QuoteCreateModalProps> = ({
  requestId,
  supplierId,
  requestPreview,
  requestMeta,
  customerName,
  onCreated,
  onClose,
}) => {
  const [totalPrice, setTotalPrice] = React.useState('');
  const [currency, setCurrency] = React.useState('CRC');
  const [message, setMessage] = React.useState('');
  const [validUntil, setValidUntil] = React.useState('');
  const [items, setItems] = React.useState<ItemDraft[]>([]);
  const [slots, setSlots] = React.useState<Array<{ startsAt: string; endsAt: string }>>([]);
  const [error, setError] = React.useState<string | null>(null);

  const [createQuote, createState] = useCreateQuoteMutation();

  // Close on Escape (when not submitting)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !createState.loading) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, createState.loading]);

  const handleSubmit = async () => {
    setError(null);
    if (!totalPrice || !validUntil) {
      setError('Total price and validity date are required');
      return;
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
            requestId,
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
      const quoteId = data?.createQuote.quoteId;
      if (quoteId) onCreated(quoteId);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to send quote');
    }
  };

  const submitting = createState.loading;

  return (
    <AnimatePresence>
      <motion.div
        key="quote-backdrop"
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
        onClick={() => !submitting && onClose()}
      >
        <motion.div
          key="quote-panel"
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
          {/* Header */}
          <Flex
            align="center"
            justify="space-between"
            padding="18px 22px"
            borderBottom={`1px solid ${solvoColors.border}`}
          >
            <Flex align="center" gap="10px">
              <Box
                width="32px"
                height="32px"
                borderRadius="10px"
                bg={solvoColors.indigoLight}
                color={solvoColors.indigo}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Sparkles size={16} />
              </Box>
              <Box>
                <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                  Send a quote
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {customerName ? `${customerName} · ` : ''}Request #{requestId}
                </Text>
              </Box>
            </Flex>
            <Box
              as="button"
              onClick={() => !submitting && onClose()}
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
              aria-label="Close"
            >
              <X size={14} />
            </Box>
          </Flex>

          {/* Body */}
          <Box padding="20px 22px">
            {(requestPreview || requestMeta) && (
              <Box
                padding="12px 14px"
                borderRadius="12px"
                bg={solvoColors.bg}
                border={`1px solid ${solvoColors.border}`}
                marginBottom="16px"
              >
                {requestPreview && (
                  <Text fontSize="13px" color={solvoColors.text} marginBottom={requestMeta ? '4px' : '0'}>
                    "{requestPreview}"
                  </Text>
                )}
                {requestMeta && (
                  <Text fontSize="11px" color={solvoColors.textSubtle}>
                    {requestMeta}
                  </Text>
                )}
              </Box>
            )}

            {/* Price + currency */}
            <Flex gap="10px" wrap="wrap" marginBottom="12px">
              <Box flex="2" minWidth="180px">
                <label style={labelStyle}>Total price *</label>
                <input
                  type="number"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(e.target.value)}
                  placeholder="e.g. 285000"
                  style={inputBase}
                />
              </Box>
              <Box flex="1" minWidth="100px">
                <label style={labelStyle}>Currency</label>
                <input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={inputBase}
                />
              </Box>
            </Flex>

            {/* Valid until */}
            <Box marginBottom="12px">
              <label style={labelStyle}>Valid until *</label>
              <input
                type="datetime-local"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                style={inputBase}
              />
            </Box>

            {/* Message */}
            <Box marginBottom="16px">
              <label style={labelStyle}>Message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Anything the customer should know — what's included, lead time, etc."
                style={{ ...inputBase, resize: 'vertical' }}
              />
            </Box>

            {/* Line items */}
            <Flex justify="space-between" align="center" marginBottom="8px">
              <Text fontSize="sm" fontWeight={600} color={solvoColors.textMuted}>
                Line items
              </Text>
              <button
                type="button"
                onClick={() => setItems((prev) => [...prev, emptyItem()])}
                style={{
                  ...buttonBase,
                  padding: '5px 11px',
                  fontSize: '12px',
                  background: solvoColors.surface,
                  color: solvoColors.text,
                  border: `1px solid ${solvoColors.border}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={12} /> Item
              </button>
            </Flex>
            {items.map((it, idx) => (
              <Flex gap="6px" wrap="wrap" marginBottom="6px" key={idx} align="flex-end">
                <Box flex="3" minWidth="160px">
                  <input
                    placeholder="Description"
                    value={it.description}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, description: e.target.value } : p,
                        ),
                      )
                    }
                    style={{ ...inputBase, fontSize: '13px' }}
                  />
                </Box>
                <Box flex="1" minWidth="70px">
                  <input
                    placeholder="Qty"
                    type="number"
                    value={it.quantity}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, quantity: e.target.value } : p,
                        ),
                      )
                    }
                    style={{ ...inputBase, fontSize: '13px' }}
                  />
                </Box>
                <Box flex="1" minWidth="80px">
                  <input
                    placeholder="Unit"
                    type="number"
                    value={it.unitPrice}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, unitPrice: e.target.value } : p,
                        ),
                      )
                    }
                    style={{ ...inputBase, fontSize: '13px' }}
                  />
                </Box>
                <Box flex="1" minWidth="80px">
                  <input
                    placeholder="Total"
                    type="number"
                    value={it.total}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, total: e.target.value } : p,
                        ),
                      )
                    }
                    style={{ ...inputBase, fontSize: '13px' }}
                  />
                </Box>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                  style={{
                    ...buttonBase,
                    padding: '8px 10px',
                    fontSize: '12px',
                    background: solvoColors.surface,
                    color: solvoColors.roseText,
                    border: `1px solid ${solvoColors.border}`,
                  }}
                  aria-label="Remove item"
                >
                  <Trash2 size={12} />
                </button>
              </Flex>
            ))}

            {/* Offered slots */}
            <Flex justify="space-between" align="center" marginTop="16px" marginBottom="8px">
              <Box>
                <Text fontSize="sm" fontWeight={600} color={solvoColors.textMuted}>
                  Available time slots
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  The customer picks one when accepting.
                </Text>
              </Box>
              <button
                type="button"
                onClick={() =>
                  setSlots((prev) => [...prev, { startsAt: '', endsAt: '' }])
                }
                style={{
                  ...buttonBase,
                  padding: '5px 11px',
                  fontSize: '12px',
                  background: solvoColors.surface,
                  color: solvoColors.text,
                  border: `1px solid ${solvoColors.border}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={12} /> Slot
              </button>
            </Flex>
            {slots.map((s, idx) => (
              <Flex gap="6px" wrap="wrap" marginBottom="6px" key={idx} align="flex-end">
                <Box flex="1" minWidth="180px">
                  <label style={{ ...labelStyle, fontSize: '10px' }}>Starts</label>
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
                    style={{ ...inputBase, fontSize: '13px' }}
                  />
                </Box>
                <Box flex="1" minWidth="180px">
                  <label style={{ ...labelStyle, fontSize: '10px' }}>Ends</label>
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
                    style={{ ...inputBase, fontSize: '13px' }}
                  />
                </Box>
                <button
                  type="button"
                  onClick={() => setSlots((prev) => prev.filter((_, i) => i !== idx))}
                  style={{
                    ...buttonBase,
                    padding: '8px 10px',
                    fontSize: '12px',
                    background: solvoColors.surface,
                    color: solvoColors.roseText,
                    border: `1px solid ${solvoColors.border}`,
                  }}
                  aria-label="Remove slot"
                >
                  <Trash2 size={12} />
                </button>
              </Flex>
            ))}

            {error && (
              <Box
                marginTop="14px"
                padding="10px 12px"
                borderRadius="10px"
                bg={solvoColors.roseLight}
                color={solvoColors.roseText}
              >
                <Text fontSize="13px">{error}</Text>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Flex
            justify="flex-end"
            gap="8px"
            padding="14px 22px"
            borderTop={`1px solid ${solvoColors.border}`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                ...buttonBase,
                background: solvoColors.surface,
                color: solvoColors.text,
                border: `1px solid ${solvoColors.border}`,
                opacity: submitting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                ...buttonBase,
                background: solvoColors.text,
                color: solvoColors.surface,
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? 'Sending…' : 'Send quote'}
            </button>
          </Flex>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuoteCreateModal;
