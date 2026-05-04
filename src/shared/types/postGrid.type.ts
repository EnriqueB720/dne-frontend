import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';
import { ButtonProps } from './button.type';
import { PostItemData } from './postItem.type';

export type PostGridLayout = 'grid' | 'list';

export interface PostGridProps {
  posts: PostItemData[];
  title?: string;
  ctaLabel?: string;
  layout?: PostGridLayout;
  onCreate?: () => void;
  onPostClick?: (post: PostItemData) => void;
  showCreateButton?: boolean;
  emptyText?: string;
  gridColumns?: number;
  containerProps?: FlexProps;
  headerProps?: FlexProps;
  titleProps?: TextProps;
  buttonProps?: Partial<ButtonProps>;
  itemsContainerProps?: FlexProps;
}
