/* eslint-disable @next/next/no-html-link-for-pages */
import * as React from 'react';
import _ from 'lodash';
import { Flex, Image, Text } from '@atoms';
import { NavBarLink, NavBarProps } from '@types';

const loggedOutLinks: NavBarLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Supplier Login', href: '/supplier-login' },
];

const loggedInLinks: NavBarLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Profile', href: '/profile' },
  { label: 'My Posts', href: '/my-posts' },
];

const rightLinks: NavBarLink[] = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const NavBar: React.FC<NavBarProps> = ({
  logoSrc = '/favicon.png',
  logoAlt = 'D&E Logo',
  isLoggedIn = false,
  onLogout,
}) => {
  const navLinks = isLoggedIn ? loggedInLinks : loggedOutLinks;

  return (
    <Flex
      as="nav"
      width="100%"
      justify="space-between"
      align="center"
      padding="12px 24px"
    >
      <Flex align="center" gap="32px">
        <a href="/">
          <Image src={logoSrc} alt={logoAlt} height="40px" />
        </a>

        <Flex gap="16px" align="center">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              <Text fontSize="sm" fontWeight="medium">
                {link.label}
              </Text>
            </a>
          ))}
        </Flex>
      </Flex>

      <Flex gap="16px" align="center">
        {rightLinks.map((link) => (
          <a key={link.href} href={link.href}>
            <Text fontSize="sm" fontWeight="medium">
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
            <Text fontSize="sm" fontWeight="medium">
              Logout
            </Text>
          </a>
        )}
      </Flex>
    </Flex>
  );
};

export default React.memo(NavBar, (prev, next) => _.isEqual(prev, next));
