import * as React from 'react';
import _ from 'lodash';
import { Button as CKButton } from '@chakra-ui/react';
import { ButtonProps } from '@types';

const Button: React.FC<ButtonProps> = ({
  children,
...props
}) => {
  return (
    <CKButton
     {...props}
    >
      {children}
    </CKButton>
  );
}

export default React.memo(Button, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});