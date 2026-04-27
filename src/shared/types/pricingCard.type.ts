import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';
import { ButtonProps } from './button.type';

export interface PricingCardProps {
  planName: string;
  price: string | number;
  priceUnit?: string;
  features: string[];
  ctaLabel?: string;
  onChoose?: () => void;
  isHighlighted?: boolean;
  currency?: string;
  containerProps?: FlexProps;
  planNameProps?: TextProps;
  priceProps?: TextProps;
  priceUnitProps?: TextProps;
  featureTextProps?: TextProps;
  buttonProps?: Partial<ButtonProps>;
}
