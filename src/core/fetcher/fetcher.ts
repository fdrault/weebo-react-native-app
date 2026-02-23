import {
  FetchState,
  FetchStatus,
  FetchStrategy,
} from '@/core/fetcher/fetcher-state';
import { buildFromStrategy } from '@/core/fetcher/fetcher-strategy';
import { createStore } from '@/core/store/store';

export type Fetcher<Args extends any[], Result> = ReturnType<
  typeof buildFetcher<Args, Result>
>;
export const buildFetcher = <Args extends any[], Result>(
  operation: (signal: AbortSignal, ...args: Args) => Promise<Result>,
  strategy: FetchStrategy,
) => {
  const fetchStateStore = createStore<FetchState<Result>>({
    status: FetchStatus.IDLE,
  });
  const revalidateStateStore = createStore<FetchState<Result>>({
    status: FetchStatus.IDLE,
  });
  let abortController: AbortController | null = null;

  const executor = buildFromStrategy(
    strategy,
    fetchStateStore,
    revalidateStateStore,
    operation,
  );

  const fetch = (...args: Args) => {
    if (abortController !== null) {
      abortController.abort();
    }
    abortController = new AbortController();
    executor(abortController.signal, args);
  };

  const abortOngoingRequest = () => abortController?.abort();
  return {
    fetch,
    fetchState: fetchStateStore.readonly,
    revalidateState: revalidateStateStore.readonly,
    abortOngoingRequest,
  };
};
