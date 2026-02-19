import { debounce } from '@/core/debounce';
import { createStore, WritableStore } from '@/core/store/store';

export enum LoaderStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
  LOADING = 'LOADING',
}

export interface LoadSuccess<T> {
  status: LoaderStatus.SUCCESS;
  data: T;
  error: null;
}

export interface LoadFailure {
  status: LoaderStatus.FAILURE;
  error: Error;
}

export interface Loading {
  status: LoaderStatus.LOADING;
  error: Error | null;
}
export interface LoadPending {
  status: LoaderStatus.PENDING;
  error: Error | null;
}

export type LoadingStatus<T> =
  | Loading
  | LoadPending
  | LoadSuccess<T>
  | LoadFailure;

export class LoaderWithCache<Args, Result> {
  private readonly loaderStatus: WritableStore<LoadingStatus<Result>>;
  private abortController: AbortController | null = null;
  private readonly debouncedLoad: (args: Args) => void;

  public readonly state;

  constructor(
    private operation: (
      args: Args,
      signal: AbortSignal,
    ) => Promise<Result> | Result,
    private config: { wait: number } = { wait: 0 },
  ) {
    this.loaderStatus = createStore<LoadingStatus<Result>>({
      status: LoaderStatus.PENDING,
      error: null,
    });

    this.state = this.loaderStatus.readonly;

    this.debouncedLoad =
      this.config.wait > 0
        ? debounce((args: Args) => this.execute(args), this.config.wait)
        : this.execute;
  }

  load = (args: Args) => {
    this.loaderStatus.update(s => ({
      ...s,
      status: LoaderStatus.LOADING,
    }));
    this.debouncedLoad(args);
  };

  private async execute(args: Args) {
    this.abort();
    this.abortController = new AbortController();

    try {
      const result = await this.operation(args, this.abortController.signal);

      this.loaderStatus.update(() => ({
        status: LoaderStatus.SUCCESS,
        data: result,
        error: null,
      }));
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return;

      this.loaderStatus.update(() => ({
        status: LoaderStatus.FAILURE,
        error: e instanceof Error ? e : new Error('Loader failure'),
      }));
    }
  }

  abort = () => {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  };
}

export type SimpleLoadingStatus = { status: LoaderStatus; error: Error | null };
type LoaderStrategy =
  | { type: 'debounce'; wait: number }
  | { type: 'ttl'; duration?: number }
  | { type: 'swr'; duration?: number }
  | { type: 'none' };

export class Loader<Args, Result> {
  private readonly stateStore: WritableStore<SimpleLoadingStatus>;
  private readonly revalidationStore: WritableStore<SimpleLoadingStatus>;
  private abortController: AbortController | null = null;
  private lastExecutionTime = 0;
  private readonly trigger: (...args: Args[]) => void;

  public readonly state;

  constructor(
    private operation: (
      signal: AbortSignal,
      ...args: Args[]
    ) => Promise<Result> | Result,
    private config: LoaderStrategy = { type: 'none' },
  ) {
    this.stateStore = createStore<SimpleLoadingStatus>({
      status: LoaderStatus.PENDING,
      error: null,
    });
    this.revalidationStore = createStore<SimpleLoadingStatus>({
      status: LoaderStatus.PENDING,
      error: null,
    });
    this.state = this.stateStore.readonly;
    this.trigger = this.createTrigger(this.config);
  }

  load = (...args: Args[]) => {
    this.trigger(...args);
  };

  private createTrigger(config: LoaderStrategy) {
    const execute = (isRevalidating: boolean, ...args: Args[]) =>
      this.performExecution(isRevalidating, ...args);

    switch (config.type) {
      case 'debounce':
        return debounce((...args: Args[]) => {
          this.update(this.stateStore, LoaderStatus.LOADING);
          execute(false, ...args);
        }, config.wait);

      case 'ttl':
      case 'swr':
        return (...args: Args[]) => {
          const now = Date.now();
          const isStale =
            now - this.lastExecutionTime >= (config.duration ?? 1000);
          const isFirstLoad =
            this.stateStore.get().status !== LoaderStatus.SUCCESS;

          if (isFirstLoad) {
            this.update(this.stateStore, LoaderStatus.LOADING);
            execute(false, ...args);
          } else if (isStale) {
            const isSWR = config.type === 'swr';
            this.update(
              isSWR ? this.revalidationStore : this.stateStore,
              LoaderStatus.LOADING,
            );
            execute(isSWR, ...args);
          }
        };

      default:
        return (...args: Args[]) => {
          this.update(this.stateStore, LoaderStatus.LOADING);
          execute(false, ...args);
        };
    }
  }
  private update(
    store: WritableStore<SimpleLoadingStatus>,
    status: LoaderStatus,
    error: Error | null = null,
  ) {
    if (status === LoaderStatus.SUCCESS) {
      store.set({ status, error: null });
    } else {
      store.update(s => ({ status, error: error ?? s.error }));
    }
  }

  private async performExecution(isRevalidating: boolean, ...args: Args[]) {
    this.abort();
    this.abortController = new AbortController();

    const targetStore = isRevalidating
      ? this.revalidationStore
      : this.stateStore;
    try {
      await this.operation(this.abortController.signal, ...args);
      this.lastExecutionTime = Date.now();
      this.update(targetStore, LoaderStatus.SUCCESS);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      this.update(
        targetStore,
        LoaderStatus.FAILURE,
        error instanceof Error ? error : new Error('Loader failure'),
      );
    }
  }
  abort = () => {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  };
}
