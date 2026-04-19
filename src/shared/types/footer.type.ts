import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  logoSrc?: string;
  logoAlt?: string;
  logoHeight?: string | number;
  copyrightText?: string;
  links?: FooterLink[];
  containerProps?: FlexProps;
  linkTextProps?: TextProps;
  copyrightTextProps?: TextProps;
}
