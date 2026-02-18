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

export class Loader<Args, Result> {
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
