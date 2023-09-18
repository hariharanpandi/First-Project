// termsAndConditionsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TermsAndConditionsState {
  termsData: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TermsAndConditionsState = {
  termsData: [],
  isLoading: false,
  error: null,
};

export const termsAndConditionsSlice = createSlice({
  name: "termsAndConditions",
  initialState,
  reducers: {
    fetchTermsAndConditionsRequest(state) {
      state.error = null;
      state.error = null;
    },
    fetchTermsAndConditionsSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.termsData = action.payload;
    },
    fetchTermsAndConditionsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTermsAndConditionsRequest,
  fetchTermsAndConditionsSuccess,
  fetchTermsAndConditionsFailure,
} = termsAndConditionsSlice.actions;

export default termsAndConditionsSlice.reducer;
