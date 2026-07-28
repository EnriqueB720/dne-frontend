import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Star, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { useCreateReviewMutation, useUpdateReviewMutation } from '@generated';

export interface ExistingReview {
  reviewId: number;
  rating: number;
  text?: string | null;
  ratingQuality?: number | null;
  ratingCommunication?: number | null;
  ratingValue?: number | null;
  ratingPunctuality?: number | null;
}

export interface ReviewCreateModalProps {
  bookingId: number;
  customerId: number;
  /** Supplier being reviewed — shown prominently so there's no doubt who
   *  the review is for. */
  supplierName?: string;
  /** Optional one-line summary of the booked service (the original request). */
  bookingSummary?: string;
  /** Optional service date shown under the summary. */
  serviceDate?: string | null;
  /** When present the modal edits this review instead of creating one. */
  existingReview?: ExistingReview | null;
  /** Called after a successful create or update. */
  onSaved: (reviewId: number) => void;
  onClose: () => void;
}

const SUB_RATINGS = [
  { key: 'ratingQuality', label: 'Quality' },
  { key: 'ratingCommunication', label: 'Communication' },
  { key: 'ratingValue', label: 'Value' },
  { key: 'ratingPunctuality', label: 'Punctuality' },
] as const;

type SubRatingKey = (typeof SUB_RATINGS)[number]['key'];

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

/** Row of 5 clickable stars. `value` is 0 when unset. */
const StarPicker: React.FC<{
  value: number;
  onChange: (v: number) => void;
  size?: number;
  disabled?: boolean;
}> = ({ value, onChange, size = 26, disabled }) => {
  const [hovered, setHovered] = React.useState(0);
  const active = hovered || value;

  return (
    <Flex gap="4px" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '2px',
            cursor: disabled ? 'default' : 'pointer',
            lineHeight: 0,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <Star
            size={size}
            color={n <= active ? solvoColors.amberText : solvoColors.border}
            fill={n <= active ? solvoColors.amberText : 'transparent'}
          />
        </button>
      ))}
    </Flex>
  );
};

/**
 * Pop-up a customer uses to rate and comment on a completed booking — opened
 * from the `/bookings` detail panel once the service is done. Also handles
 * editing an existing review (pass `existingReview`). Style mirrors the
 * supplier's quote modal so both sides of the flow feel symmetric.
 */
const ReviewCreateModal: React.FC<ReviewCreateModalProps> = ({
  bookingId,
  customerId,
  supplierName,
  bookingSummary,
  serviceDate,
  existingReview,
  onSaved,
  onClose,
}) => {
  const isEdit = !!existingReview;

  const [rating, setRating] = React.useState(existingReview?.rating ?? 0);
  const [text, setText] = React.useState(existingReview?.text ?? '');
  const [subRatings, setSubRatings] = React.useState<Record<SubRatingKey, number>>({
    ratingQuality: existingReview?.ratingQuality ?? 0,
    ratingCommunication: existingReview?.ratingCommunication ?? 0,
    ratingValue: existingReview?.ratingValue ?? 0,
    ratingPunctuality: existingReview?.ratingPunctuality ?? 0,
  });
  const [error, setError] = React.useState<string | null>(null);
  const [savedReviewId, setSavedReviewId] = React.useState<number | null>(null);

  const [createReview, createState] = useCreateReviewMutation();
  const [updateReview, updateState] = useUpdateReviewMutation();

  const submitting = createState.loading || updateState.loading;

  // Close on Escape (when not submitting)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, submitting]);

  // Success state: show the confirmation briefly, then hand off and close.
  React.useEffect(() => {
    if (savedReviewId === null) return;
    const timer = setTimeout(() => {
      onSaved(savedReviewId);
      onClose();
    }, 1200);
    return () => clearTimeout(timer);
  }, [savedReviewId, onSaved, onClose]);

  const handleSubmit = async () => {
    setError(null);
    if (!rating) {
      setError('Pick an overall rating first');
      return;
    }

    const fields = {
      rating,
      text: text.trim() || undefined,
      ratingQuality: subRatings.ratingQuality || undefined,
      ratingCommunication: subRatings.ratingCommunication || undefined,
      ratingValue: subRatings.ratingValue || undefined,
      ratingPunctuality: subRatings.ratingPunctuality || undefined,
    };

    try {
      if (isEdit && existingReview) {
        const { data } = await updateReview({
          variables: {
            data: { reviewId: existingReview.reviewId, customerId, ...fields },
          },
        });
        setSavedReviewId(data?.updateReview.reviewId ?? existingReview.reviewId);
      } else {
        const { data } = await createReview({
          variables: { data: { bookingId, customerId, ...fields } },
        });
        if (data?.createReview.reviewId) setSavedReviewId(data.createReview.reviewId);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save review');
    }
  };

  const formatServiceDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <AnimatePresence>
      <motion.div
        key="review-backdrop"
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
        onClick={() => !submitting && savedReviewId === null && onClose()}
      >
        <motion.div
          key="review-panel"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: solvoColors.surface,
            borderRadius: '20px',
            boxShadow: solvoShadows.heroInput,
          }}
        >
          {savedReviewId !== null ? (
            /* ── Saved confirmation ─────────────────────────────────── */
            <Flex direction="column" align="center" justify="center" padding="48px 24px" gap="12px">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ color: solvoColors.successText }}
              >
                <CheckCircle2 size={44} />
              </motion.div>
              <Text fontFamily={solvoFonts.serif} fontSize="22px" color={solvoColors.text}>
                {isEdit ? 'Review updated' : 'Review saved'}
              </Text>
              <Text fontSize="sm" color={solvoColors.textMuted}>
                Thanks for helping other customers{supplierName ? ` — and ${supplierName}` : ''}.
              </Text>
            </Flex>
          ) : (
            <>
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
                    bg={solvoColors.amberLight}
                    color={solvoColors.amberText}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Star size={16} />
                  </Box>
                  <Box>
                    <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                      {isEdit ? 'Edit your review' : 'Leave a review'}
                    </Text>
                    <Text fontSize="xs" color={solvoColors.textSubtle}>
                      Booking #{bookingId}
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
                {/* Who + what is being reviewed */}
                <Box
                  padding="12px 14px"
                  borderRadius="12px"
                  bg={solvoColors.bg}
                  border={`1px solid ${solvoColors.border}`}
                  marginBottom="16px"
                >
                  <Text
                    fontSize="10px"
                    fontWeight={600}
                    color={solvoColors.textSubtle}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                    marginBottom="2px"
                  >
                    You&apos;re reviewing
                  </Text>
                  <Text fontFamily={solvoFonts.serif} fontSize="17px" color={solvoColors.text}>
                    {supplierName ?? `Supplier on booking #${bookingId}`}
                  </Text>
                  {bookingSummary && (
                    <Text fontSize="13px" color={solvoColors.textMuted} marginTop="4px">
                      "{bookingSummary}"
                    </Text>
                  )}
                  {serviceDate && (
                    <Text fontSize="11px" color={solvoColors.textSubtle} marginTop="4px">
                      Service on {formatServiceDate(serviceDate)}
                    </Text>
                  )}
                </Box>

                {/* Overall rating */}
                <Box marginBottom="16px">
                  <label style={labelStyle}>Overall rating *</label>
                  <StarPicker value={rating} onChange={setRating} disabled={submitting} />
                </Box>

                {/* Comment */}
                <Box marginBottom="16px">
                  <label style={labelStyle}>Comment (optional)</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    disabled={submitting}
                    placeholder="How was the service? What should other customers know?"
                    style={{ ...inputBase, resize: 'vertical' }}
                  />
                </Box>

                {/* Sub-ratings */}
                <Text fontSize="sm" fontWeight={600} color={solvoColors.textMuted} marginBottom="8px">
                  Rate the details (optional)
                </Text>
                <Flex direction="column" gap="6px">
                  {SUB_RATINGS.map(({ key, label }) => (
                    <Flex key={key} justify="space-between" align="center">
                      <Text fontSize="13px" color={solvoColors.text}>
                        {label}
                      </Text>
                      <StarPicker
                        value={subRatings[key]}
                        onChange={(v) => setSubRatings((prev) => ({ ...prev, [key]: v }))}
                        size={18}
                        disabled={submitting}
                      />
                    </Flex>
                  ))}
                </Flex>

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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {submitting && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '13px',
                        height: '13px',
                        borderRadius: '9999px',
                        border: `2px solid ${solvoColors.surface}`,
                        borderTopColor: 'transparent',
                        display: 'inline-block',
                      }}
                    />
                  )}
                  {submitting
                    ? 'Saving…'
                    : isEdit
                      ? 'Save changes'
                      : 'Submit review'}
                </button>
              </Flex>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewCreateModal;
