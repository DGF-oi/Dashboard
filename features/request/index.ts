// request feature の manifest です。自動登録の入力元になります。
import type { FeatureDefinition } from "@/app/types/feature";
import { requestRoutes } from "@/features/request/routes";
import { requestReducer, type RequestFilterState } from "@/features/request/store/requestSlice";

const requestFeature: FeatureDefinition<RequestFilterState> = {
  key: "request",
  store: {
    reducer: requestReducer,
  },
  routes: requestRoutes,
  api: {
    endpoint: "request",
    baseUrlEnv: "VITE_REQUEST_API",
    mockEnv: "VITE_USE_REQUEST_MOCK",
  },
  i18n: {
    namespaces: ["request"],
  },
};

export default requestFeature;