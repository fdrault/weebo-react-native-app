import { GetAnimeSearchResponse } from '@/core/api/jikan-dto';
import {
  FetchMoreState,
  FetchState,
  FetchStatus,
} from '@/core/fetcher/fetcher-state';
import { buildFetchStateMachine } from '@/core/fetcher/fetcher-strategy';
import { createStore } from '@/core/store/store';

export const buildSearchPaginationFetcher = (
  q: string,
  operation: (
    signal: AbortSignal,
    page: number,
    q: string,
  ) => Promise<GetAnimeSearchResponse>,
) => {
  const fetchStateStore = createStore<FetchState<GetAnimeSearchResponse>>({
    status: FetchStatus.IDLE,
  });
  const fetchMoreStateStore = createStore<FetchMoreState>({
    status: FetchStatus.IDLE,
  });
  const refreshStateStore = createStore<FetchMoreState>({
    status: FetchStatus.IDLE,
  });
  let abortController: AbortController | null = null;

  const machine = buildFetchStateMachine(fetchStateStore);
  let currentPage = 1;

  const fetch = () => {
    const executor = async () => {
      if (abortController !== null) {
        abortController.abort();
      }
      abortController = new AbortController();
      try {
        machine.toFetching();
        const result = await operation(abortController.signal, 1, q);
        machine.toReady(result);
      } catch (e) {
        machine.toError(e instanceof Error ? e : new Error('Fetch error'));
      }
    };
    executor();
  };

  const fetchMore = () => {
    const execute = async () => {
      const state = fetchStateStore.get();
      if (
        state.status === FetchStatus.READY &&
        state.data.pagination.has_next_page
      ) {
        if (fetchMoreStateStore.get().status === FetchStatus.FETCHING) {
          return; // Request already ongoing
        }
        try {
          if (abortController !== null) {
            abortController.abort();
          }
          abortController = new AbortController();
          fetchMoreStateStore.set({
            status: FetchStatus.FETCHING,
            error: null,
          });
          console.log(`Fetching "${q}" page ${currentPage + 1}...`);
          const result = await operation(
            abortController.signal,
            currentPage + 1,
            q,
          );
          currentPage = currentPage + 1;
          machine.toReady({
            data: state.data.data.concat(result.data),
            pagination: result.pagination,
          });
          fetchMoreStateStore.set({ status: FetchStatus.READY, error: null });
        } catch (e) {
          fetchMoreStateStore.set({
            status: FetchStatus.ERROR,
            error: e instanceof Error ? e : new Error('Fetch error'),
          });
        }
      }
    };
    execute();
  };

  const refresh = () => {
    const executor = async () => {
      if (abortController !== null) {
        abortController.abort();
      }
      abortController = new AbortController();
      try {
        refreshStateStore.set({ status: FetchStatus.FETCHING, error: null });
        const result = await operation(abortController.signal, 1, q);
        currentPage = 1;
        machine.toReady(result);
        refreshStateStore.set({ status: FetchStatus.READY, error: null });
      } catch (e) {
        machine.toError(e instanceof Error ? e : new Error('Fetch error'));
      }
    };
    executor();
  };

  const abortOngoingRequest = () => {
    abortController?.abort();
  };

  const reset = () => {
    abortOngoingRequest();
    fetchStateStore.set({ status: FetchStatus.IDLE });
  };

  return {
    fetch,
    fetchMore,
    refresh,
    fetchState: fetchStateStore.readonly,
    fetchMoreState: fetchMoreStateStore.readonly,
    refreshState: refreshStateStore.readonly,
    abortOngoingRequest,
    reset,
  };
};
