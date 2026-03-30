import * as React from 'react';
import _ from 'lodash';
import { Badge as CKBadge } from '@chakra-ui/react';
import { BadgeProps } from '@types';

const Badge: React.FC<BadgeProps> = ({
  children,
  ...props
}) => {

  return (
    <CKBadge
      {...props}
    >
        {children}
    </CKBadge>
    );
}

export default React.memo(Badge, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});