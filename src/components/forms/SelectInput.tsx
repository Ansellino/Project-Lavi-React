import React from "react";
import { useFormField } from "../../hooks/useFormField";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectInputProps {
  label: string;
  name: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  formik?: boolean; // Whether to use Formik hooks
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  helperText,
  error,
  className = "",
  required = false,
  disabled = false,
  formik = false,
  ...props
}) => {
  // Use our custom hook to handle both Formik and non-Formik cases
  const [field, meta] = useFormField(name, {
    formik,
    value,
    onChange,
    onBlur,
    error,
  });

  // Determine if there's an error to show
  const hasError = meta.touched && meta.error;
  const errorMessage = meta.error;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <select
        id={name}
        name={field.name}
        value={field.value || ""}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={disabled}
        className={`form-input w-full ${
          hasError
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : ""
        } ${disabled ? "opacity-50 cursor-not-allowed bg-secondary-50" : ""}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helperText && !hasError && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default SelectInput;
