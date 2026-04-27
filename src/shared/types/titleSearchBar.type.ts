import { BoxProps, FlexProps, TextProps, InputProps, ButtonProps } from '@types';

export interface TitleSearchBarProps {
  title?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  searchRoute?: string;
  queryParamName?: string;
  containerProps?: BoxProps;
  rowProps?: FlexProps;
  titleProps?: TextProps;
  inputProps?: InputProps;
  buttonProps?: ButtonProps;
}
