import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface Modal {
  id: string;
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UIContextType {
  toasts: Toast[];
  showToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  currentModal: Modal | null;
  showModal: (modal: Omit<Modal, 'id'>) => void;
  hideModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentModal, setCurrentModal] = useState<Modal | null>(null);

  const showToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString