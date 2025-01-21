'use client';

import { useEffect } from 'react';
import { useErrorToast } from '../use-error-toast';

export default function ToastComponent({
  message,
  type = 'error',
}: {
  message?: string;
  type?: 'error' | 'success' | 'neutral';
}) {
  const { errorMessage, handleCloseToast } = useErrorToast();

  if (!message && type === 'error') {
    message = errorMessage;
  }

  useEffect(() => {
    if (!errorMessage) return;
    // Auto-close after 5s (optional)
    const timer = setTimeout(() => {
      handleCloseToast();
    }, 5000);
    return () => clearTimeout(timer);
  }, [errorMessage, handleCloseToast]);

  const baseClasses = `
    fixed top-4 z-50
    px-4 py-3
    border rounded shadow
    transition-opacity duration-300
    left-0 right-0 w-full
    sm:left-1/2 sm:-translate-x-1/2 sm:w-auto
    flex items-center justify-between
    `;
  let typeClasses = '';

  switch (type) {
    case 'error':
      typeClasses = 'bg-red-100 border-red-400 text-red-700';
      break;
    case 'success':
      typeClasses = 'bg-green-100 border-green-400 text-green-700';
      break;
    default:
      typeClasses = 'bg-gray-100 border-gray-400 text-gray-700';
  }

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      <span className="flex items-center justify-center">
        {message ?? errorMessage}
      </span>
      <button
        className="ml-4 text-sm text-gray-700 hover:opacity-75"
        onClick={handleCloseToast}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}
