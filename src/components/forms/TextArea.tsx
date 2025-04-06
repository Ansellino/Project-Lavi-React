import React from "react";
import { useFormField } from "../../hooks/useFormField";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  helperText?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  formik?: boolean;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  helperText,
  error,
  className = "",
  labelClassName = "",
  required = false,
  disabled = false,
  rows = 4,
  formik = false,
  ...props
}) => {
  const [field, meta] = useFormField(name, {
    formik,
    value,
    onChange,
    onBlur,
    error,
  });

  const hasError = meta.touched && meta.error;
  const errorMessage = meta.error;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className={`form-label ${labelClassName}`}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <textarea
        id={name}
        name={field.name}
        rows={rows}
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
      />

      {helperText && !hasError && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default TextArea;
