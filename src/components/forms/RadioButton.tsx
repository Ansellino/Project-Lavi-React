import React from "react";

interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
  labelClassName?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  className = "",
  labelClassName = "",
  disabled = false,
  checked,
  onChange,
  helperText,
  error,
  id,
  name,
  value,
  ...rest
}) => {
  return (
    <div className={`flex ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`w-4 h-4 text-primary-600 focus:ring-primary-500 border-secondary-300 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            {...rest}
          />
        </div>

        <div className="ml-2 text-sm">
          {label && (
            <label
              htmlFor={id}
              className={`font-medium text-secondary-700 ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${labelClassName}`}
            >
              {label}
            </label>
          )}

          {helperText && !error && (
            <p className="mt-1 text-secondary-500">{helperText}</p>
          )}

          {error && <p className="mt-1 text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RadioButton;
