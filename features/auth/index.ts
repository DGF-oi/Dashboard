// auth feature の manifest です。persist や API 定義をここでまとめます。
import type { FeatureDefinition } from "@/app/types/feature";
import { authReducer, authPersistConfig, type AuthState } from "@/features/auth/store/authSlice";

const authFeature: FeatureDefinition<AuthState> = {
  key: "auth",
  store: {
    reducer: authReducer,
    persist: authPersistConfig,
  },
  api: {
    endpoint: "auth",
    baseUrlEnv: "VITE_AUTH_API",
    mockEnv: "VITE_USE_AUTH_MOCK",
  },
  i18n: {
    namespaces: ["auth"],
  },
};

export default authFeature;