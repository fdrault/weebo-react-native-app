import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';

export const useAsync = (operation: () => Promise<unknown>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const operationWrapped = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      await operation();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [operation]);

  return [operationWrapped, loading, error] as const;
};

export const useAsyncOnFocus = (
  operation: () => Promise<unknown>,
  ttl = 60 * 1000,
) => {
  const timestamp = useRef(0);
  const operationWrapped = useCallback(() => {
      const now = new Date().getTime();
    if (now - timestamp.current > ttl) {
        timestamp.current = now;
        operation();
    }
  }, [ttl])
  useFocusEffect(() => operationWrapped());
};
