// request feature で使う UI フィルタ状態を保持する slice です。
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface RequestFilterState {
  status: "all" | "queued" | "approved" | "rejected";
}

const initialState: RequestFilterState = {
  status: "all",
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<RequestFilterState["status"]>) {
      state.status = action.payload;
    },
  },
});

export const { setStatusFilter } = requestSlice.actions;
export const requestReducer = requestSlice.reducer;