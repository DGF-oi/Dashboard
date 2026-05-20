// 各 feature の manifest を自動収集し、store/router/i18n/API に展開するレジストリです。
import type { Reducer, UnknownAction } from "@reduxjs/toolkit";
import type { RouteObject } from "react-router-dom";
import type { FeatureDefinition, Locale, PersistEntry } from "@/app/types/feature";

const featureModules = import.meta.glob<{ default: FeatureDefinition }>("../../features/**/index.ts", {
  eager: true,
});

// locale は 言語/namespace.json の配置規約から自動で読み込みます。
const localeModules = import.meta.glob<Record<string, unknown>>("../../features/**/locales/*/*.json", {
  eager: true,
  import: "default",
});

// feature key 順に並べることで読み込み結果を安定化させます。
const features = Object.values(featureModules)
  .map((module) => module.default)
  .sort((left, right) => left.key.localeCompare(right.key));

const reducers = features.reduce<Record<string, Reducer<unknown, UnknownAction>>>((accumulator, feature) => {
  if (feature.store) {
    accumulator[feature.key] = feature.store.reducer as Reducer<unknown, UnknownAction>;
  }
  return accumulator;
}, {});

const routes = features.flatMap((feature) => feature.routes ?? [] satisfies RouteObject[]);

const apiDefinitions = features.reduce<Record<string, NonNullable<FeatureDefinition["api"]>>>((accumulator, feature) => {
  if (feature.api) {
    accumulator[feature.key] = feature.api;
  }
  return accumulator;
}, {});

const namespaces = Array.from(
  new Set(features.flatMap((feature) => feature.i18n?.namespaces ?? [])),
);

const i18nResources = Object.entries(localeModules).reduce<Record<Locale, Record<string, Record<string, unknown>>>>(
  (accumulator, [filePath, messages]) => {
    // ユーザー要望に合わせて jp ディレクトリも内部では ja として扱います。
    const match = filePath.match(/features\/.+?\/locales\/(en|jp)\/([^/]+)\.json$/);
    if (!match) {
      return accumulator;
    }

    const [, localeFolder, namespace] = match;
    const locale = localeFolder === "jp" ? "ja" : "en";
    accumulator[locale][namespace] = messages;
    return accumulator;
  },
  {
    ja: {},
    en: {},
  },
);

const persistEntries = features.flatMap<PersistEntry>((feature) => {
  if (!feature.store?.persist) {
    return [];
  }

  if (feature.store.persist === true) {
    return [
      {
        storageKey: `feature:${feature.key}`,
        reducerKey: feature.key,
        select: (rootState) => rootState[feature.key],
      },
    ];
  }

  return [
    {
      storageKey: feature.store.persist.key ?? `feature:${feature.key}`,
      reducerKey: feature.key,
      select: (rootState) => feature.store?.persist && feature.store.persist !== true ? feature.store.persist.select(rootState[feature.key]) : undefined,
    },
  ];
});

export const featureRegistry = {
  features,
  reducers,
  routes,
  apiDefinitions,
  namespaces,
  i18nResources,
  persistEntries,
};