import {
  FetchState,
  FetchStatus,
  FetchStrategy,
} from '@/core/fetcher/fetcher-state';
import { WritableStore } from '@/core/store/store';

const buildFetchStateMachine = <Result>(
  state: WritableStore<FetchState<Result>>,
) => {
  const toReady = (data: Result) =>
    state.set({ status: FetchStatus.READY, error: null, data });
  const toFetching = () =>
    state.update(s => ({
      status: FetchStatus.FETCHING,
      error: 'error' in s ? s.error : null,
    }));
  const toError = (error: Error) => {
    state.set({ status: FetchStatus.ERROR, error });
  };

  return { state: state.readonly, toReady, toFetching, toError };
};

type FetchStateMachine<Result> = ReturnType<
  typeof buildFetchStateMachine<Result>
>;

const buildImmediateStrategy = <Args, Result>(
  context: {
    machine: FetchStateMachine<Result>;
  },
  operation: (signal: AbortSignal, ...args: Args[]) => Promise<any>,
) => {
  const execute = (signal: AbortSignal) =>
    performFetch(context, signal, operation);
  return execute;
};

const buildTTLStrategy = <Args, Result>(
  context: {
    machine: FetchStateMachine<Result>;
    ttl: number;
  },
  operation: (signal: AbortSignal, ...args: Args[]) => Promise<any>,
) => {
  let lastExecutionTime = 0;
  const execute = (signal: AbortSignal) => {
    const shouldExecute = Date.now() - lastExecutionTime > context.ttl;
    if (shouldExecute) {
      lastExecutionTime = Date.now();
      return performFetch(context, signal, operation);
    }
  };
  return execute;
};

const buildSWRStrategy = <Args, Result>(
  context: {
    stateMachine: FetchStateMachine<Result>;
    revalidatingMachine: FetchStateMachine<Result>;
    ttl: number;
  },
  operation: (signal: AbortSignal, ...args: Args[]) => Promise<any>,
) => {
  const { stateMachine, revalidatingMachine, ttl } = context;
  let lastExecutionTime = 0;
  const execute = (signal: AbortSignal, ...args: Args[]) => {
    const isFirstLoad = stateMachine.state.get().status !== FetchStatus.READY;
    const isStale = Date.now() - lastExecutionTime > ttl;

    if (isFirstLoad) {
      lastExecutionTime = Date.now();
      return performFetch(
        { machine: stateMachine },
        signal,
        operation,
        ...args,
      );
    }
    if (isStale) {
      lastExecutionTime = Date.now();
      return performFetch(
        { machine: revalidatingMachine },
        signal,
        operation,
        ...args,
      );
    }
  };
  return execute;
};

const buildDebounceStrategy = <Args, Result>(
  context: {
    machine: FetchStateMachine<Result>;
    wait: number;
  },
  operation: (signal: AbortSignal, ...args: Args[]) => Promise<any>,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const execute = (signal: AbortSignal, ...args: Args[]) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    timeoutId = setTimeout(
      () => performFetch(context, signal, operation, ...args),
      context.wait,
    );
  };
  return execute;
};

const performFetch = <Args, Result>(
  context: { machine: FetchStateMachine<Result> },
  signal: AbortSignal,
  operation: (signal: AbortSignal, ...args: Args[]) => Promise<Result>,
  ...args: Args[]
) => {
  const { machine } = context;
  const fetch = async () => {
    try {
      machine.toFetching();
      const result = await operation(signal, ...args);
      machine.toReady(result);
    } catch (e) {
      machine.toError(e instanceof Error ? e : new Error('Fetch error'));
    }
  };
  fetch();
};

export const buildFromStrategy = <Args, Result>(
  strategy: FetchStrategy,
  fetchStateStore: WritableStore<FetchState<Result>>,
  revalidateStateStore: WritableStore<FetchState<Result>>,
  operation: (signal: AbortSignal, ...args: Args[]) => Promise<any>,
) => {
  switch (strategy.type) {
    case 'immediate':
      return buildImmediateStrategy(
        { machine: buildFetchStateMachine(fetchStateStore) },
        operation,
      );
    case 'swr':
      return buildSWRStrategy(
        {
          stateMachine: buildFetchStateMachine(fetchStateStore),
          revalidatingMachine: buildFetchStateMachine(revalidateStateStore),
          ttl: strategy.duration ?? 60 * 1000,
        },
        operation,
      );
    case 'ttl':
      return buildTTLStrategy(
        {
          machine: buildFetchStateMachine(fetchStateStore),
          ttl: strategy.duration ?? 60 * 1000,
        },
        operation,
      );
    case 'debounce':
      return buildDebounceStrategy(
        {
          machine: buildFetchStateMachine(fetchStateStore),
          wait: strategy.wait ?? 1000,
        },
        operation,
      );
  }
};
