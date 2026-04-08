import * as React from 'react';

import _ from 'lodash';

import { FieldProps } from '@types';
import { Field as ChakraField, FieldLabel, FieldErrorText } from '@chakra-ui/react';
import { Input, PasswordInput, Combobox, Textarea } from '@components';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const Field: React.FC<FieldProps> = ({
  label,
  name,
  fieldType = 'field',
  fieldColor = 'black',
  inputPlaceholder,
  inputValue,
  isRequired,
  isErrors,
  errorMessage,
  isSubmitting,
  isPassword,
  defaultCountry = 'us',
  countryFieldName,
  comboboxItems,
  comboboxPlaceholder,
  comboboxEmptyText,
  onChange,
  onBlur,
  setFieldValue
}) => {

  function renderField() {
    switch (fieldType) {
      case 'field':
        return (
          !isPassword ?
            <Input
              onChange={onChange}
              type="text"
              name={name}
              placeholder={inputPlaceholder}
              value={inputValue}
            />
            :
            <PasswordInput
              onChange={onChange}
              name={name}
              placeholder={inputPlaceholder}
              value={inputValue}
            />
        );
      case 'phone':
        return (
          <PhoneInput
            disabled={isSubmitting}
            prefix=''
            placeholder={inputPlaceholder}
            defaultCountry={defaultCountry}
            value={inputValue}
            name={name}
            onChange={(phone, meta) => {
              onChange?.(phone);
              if (countryFieldName && setFieldValue) {
                setFieldValue(countryFieldName, meta.country.name);
              }
            }}
          />
        );
      case 'combobox':
        return (
          <Combobox
            items={comboboxItems || []}
            placeholder={comboboxPlaceholder}
            emptyText={comboboxEmptyText}
          />
        );
      case 'textarea':
        return (
          <Textarea
            onChange={onChange}
            name={name}
            placeholder={inputPlaceholder}
            value={inputValue}
          />
        );
    }
  }

  return (
    <ChakraField.Root
      mb={2}
      mr={2}
      invalid={isErrors}
      required={isRequired}
      disabled={isSubmitting}
      onBlur={onBlur}
      color={fieldColor}>
      <FieldLabel color={fieldColor}>{label}</FieldLabel>
      {renderField()}
      {isErrors && <FieldErrorText>{errorMessage}</FieldErrorText>}
    </ChakraField.Root>
  )

}

export default React.memo(Field, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
});