import { FlexProps } from '@chakra-ui/react';
import { BadgeProps } from './badge.type';

export interface TagChipItem {
  label: string;
  value?: string;
  onClick?: () => void;
}

export interface TagChipGroupProps {
  tags: TagChipItem[];
  selectedValue?: string;
  onTagClick?: (tag: TagChipItem) => void;
  containerProps?: FlexProps;
  chipProps?: Partial<BadgeProps>;
  selectedChipProps?: Partial<BadgeProps>;
}
