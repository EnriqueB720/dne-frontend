import { BadgeProps as CKBadgeProps } from '@chakra-ui/react';

export interface BadgeProps extends CKBadgeProps {
  children?: React.ReactNode;
}