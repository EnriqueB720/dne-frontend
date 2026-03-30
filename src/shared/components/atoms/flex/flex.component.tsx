import * as React from 'react';
import _ from 'lodash';
import { Flex as CKFlex } from '@chakra-ui/react';
import { FlexProps } from '@types';

const Flex: React.FC<FlexProps> = ({
  children,
  ...props
}) => {
  return (
    <CKFlex
      {...props}
    >
      {children}
    </CKFlex>
  )
}


export default React.memo(Flex, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});