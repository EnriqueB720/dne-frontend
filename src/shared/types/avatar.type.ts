import {
  AvatarRootProps as AvatarRootProperties,
} from '@chakra-ui/react';

export interface AvatarProps extends AvatarRootProperties {
  src: string;
  name?: string;
}
