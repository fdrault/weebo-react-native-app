import { RecordStorage } from '@/core/store/record-storage';
import { Serializable } from '@/core/store/serializable';
import { createStore, WritableStore } from '@/core/store/store';

export function createSerializablePersistentStore<State>(
  record: RecordStorage<string>,
  key: string,
  initialState: State extends Serializable<State> ? State : never,
): WritableStore<State> {
  return createPersistentStore<State>(
    record,
    key,
    initialState,
    source => JSON.stringify(source),
    source => JSON.parse(source),
  );
}

export const createPersistentStore = <State>(
  record: RecordStorage<string>,
  key: string,
  initialState: State,
  serializer: (state: State) => string,
  deserializer: (raw: string) => State,
): WritableStore<State> => {
  const persisted = record.get(key);
  const store = createStore(
    persisted != null ? deserializer(persisted) : initialState,
  );

  const set = (nextState: State) => {
    store.set(nextState);
    record.set(key, serializer(nextState));
  };

  const update: (updater: (currentState: State) => State) => void = updater => {
    store.update(updater);
    record.set(key, serializer(store.get()));
  };

  const patch: (p: Partial<State>) => void = p => {
    store.patch(p);
    record.set(key, serializer(store.get()));
  };

  return { ...store, set, update, patch };
};
