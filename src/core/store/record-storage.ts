export interface RecordStorage<V> {
  set(key: string, value: V): void;

  get(key: string): V | null;
  get<NSV>(key: string, notSetValue?: NSV): V | NSV;

  update<NSV>(
    key: string,
    updater: (previous: V | NSV) => V | NSV,
    notSetValue: NSV,
  ): V | NSV;

  clear(key: string): void;

  clearAllValues(): void;
}
