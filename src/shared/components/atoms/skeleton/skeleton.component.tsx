import * as React from 'react';
import _ from 'lodash';
import { Skeleton as CKSkeleton } from '@chakra-ui/react';
import { SkeletonProps } from '@types';

const Skeleton: React.FC<SkeletonProps> = ({ children, ...props }) => (
  <CKSkeleton {...props}>{children}</CKSkeleton>
);

export default React.memo(Skeleton, (prev, next) => _.isEqual(prev, next));