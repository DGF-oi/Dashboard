// アクセストークンを Authorization ヘッダーへ付与する interceptor です。
import type { InternalAxiosRequestConfig } from "axios";

type TokenResolver = () => string | null;

let resolveToken: TokenResolver = () => null;

export const setAuthTokenResolver = (resolver: TokenResolver) => {
  resolveToken = resolver;
};

export const attachAuthHeader = (config: InternalAxiosRequestConfig) => {
  // token がある場合だけ Authorization を付与します。
  const token = resolveToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers.set("Content-Type", "application/json");
  return config;
};