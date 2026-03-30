import * as React from 'react';
import _ from 'lodash';
import { Text } from '@chakra-ui/react';
import { TextProps } from '@types';

const TextComponent: React.FC<TextProps> = ({ children, ...props }) => (
  <Text {...props}>
    {children}
  </Text>
);

export default React.memo(TextComponent, (prev, next) => _.isEqual(prev, next));
