// Redux の設定状態と feature の必要最小限の状態を localStorage と同期します。
import { STORAGE_KEYS } from "@/app/config/storage";
import { featureRegistry } from "@/app/registry/featureRegistry";
import { defaultSettingsState, type SettingsState } from "@/app/store/settingsSlice";

const isBrowser = typeof window !== "undefined";

const readStorage = <T>(key: string, fallback: T): T => {
  // ブラウザ以外の環境では storage を触れないため既定値を返します。
  if (!isBrowser) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = (key: string, value: unknown) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadSettingsState = () => readStorage<SettingsState>(STORAGE_KEYS.settings, defaultSettingsState);
export const loadNormalizedSettingsState = (): SettingsState => {
  // 旧 version の保存値にも対応できるように default とマージします。
  const persisted = readStorage<Partial<SettingsState>>(STORAGE_KEYS.settings, {});

  return {
    ...defaultSettingsState,
    ...persisted,
    ui: {
      ...defaultSettingsState.ui,
      ...(persisted.ui ?? {}),
    },
  };
};

export const loadFeaturePreloadedState = () => {
  return featureRegistry.persistEntries.reduce<Record<string, unknown>>((accumulator, entry) => {
    accumulator[entry.reducerKey] = readStorage(entry.storageKey, undefined);
    return accumulator;
  }, {});
};

export const persistSettingsState = (settings: SettingsState) => {
  writeStorage(STORAGE_KEYS.settings, settings);
};

export const persistFeatureStates = (rootState: Record<string, unknown>) => {
  featureRegistry.persistEntries.forEach((entry) => {
    const value = entry.select(rootState);
    if (typeof value !== "undefined") {
      writeStorage(entry.storageKey, value);
    }
  });
};