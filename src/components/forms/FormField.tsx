import React from "react";
import { useField } from "formik";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
  autoComplete?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  helperText,
  className = "",
  as = "input",
  children,
  ...props
}) => {
  const [field, meta] = useField(props);
  const { name, required } = props;
  const hasError = meta.touched && meta.error;

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-medium text-secondary-700"
      >
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {as === "select" ? (
        <select
          id={name}
          className={`form-input w-full ${
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          {...field}
          {...props}
        >
          {children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={name}
          className={`form-input w-full ${
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          rows={4}
          {...field}
          {...props}
        />
      ) : (
        <input
          id={name}
          className={`form-input w-full ${
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          {...field}
          {...props}
        />
      )}

      {helperText && !hasError && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">{meta.error}</p>}
    </div>
  );
};

export default FormField;
