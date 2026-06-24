import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import type { PackageItem } from '@/shared/jotai/package.atom';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MultiQuoteFormData {
  /** Shared request text applied to every supplier. */
  rawQuery: string;
  /** Shared service date (ISO `datetime-local` value). Required. */
  serviceDate: string;
  /** Shared city. */
  city: string;
  /** Shared guest count. */
  guestCount: string;
  /** Shared message to suppliers. */
  message: string;
  /** Per-supplier budget, keyed by the item's `packageKey`. */
  budgets: Record<string, string>;
}

export interface MultiQuoteModalProps {
  items: PackageItem[];
  /** Prefill for the shared request text (e.g. the customer's last message). */
  defaultRawQuery?: string;
  /** Prefill for the shared city. */
  defaultCity?: string;
  /** Prefill for the shared guest count. */
  defaultGuestCount?: string;
  submitting?: boolean;
  error?: string | null;
  onConfirm: (data: MultiQuoteFormData) => void;
  onClose: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Pull the numeric part out of a price label like "₡285,000" → "285000". */
function priceDigits(label: string): string {
  return label.replace(/[^\d]/g, '');
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '11px 13px',
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

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Combined "request quotes" form for a multi-provider package. The customer
 * fills the shared event details (date, city, guests, message) once, then sets
 * an individual budget per supplier. On submit the parent loops the existing
 * single-quote flow once per supplier, producing one request + one quote each.
 */
const MultiQuoteModal: React.FC<MultiQuoteModalProps> = ({
  items,
  defaultRawQuery = '',
  defaultCity = '',
  defaultGuestCount = '',
  submitting = false,
  error,
  onConfirm,
  onClose,
}) => {
  const [rawQuery, setRawQuery] = React.useState(defaultRawQuery);
  const [serviceDate, setServiceDate] = React.useState('');
  const [city, setCity] = React.useState(defaultCity);
  const [guestCount, setGuestCount] = React.useState(defaultGuestCount);
  const [message, setMessage] = React.useState('');
  const [budgets, setBudgets] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((it) => [it.packageKey, priceDigits(it.priceLabel)])),
  );

  // Close on Escape (when not submitting).
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, submitting]);

  const realCount = items.filter((it) => it.isRealSupplier && it.id > 0).length;

  const handleSubmit = () => {
    onConfirm({ rawQuery, serviceDate, city, guestCount, message, budgets });
  };

  return (
    <AnimatePresence>
      <motion.div
        key="multiquote-backdrop"
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
          key="multiquote-panel"
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
                  Request quotes
                </Text>
                <Text fontSize="xs" color={solvoColors.textSubtle}>
                  {items.length} provider{items.length === 1 ? '' : 's'} · one request &amp; quote each
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
            <Box
              padding="10px 12px"
              borderRadius="10px"
              bg={solvoColors.indigoLight}
              marginBottom="16px"
            >
              <Text fontSize="xs" color={solvoColors.indigo}>
                Fill the event details once — they apply to every provider. Set an
                individual budget for each below; we send one request and quote per
                supplier.
              </Text>
            </Box>

            {/* Shared request text */}
            <Box marginBottom="12px">
              <label style={labelStyle}>Your request (shared)</label>
              <textarea
                value={rawQuery}
                onChange={(e) => setRawQuery(e.target.value)}
                rows={2}
                placeholder="e.g. Birthday party for 35 people on Saturday"
                style={{ ...inputBase, resize: 'vertical' }}
              />
            </Box>

            {/* Shared date + guests */}
            <Flex gap="10px" wrap="wrap" marginBottom="12px">
              <Box flex="1" minWidth="180px">
                <label style={labelStyle}>Service date *</label>
                <input
                  type="datetime-local"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  style={inputBase}
                />
              </Box>
              <Box flex="1" minWidth="120px">
                <label style={labelStyle}>Guests</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  style={inputBase}
                />
              </Box>
            </Flex>

            {/* Shared city */}
            <Box marginBottom="12px">
              <label style={labelStyle}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Santa Ana"
                style={inputBase}
              />
            </Box>

            {/* Shared message */}
            <Box marginBottom="18px">
              <label style={labelStyle}>Message to suppliers (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                placeholder="Any extra context, dietary needs, theme, etc."
                style={{ ...inputBase, resize: 'vertical' }}
              />
            </Box>

            {/* Per-supplier budgets */}
            <Text fontSize="sm" fontWeight={600} color={solvoColors.textMuted} marginBottom="8px">
              Budget per provider
            </Text>
            <Flex direction="column" gap="8px" marginBottom="4px">
              {items.map((it) => (
                <Flex key={it.packageKey} align="center" gap="10px">
                  <Flex
                    width="34px"
                    height="34px"
                    borderRadius="10px"
                    bg={solvoColors.bg}
                    align="center"
                    justify="center"
                    fontSize="17px"
                    flexShrink={0}
                    borderWidth="1px"
                    borderColor={solvoColors.border}
                  >
                    {it.avatar}
                  </Flex>
                  <Box flex="1" minWidth="0">
                    <Text
                      fontSize="sm"
                      fontWeight={500}
                      color={solvoColors.text}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {it.name}
                    </Text>
                    <Text
                      fontSize="10px"
                      color={it.isRealSupplier && it.id > 0 ? solvoColors.emeraldText : solvoColors.amberText}
                    >
                      {it.isRealSupplier && it.id > 0 ? 'Real supplier' : 'AI-generated · no quote sent'}
                    </Text>
                  </Box>
                  <Box width="150px" flexShrink={0}>
                    <input
                      type="number"
                      value={budgets[it.packageKey] ?? ''}
                      onChange={(e) =>
                        setBudgets((prev) => ({ ...prev, [it.packageKey]: e.target.value }))
                      }
                      placeholder="Budget (₡)"
                      style={{ ...inputBase, fontSize: '13px', padding: '9px 11px' }}
                    />
                  </Box>
                </Flex>
              ))}
            </Flex>

            {realCount < items.length && (
              <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="8px">
                AI-generated providers create a request but no real supplier receives
                a quote yet — they don&apos;t exist in the database.
              </Text>
            )}

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
                padding: '11px 18px',
                borderRadius: '12px',
                border: `1px solid ${solvoColors.border}`,
                background: solvoColors.surface,
                color: solvoColors.text,
                fontWeight: 600,
                fontSize: '14px',
                fontFamily: solvoFonts.sans,
                cursor: 'pointer',
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
                padding: '11px 18px',
                borderRadius: '12px',
                border: 'none',
                background: solvoColors.text,
                color: solvoColors.surface,
                fontWeight: 600,
                fontSize: '14px',
                fontFamily: solvoFonts.sans,
                cursor: 'pointer',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting
                ? 'Sending…'
                : `Send ${items.length} request${items.length === 1 ? '' : 's'}`}
            </button>
          </Flex>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MultiQuoteModal;
