import * as React from 'react';
import { Star, ShieldCheck, Clock, MapPin, Check, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Box, Flex, Text } from '@atoms';
import { Pill } from '@atoms';
import { solvoColors, solvoFonts, solvoShadows } from '@constants';

export interface ProviderData {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  priceLabel: string;
  includes: string[];
  tags: string[];
  responseTime: string;
  location: string;
  avatar: string;
  verified?: boolean;
  recommended?: boolean;
}

export interface ProviderCardProps {
  provider: ProviderData;
  index?: number;
  onSelect?: (provider: ProviderData) => void;
  onWhatsApp?: (provider: ProviderData) => void;
  onViewProfile?: (provider: ProviderData) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  index = 0,
  onSelect,
  onWhatsApp,
  onViewProfile,
}) => {
  const isRecommended = !!provider.recommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      style={{ position: 'relative' }}
    >
      {isRecommended && (
        <Box
          position="absolute"
          top="-12px"
          left="24px"
          bg={solvoColors.text}
          color="white"
          padding="4px 12px"
          borderRadius="full"
          fontSize="11px"
          fontWeight="500"
          zIndex={1}
        >
          ✨ AI Recommended · Best match
        </Box>
      )}
      <Box
        bg="white"
        borderWidth="1px"
        borderColor={isRecommended ? solvoColors.indigoBorder : solvoColors.border}
        borderRadius="24px"
        padding="24px"
        boxShadow={isRecommended ? solvoShadows.recommendedHalo : 'none'}
        _hover={{ borderColor: isRecommended ? solvoColors.indigoBorder : solvoColors.borderHover }}
        transition="all 0.2s"
      >
        <Flex direction={{ base: 'column', md: 'row' }} gap="20px">
          <Flex
            direction="column"
            align="center"
            justify="center"
            width={{ base: '100%', md: '160px' }}
            flexShrink={0}
            gap="8px"
          >
            <Flex
              width="80px"
              height="80px"
              borderRadius="full"
              bg={solvoColors.indigoLight}
              align="center"
              justify="center"
              fontSize="36px"
            >
              {provider.avatar}
            </Flex>
            <Text
              fontFamily={solvoFonts.serif}
              fontSize="xl"
              fontWeight="500"
              color={solvoColors.text}
            >
              {provider.priceLabel}
            </Text>
            <Text fontSize="xs" color={solvoColors.textSubtle}>
              estimated total
            </Text>
          </Flex>

          <Box flex="1" minWidth="0">
            <Flex align="center" gap="8px" marginBottom="6px">
              <Text fontSize="lg" fontWeight="600" color={solvoColors.text}>
                {provider.name}
              </Text>
              {provider.verified && (
                <Box color={solvoColors.indigo}>
                  <ShieldCheck size={16} />
                </Box>
              )}
            </Flex>

            <Flex gap="14px" align="center" wrap="wrap" marginBottom="12px">
              <Flex align="center" gap="4px">
                <Star size={14} fill={solvoColors.amberText} color={solvoColors.amberText} />
                <Text fontSize="sm" fontWeight="500" color={solvoColors.text}>
                  {provider.rating}
                </Text>
                <Text fontSize="sm" color={solvoColors.textSubtle}>
                  ({provider.reviews} reviews)
                </Text>
              </Flex>
              <Flex align="center" gap="4px" color={solvoColors.textSubtle}>
                <MapPin size={13} />
                <Text fontSize="sm">{provider.location}</Text>
              </Flex>
              <Flex align="center" gap="4px" color={solvoColors.textSubtle}>
                <Clock size={13} />
                <Text fontSize="sm">{provider.responseTime}</Text>
              </Flex>
            </Flex>

            <Box
              display="grid"
              gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }}
              gap="6px"
              marginBottom="14px"
            >
              {provider.includes.map((inc) => (
                <Flex key={inc} align="center" gap="6px">
                  <Box color={solvoColors.emeraldText}>
                    <Check size={14} strokeWidth={2.5} />
                  </Box>
                  <Text fontSize="sm" color={solvoColors.textMuted}>
                    {inc}
                  </Text>
                </Flex>
              ))}
            </Box>

            <Flex gap="6px" wrap="wrap" marginBottom="16px">
              {provider.tags.map((tag) => (
                <Pill
                  key={tag}
                  tone={tag === 'AI Match' ? 'indigo' : tag === 'Premium' ? 'amber' : 'default'}
                >
                  {tag}
                </Pill>
              ))}
            </Flex>

            <Flex gap="10px" wrap="wrap" align="center">
              <Text
                as="button"
                fontSize="sm"
                fontWeight="500"
                color={solvoColors.text}
                cursor="pointer"
                onClick={() => onViewProfile?.(provider)}
                _hover={{ color: solvoColors.indigo }}
              >
                View profile
              </Text>
              <Flex flex="1" />
              <Flex
                as="button"
                align="center"
                gap="6px"
                padding="8px 14px"
                borderRadius="10px"
                bg={solvoColors.emerald}
                color="white"
                fontSize="sm"
                fontWeight="500"
                cursor="pointer"
                onClick={() => onWhatsApp?.(provider)}
                _hover={{ opacity: 0.9 }}
              >
                <MessageCircle size={14} />
                WhatsApp
              </Flex>
              <Flex
                as="button"
                align="center"
                gap="6px"
                padding="8px 14px"
                borderRadius="10px"
                bg={solvoColors.text}
                color="white"
                fontSize="sm"
                fontWeight="500"
                cursor="pointer"
                onClick={() => onSelect?.(provider)}
                _hover={{ bg: solvoColors.indigo }}
              >
                Select
                <ArrowRight size={14} />
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </motion.div>
  );
};

export default ProviderCard;
