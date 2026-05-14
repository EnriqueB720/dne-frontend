import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { Box, Flex, Text } from '@atoms';
import { Logo } from '@molecules';
import { solvoColors, solvoShadows } from '@constants';
import AuthContext from '@/shared/contexts/auth.context';

// Shared restrained motion config for dropdown panels
const PANEL_MOTION = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.97 },
  transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
};

export interface SolvoNavBarProps {
  activePath?: string;
  /** When provided, the logo navigates in-app instead of via Next.js router */
  onGoHome?: () => void;
  /** When provided, the "Chat" nav item starts a new chat instead of navigating */
  onNewChat?: () => void;
  /** Hide the logo entirely — useful in chat mode where the sidebar already shows it */
  hideLogo?: boolean;
}

const navItems = [
  { label: 'Chat', href: '/' },
  { label: 'Packages', href: '/packages' },
  { label: 'Requests', href: '/requests' },
  { label: 'Quotes', href: '/quotes' },
  { label: 'Bookings', href: '/bookings' },
  { label: 'Messages', href: '/messages' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Dashboard', href: '/dashboard' },
];

const navButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'none',
};

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const SolvoNavBar: React.FC<SolvoNavBarProps> = ({
  activePath = '/',
  onGoHome,
  onNewChat,
  hideLogo = false,
}) => {
  const router = useRouter();
  const { isAuthenticated, user, logout } = React.useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close menus on outside click
  React.useEffect(() => {
    if (!userMenuOpen && !mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen, mobileMenuOpen]);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/');
  };

  const renderNavLink = (item: typeof navItems[number], onClick?: () => void) => {
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

    if (item.label === 'Chat' && onNewChat) {
      return (
        <button
          key={item.label}
          onClick={() => {
            onNewChat();
            onClick?.();
          }}
          style={navButtonStyle}
        >
          {textEl}
        </button>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        style={{ textDecoration: 'none' }}
        onClick={onClick}
      >
        {textEl}
      </Link>
    );
  };

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
        {hideLogo ? (
          <Box />
        ) : onGoHome ? (
          <button onClick={onGoHome} style={navButtonStyle} title="Home">
            <Logo size="md" />
          </button>
        ) : (
          <Link href="/" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <Logo size="md" />
          </Link>
        )}

        {/* Inline nav — visible on lg and up */}
        <Flex gap="28px" align="center" display={{ base: 'none', lg: 'flex' }}>
          {navItems.map((item) => renderNavLink(item))}
        </Flex>

        {/* Right side: hamburger (small screens) + auth controls */}
        <Flex gap="10px" align="center">
          {/* Hamburger — visible below lg */}
          <Box
            position="relative"
            ref={mobileMenuRef as any}
            display={{ base: 'block', lg: 'none' }}
          >
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.1 }}
              style={{
                ...navButtonStyle,
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: mobileMenuOpen ? solvoColors.bg : 'transparent',
                border: `1px solid ${solvoColors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Menu"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{ display: 'inline-flex' }}
                  >
                    <X size={18} color={solvoColors.text} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{ display: 'inline-flex' }}
                  >
                    <Menu size={18} color={solvoColors.text} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  key="mobile-panel"
                  {...PANEL_MOTION}
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    transformOrigin: 'top right',
                    zIndex: 41,
                  }}
                >
                  <Box
                    minWidth="220px"
                    bg={solvoColors.surface}
                    border={`1px solid ${solvoColors.border}`}
                    borderRadius="14px"
                    padding="8px"
                    style={{ boxShadow: solvoShadows.floatingPanel }}
                  >
                    <Flex direction="column" gap="2px">
                      {navItems.map((item, i) => {
                        const isActive = activePath === item.href.split('?')[0];
                        const closeMenu = () => setMobileMenuOpen(false);

                        const row = (
                          <motion.div
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18, delay: 0.04 + i * 0.025 }}
                          >
                            <Flex
                              align="center"
                              padding="10px 12px"
                              borderRadius="8px"
                              cursor="pointer"
                              bg={isActive ? solvoColors.bg : 'transparent'}
                              _hover={{ bg: solvoColors.bg }}
                            >
                              <Text
                                fontSize="sm"
                                fontWeight={isActive ? 600 : 500}
                                color={isActive ? solvoColors.indigo : solvoColors.text}
                              >
                                {item.label}
                              </Text>
                            </Flex>
                          </motion.div>
                        );

                        if (item.label === 'Chat' && onNewChat) {
                          return (
                            <button
                              key={item.label}
                              onClick={() => {
                                onNewChat();
                                closeMenu();
                              }}
                              style={{ ...navButtonStyle, width: '100%', textAlign: 'left' }}
                            >
                              {row}
                            </button>
                          );
                        }

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            style={{ textDecoration: 'none', display: 'block' }}
                            onClick={closeMenu}
                          >
                            {row}
                          </Link>
                        );
                      })}
                    </Flex>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Auth controls — always visible */}
          {isAuthenticated && user ? (
            <Box position="relative" ref={userMenuRef as any}>
              <motion.button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.1 }}
                style={{
                  ...navButtonStyle,
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  background: solvoColors.indigoLight,
                  color: solvoColors.indigo,
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={user.name ?? user.email}
              >
                {getInitials(user.name)}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    key="user-panel"
                    {...PANEL_MOTION}
                    style={{
                      position: 'absolute',
                      top: '46px',
                      right: 0,
                      transformOrigin: 'top right',
                      zIndex: 41,
                    }}
                  >
                    <Box
                      minWidth="220px"
                      bg={solvoColors.surface}
                      border={`1px solid ${solvoColors.border}`}
                      borderRadius="14px"
                      padding="6px"
                      style={{ boxShadow: solvoShadows.floatingPanel }}
                    >
                  <Box padding="10px 12px" borderBottom={`1px solid ${solvoColors.border}`} marginBottom="6px">
                    <Text fontSize="sm" fontWeight={600} color={solvoColors.text}>
                      {user.name}
                    </Text>
                    <Text fontSize="xs" color={solvoColors.textSubtle}>
                      {user.email}
                    </Text>
                    <Text fontSize="xs" color={solvoColors.indigo} marginTop="2px">
                      {user.isSupplier ? 'Supplier' : user.isAdmin ? 'Admin' : 'Customer'}
                    </Text>
                  </Box>

                  <Link
                    href="/dashboard"
                    style={{ textDecoration: 'none', display: 'block' }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Flex
                      align="center"
                      gap="8px"
                      padding="8px 12px"
                      borderRadius="8px"
                      cursor="pointer"
                      _hover={{ bg: solvoColors.bg }}
                    >
                      <UserIcon size={14} color={solvoColors.textMuted} />
                      <Text fontSize="sm" color={solvoColors.text}>
                        Dashboard
                      </Text>
                    </Flex>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      ...navButtonStyle,
                      width: '100%',
                      textAlign: 'left',
                    }}
                  >
                    <Flex
                      align="center"
                      gap="8px"
                      padding="8px 12px"
                      borderRadius="8px"
                      cursor="pointer"
                      _hover={{ bg: solvoColors.bg }}
                    >
                      <LogOut size={14} color={solvoColors.roseText} />
                      <Text fontSize="sm" color={solvoColors.roseText}>
                        Sign out
                      </Text>
                    </Flex>
                  </button>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          ) : (
            <Flex gap="8px" align="center">
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Text
                  fontSize="sm"
                  fontWeight={500}
                  color={solvoColors.textMuted}
                  display={{ base: 'none', sm: 'block' }}
                  _hover={{ color: solvoColors.indigo }}
                >
                  Sign in
                </Text>
              </Link>
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Box
                  padding="8px 14px"
                  borderRadius="10px"
                  bg={solvoColors.text}
                  color={solvoColors.surface}
                  fontSize="sm"
                  fontWeight={600}
                  cursor="pointer"
                >
                  Get started
                </Box>
              </Link>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default SolvoNavBar;
