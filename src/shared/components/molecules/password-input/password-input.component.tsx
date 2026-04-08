import * as React from 'react';

import _ from 'lodash';

import { PasswordInput as CKPasswordInput } from "@/components/ui/password-input"

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