import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PrivacyState {
  privacyData: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PrivacyState = {
  privacyData: [],
  isLoading: false,
  error: null,
};

export const PrivacySlice = createSlice({
  name: "privacyPolicy",
  initialState,
  reducers: {
    PrivacyPolycyRequest(state) {
      state.error = null;
      state.isLoading=true;
    },
    PrivacyPolycyRequestSuccess(state, action: PayloadAction<any>) {
      state.isLoading = false;
      state.privacyData = action.payload;
    },
    PrivacyPolycyRequestFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  PrivacyPolycyRequest,
  PrivacyPolycyRequestSuccess,
  PrivacyPolycyRequestFailure,
} = PrivacySlice.actions;

export default PrivacySlice.reducer;
