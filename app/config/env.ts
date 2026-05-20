// Vite の環境変数を安全に読むための薄いラッパーです。
const readEnv = (name: string, fallback = "") => {
  const value = import.meta.env[name as keyof ImportMetaEnv];
  return typeof value === "string" ? value : fallback;
};

const readBooleanEnv = (name: string, fallback = false) => {
  const value = readEnv(name);
  if (!value) {
    return fallback;
  }

  return value === "true";
};

export const appEnv = {
  // UI 初期表示や API 接続先の既定値をここでまとめて管理します。
  appName: readEnv("VITE_APP_NAME", "KAMS Frontend Template"),
  defaultLanguage: readEnv("VITE_DEFAULT_LANGUAGE", "ja"),
  requestApiBaseUrl: readEnv(
    "VITE_REQUEST_API",
    "https://example.execute-api.ap-northeast-1.amazonaws.com/request",
  ),
  authApiBaseUrl: readEnv(
    "VITE_AUTH_API",
    "https://example.execute-api.ap-northeast-1.amazonaws.com/auth",
  ),
  useRequestMock: readBooleanEnv("VITE_USE_REQUEST_MOCK", true),
  useAuthMock: readBooleanEnv("VITE_USE_AUTH_MOCK", true),
};

export const getEnvValue = (name: string) => readEnv(name);
export const getBooleanEnvValue = (name: string, fallback = false) => readBooleanEnv(name, fallback);