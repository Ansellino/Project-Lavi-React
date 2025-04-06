import React from "react";
import { useFormField } from "../../hooks/useFormField";

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  name: string;
  helperText?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  formik?: boolean;
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({
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
  formik = false,
  size = "md",
  leftIcon,
  rightIcon,
  type = "text",
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

  const sizeClasses = {
    sm: "py-1 text-sm",
    md: "py-2",
    lg: "py-3 text-lg",
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className={`form-label ${labelClassName}`}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-secondary-500">
            {leftIcon}
          </div>
        )}

        <input
          id={name}
          name={field.name}
          type={type}
          value={field.value || ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={disabled}
          className={`form-input w-full ${sizeClasses[size]} ${
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          } ${disabled ? "opacity-50 cursor-not-allowed bg-secondary-50" : ""}
            ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-secondary-500">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && !hasError && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}

      {hasError && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default TextInput;
