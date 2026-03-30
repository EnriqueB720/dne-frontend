import * as React from 'react';
import _ from 'lodash';
import {
  Avatar as CKAvatar,
  AvatarGroup as CKAvatarGroup,
} from '@chakra-ui/react';
import { AvatarRootProps, AvatarFallbackProps, AvatarImageProps, AvatarGroupProps } from '@types';

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

const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, ...props }) => (
  <CKAvatarGroup {...props}>
    {children}
  </CKAvatarGroup>
);

const MemoAvatarRoot     = React.memo(AvatarRoot,     (prev, next) => _.isEqual(prev, next));
const MemoAvatarFallback = React.memo(AvatarFallback, (prev, next) => _.isEqual(prev, next));
const MemoAvatarImage    = React.memo(AvatarImage,    (prev, next) => _.isEqual(prev, next));
const MemoAvatarGroup    = React.memo(AvatarGroup,    (prev, next) => _.isEqual(prev, next));

const Avatar = Object.assign(MemoAvatarRoot, {
  Fallback: MemoAvatarFallback,
  Image:    MemoAvatarImage,
});

export { Avatar, MemoAvatarGroup as AvatarGroup };