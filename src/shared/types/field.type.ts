import { ChangeEvent } from "react";
import { ComboboxItem } from "./comboBox.type";


export interface FieldProps {
  label: string;
  name: string;
  fieldType?: 'field' | 'phone' | 'combobox';
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