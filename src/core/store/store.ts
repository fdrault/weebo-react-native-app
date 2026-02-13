import { useSyncExternalStore } from "react";

export const useStore = <T>(store: ReadableStore<T>) => {
  return useSyncExternalStore(store.subscribe, store.get);
};

type Listener<T> = (state: T) => void;

export type ReadableStore<T> = {
  get: () => T;
  subscribe: (listener: Listener<T>) => () => void;
  select: <S>(selector: (state: T) => S) => ReadableStore<S>;
};

type Selector<State, Selection> = (state: State) => Selection;

type FlattenObject<T> = {
  [K in keyof T]: T[K] extends ReadableStore<infer V> ? V : never;
};


export type WritableStore<T> = ReadableStore<T> & {
  set: (nextState: T) => void;
  update: (updater: (currentState: T) => T) => void;
  readonly: ReadableStore<T>
};

export const createStore = <State>(
  initialState: State,
): WritableStore<State> => {
  const listeners = new Set<Listener<State>>();
  let currentState = initialState;

  const emit = () => {
    for (const listener of listeners) listener(currentState);
  };

  const get = () => currentState;

  const subscribe = (listener: Listener<State>) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const set = (nextState: State) => {
    currentState = nextState;
    emit();
  };

  const update = (updater: (s: State) => State) => set(updater(currentState));

  const select: <Slice>(
    selector: Selector<State, Slice>,
  ) => ReadableStore<Slice> = selector =>
    createDerivedStore({ get, subscribe, select }, selector);

  return { get, subscribe, set, update, select , readonly: { get, subscribe, select} };
};

const createDerivedStore = <State, Slice>(
  parent: ReadableStore<State>,
  selector: (state: State) => Slice,
): ReadableStore<Slice> => {
  let lastParentState = parent.get();
  let lastSlice = selector(lastParentState);

  const get = () => {
    const currentParentState = parent.get();
    if (currentParentState !== lastParentState) {
      lastParentState = currentParentState;
      lastSlice = selector(currentParentState);
    }
    return lastSlice;
  };

  const subscribe = (listener: Listener<Slice>) => {
    return parent.subscribe(nextParentState => {
      if (nextParentState === lastParentState) return;

      const nextSlice = selector(nextParentState);
      if (nextSlice !== lastSlice) {
        lastParentState = nextParentState;
        lastSlice = nextSlice;
        listener(nextSlice);
      }
    });
  };

  const select: <U>(selector: Selector<Slice, U>) => ReadableStore<U> = <U>(
    derivedSelector: (slice: Slice) => U,
  ) => createDerivedStore({ get, subscribe, select }, derivedSelector);

  return { get, subscribe, select };
};

export const combineStores = <
  const Stores extends Record<string, ReadableStore<any>>,
  Result,
>(
  stores: Stores,
  selector: (values: FlattenObject<Stores>) => Result,
): ReadableStore<Result> => {
  const storeEntries = Object.entries(stores);

  const getMappedValues = () => {
    const obj: any = {};
    for (const [key, store] of storeEntries) {
      obj[key] = store.get();
    }
    return obj as FlattenObject<Stores>;
  };

  let lastMappedValues = getMappedValues();
  let lastResult = selector(lastMappedValues);

  const get = (): Result => {
    const currentValues = getMappedValues();
    const hasChanged = storeEntries.some(
      ([key]) => (currentValues as any)[key] !== (lastMappedValues as any)[key]
    );

    if (hasChanged) {
      lastMappedValues = currentValues;
      lastResult = selector(currentValues);
    }
    return lastResult;
  };

  const subscribe = (listener: Listener<Result>) => {
    const unsubs = storeEntries.map(([_, store]) =>
      store.subscribe(() => {
        const nextResult = get();
        if (nextResult !== lastResult) {
          lastResult = nextResult;
          listener(lastResult);
        }
      })
    );
    return () => unsubs.forEach((fn) => fn());
  };

  const select: <U>(s: (state: Result) => U) => ReadableStore<U> = <U>(s: (state: Result) => U) =>
    createDerivedStore({ get, subscribe, select }, s);

  return { get, subscribe, select };
};