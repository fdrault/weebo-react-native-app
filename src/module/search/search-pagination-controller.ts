import { Pagination } from '@/core/api/jikan-dto';
import { createStore, ReadableStore, WritableStore } from '@/core/store/store';

interface PaginationState<R extends { data: any[] }> {
  fetching: boolean;
  data: R['data'];
  refreshing: boolean;
  error: Error | null;

  fetchingMore: boolean;
  fetchingMoreError: Error | null;
  hasMore: boolean;
}
export class SearchPaginationController<
  Result extends { data: any[]; pagination: Pagination },
> {
  private readonly initialState: PaginationState<Result> = {
    fetching: false,
    fetchingMore: false,
    refreshing: false,
    hasMore: false,
    data: [],
    error: null,
    fetchingMoreError: null,
  };

  private stateStore: WritableStore<PaginationState<Result>>;
  readonly state: ReadableStore<PaginationState<Result>>;
  private abortController: AbortController | null = null;
  private currentPage = 1;
  private currentInput = '';

  constructor(
    private operation: (
      signal: AbortSignal,
      page: number,
      q: string,
    ) => Promise<Result>,
  ) {
    this.stateStore = createStore<PaginationState<Result>>(this.initialState);
    this.state = this.stateStore.readonly;
  }

  private async executeTask(options: {
    page: number;
    query: string;
    onStart: () => void;
    onSuccess: (result: Result) => void;
    onError: (err: Error) => void;
  }) {
    this.abort();

    this.abortController = new AbortController();
    options.onStart();

    try {
      const result = await this.operation(
        this.abortController.signal,
        options.page,
        options.query,
      );
      options.onSuccess(result);
      this.currentPage = options.page;
      this.currentInput = options.query;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      options.onError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      this.abortController = null;
    }
  }

  async fetch(q: string) {
    if (q === '') {
      this.abort();
      this.stateStore.set(this.initialState);
      return;
    }

    const state = this.stateStore.get();
    if (state.fetching && q === this.currentInput) return;

    await this.executeTask({
      page: 1,
      query: q,
      onStart: () => {
        this.stateStore.set({ ...this.initialState, data: [], fetching: true });
      },
      onSuccess: res => {
        this.stateStore.patch({
          fetching: false,
          data: res.data,
          hasMore: res.pagination.has_next_page,
        });
      },
      onError: error => {
        this.stateStore.patch({ fetching: false, error });
      },
    });
  }

  async fetchMore() {
    const state = this.stateStore.get();
    if (state.fetching || state.fetchingMore || !state.hasMore) return;

    await this.executeTask({
      page: this.currentPage + 1,
      query: this.currentInput,
      onStart: () =>
        this.stateStore.patch({ fetchingMore: true, fetchingMoreError: null }),
      onSuccess: res => {
        this.stateStore.update(s => ({
          ...s,
          data: [...s.data, ...res.data],
          fetchingMore: false,
          hasMore: res.pagination.has_next_page,
        }));
      },
      onError: err =>
        this.stateStore.patch({ fetchingMore: false, fetchingMoreError: err }),
    });
  }

  async refresh() {
    if (this.stateStore.get().fetching) return;

    await this.executeTask({
      page: 1,
      query: this.currentInput,
      onStart: () => this.stateStore.patch({ refreshing: true, error: null }),
      onSuccess: res => {
        this.stateStore.patch({
          refreshing: false,
          data: res.data,
          hasMore: res.pagination.has_next_page,
        });
      },
      onError: error => this.stateStore.patch({ refreshing: false, error }),
    });
  }

  abort() {
    this.abortController?.abort();
    this.abortController = null;
  }
}
