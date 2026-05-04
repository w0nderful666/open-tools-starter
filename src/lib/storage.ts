export type StorageKey = string;

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const probeKey = "open-tools-starter.storage-probe";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

export const storage = {
  isAvailable(): boolean {
    return getStorage() !== null;
  },

  get<K extends string, T>(key: K, fallback: T): T {
    const localStorage = getStorage();
    if (!localStorage) {
      return fallback;
    }

    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<K extends string, T>(key: K, value: T): boolean {
    const localStorage = getStorage();
    if (!localStorage) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove<K extends string>(key: K): boolean {
    const localStorage = getStorage();
    if (!localStorage) {
      return false;
    }

    localStorage.removeItem(key);
    return true;
  },
};
