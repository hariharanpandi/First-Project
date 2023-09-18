import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface CreateAppState {
  appData: null;
  appLoading: boolean;
  appError: string | null;
  appSuccess: string | null;
}

const initialState: CreateAppState = {
    appData: null,
    appLoading: false,
  appError: null,
  appSuccess: null,
};

export const createAppSlice = createSlice({
  name: "createApp",
  initialState,
  reducers: {
    createAppRequest: (state, action) => {
      state.appData = null;
      state.appLoading = true;
      state.appError = null;
    },
    createAppSuccess: (state,action) => {
      state.appData = action.payload;
      state.appLoading = false;
      state.appSuccess = action.payload;
    },
    createAppFailure: (state, action) => {
      state.appLoading = false;
      state.appError = action.payload;
      state.appData = null;

    },
    createAppReset: (state)=>{
     state.appSuccess = null;
     state.appError = null;
     state.appData = null;
    },
  },
});

export const { 
  createAppRequest,
  createAppSuccess,
   createAppFailure,
   createAppReset, } =
createAppSlice.actions;

export default  createAppSlice.reducer;
