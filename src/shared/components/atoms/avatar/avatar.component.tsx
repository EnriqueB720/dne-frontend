import * as React from 'react';
import _ from 'lodash';
import {
  Avatar as CKAvatar,
} from '@chakra-ui/react';
import { AvatarProps } from '@types';

const AvatarBase: React.FC<AvatarProps> = ({ name, src, ...props }) => (
  <CKAvatar.Root {...props}>
    <CKAvatar.Fallback name={name} />
    <CKAvatar.Image src={src} />
  </CKAvatar.Root>
);

const Avatar = React.memo(AvatarBase, (prev, next) => _.isEqual(prev, next));

export default Avatar;
