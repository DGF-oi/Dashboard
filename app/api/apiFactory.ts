// feature manifest から API クライアントを自動生成するファクトリです。
import axios from "axios";
import { getBooleanEnvValue, getEnvValue } from "@/app/config/env";
import { featureRegistry } from "@/app/registry/featureRegistry";
import { attachAuthHeader } from "@/app/api/interceptors/authInterceptor";
import { normalizeApiError } from "@/app/api/interceptors/errorInterceptor";

export interface ApiClientDefinition {
  featureKey: string;
  endpoint: string;
  baseUrl: string;
  useMock: boolean;
}

const definitions = Object.entries(featureRegistry.apiDefinitions).reduce<Record<string, ApiClientDefinition>>(
  (accumulator, [featureKey, definition]) => {
    // baseUrl と mock 利用可否を feature ごとに解決しておきます。
    const baseUrl = getEnvValue(definition.baseUrlEnv);
    accumulator[featureKey] = {
      featureKey,
      endpoint: definition.endpoint,
      baseUrl,
      useMock: definition.mockEnv ? getBooleanEnvValue(definition.mockEnv) : false,
    };
    return accumulator;
  },
  {},
);

const clients = Object.values(definitions).reduce<Record<string, ReturnType<typeof axios.create>>>((accumulator, definition) => {
  // Axios client を feature 単位で作成し、共通 interceptor を差し込みます。
  const client = axios.create({
    baseURL: definition.baseUrl || `/${definition.endpoint}`,
    timeout: 15000,
  });

  client.interceptors.request.use(attachAuthHeader);
  client.interceptors.response.use((response) => response, normalizeApiError);
  accumulator[definition.featureKey] = client;
  return accumulator;
}, {});

export const apiFactory = {
  getClient(featureKey: string) {
    const client = clients[featureKey];
    if (!client) {
      throw new Error(`API client is not configured for feature: ${featureKey}`);
    }
    return client;
  },
  getDefinition(featureKey: string) {
    return definitions[featureKey];
  },
};