import { useField as useFormikField, FieldInputProps, FieldMetaProps } from "formik";

/**
 * Custom hook to handle form fields with or without Formik
 */
export function useFormField<T>(
  name: string, 
  options: {
    formik: boolean;
    value?: T;
    onChange?: React.ChangeEventHandler;
    onBlur?: React.FocusEventHandler;
    error?: string;
  }
): [FieldInputProps<T>, FieldMetaProps<T>] {
  const { formik, value, onChange, onBlur, error } = options;
  
  if (formik) {
    // Use Formik's useField when in a Formik context
    return useFormikField(name);
  }
  
  // Create a Formik-compatible field interface for non-Formik usage
  return [
    {
      name,
      value: value as T,
      onChange,
      onBlur,
      // These are part of the Formik field interface but not used in our component
      multiple: false,
      checked: false,
    },
    {
      touched: false,
      error: error,
      initialError: "",
      initialTouched: false,
      initialValue: value as T,
      value: value as T,
    }
  ];
}