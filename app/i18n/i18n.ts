// 共通文言と feature locale を束ねて i18next を初期化します。
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { featureRegistry } from "@/app/registry/featureRegistry";
import { store } from "@/app/store/createAppStore";
import { setLanguage } from "@/app/store/settingsSlice";

type LocaleNamespace = Record<string, unknown>;
type LocaleModule = { default: LocaleNamespace } | LocaleNamespace;

const toLocaleNamespace = (module: LocaleModule): LocaleNamespace => {
  const candidate = "default" in module ? module.default : module;
  return typeof candidate === "object" && candidate !== null
    ? (candidate as LocaleNamespace)
    : ({} as LocaleNamespace);
};

// common locales を glob で収集します（src/common/locales/en/*.json など）。
const commonLocaleFiles = import.meta.glob<LocaleModule>(
  "../../common/locales/*/*.json",
  { eager: true }
);

const loadCommonResources = () => {
  // common locales を言語別・namespace別に整形します。
  const resources: Record<string, Record<string, Record<string, LocaleNamespace>>> = {
    ja: { common: {} },
    en: { common: {} },
  };

  for (const [filePath, module] of Object.entries(commonLocaleFiles)) {
    // ファイルパスから言語とnamespaceを抽出します。
    // src/common/locales/en/header.json → en, header
    // src/common/locales/jp/header.json → jp (ja に変換), header
    const match = filePath.match(/locales\/(en|jp)\/([^/]+)\.json$/);
    if (!match) continue;

    const [, localeFolder, namespace] = match;
    const locale = localeFolder === "jp" ? "ja" : "en";

    if (!resources[locale].common[namespace]) {
      resources[locale].common[namespace] = {};
    }

    // 各 namespace の中に データを展開します。
    resources[locale].common[namespace] = toLocaleNamespace(module);
  }

  return resources;
};

const commonResources = loadCommonResources();

void i18n.use(initReactI18next).init({
  // feature registry から収集した locale をそのまま resources に流し込みます。
  resources: {
    ja: {
      ...commonResources.ja,
      ...featureRegistry.i18nResources.ja,
    },
    en: {
      ...commonResources.en,
      ...featureRegistry.i18nResources.en,
    },
  },
  lng: store.getState().settings.language,
  fallbackLng: "en",
  ns: ["common", ...featureRegistry.namespaces],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

store.subscribe(() => {
  // Redux の言語設定が変わったら i18next 側にも同期します。
  const language = store.getState().settings.language;
  if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }
});

i18n.on("languageChanged", (language) => {
  // i18next 側から変更された場合も Redux を追従させて一元管理を保ちます。
  const currentLanguage = store.getState().settings.language;
  if (currentLanguage !== language && (language === "ja" || language === "en")) {
    store.dispatch(setLanguage(language));
  }
});

export default i18n;