import { ChangeEvent } from "react";
import { ComboboxItem } from "./comboBox.type";

export type FieldType = 'field' | 'phone' | 'combobox' | 'textarea' | 'fileUpload';

export interface FieldProps {
  label: string;
  name: string;
  fieldType?: FieldType;
  fieldColor?:string;
  inputPlaceholder?: string;
  inputValue?: string | undefined;
  isRequired?: boolean;
  isErrors?: boolean;
  errorMessage?: string;
  isSubmitting?: boolean;
  isPassword?: boolean;
  defaultCountry?: string;
  countryFieldName?: string;
  comboboxItems?: ComboboxItem[];
  comboboxPlaceholder?: string;
  comboboxEmptyText?: string;
  onChange?: (e: string | ChangeEvent<any>) => void;
  onBlur?: (e: any) => void;
  setFieldValue?: (field: string, value: any) => void;
}