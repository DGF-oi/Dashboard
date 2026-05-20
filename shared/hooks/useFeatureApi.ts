// featureKey から API クライアントと設定定義をまとめて取り出す共通 hook です。
import { apiFactory } from "@/app/api/apiFactory";

export const useFeatureApi = (featureKey: string) => {
  return {
    client: apiFactory.getClient(featureKey),
    definition: apiFactory.getDefinition(featureKey),
  };
};