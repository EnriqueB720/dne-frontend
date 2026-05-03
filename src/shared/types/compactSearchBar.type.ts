import { FlexProps, InputProps, IconButtonProps } from '@types';

export interface CompactSearchBarProps {
  inputPlaceholder?: string;
  searchRoute?: string;
  queryParamName?: string;
  defaultValue?: string;
  containerProps?: FlexProps;
  inputProps?: InputProps;
  buttonProps?: IconButtonProps;
}
