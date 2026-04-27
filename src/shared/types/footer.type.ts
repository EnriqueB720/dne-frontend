import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';

export interface FooterLink {
  label: string;
  href: string;
}

import { LogoVariant } from './navBar.type';

export interface FooterProps {
  logoVariant?: LogoVariant;
  logoAlt?: string;
  logoHeight?: string | number;
  copyrightText?: string;
  links?: FooterLink[];
  containerProps?: FlexProps;
  linkTextProps?: TextProps;
  copyrightTextProps?: TextProps;
}
