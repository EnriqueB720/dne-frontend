import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Trash2, Send, ShoppingBag } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';
import type { PackageItem } from '@/shared/jotai/package.atom';

// ── Helpers ────────────────────────────────────────────────────────────────

function parsePriceColones(label: string): number {
  const digits = label.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

function formatColones(amount: number): string {
  return `₡${amount.toLocaleString('en-US')}`;
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface PackagePanelProps {
  items: PackageItem[];
  onRemove: (packageKey: string) => void;
  onClear: () => void;
  /** Called when user clicks "Request quotes" */
  onRequestQuotes?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

const PackagePanel: React.FC<PackagePanelProps> = ({
  items,
  onRemove,
  onClear,
  onRequestQuotes,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + parsePriceColones(item.priceLabel),
    0,
  );

  return (
    <Box
      width="280px"
      flexShrink={0}
      height="100%"
      display="flex"
      flexDirection="column"
      borderLeft="1px solid"
      borderColor={solvoColors.border}
      bg="white"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        padding="16px"
        borderBottom="1px solid"
        borderColor={solvoColors.border}
        flexShrink={0}
      >
        <Flex align="center" gap="8px">
          <Box
            width="28px"
            height="28px"
            borderRadius="8px"
            bg="#D1FAE5"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={solvoColors.emeraldText}
          >
            <Package size={14} />
          </Box>
          <Text fontWeight="600" fontSize="sm" color={solvoColors.text}>
            My Package
          </Text>
          {items.length > 0 && (
            <Flex
              align="center"
              justify="center"
              width="20px"
              height="20px"
              borderRadius="full"
              bg={solvoColors.emeraldText}
              color="white"
              fontSize="11px"
              fontWeight="700"
            >
              {items.length}
            </Flex>
          )}
        </Flex>

        {items.length > 0 && (
          <button
            onClick={onClear}
            title="Clear package"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: solvoColors.textSubtle,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <Trash2 size={13} />
            Clear
          </button>
        )}
      </Flex>

      {/* Item list */}
      <Box flex="1" overflowY="auto" padding="8px">
        {items.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="180px"
            gap="12px"
            padding="16px"
          >
            <Box
              width="48px"
              height="48px"
              borderRadius="14px"
              bg={solvoColors.bg}
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={solvoColors.textSubtle}
            >
              <ShoppingBag size={22} />
            </Box>
            <Text
              fontSize="xs"
              color={solvoColors.textSubtle}
              textAlign="center"
              lineHeight="1.55"
            >
              Click <strong>"Add to package"</strong> on any provider card to
              start building your custom package.
            </Text>
          </Flex>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.packageKey}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                style={{ marginBottom: '4px' }}
              >
                <Box
                  padding="10px 12px"
                  borderRadius="12px"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  bg={solvoColors.bg}
                >
                  <Flex align="flex-start" justify="space-between" gap="8px">
                    <Flex align="center" gap="10px" flex="1" minWidth="0">
                      {/* Avatar */}
                      <Flex
                        width="36px"
                        height="36px"
                        borderRadius="10px"
                        bg="white"
                        align="center"
                        justify="center"
                        fontSize="18px"
                        flexShrink={0}
                        borderWidth="1px"
                        borderColor={solvoColors.border}
                      >
                        {item.avatar}
                      </Flex>

                      <Box flex="1" minWidth="0">
                        {item.serviceLabel && (
                          <Text
                            fontSize="10px"
                            color={solvoColors.indigo}
                            fontWeight="600"
                            letterSpacing="0.06em"
                            marginBottom="1px"
                          >
                            {item.serviceLabel.toUpperCase()}
                          </Text>
                        )}
                        <Text
                          fontSize="sm"
                          fontWeight="500"
                          color={solvoColors.text}
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          fontFamily={solvoFonts.serif}
                          fontSize="sm"
                          fontWeight="500"
                          color={solvoColors.text}
                        >
                          {item.priceLabel}
                        </Text>
                      </Box>
                    </Flex>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemove(item.packageKey)}
                      title="Remove from package"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: solvoColors.textSubtle,
                        flexShrink: 0,
                      }}
                    >
                      <X size={13} />
                    </button>
                  </Flex>

                  {/* Includes pills */}
                  {item.includes.length > 0 && (
                    <Flex gap="4px" wrap="wrap" marginTop="8px">
                      {item.includes.slice(0, 3).map((inc) => (
                        <Box
                          key={inc}
                          padding="2px 6px"
                          borderRadius="full"
                          bg="white"
                          borderWidth="1px"
                          borderColor={solvoColors.border}
                          fontSize="10px"
                          color={solvoColors.textMuted}
                        >
                          {inc}
                        </Box>
                      ))}
                    </Flex>
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Box>

      {/* Footer: subtotal + CTA */}
      {items.length > 0 && (
        <Box
          padding="16px"
          borderTop="1px solid"
          borderColor={solvoColors.border}
          flexShrink={0}
        >
          {/* Subtotal */}
          <Flex justify="space-between" align="center" marginBottom="12px">
            <Text fontSize="sm" color={solvoColors.textMuted}>
              Estimated total
            </Text>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize="lg"
              fontWeight="500"
              color={solvoColors.text}
            >
              {formatColones(subtotal)}
            </Text>
          </Flex>

          {/* Per-service breakdown */}
          <Flex direction="column" gap="4px" marginBottom="14px">
            {items.map((item) => (
              <Flex key={item.packageKey} justify="space-between">
                <Text
                  fontSize="xs"
                  color={solvoColors.textSubtle}
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '160px',
                  }}
                >
                  {item.avatar} {item.name}
                </Text>
                <Text fontSize="xs" color={solvoColors.textMuted} fontWeight="500">
                  {item.priceLabel}
                </Text>
              </Flex>
            ))}
          </Flex>

          {/* Request quotes button */}
          <button
            onClick={onRequestQuotes}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: solvoColors.text,
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Send size={14} />
            Request quotes ({items.length})
          </button>

          <Text
            fontSize="10px"
            color={solvoColors.textSubtle}
            textAlign="center"
            marginTop="8px"
          >
            We'll contact each provider on your behalf
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default PackagePanel;
