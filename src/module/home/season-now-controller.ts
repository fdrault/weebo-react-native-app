import { createStore, ReadableStore, WritableStore } from '@/core/store/store';

interface SeasonNowState<R extends { data: any[] }> {
  fetching: boolean;
  refreshing: boolean;
  data: R['data'];
  error: Error | null;
}
export class SeasonNowController<Result extends { data: any[] }> {
  private readonly initialState: SeasonNowState<Result> = {
    fetching: false,
    refreshing: false,
    data: [],
    error: null,
  };

  private stateStore: WritableStore<SeasonNowState<Result>>;
  readonly state: ReadableStore<SeasonNowState<Result>>;
  private abortController: AbortController | null = null;
  private isReady = false;

  constructor(private operation: (signal: AbortSignal) => Promise<Result>) {
    this.stateStore = createStore<SeasonNowState<Result>>(this.initialState);
    this.state = this.stateStore.readonly;
  }

  private async initialFetch() {
    const state = this.stateStore.get();
    if (state.fetching) {
      return;
    }
    this.abort();

    this.abortController = new AbortController();

    try {
      this.stateStore.patch({ ...this.initialState, fetching: true });
      const result = await this.operation(this.abortController.signal);
      this.isReady = true;
      this.stateStore.set({
        data: result.data,
        fetching: false,
        error: null,
        refreshing: false,
      });
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      this.stateStore.set({
        data: [],
        fetching: false,
        refreshing: false,
        error: e instanceof Error ? e : new Error(String(e)),
      });
    } finally {
      this.abortController = null;
    }
  }

  async fetch() {
    console.log(`fetch isReady ${this.isReady}`);
    if (!this.isReady) {
      return await this.initialFetch();
    } else {
      return await this.refresh();
    }
  }

  async refresh() {
    const state = this.stateStore.get();
    if (state.fetching) {
      return;
    }
    this.abort();
    this.abortController = new AbortController();

    try {
      this.stateStore.patch({ refreshing: true });
      const result = await this.operation(this.abortController.signal);
      this.stateStore.set({
        data: result.data,
        fetching: false,
        error: null,
        refreshing: false,
      });
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      this.stateStore.set({
        data: [],
        fetching: false,
        refreshing: false,
        error: e instanceof Error ? e : new Error(String(e)),
      });
    } finally {
      this.abortController = null;
    }
  }

  abort() {
    console.log('abort');
    this.abortController?.abort();
    this.abortController = null;
    this.stateStore.patch({ refreshing: false, fetching: false });
  }
}
