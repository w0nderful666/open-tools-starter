import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export function usePersistentState<T>(
  key: string,
  initialValue: T,
): [T, (nextValue: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() =>
    storage.get(key, initialValue),
  );

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
}