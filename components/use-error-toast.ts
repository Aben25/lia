'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const errorParams = searchParams.has('error')
      ? searchParams
      : new URLSearchParams(location.hash);

    const { error, error_code, error_description } =
      Object.fromEntries(errorParams);

    setErrorMessage(error_description ?? error_code ?? error ?? '');
  }, [searchParams]);

  function handleCloseToast() {
    setErrorMessage('');
  }

  return { errorMessage, handleCloseToast };
}
