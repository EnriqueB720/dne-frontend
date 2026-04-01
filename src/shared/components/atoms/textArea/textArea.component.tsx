import * as React from 'react';
import _ from 'lodash';
import { Textarea as CKTextarea } from '@chakra-ui/react';
import { TextareaProps } from '@types';

const Textarea: React.FC<TextareaProps> = ({ ...props }) => (
  <CKTextarea {...props} />
);

export default React.memo(Textarea, (prev, next) => _.isEqual(prev, next));