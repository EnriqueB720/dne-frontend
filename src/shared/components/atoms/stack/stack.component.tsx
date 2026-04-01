import * as React from 'react';
import _ from 'lodash';
import { Stack as CKStack } from '@chakra-ui/react';
import { StackProps } from '@types';

const Stack: React.FC<StackProps> = ({ children, ...props }) => (
  <CKStack {...props}>{children}</CKStack>
);

export default React.memo(Stack,  (prev, next) => _.isEqual(prev, next));
