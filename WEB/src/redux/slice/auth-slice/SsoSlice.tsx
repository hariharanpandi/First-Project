import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SSOState {
    loading: boolean;
    success: string | null;
    error: string | null;
    domain:string;
  }

const initialState: SSOState = {
  loading: false,
  success: "",
  error: "",
  domain:"",
};

export const SSOSlice = createSlice({
  name: "sso",
  initialState,
  reducers: {
    SSORequest: (state,action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.domain="";
    },
    SSOSuccess: (state,action) => {
      state.loading = false;
      state.success = action.payload;
      state.domain=action.payload;
    },
    SSOFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.domain="";
    },
  },
});

export const {
  SSORequest,
  SSOSuccess,
  SSOFailure,
} = SSOSlice.actions;

export default SSOSlice.reducer;
