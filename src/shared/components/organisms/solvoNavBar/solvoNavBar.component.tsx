import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, UserRound } from 'lucide-react';

import { Box, Flex, Text } from '@atoms';
import { solvoColors, solvoFonts } from '@constants';
import ColorModeToggle from '../../molecules/colorModeToggle/colorModeToggle.component';
import Logo from '../../molecules/logo/logo.component';
import AuthContext from '@/shared/contexts/auth.context';
import { useI18n } from '@/shared/i18n';

export interface SolvoNavBarProps {
  /** Starts a fresh chat when "Chat" is clicked while already on the chat page. */
  onNewChat?: () => void;
  onGoHome?: () => void;
  hideLogo?: boolean;
  /** Mobile: opens the chat history drawer. */
  onMenuClick?: () => void;
}

/**
 * Top bar on every page. Links depend on who is signed in:
 *  guest → Chat · Sign in · Create account
 *  customer → Chat · My contacts · My account
 *  supplier → Chat · My business · My account
 *  admin → + Admin
 * The ES/EN switch is always visible.
 */
const SolvoNavBar: React.FC<SolvoNavBarProps> = ({ onNewChat, onGoHome, hideLogo = false, onMenuClick }) => {
  const router = useRouter();
  const { user, isAuthenticated } = React.useContext(AuthContext);
  const { t, lang, setLang } = useI18n();

  const links: Array<{ href: string; label: string }> = [{ href: '/', label: t('nav.chat') }];
  if (isAuthenticated && user) {
    if (user.isCustomer) links.push({ href: '/dashboard', label: t('nav.myContacts') });
    if (user.isSupplier) links.push({ href: '/provider', label: t('nav.myBusiness') });
    if (user.isAdmin) links.push({ href: '/admin', label: t('nav.admin') });
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: active ? 700 : 500,
    color: active ? solvoColors.text : solvoColors.textMuted,
    background: active ? solvoColors.surfaceMuted : 'transparent',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={50}
      bg={solvoColors.surfaceTranslucent}
      borderBottom="1px solid"
      borderColor={solvoColors.border}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <Flex align="center" justify="space-between" gap="12px" padding={{ base: '10px 14px', md: '12px 24px' }} height="64px">
        <Flex align="center" gap="10px" minWidth={0}>
          {onMenuClick && (
            <Box display={{ base: 'block', lg: 'none' }}>
              <button
                onClick={onMenuClick}
                aria-label={t('nav.menu')}
                style={{ border: 'none', background: 'transparent', color: solvoColors.text, cursor: 'pointer', display: 'flex', padding: '6px' }}
              >
                <Menu size={20} />
              </button>
            </Box>
          )}
          {!hideLogo && (
            <Box cursor="pointer" onClick={() => (onGoHome ? onGoHome() : router.push('/'))}>
              <Logo size="sm" />
            </Box>
          )}
          <Flex gap="2px" display={{ base: 'none', md: 'flex' }} marginLeft="8px">
            {links.map((l) => {
              const active = router.pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={linkStyle(active)}
                  onClick={(e) => {
                    if (l.href === '/' && active && onNewChat) {
                      e.preventDefault();
                      onNewChat();
                    }
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </Flex>
        </Flex>

        <Flex align="center" gap="8px" flexShrink={0}>
          {/* Language switch */}
          <Flex borderWidth="1px" borderColor={solvoColors.border} borderRadius="9999px" padding="2px" title={t('nav.language')}>
            {(['es', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                style={{
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '4px 9px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: lang === l ? solvoColors.text : 'transparent',
                  color: lang === l ? solvoColors.surface : solvoColors.textMuted,
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </Flex>
          <ColorModeToggle size="34px" />
          {isAuthenticated && user ? (
            <Link href="/profile" title={t('nav.account')} style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <Flex width="34px" height="34px" borderRadius="full" bg={solvoColors.brandSoft} color={solvoColors.brandText} align="center" justify="center" fontWeight={700} fontSize="14px">
                {(user.name ?? '?').slice(0, 1).toUpperCase() || <UserRound size={16} />}
              </Flex>
            </Link>
          ) : (
            <Flex gap="6px" align="center">
              <Link href={`/login?next=${encodeURIComponent(router.asPath)}`} style={{ ...linkStyle(false), color: solvoColors.text }}>
                {t('common.signIn')}
              </Link>
              <Box display={{ base: 'none', sm: 'block' }}>
                <Link
                  href="/register"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    background: solvoColors.accent,
                    color: solvoColors.accentFg,
                    textDecoration: 'none',
                    fontFamily: solvoFonts.sans,
                  }}
                >
                  {t('common.signUp')}
                </Link>
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* Mobile links row */}
      {links.length > 1 && (
        <Flex display={{ base: 'flex', md: 'none' }} gap="4px" padding="0 12px 8px" overflowX="auto">
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle(router.pathname === l.href)}>
              <Text as="span" fontSize="13px">
                {l.label}
              </Text>
            </Link>
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default SolvoNavBar;
