import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';

export interface NavBarLink {
  label: string;
  href: string;
}

export type LogoVariant = 'dark' | 'light';

export interface NavBarProps {
  logoVariant?: LogoVariant;
  logoAlt?: string;
  logoHeight?: string | number;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  loggedOutLinks?: NavBarLink[];
  loggedInLinks?: NavBarLink[];
  rightLinks?: NavBarLink[];
  containerProps?: FlexProps;
  linkTextProps?: TextProps;
}
