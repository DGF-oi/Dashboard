// feature manifest が従う契約をまとめた型定義です。
import type { Reducer } from "@reduxjs/toolkit";
import type { RouteObject } from "react-router-dom";

export type Locale = "ja" | "en";

export interface PersistConfig<State> {
  key?: string;
  select: (state: State) => unknown;
}

export interface FeatureStoreDefinition<State = unknown> {
  reducer: Reducer<State>;
  persist?: boolean | PersistConfig<State>;
}

export interface FeatureApiDefinition {
  endpoint: string;
  baseUrlEnv: string;
  mockEnv?: string;
}

export interface FeatureI18nDefinition {
  namespaces: string[];
}

export interface FeatureDefinition<State = unknown> {
  key: string;
  store?: FeatureStoreDefinition<State>;
  routes?: RouteObject[];
  api?: FeatureApiDefinition;
  i18n?: FeatureI18nDefinition;
}

export interface PersistEntry {
  storageKey: string;
  reducerKey: string;
  select: (rootState: Record<string, unknown>) => unknown;
}