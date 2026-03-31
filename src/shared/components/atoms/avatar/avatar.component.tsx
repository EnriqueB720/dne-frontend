import * as React from 'react';
import _ from 'lodash';
import {
  Avatar as CKAvatar,
} from '@chakra-ui/react';
import { AvatarRootProps, AvatarFallbackProps, AvatarImageProps } from '@types';

const AvatarRoot: React.FC<AvatarRootProps> = ({ children, ...props }) => (
  <CKAvatar.Root {...props}>
    {children}
  </CKAvatar.Root>
);

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, ...props }) => (
  <CKAvatar.Fallback {...props}>
    {children}
  </CKAvatar.Fallback>
);

const AvatarImage: React.FC<AvatarImageProps> = ({ ...props }) => (
  <CKAvatar.Image {...props} />
);

const MemoAvatarRoot     = React.memo(AvatarRoot,     (prev, next) => _.isEqual(prev, next));
const MemoAvatarFallback = React.memo(AvatarFallback, (prev, next) => _.isEqual(prev, next));
const MemoAvatarImage    = React.memo(AvatarImage,    (prev, next) => _.isEqual(prev, next));

const Avatar = Object.assign(MemoAvatarRoot, {
  Fallback: MemoAvatarFallback,
  Image:    MemoAvatarImage,
});

export default Avatar;