import * as React from 'react';
import _ from 'lodash';
import { SkeletonText as CKSkeletonText } from '@chakra-ui/react';
import { SkeletonTextProps } from '@types';

const SkeletonText: React.FC<SkeletonTextProps> = ({ ...props }) => (
  <CKSkeletonText {...props} />
);

export default React.memo(SkeletonText, (prev, next) => _.isEqual(prev, next));