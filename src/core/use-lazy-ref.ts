import { useRef } from 'react';

export const useLazyRef = <T>(factory: () => T) => {
  const ref = useRef<ReturnType<typeof factory> | null>(null);
  if (ref.current === null) {
    ref.current = factory();
  }
  return ref as React.RefObject<T>;
};
