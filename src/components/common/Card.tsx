import React from "react";

type CardVariant = "default" | "outlined" | "elevated";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
  fullWidth?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  className = "",
  onClick,
  header,
  footer,
  noPadding = false,
  fullWidth = false,
}) => {
  const baseClasses = "rounded-lg overflow-hidden";

  const variantClasses = {
    default: "bg-white border border-secondary-200",
    outlined: "bg-transparent border border-secondary-200",
    elevated: "bg-white shadow-md",
  };

  const paddingClasses = noPadding ? "" : "p-4";
  const widthClasses = fullWidth ? "w-full" : "";
  const clickableClasses = onClick
    ? "cursor-pointer transition-shadow hover:shadow-md"
    : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses} ${widthClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {header && (
        <div
          className={`${
            noPadding ? "p-4" : ""
          } border-b border-secondary-200 font-medium text-secondary-900 mb-4`}
        >
          {header}
        </div>
      )}

      <div className={`${noPadding && !header ? "p-4" : ""}`}>{children}</div>

      {footer && (
        <div
          className={`${
            noPadding ? "p-4" : ""
          } border-t border-secondary-200 mt-4 pt-4`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
