import * as React from 'react';
import _ from 'lodash';
import { IconName, IconProps } from '@types';
import { MdVisibility, MdVisibilityOff, MdSearch } from "react-icons/md";
import { IconType } from 'react-icons';

const IconDictionary: {
  [K in IconName]: IconType
} = {
  visibilityOff: MdVisibilityOff,
  visibilityOn: MdVisibility,
  search: MdSearch
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