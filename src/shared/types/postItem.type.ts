import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';
import { ImageProps } from './image.type';

export type PostItemVariant = 'card' | 'row';

export interface PostItemData {
  id: string | number;
  title: string;
  description?: string;
  imageUrl?: string;
  date?: string;
}

export interface PostItemProps extends PostItemData {
  variant?: PostItemVariant;
  onClick?: () => void;
  containerProps?: FlexProps;
  titleProps?: TextProps;
  descriptionProps?: TextProps;
  dateProps?: TextProps;
  imageProps?: Partial<ImageProps>;
}
