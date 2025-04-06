import React, { useEffect, useRef } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
  labelClassName?: string;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className = "",
  labelClassName = "",
  disabled = false,
  checked,
  onChange,
  helperText,
  error,
  indeterminate = false,
  id,
  ...rest
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  // Handle indeterminate state
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={`flex ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={checkboxRef}
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-secondary-300 ${
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
          
          {error && (
            <p className="mt-1 text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkbox;