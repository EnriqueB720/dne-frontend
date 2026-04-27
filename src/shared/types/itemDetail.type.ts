import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';
import { TextareaProps } from './textarea.type';
import { ImageProps } from './image.type';

export interface ItemDetailProps {
  itemNumber: string | number;
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  images?: string[];
  imageAlt?: string;
  imageSize?: string | number;
  itemNumberPrefix?: string;
  emailLabel?: string;
  phoneLabel?: string;
  addressLabel?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoHeight?: string | number;
  containerProps?: FlexProps;
  galleryProps?: FlexProps;
  imageProps?: Partial<ImageProps>;
  headingProps?: TextProps;
  descriptionProps?: Partial<TextareaProps>;
  contactLabelProps?: TextProps;
  contactValueProps?: TextProps;
  logoProps?: Partial<ImageProps>;
}
