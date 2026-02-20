import { Fetcher } from '@/core/fetcher/fetcher';
import { useStore } from '@/core/store/store';
import { useLazyRef } from '@/core/use-lazy-ref';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';

export const useFetcher = <Args, Result>(
  buildFetcher: () => Fetcher<Args, Result>,
) => {
  const fetcherRef = useLazyRef(buildFetcher);

  useEffect(() => {
    const fetcher = fetcherRef.current;
    return () => fetcher.abortOngoingRequest();
  }, [fetcherRef]);

  const state = useStore(fetcherRef.current.fetchState);

  return {
    state,
    fetcher: fetcherRef.current,
  };
};

export const useFetchOnFocus = <Args, Result>(
  buildFetcher: () => Fetcher<Args, Result>,
) => {
  const fetcher = useFetcher(buildFetcher);

  useFocusEffect(fetcher.fetcher.fetch);

  return fetcher;
};
