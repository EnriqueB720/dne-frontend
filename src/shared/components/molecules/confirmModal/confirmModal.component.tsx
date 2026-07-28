import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';

export interface ConfirmModalProps {
  title: string;
  /** Body copy — say what happens and whether it can be undone. */
  message: string;
  /** Optional preview of the thing being acted on (e.g. the review text). */
  preview?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` paints the confirm button rose — use for destructive actions. */
  tone?: 'danger' | 'neutral';
  /** Drives the spinner + disabled state; the caller owns the async work. */
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

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
 * Replacement for `window.confirm` — same blocking intent, but styled like
 * the rest of the app. Escape and backdrop clicks cancel (unless loading).
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  preview,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const isDanger = tone === 'danger';

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel, loading]);

  return (
    <AnimatePresence>
      <motion.div
        key="confirm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 25, 23, 0.5)',
          backdropFilter: 'blur(4px)',
          // Above the review modal (z 200) so edit→delete stacking works.
          zIndex: 210,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
        onClick={() => !loading && onCancel()}
      >
        <motion.div
          key="confirm-panel"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="alertdialog"
          aria-modal="true"
          style={{
            width: '100%',
            maxWidth: '400px',
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
                bg={isDanger ? solvoColors.roseLight : solvoColors.indigoLight}
                color={isDanger ? solvoColors.roseText : solvoColors.indigo}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <AlertTriangle size={16} />
              </Box>
              <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                {title}
              </Text>
            </Flex>
            <Box
              as="button"
              onClick={() => !loading && onCancel()}
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
            <Text fontSize="sm" color={solvoColors.textMuted} lineHeight={1.55}>
              {message}
            </Text>
            {preview && (
              <Box
                marginTop="14px"
                padding="12px 14px"
                borderRadius="12px"
                bg={solvoColors.bg}
                border={`1px solid ${solvoColors.border}`}
              >
                {preview}
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
              onClick={onCancel}
              disabled={loading}
              style={{
                ...buttonBase,
                background: solvoColors.surface,
                color: solvoColors.text,
                border: `1px solid ${solvoColors.border}`,
                opacity: loading ? 0.5 : 1,
              }}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              style={{
                ...buttonBase,
                background: isDanger ? solvoColors.roseText : solvoColors.text,
                color: solvoColors.surface,
                opacity: loading ? 0.6 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {loading && (
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
              {loading ? 'Working…' : confirmLabel}
            </button>
          </Flex>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
