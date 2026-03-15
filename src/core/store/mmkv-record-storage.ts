import { createMMKV, MMKV } from 'react-native-mmkv';

export class MMKVRecordStorage {
  private MMKV: MMKV;
  constructor(public id: string) {
    this.MMKV = createMMKV({ id });
  }
  set(key: string, value: string): void {
    this.MMKV.set(key, value);
  }
  get<NSV>(key: string, notSetValue: NSV | null = null) {
    const value = this.MMKV.getString(key);
    if (value === undefined) {
      return notSetValue ?? null;
    }
    return value;
  }

  update<NSV>(
    key: string,
    updater: (previous: string | NSV) => string | NSV,
    notSetValue: NSV,
  ) {
    const value = this.get(key, notSetValue);
    const result = updater(value as string | NSV);
    return result;
  }

  clear(key: string): void {
    this.MMKV.remove(key);
  }
  clearAllValues(): void {
    this.MMKV.clearAll();
  }
}
