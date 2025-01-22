'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook for managing error toast message from the "error" query param
 * during an error redirect
 *
 * @returns {{
 *   errorMessage: string;
 *   handleCloseToast: () => void;
 * }}
 */
export function useErrorToast() {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const searchParams = Object.fromEntries(
      new URLSearchParams(
        window.location.search || window.location.hash
      ).entries()
    );

    const { error, error_code, error_description } = searchParams;

    setErrorMessage(error_description ?? error_code ?? error ?? '');
  }, []);

  function handleCloseToast() {
    setErrorMessage('');
  }

  return { errorMessage, handleCloseToast };
}
