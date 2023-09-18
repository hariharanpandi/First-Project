import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface GetAppState {
  appData: null;
  appLoading: boolean;
  appError: string | null;
  appSuccess: string | null;
}

const initialState: GetAppState = {
    appData: null,
    appLoading: false,
  appError: null,
  appSuccess: null,
};

export const GetAppSlice = createSlice({
  name: "GetApp",
  initialState,
  reducers: {
    GetAppRequest: (state) => {
      state.appData = null;
      state.appLoading = true;
      state.appError = null;
    },
    GetAppSuccess: (state,action) => {
      state.appData = action.payload;
      state.appLoading = false;
      state.appSuccess = action.payload;
    },
    GetAppFailure: (state, action) => {
      state.appLoading = false;
      state.appError = action.payload;
      state.appData = null;

    },
    GetAppReset: (state)=>{
     state.appSuccess = null
    }
  },
});

export const { 
    GetAppRequest,
    GetAppSuccess,
    GetAppFailure,
    GetAppReset } =
    GetAppSlice.actions;

export default  GetAppSlice.reducer;
