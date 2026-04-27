import { FlexProps } from '@chakra-ui/react';
import { TextProps } from './text.type';
import { ButtonProps } from './button.type';
import { InputProps } from './input.type';

export interface ProfileCardField {
  label: string;
  value: string;
}

export interface ProfileCardProps {
  name: string;
  email: string;
  phone: string;
  avatarSrc?: string;
  avatarSize?: string;
  nameLabel?: string;
  emailLabel?: string;
  phoneLabel?: string;
  editLabel?: string;
  onEdit?: () => void;
  extraFields?: ProfileCardField[];
  containerProps?: FlexProps;
  labelProps?: TextProps;
  inputProps?: Partial<InputProps>;
  buttonProps?: Partial<ButtonProps>;
}
