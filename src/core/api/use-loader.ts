import { Loader } from '@/core/api/loader';
import { useStore } from '@/core/store/store';
import { useLazyRef } from '@/core/use-lazy-ref';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';

export const useLoaderOnFocus = <Args, Result>(
  buildLoader: () => Loader<Args, Result>,
) => {
  const loaderRef = useLazyRef(buildLoader);

  useEffect(() => {
    const loader = loaderRef.current;
    return () => loader.abort();
  }, [loaderRef]);

  const state = useStore(loaderRef.current.state);

  useFocusEffect(loaderRef.current.load);

  return { state };
};

export const useLoader = <Args, Result>(
  buildLoader: () => Loader<Args, Result>,
) => {
  const loaderRef = useLazyRef(buildLoader);

  useEffect(() => {
    const loader = loaderRef.current;
    return () => loader.abort();
  }, [loaderRef]);

  const state = useStore(loaderRef.current.state);

  return {
    state,
    load: loaderRef.current.load,
    abort: loaderRef.current.abort,
  };
};
