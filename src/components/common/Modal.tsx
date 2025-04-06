import React, { useEffect, useRef } from "react";
import { useUI } from "../../context/UIContext";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Standalone Modal component when you need direct control
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Store previous active element to restore focus later
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 0);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEsc, isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      closeOnClickOutside &&
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  if (!isOpen) return null;

  // Use createPortal to render the modal at the document body level
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-opacity-50 bg-secondary-900"
      aria-modal="true"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl transition-all transform ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            {title && (
              <h3 className="text-lg font-medium text-secondary-900">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={onClose}
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-secondary-200">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

/**
 * Context-based modal component that uses UIContext
 * This component renders the current modal from context
 */
export const ModalContainer: React.FC = () => {
  const { currentModal, hideModal } = useUI();

  if (!currentModal) return null;

  return (
    <Modal
      isOpen={true}
      onClose={hideModal}
      title={currentModal.title}
      footer={
        <div className="flex justify-end space-x-3">
          {currentModal.onCancel && (
            <button
              onClick={() => {
                currentModal.onCancel?.();
                hideModal();
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          {currentModal.onConfirm && (
            <button
              onClick={() => {
                currentModal.onConfirm?.();
                hideModal();
              }}
              className="btn btn-primary"
            >
              Confirm
            </button>
          )}
        </div>
      }
    >
      {currentModal.content}
    </Modal>
  );
};

export default ModalContainer;
