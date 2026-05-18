import * as React from 'react';
import _ from 'lodash';
import { Box as CKBox } from '@chakra-ui/react';
import { BoxProps } from '@types';

const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => {
  return (
    <CKBox ref={ref} {...props}>
      {children}
    </CKBox>
  );
});

Box.displayName = 'Box';

export default React.memo(Box, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});
