// アプリ全体の Redux store を組み立てるファイルです。
import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import type { AuthState } from "@/features/auth/store/authSlice";
import type { RequestFilterState } from "@/features/request/store/requestSlice";
import { featureRegistry } from "@/app/registry/featureRegistry";
import { persistFeatureStates, persistSettingsState, loadFeaturePreloadedState, loadNormalizedSettingsState } from "@/app/store/persist";
import { settingsReducer, type SettingsState } from "@/app/store/settingsSlice";

const rootReducer = combineReducers({
  settings: settingsReducer,
  ...featureRegistry.reducers,
});

// state 更新後に localStorage へ反映するための listener middleware です。
const persistenceListener = createListenerMiddleware();

export const createAppStore = () => {
  // 永続化対象だけを preload し、API レスポンスのような一時データは復元しません。
  const preloadedState = {
    settings: loadNormalizedSettingsState(),
    ...loadFeaturePreloadedState(),
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).prepend(persistenceListener.middleware),
  });

  persistenceListener.startListening({
    predicate: () => true,
    effect: (_, listenerApi) => {
      // store 変更のたびに settings と persist 対象 feature だけを書き戻します。
      const state = listenerApi.getState() as RootState;
      persistSettingsState(state.settings);
      persistFeatureStates(state as Record<string, unknown>);
    },
  });

  return store;
};

export const store = createAppStore();

export type AppStore = typeof store;
export type RootState = Record<string, unknown> & {
  settings: SettingsState;
  auth?: AuthState;
  request?: RequestFilterState;
};
export type AppDispatch = AppStore["dispatch"];