import { siteMeta } from "@/config/siteMeta";
import type { ClipItem } from "./clipboardUtils";
import { normalizeImportedClip } from "./clipboardUtils";

const STORAGE_KEY = `${siteMeta.localStoragePrefix}.clips.v1`;

export const clipboardStorage = {
  isAvailable(): boolean {
    try {
      const probe = `${siteMeta.localStoragePrefix}.probe`;
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  },

  readAll(): ClipItem[] {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const records = Array.isArray(parsed) ? parsed : parsed?.clips;
      if (!Array.isArray(records)) return [];
      return records.map(normalizeImportedClip).filter((clip): clip is ClipItem => Boolean(clip));
    } catch {
      return [];
    }
  },

  saveAll(clips: ClipItem[]): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clips));
  },

  clear(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  },

  exportJson(clips: ClipItem[]): string {
    return JSON.stringify(
      {
        app: siteMeta.name,
        version: siteMeta.version,
        exportedAt: new Date().toISOString(),
        storage: "localStorage adapter",
        clips,
      },
      null,
      2,
    );
  },

  importJson(raw: string, existing: ClipItem[]): ClipItem[] {
    const parsed = JSON.parse(raw);
    const records = Array.isArray(parsed) ? parsed : parsed?.clips;
    if (!Array.isArray(records)) {
      throw new Error("JSON must contain an array or a clips array.");
    }

    const imported = records
      .map(normalizeImportedClip)
      .filter((clip): clip is ClipItem => Boolean(clip));

    const merged = new Map(existing.map((clip) => [clip.id, clip]));
    imported.forEach((clip) => merged.set(clip.id, clip));
    return Array.from(merged.values());
  },
};
