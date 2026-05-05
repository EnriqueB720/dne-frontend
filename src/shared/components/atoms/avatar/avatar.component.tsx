import * as React from 'react';
import _ from 'lodash';
import {
  Avatar as CKAvatar,
} from '@chakra-ui/react';
import { AvatarProps } from '@types';

// Chakra v3's withContext strips standard <img> attrs from the public type of
// Avatar.Image (and also drops `children`/`asChild`), so we widen it here. The
// runtime accepts these props normally.
const CKAvatarImage = CKAvatar.Image as unknown as React.FC<
  React.ComponentPropsWithoutRef<'img'> & { asChild?: boolean; children?: React.ReactNode }
>;

const AvatarBase: React.FC<AvatarProps> = ({ name, src, ...props }) => (
  <CKAvatar.Root {...props}>
    <CKAvatar.Fallback name={name} />
    <CKAvatarImage src={src} alt={name ?? ''} />
  </CKAvatar.Root>
);

const Avatar = React.memo(AvatarBase, (prev, next) => _.isEqual(prev, next));

export default Avatar;
