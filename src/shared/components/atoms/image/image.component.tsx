import * as React from 'react';
import _ from 'lodash';
import { Image as CKImage } from '@chakra-ui/react';
import { ImageProps } from '@types';

const Image: React.FC<ImageProps> = ({ ...props }) => (
    <CKImage {...props} />
);

export default React.memo(Image, (prev, next) => _.isEqual(prev, next));
