import * as React from 'react';
import _ from 'lodash';
import { IconButton as CKIconButton } from '@chakra-ui/react';
import { IconButtonProps } from '@types';
import { Icon } from '..';

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  ...props
}) => {

  return (
    <CKIconButton
      {...props}>
        <Icon name={icon}/>
      </CKIconButton>
  );
}


export default React.memo(IconButton, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
  });