export enum FetchStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  READY = 'READY',
  ERROR = 'ERROR',
}

export type FetchState<Result> =
  | { status: FetchStatus.IDLE }
  | { status: FetchStatus.FETCHING; error: Error | null }
  | { status: FetchStatus.READY; error: null; data: Result }
  | { status: FetchStatus.ERROR; error: Error };

export type FetchMoreState =
  | { status: FetchStatus.IDLE }
  | { status: FetchStatus.FETCHING; error: Error | null }
  | { status: FetchStatus.READY; error: null }
  | { status: FetchStatus.ERROR; error: Error };

export type FetchStrategy =
  | { type: 'immediate' }
  | { type: 'debounce'; wait?: number }
  | { type: 'swr'; duration?: number }
  | { type: 'ttl'; duration?: number };
