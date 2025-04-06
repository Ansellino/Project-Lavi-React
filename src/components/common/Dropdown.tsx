import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  id: string | number;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  width?: "auto" | "full";
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "left",
  width = "auto",
  className = "",
  triggerClassName = "",
  menuClassName = "",
  itemClassName = "",
  disabled = false,
  closeOnSelect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Dropdown trigger */}
      <div
        onClick={handleToggle}
        className={`cursor-pointer ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${triggerClassName}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none
            ${align === "right" ? "right-0" : "left-0"}
            ${width === "full" ? "w-full" : ""}
            ${menuClassName}
          `}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900
                  ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  ${itemClassName}
                `}
                role="menuitem"
                tabIndex={-1}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
