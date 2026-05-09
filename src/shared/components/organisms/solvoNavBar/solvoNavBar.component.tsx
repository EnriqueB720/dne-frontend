import * as React from 'react';
import Link from 'next/link';
import { Box, Flex, Text } from '@atoms';
import { Logo } from '@molecules';
import { solvoColors } from '@constants';

export interface SolvoNavBarProps {
  activePath?: string;
  /** When provided, the logo navigates in-app instead of via Next.js router */
  onGoHome?: () => void;
  /** When provided, the "Chat" nav item starts a new chat instead of navigating */
  onNewChat?: () => void;
}

const navItems = [
  { label: 'Chat', href: '/' },
  { label: 'Packages', href: '/packages' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'For providers', href: '/provider' },
];

/** Shared style for the plain-button nav links so they match the Link ones */
const navButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'none',
};

const SolvoNavBar: React.FC<SolvoNavBarProps> = ({
  activePath = '/',
  onGoHome,
  onNewChat,
}) => {
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
        {/* Logo — in-app callback when available, plain link otherwise */}
        {onGoHome ? (
          <button onClick={onGoHome} style={navButtonStyle} title="Home">
            <Logo size="md" />
          </button>
        ) : (
          <Link href="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <Logo size="md" />
          </Link>
        )}

        {/* Nav items */}
        <Flex gap="32px" align="center" display={{ base: 'none', md: 'flex' }}>
          {navItems.map((item) => {
            const isActive = activePath === item.href.split('?')[0];
            const textEl = (
              <Text
                fontSize="sm"
                fontWeight="500"
                color={isActive ? solvoColors.indigo : solvoColors.textMuted}
                _hover={{ color: solvoColors.indigo }}
              >
                {item.label}
              </Text>
            );

            // "Chat" item gets the in-app callback when provided
            if (item.label === 'Chat' && onNewChat) {
              return (
                <button
                  key={item.label}
                  onClick={onNewChat}
                  style={navButtonStyle}
                >
                  {textEl}
                </button>
              );
            }

            return (
              <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
                {textEl}
              </Link>
            );
          })}
        </Flex>

        {/* Avatar placeholder */}
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
