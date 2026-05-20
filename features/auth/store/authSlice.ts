// 認証トークンとユーザー基本情報だけを保持する auth slice です。
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/app/config/storage";

export interface AuthState {
  token: string | null;
  profile: {
    id: string;
    name: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    },
    clearSession(state) {
      state.token = null;
      state.profile = null;
    },
  },
});

export const authPersistConfig = {
  // 復元に必要な最小情報だけを localStorage へ保存します。
  key: STORAGE_KEYS.auth,
  select: (state: AuthState) => ({
    token: state.token,
    profile: state.profile,
  }),
};

export const { clearSession, setSession } = authSlice.actions;
export const authReducer = authSlice.reducer;