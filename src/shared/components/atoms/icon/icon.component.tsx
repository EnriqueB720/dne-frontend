import * as React from 'react';
import _ from 'lodash';
import { IconName, IconProps } from '@types';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { IconType } from 'react-icons';

const IconDictionary: {
  [K in IconName]: IconType
} = {
  visibilityOff: MdVisibilityOff,
  visibilityOn: MdVisibility
}

const Icon: React.FC<IconProps> = ({
  name
}) => {

  const Component = IconDictionary[name];

  return (
    <Component />
  );
}

export default React.memo(Icon, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});