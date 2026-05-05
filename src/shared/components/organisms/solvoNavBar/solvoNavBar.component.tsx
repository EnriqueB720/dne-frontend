import * as React from 'react';
import Link from 'next/link';
import { Box, Flex, Text } from '@atoms';
import { Logo } from '@molecules';
import { solvoColors } from '@constants';

export interface SolvoNavBarProps {
  activePath?: string;
}

const navItems = [
  { label: 'Browse', href: '/search?query=' },
  { label: 'Packages', href: '/packages' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'For providers', href: '/provider' },
];

const SolvoNavBar: React.FC<SolvoNavBarProps> = ({ activePath = '/' }) => {
  return (
    <Box
      position="sticky"
      top="0"
      zIndex={40}
      width="100%"
      style={{
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        background: 'rgba(250, 250, 249, 0.85)',
      }}
      borderBottom="1px solid"
      borderColor={solvoColors.border}
    >
      <Flex
        maxWidth="1200px"
        margin="0 auto"
        align="center"
        justify="space-between"
        padding="14px 24px"
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        <Flex gap="32px" align="center" display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => {
            const isActive = activePath === item.href.split('?')[0];
            return (
              <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color={isActive ? solvoColors.indigo : solvoColors.textMuted}
                  _hover={{ color: solvoColors.indigo }}
                >
                  {item.label}
                </Text>
              </Link>
            );
          })}
        </Flex>

        <Flex
          width="36px"
          height="36px"
          borderRadius="full"
          bg={solvoColors.indigoLight}
          color={solvoColors.indigo}
          align="center"
          justify="center"
          fontWeight="600"
          fontSize="sm"
          cursor="pointer"
        >
          U
        </Flex>
      </Flex>
    </Box>
  );
};

export default SolvoNavBar;
