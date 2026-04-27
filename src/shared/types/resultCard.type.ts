import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';
import { ButtonProps } from './button.type';

export interface ResultCardProps {
  title: string;
  price: string | number;
  description: string;
  currency?: string;
  ctaLabel?: string;
  href?: string;
  onVisit?: () => void;
  imageUrl?: string;
  imageAlt?: string;
  containerProps?: FlexProps;
  titleProps?: TextProps;
  priceProps?: TextProps;
  descriptionProps?: TextProps;
  buttonProps?: Partial<ButtonProps>;
}
