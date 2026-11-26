import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShieldCheck, Star } from 'lucide-react';

import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';
import { Chip } from '../../ui';
import { useI18n } from '@/shared/i18n';
import { categoryName, formatPrice, type ChatSupplier } from '@/shared/lib/supplier';

export interface SupplierCardProps {
  supplier: ChatSupplier;
  index?: number;
  onContact?: (s: ChatSupplier) => void;
  onViewProfile?: (s: ChatSupplier) => void;
}

/**
 * One real supplier in the chat results. Always a DB supplier — the chat
 * never shows invented ones. "Featured" = admin-preferred placement.
 */
const SupplierCard: React.FC<SupplierCardProps> = ({ supplier: s, index = 0, onContact, onViewProfile }) => {
  const { t, lang } = useI18n();
  const primary = s.categories?.[0];
  const firstPrice = s.services?.find((sv) => sv.priceFrom);
  const place = [s.city, s.provinceName].filter(Boolean).join(', ');
  const serves = (s.serviceProvinceNames ?? []).filter((p) => p !== s.provinceName);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Box
        bg={solvoColors.surface}
        borderWidth="1px"
        borderColor={s.preferred ? solvoColors.brandBorder : solvoColors.border}
        borderRadius="18px"
        padding="16px 18px"
        style={s.preferred ? { boxShadow: solvoShadows.recommendedHalo } : undefined}
      >
        <Flex gap="14px" align="flex-start">
          <Flex
            width="44px"
            height="44px"
            borderRadius="12px"
            bg={solvoColors.brandSoft}
            color={solvoColors.brandText}
            align="center"
            justify="center"
            fontSize="20px"
            flexShrink={0}
          >
            {primary?.icon ?? s.companyName.slice(0, 1)}
          </Flex>

          <Box flex="1" minWidth={0}>
            <Flex align="center" gap="6px" wrap="wrap">
              <Text fontFamily={solvoFonts.display} fontWeight={700} fontSize="16px" color={solvoColors.text}>
                {s.companyName}
              </Text>
              {s.verified && (
                <Box color={solvoColors.brand} title={t('common.verified')}>
                  <ShieldCheck size={16} />
                </Box>
              )}
              {s.preferred && <Chip tone="brand">{t('common.preferred')}</Chip>}
            </Flex>

            {s.tagline && (
              <Text fontSize="sm" color={solvoColors.textMuted} marginTop="2px">
                {s.tagline}
              </Text>
            )}

            <Flex gap="12px" wrap="wrap" marginTop="8px" fontSize="12px" color={solvoColors.textSubtle} align="center">
              {s.rating != null && (s.reviewCount ?? 0) > 0 ? (
                <Flex align="center" gap="3px">
                  <Star size={13} fill="currentColor" color="var(--solvo-amber-text)" />
                  <Text fontWeight={600} color={solvoColors.text}>
                    {Number(s.rating).toFixed(1)}
                  </Text>
                  <Text>
                    ({s.reviewCount === 1 ? t('common.oneReview') : t('common.reviewsCount', { n: s.reviewCount ?? 0 })})
                  </Text>
                </Flex>
              ) : (
                <Chip>{t('common.newSupplier')}</Chip>
              )}
              {place && (
                <Flex align="center" gap="3px">
                  <MapPin size={12} />
                  <Text>{place}</Text>
                </Flex>
              )}
              {primary && <Text>{categoryName(primary, lang)}</Text>}
            </Flex>

            {serves.length > 0 && (
              <Text fontSize="12px" color={solvoColors.textSubtle} marginTop="4px">
                {t('card.serves', { list: serves.join(', ') })}
              </Text>
            )}

            {(s.skills?.length ?? 0) > 0 && (
              <Flex gap="6px" wrap="wrap" marginTop="10px">
                {s.skills!.slice(0, 5).map((sk) => (
                  <Chip key={sk}>{sk}</Chip>
                ))}
              </Flex>
            )}

            <Flex justify="space-between" align="center" marginTop="14px" gap="10px" wrap="wrap">
              <Text fontSize="13px" fontWeight={600} color={solvoColors.text}>
                {firstPrice ? formatPrice(firstPrice.priceFrom, firstPrice.priceUnit, t, firstPrice.currency) : ''}
              </Text>
              <Flex gap="8px">
                {onViewProfile && (
                  <button
                    onClick={() => onViewProfile(s)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${solvoColors.border}`,
                      color: solvoColors.text,
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {t('card.profile')}
                  </button>
                )}
                {onContact && (
                  <button
                    onClick={() => onContact(s)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: solvoColors.accent,
                      color: solvoColors.accentFg,
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t('card.contact')} <ArrowRight size={14} />
                  </button>
                )}
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default SupplierCard;
