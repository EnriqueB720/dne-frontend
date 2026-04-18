import * as React from 'react';

import _ from 'lodash';

import { FormProps } from '@types';
import { useTranslation } from '@/shared/hooks';
import { Field, Button, Box } from '@components';
import { Formik, FormikValues } from 'formik';


const Form = <T extends FormikValues,>({
  fields,
  validationSchema,
  submitButtonText,
  formValues,
  isLoading,
  groupings = [fields.length],
  onSubmit }: React.PropsWithChildren<FormProps<T>>) => {

  const { t } = useTranslation();


  const handleSubmit = (values: T) => {
    try {
      onSubmit(values);
    } catch (error) {
      alert(error);
    }
  }

  return (

    <Formik initialTouched={formValues} initialValues={formValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {(formik) => (
        <>
          {groupings.map((subGroup, i) => {
            const lastFieldIndex = groupings.slice(0, i).reduce((total, size) => total + size, 0);
            const subGroupFields = fields.slice(lastFieldIndex, lastFieldIndex + subGroup);

            return (
              <Box display={'flex'} justifyContent='space-around' alignItems={'center'} key={i}>
                {

                  subGroupFields?.map(field => {
                    const { name } = field;
                    const key = name.toString();
                    const value = formik.values[name];
                    const isTouched = formik.touched[name];
                    const error = isTouched && formik.errors[name] ? formik.errors[name]?.toString() : undefined;

                    return (
                      <Field
                        {...field}
                        key={key}
                        isErrors={!!error}
                        errorMessage={error}
                        inputValue={value}
                        onChange={formik.handleChange(name)}
                        onBlur={formik.handleBlur(name)}
                        isSubmitting={isLoading}
                        setFieldValue={formik.setFieldValue}
                      />
                    );
                  })!
                }
              </Box>
            )
            
          })}

          <Button
            marginTop={'10px'}
            loading={isLoading}
            disabled={isLoading}
            key='submit'
            onClick={() => formik.handleSubmit()}
            bg={'#00a884'}
            >
            {submitButtonText || t('login.form.submit')}
          </Button>
        </>)}

    </Formik>
  )
}

export default React.memo(Form, (prevProps, nextProps) => {
  return _.isEqual(prevProps, nextProps);
}) as <T>(props: React.PropsWithChildren<FormProps<T>>) => React.JSX.Element;