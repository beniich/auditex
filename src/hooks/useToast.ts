import React, { useState, useCallback } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  title?: string;
}

let toastCounter = 0;

// Global store for toasts (outside React to allow calling from anywhere)
let globalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null = null;

export function registerToastSetter(setter: React.Dispatch<React.SetStateAction<Toast[]>>) {
  globalSetToasts = setter;
}

export const toast = {
  success: (message: string, title?: string) => addToast(message, 'success', title),
  error: (message: string, title?: string) => addToast(message, 'error', title),
  warning: (message: string, title?: string) => addToast(message, 'warning', title),
  info: (message: string, title?: string) => addToast(message, 'info', title),
};

function addToast(message: string, variant: ToastVariant, title?: string) {
  if (!globalSetToasts) {
    console.warn('[Toast] No toast container registered.');
    return;
  }
  const id = `toast-${++toastCounter}`;
  globalSetToasts(prev => [...prev, { id, message, variant, title }]);
  setTimeout(() => {
    globalSetToasts?.(prev => prev.filter(t => t.id !== id));
  }, 4000);
}

export function useToastState() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  registerToastSetter(setToasts);
  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  return { toasts, dismiss };
}
