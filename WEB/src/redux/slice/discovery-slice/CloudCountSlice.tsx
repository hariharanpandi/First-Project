import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TermsAndConditionsState {
  countData: any | null;
  isLoading: boolean;
  error: string | null;
  loading: boolean;
  success: string | null;
}

const initialState: TermsAndConditionsState = {
  countData: null,
  isLoading: false,
  error: null,
  loading: false,
  success: null,
};

export const cloudCountSlice = createSlice({
  name: "cloudcounts",
  initialState,
  reducers: {
    fetchCloudCountRequest(state,action) {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.countData = null;
    },
    fetchClodCountSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.countData = action.payload;
      state.success = action.payload;
    },
    fetchCloudCountFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCloudCountRequest,
  fetchClodCountSuccess,
  fetchCloudCountFailure,
} = cloudCountSlice.actions;

export default cloudCountSlice.reducer;
