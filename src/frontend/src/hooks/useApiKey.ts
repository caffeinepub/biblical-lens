import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'biblical-lens-api-key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
    }
  }, []);

  const setApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKeyState(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState(null);
  };

  return {
    apiKey,
    setApiKey,
    clearApiKey,
  };
}
