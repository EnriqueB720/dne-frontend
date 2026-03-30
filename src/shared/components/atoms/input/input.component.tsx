import * as React from 'react';
import _ from 'lodash';
import { Input as CKInput } from '@chakra-ui/react';
import { InputProps } from '@types';

const Input: React.FC<InputProps> = ({
  ...props
}) => {

  return (
    <CKInput {...props}/>
  );
}

export default React.memo(Input, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});
