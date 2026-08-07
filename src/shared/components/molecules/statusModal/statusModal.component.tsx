import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';

export interface StatusModalProps {
  kind: 'success' | 'error';
  title: string;
  message: string;
  /** Auto-dismiss after this many ms. Omit to require an explicit close. */
  autoCloseMs?: number;
  closeLabel?: string;
  onClose: () => void;
}

/**
 * Outcome dialog for actions whose result would otherwise be missed — a
 * banner at the top of a long form is invisible to someone who just hit
 * "Save" at the bottom of it, so the confirmation comes to them instead.
 */
const StatusModal: React.FC<StatusModalProps> = ({
  kind,
  title,
  message,
  autoCloseMs,
  closeLabel = 'Done',
  onClose,
}) => {
  const isSuccess = kind === 'success';

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  React.useEffect(() => {
    if (!autoCloseMs) return;
    const t = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="status-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 25, 23, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
        onClick={onClose}
      >
        <motion.div
          key="status-panel"
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
                bg={isSuccess ? solvoColors.successLight : solvoColors.roseLight}
                color={isSuccess ? solvoColors.successText : solvoColors.roseText}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {isSuccess ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              </Box>
              <Text fontFamily={solvoFonts.serif} fontSize="20px" color={solvoColors.text}>
                {title}
              </Text>
            </Flex>
            <Box
              as="button"
              onClick={onClose}
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

          <Box padding="20px 22px">
            <Text fontSize="sm" color={solvoColors.textMuted} lineHeight={1.55}>
              {message}
            </Text>
          </Box>

          <Flex
            justify="flex-end"
            padding="14px 22px"
            borderTop={`1px solid ${solvoColors.border}`}
          >
            <button
              type="button"
              onClick={onClose}
              autoFocus
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: solvoFonts.sans,
                background: solvoColors.text,
                color: solvoColors.surface,
              }}
            >
              {closeLabel}
            </button>
          </Flex>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusModal;
