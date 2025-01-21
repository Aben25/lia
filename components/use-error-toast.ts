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

  const [errorMessage, setErrorMessage] = useState(() => {
    return searchParams.get('error') || '';
  });

  useEffect(() => {
    const errorParams = searchParams.has('error')
      ? searchParams.entries()
      : new URLSearchParams(location.hash).entries();

    const { error, error_code, error_description } = errorParams.reduce<{
      [key: string]: string;
    }>((params, [k, v]) => {
      params[k] = v;
      return params;
    }, {});

    setErrorMessage(error_description ?? error_code ?? error);
  }, [searchParams]);

  function handleCloseToast() {
    setErrorMessage('');
  }

  return { errorMessage, handleCloseToast };
}
