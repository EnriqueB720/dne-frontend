import * as React from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Box, Flex, Text } from '@atoms';
import { Pill } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';

export interface PackageItem {
  icon: string;
  label: string;
  price: string;
}

export interface PackageData {
  tier: string;
  emoji: string;
  price: string;
  saved: string;
  tag: string;
  featured?: boolean;
  items: PackageItem[];
}

export interface PackageCardProps {
  pkg: PackageData;
  index?: number;
  onBook?: (pkg: PackageData) => void;
  onCustomize?: (pkg: PackageData) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, index = 0, onBook, onCustomize }) => {
  const [open, setOpen] = useState(pkg.featured ?? false);
  const isFeatured = !!pkg.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      style={{
        transform: isFeatured ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <Flex
        direction="column"
        bg="white"
        borderWidth={isFeatured ? '2px' : '1px'}
        borderColor={isFeatured ? solvoColors.text : solvoColors.border}
        borderRadius="24px"
        padding="28px"
        gap="20px"
        height="100%"
        boxShadow={isFeatured ? '0 25px 50px -12px rgba(28, 25, 23, 0.15)' : 'none'}
      >
        <Flex justify="space-between" align="flex-start">
          <Text fontSize="44px">{pkg.emoji}</Text>
          <Pill tone={isFeatured ? 'dark' : 'indigo'}>{pkg.tag}</Pill>
        </Flex>

        <Box>
          <Text
            fontSize="xs"
            fontWeight="600"
            color={solvoColors.textSubtle}
            letterSpacing="0.08em"
            textTransform="uppercase"
            marginBottom="6px"
          >
            BIRTHDAY PACKAGE
          </Text>
          <Text
            fontFamily={solvoFonts.serif}
            fontSize="3xl"
            fontWeight="500"
            color={solvoColors.text}
          >
            {pkg.tier}
          </Text>
        </Box>

        <Box>
          <Text
            fontFamily={solvoFonts.serif}
            fontSize="3xl"
            fontWeight="500"
            color={solvoColors.text}
          >
            {pkg.price}
          </Text>
          <Text fontSize="sm" color={solvoColors.emeraldText} fontWeight="500">
            save {pkg.saved}
          </Text>
        </Box>

        <Box>
          <Flex
            as="button"
            align="center"
            justify="space-between"
            cursor="pointer"
            paddingY="6px"
            onClick={() => setOpen(!open)}
            width="100%"
          >
            <Text fontSize="sm" fontWeight="500" color={solvoColors.text}>
              What's included
            </Text>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              <ChevronDown size={16} color={solvoColors.textMuted} />
            </motion.div>
          </Flex>

          {open && (
            <Flex direction="column" gap="6px" marginTop="10px">
              {pkg.items.map((it) => (
                <Flex
                  key={it.label}
                  align="center"
                  justify="space-between"
                  bg="#FAFAF9"
                  padding="10px 12px"
                  borderRadius="10px"
                >
                  <Flex align="center" gap="10px">
                    <Text fontSize="lg">{it.icon}</Text>
                    <Text fontSize="sm" color={solvoColors.text}>
                      {it.label}
                    </Text>
                  </Flex>
                  <Text fontSize="sm" color={solvoColors.textSubtle}>
                    {it.price}
                  </Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>

        <Flex direction="column" gap="8px" marginTop="auto">
          <Flex
            as="button"
            justify="center"
            padding="12px"
            borderRadius="12px"
            fontSize="sm"
            fontWeight="500"
            cursor="pointer"
            bg={isFeatured ? solvoColors.text : '#F5F5F4'}
            color={isFeatured ? 'white' : solvoColors.text}
            onClick={() => onBook?.(pkg)}
            _hover={{ opacity: 0.9 }}
          >
            Book this package
          </Flex>
          <Flex
            as="button"
            justify="center"
            padding="12px"
            borderRadius="12px"
            fontSize="sm"
            fontWeight="500"
            cursor="pointer"
            borderWidth="1px"
            borderColor={solvoColors.border}
            color={solvoColors.textMuted}
            onClick={() => onCustomize?.(pkg)}
            _hover={{ borderColor: solvoColors.borderHover }}
          >
            Customize package
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default PackageCard;
