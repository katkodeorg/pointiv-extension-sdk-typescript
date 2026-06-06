import {
  pointivStorageDelete,
  pointivStorageList,
  pointivStorageRead,
  pointivStorageWrite,
} from "./host-calls.js";

export const storage = {
  write(key: string, value: string): void {
    pointivStorageWrite(key, value);
  },

  read(key: string): string | null {
    const value = pointivStorageRead(key);
    return value.length === 0 ? null : value;
  },

  delete(key: string): void {
    pointivStorageDelete(key);
  },

  list(): string[] {
    try {
      return JSON.parse(pointivStorageList()) as string[];
    } catch {
      return [];
    }
  },

  readJson<T>(key: string): T | null {
    const raw = storage.read(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  writeJson<T>(key: string, value: T): void {
    storage.write(key, JSON.stringify(value));
  },
};
