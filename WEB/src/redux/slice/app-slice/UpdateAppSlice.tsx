import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UpdateAppState {
  updateAppType: any | null;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: string | null;
}

const initialState: UpdateAppState = {
  updateAppType: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: null,
};

export const updateAppSlice = createSlice({
  name: "updateApp",
  initialState,
  reducers: {
    updateAppRequest: (state,action) => {
      state.updateAppType = null;
      state.updateLoading = true;
      state.updateError = null;
    },
    updateAppSuccess: (state, action) => {
      state.updateAppType = action.payload;
      state.updateLoading = false;
      state.updateSuccess = action.payload;
    },
    updateAppFailure: (state, action) => {
      state.updateLoading = false;
      state.updateError = action.payload;
      state.updateAppType = null;
    },
    updateAppReset: (state) => {
      state.updateSuccess = null;
      state.updateError = null;
    },
  },
});

export const {
  updateAppRequest,
  updateAppSuccess,
  updateAppFailure,
  updateAppReset,
} = updateAppSlice.actions;

export default updateAppSlice.reducer;
