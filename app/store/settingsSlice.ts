// テーマや言語など、画面全体で共有する設定状態を管理する slice です。
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { appEnv } from "@/app/config/env";

export type ThemeMode = "light" | "dark" | "system";

export interface SettingsState {
  language: "ja" | "en";
  theme: ThemeMode;
  ui: {
    compactSidebar: boolean;
  };
}

export const defaultSettingsState: SettingsState = {
  // 初期値は環境変数から決めつつ、足りないものは安全な既定値へ寄せます。
  language: appEnv.defaultLanguage === "en" ? "en" : "ja",
  theme: "system",
  ui: {
    compactSidebar: false,
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: defaultSettingsState,
  reducers: {
    setLanguage(state, action: PayloadAction<SettingsState["language"]>) {
      state.language = action.payload;
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
    },
    setCompactSidebar(state, action: PayloadAction<boolean>) {
      state.ui.compactSidebar = action.payload;
    },
  },
});

export const { setCompactSidebar, setLanguage, setTheme } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;