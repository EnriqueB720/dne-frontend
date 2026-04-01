import * as React from 'react';
import _ from 'lodash';
import { SkeletonCircle as CKSkeletonCircle } from '@chakra-ui/react';
import { SkeletonCircleProps } from '@types';

const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ ...props }) => (
  <CKSkeletonCircle {...props} />
);

export default React.memo(SkeletonCircle, (prev, next) => _.isEqual(prev, next));