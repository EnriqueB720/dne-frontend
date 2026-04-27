/* eslint-disable @next/next/no-html-link-for-pages */
import * as React from 'react';
import _ from 'lodash';
import { Flex, Image, Text } from '@atoms';
import { NavBarLink, NavBarProps } from '@types';

const defaultLoggedOutLinks: NavBarLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Supplier Login', href: '/supplier-login' },
];

const defaultLoggedInLinks: NavBarLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Profile', href: '/profile' },
  { label: 'My Posts', href: '/my-posts' },
];

const defaultRightLinks: NavBarLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const logoVariantMap = {
  dark: '/assets/logos/logo.png',
  light: '/assets/logos/logo-light.png',
};

const NavBar: React.FC<NavBarProps> = ({
  logoVariant = 'dark',
  logoAlt = 'D&E Logo',
  logoHeight = '40px',
  isLoggedIn = false,
  onLogout,
  loggedOutLinks = defaultLoggedOutLinks,
  loggedInLinks = defaultLoggedInLinks,
  rightLinks = defaultRightLinks,
  containerProps,
  linkTextProps,
}) => {
  const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;
  const logoSrc = logoVariantMap[logoVariant];

  return (
    <Flex
      as="nav"
      width="100%"
      justify="space-between"
      align="center"
      padding="12px 24px"
      {...containerProps}
    >
      <Flex align="center" gap="32px">
        <a href="/">
          <Image src={logoSrc} alt={logoAlt} height={logoHeight} />
        </a>

        <Flex gap="16px" align="center">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              <Text fontSize="sm" fontWeight="medium" {...linkTextProps}>
                {link.label}
              </Text>
            </a>
          ))}
        </Flex>
      </Flex>

      <Flex gap="16px" align="center">
        {rightLinks.map((link) => (
          <a key={link.href} href={link.href}>
            <Text fontSize="sm" fontWeight="medium" {...linkTextProps}>
              {link.label}
            </Text>
          </a>
        ))}

        {isLoggedIn && onLogout && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            <Text fontSize="sm" fontWeight="medium" {...linkTextProps}>
              Logout
            </Text>
          </a>
        )}
      </Flex>
    </Flex>
  );
};

export default React.memo(NavBar, (prev, next) => _.isEqual(prev, next));
