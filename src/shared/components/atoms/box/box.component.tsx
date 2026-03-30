import * as React from 'react';
import _ from 'lodash';
import { Box as CKBox } from '@chakra-ui/react';
import { BoxProps } from '@types';

const Box: React.FC<BoxProps> = ({
  children,
 ...props
}) => {

  return (
    <CKBox
      {...props}
    >
     {children}
    </CKBox>
  );
}

export default React.memo(Box, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});