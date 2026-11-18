import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';
import { useDismissReviewPromptMutation, useReviewPromptsQuery } from '@generated';
import ReviewCreateModal from '../reviewCreateModal/reviewCreateModal.component';

export interface ReviewPromptsProps {
  customerId: number;
}

const daysAgo = (iso: string): string => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d <= 0) return 'today';
  if (d === 1) return 'yesterday';
  return `${d} days ago`;
};

/**
 * "How did it go?" — suppliers the customer reached out to a couple of days
 * ago and hasn't reviewed. A star opens the review modal pre-filled with that
 * rating; "Not now" stops asking until they contact the supplier again.
 * Renders nothing when there's nothing to ask about.
 */
const ReviewPrompts: React.FC<ReviewPromptsProps> = ({ customerId }) => {
  const promptsQuery = useReviewPromptsQuery({ fetchPolicy: 'cache-and-network' });
  const [dismissPrompt] = useDismissReviewPromptMutation();
  const [reviewing, setReviewing] = React.useState<{
    supplierId: number;
    companyName: string;
    rating: number;
  } | null>(null);
  const [hidden, setHidden] = React.useState<number[]>([]);

  const prompts = (promptsQuery.data?.reviewPrompts ?? []).filter(
    (p) => !hidden.includes(p.supplierId),
  );
  if (prompts.length === 0 && !reviewing) return null;

  const handleDismiss = (supplierId: number) => {
    // Optimistic — a failed dismiss just means we ask again next visit.
    setHidden((h) => [...h, supplierId]);
    dismissPrompt({ variables: { supplierId } }).catch(() => undefined);
  };

  return (
    <Box
      marginBottom="28px"
      padding="18px 20px"
      borderRadius="16px"
      borderWidth="1px"
      borderColor={solvoColors.brandBorder}
      bg={solvoColors.brandSoft}
    >
      <Text fontFamily={solvoFonts.display} fontSize="18px" color={solvoColors.text} marginBottom="2px">
        How did it go?
      </Text>
      <Text fontSize="13px" color={solvoColors.textMuted} marginBottom="14px">
        You reached out to {prompts.length === 1 ? 'this supplier' : 'these suppliers'} through
        Solvo. A quick rating helps them — and the next customer.
      </Text>

      <Flex direction="column" gap="8px">
        {prompts.map((p, i) => (
          <motion.div
            key={p.supplierId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            <Flex
              align="center"
              justify="space-between"
              gap="12px"
              wrap="wrap"
              padding="12px 14px"
              borderRadius="12px"
              bg={solvoColors.surface}
              borderWidth="1px"
              borderColor={solvoColors.border}
            >
              <Box minWidth="0">
                <Link
                  href={`/providers/${p.supplierId}`}
                  style={{ textDecoration: 'none', color: solvoColors.text, fontWeight: 600, fontSize: '14px' }}
                >
                  {p.companyName}
                </Link>
                <Text fontSize="12px" color={solvoColors.textSubtle}>
                  Contacted {daysAgo(p.contactedAt)}
                  {p.city ? ` · ${p.city}` : ''}
                </Text>
              </Box>

              <Flex align="center" gap="10px">
                <Flex gap="2px" aria-label={`Rate ${p.companyName}`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n === 1 ? '' : 's'} for ${p.companyName}`}
                      onClick={() =>
                        setReviewing({ supplierId: p.supplierId, companyName: p.companyName, rating: n })
                      }
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '2px',
                        cursor: 'pointer',
                        lineHeight: 0,
                      }}
                    >
                      <Star size={20} color={solvoColors.amberText} />
                    </button>
                  ))}
                </Flex>
                <button
                  type="button"
                  onClick={() => handleDismiss(p.supplierId)}
                  aria-label={`Not now for ${p.companyName}`}
                  title="Not now"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: `1px solid ${solvoColors.border}`,
                    background: 'transparent',
                    color: solvoColors.textSubtle,
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: solvoFonts.sans,
                  }}
                >
                  <X size={12} />
                  Not now
                </button>
              </Flex>
            </Flex>
          </motion.div>
        ))}
      </Flex>

      {reviewing && (
        <ReviewCreateModal
          supplierId={reviewing.supplierId}
          customerId={customerId}
          supplierName={reviewing.companyName}
          initialRating={reviewing.rating}
          onSaved={() => {
            // A reviewed supplier drops off the list server-side.
            promptsQuery.refetch();
          }}
          onClose={() => setReviewing(null)}
        />
      )}
    </Box>
  );
};

export default ReviewPrompts;
