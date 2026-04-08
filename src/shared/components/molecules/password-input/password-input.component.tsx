import * as React from 'react';

import _ from 'lodash';

import { CKPasswordInput } from "@components";

import { PasswordInputProps } from '@types';

const PasswordInput: React.FC<PasswordInputProps> = ({
  ...props
}) => {

  return (
    <CKPasswordInput {...props}/>
  );
}

export default React.memo(PasswordInput, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
  });