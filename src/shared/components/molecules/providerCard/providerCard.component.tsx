import * as React from 'react';
import {
  Star, ShieldCheck, Clock, MapPin, Check, MessageCircle,
  ArrowRight, Globe, Mail, Phone, PackagePlus, PackageCheck,
  Database, Sparkles,
} from 'lucide-react';
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
  /** Optional website URL — populated when the AI suggests a plausible one. */
  website?: string;
  /** Optional contact email — populated when the AI suggests a plausible one. */
  email?: string;
  /** Optional contact phone — populated when the AI suggests a plausible one. */
  phone?: string;
  /** True when this card represents a real supplier from the DB (vs. AI-invented). */
  isRealSupplier?: boolean;
}

function buildSearchUrl(provider: ProviderData): string {
  const cleanLocation = provider.location.replace(/,\s*\d+(\.\d+)?\s*km away.*/i, '');
  const query = `${provider.name} ${cleanLocation} Costa Rica`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function resolveProviderLink(provider: ProviderData): {
  href: string;
  label: string;
  title: string;
} {
  if (provider.website) {
    return { href: provider.website, label: 'Visit website', title: provider.website };
  }
  return {
    href: buildSearchUrl(provider),
    label: 'Search online',
    title: `Search the web for ${provider.name}`,
  };
}

export interface ProviderCardProps {
  provider: ProviderData;
  index?: number;
  onSelect?: (provider: ProviderData) => void;
  onWhatsApp?: (provider: ProviderData) => void;
  onViewProfile?: (provider: ProviderData) => void;
  /** Whether this provider is currently in the user's package */
  isInPackage?: boolean;
  /** Toggle this provider in/out of the package */
  onTogglePackage?: (provider: ProviderData) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  index = 0,
  onSelect,
  onWhatsApp,
  onViewProfile,
  isInPackage = false,
  onTogglePackage,
}) => {
  const isRecommended = !!provider.recommended;

  const linkStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: solvoColors.indigo,
    cursor: 'pointer',
    textDecoration: 'none',
  };
  const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.textDecoration = 'underline';
  };
  const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.textDecoration = 'none';
  };

  const link = resolveProviderLink(provider);

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
        borderColor={
          isInPackage
            ? solvoColors.emeraldText
            : isRecommended
            ? solvoColors.indigoBorder
            : solvoColors.border
        }
        borderRadius="24px"
        padding="24px"
        boxShadow={
          isInPackage
            ? '0 0 0 3px rgba(16, 185, 129, 0.12)'
            : isRecommended
            ? solvoShadows.recommendedHalo
            : 'none'
        }
        transition="all 0.2s"
      >
        <Flex direction={{ base: 'column', md: 'row' }} gap="20px">
          {/* Left column: avatar + price */}
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

          {/* Right column: info + actions */}
          <Box flex="1" minWidth="0">
            <Flex align="center" gap="8px" marginBottom="6px" wrap="wrap">
              <Text fontSize="lg" fontWeight="600" color={solvoColors.text}>
                {provider.name}
              </Text>
              {provider.verified && (
                <Box color={solvoColors.indigo}>
                  <ShieldCheck size={16} />
                </Box>
              )}
              {/* Trust-signal badge — distinguishes real DB suppliers from
                  AI-generated suggestions so users can scan at a glance.
                  "In our network" = a real, contactable verified supplier;
                  "AI suggestion" = an illustrative idea with no contact
                  details (we never fabricate phone/email/website). */}
              {provider.isRealSupplier ? (
                <Flex
                  align="center"
                  gap="4px"
                  padding="2px 8px"
                  borderRadius="full"
                  bg={solvoColors.indigoLight}
                  color={solvoColors.indigo}
                  fontSize="11px"
                  fontWeight="600"
                  title="This provider is part of the Solvo network"
                >
                  <Database size={11} />
                  In our network
                </Flex>
              ) : (
                <Flex
                  align="center"
                  gap="4px"
                  padding="2px 8px"
                  borderRadius="full"
                  bg={solvoColors.bg}
                  color={solvoColors.textSubtle}
                  fontSize="11px"
                  fontWeight="600"
                  borderWidth="1px"
                  borderColor={solvoColors.border}
                  title="An AI-generated suggestion — not a verified listing. Contact details aren't available."
                >
                  <Sparkles size={11} />
                  AI suggestion
                </Flex>
              )}
              {/* "In package" badge */}
              {isInPackage && (
                <Flex
                  align="center"
                  gap="4px"
                  padding="2px 8px"
                  borderRadius="full"
                  bg="#D1FAE5"
                  color={solvoColors.emeraldText}
                  fontSize="11px"
                  fontWeight="600"
                >
                  <PackageCheck size={12} />
                  In package
                </Flex>
              )}
            </Flex>

            {/* Meta row */}
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

            {/* Includes */}
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

            {/* Tags */}
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

            {/* Action row */}
            <Flex gap="10px" wrap="wrap" align="center">
              {/* Text links */}
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

              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={link.title}
                style={linkStyle}
                onMouseEnter={onLinkEnter}
                onMouseLeave={onLinkLeave}
              >
                <Globe size={13} />
                {link.label}
              </a>

              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  onClick={(e) => e.stopPropagation()}
                  title={provider.email}
                  style={linkStyle}
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={onLinkLeave}
                >
                  <Mail size={13} />
                  Email
                </a>
              )}

              {provider.phone && (
                <a
                  href={`tel:${provider.phone.replace(/[^\d+]/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  title={provider.phone}
                  style={linkStyle}
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={onLinkLeave}
                >
                  <Phone size={13} />
                  {provider.phone}
                </a>
              )}

              <Flex flex="1" />

              {/* Package toggle button */}
              {onTogglePackage && (
                <motion.button
                  onClick={() => onTogglePackage(provider)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: `1px solid ${isInPackage ? solvoColors.emeraldText : solvoColors.border}`,
                    background: isInPackage ? '#D1FAE5' : 'white',
                    color: isInPackage ? solvoColors.emeraldText : solvoColors.textMuted,
                    transition: 'all 0.15s',
                  }}
                >
                  {isInPackage ? (
                    <>
                      <PackageCheck size={14} />
                      Remove
                    </>
                  ) : (
                    <>
                      <PackagePlus size={14} />
                      Add to package
                    </>
                  )}
                </motion.button>
              )}

              {/* WhatsApp */}
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

              {/* Select / view profile */}
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
