import { useCallback, useEffect, useRef } from 'react';

export const debounce = <T extends (...args: any) => any>(
  operation: T,
  wait: number,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      operation(args);
      timeoutId = null;
    }, wait);
  };
};

export const useDebounce = <T extends (...args: any) => any>(
  operation: T,
  wait: number,
) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const operationRef = useRef(operation);

  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  useEffect(() => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }
  }, []);

  const debounced = useCallback(
    (...params: Parameters<T>) => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
      timeoutId.current = setTimeout(() => {
        operationRef.current(...params);
        timeoutId.current = null;
      }, wait);
    },
    [wait],
  );
  return debounced;
};
