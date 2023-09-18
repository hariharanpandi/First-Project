import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CloudUserState {
  cloudUserData: any | null;
  cloudLoading: boolean;
  cloudError: string | null;

  cloudSuccess: string | null;
}

const initialState: CloudUserState = {
  cloudUserData: null,
  cloudLoading: false,
  cloudError: null,

  cloudSuccess: null,
};

export const getCloudUserSlice = createSlice({
  name: "getCloudUser",
  initialState,
  reducers: {
    getCloudUserRequest(state,action) {
      state.cloudLoading = true;
      state.cloudSuccess = null;
      state.cloudError = null;
      state.cloudUserData = null;
    },
    getCloudUserSuccess(state, action: PayloadAction<any>) {
      state.cloudLoading = false;
      state.cloudUserData = action.payload;
      state.cloudSuccess = action.payload;
    },
    getCloudUserFailure(state, action: PayloadAction<string>) {
      state.cloudLoading = false;
      state.cloudError = action.payload;
    },
  },
});

export const { getCloudUserRequest, getCloudUserSuccess, getCloudUserFailure } =
  getCloudUserSlice.actions;

export default getCloudUserSlice.reducer;
