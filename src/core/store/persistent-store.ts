import { RecordStorage } from '@/core/store/record-storage';
import { createStore, WritableStore } from '@/core/store/store';

export const createPersistentStore = <State>(
  record: RecordStorage<string>,
  key: string,
  initialState: State,
): WritableStore<State> => {
  const store = createStore(initialState);

  const set = (nextState: State) => {
    store.set(nextState);
    record.set(key, JSON.stringify(nextState));
  };

  const update: (updater: (currentState: State) => State) => void = updater => {
    store.update(updater);
    record.set(key, JSON.stringify(store.get()));
  };

  const patch: (p: Partial<State>) => void = p => {
    store.patch(p);
    record.set(key, JSON.stringify(store.get()));
  };

  return { ...store, set, update, patch };
};
