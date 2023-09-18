import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface Discovery {
  discoveryData: null;
  discoveryLoading: boolean;
  discoveryError: string | null;
  appSuccess: string | null;
}

const initialState: Discovery = {
    discoveryData: null,
    discoveryLoading: false,
    discoveryError: null,
  appSuccess: null,
};

export const discoverySlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {
    discoveryRequest: (state,action) => {
      state.discoveryData = null;
      state.discoveryLoading = true;
      state.discoveryError = null;
    },
    discoverySuccess: (state,action) => {
      state.discoveryData = action.payload;
      state.discoveryLoading = false;
      state.appSuccess = action.payload;
    },
    discoveryFailure: (state, action) => {
      state.discoveryLoading = false;
      state.discoveryError = action.payload;
      state.discoveryData = null;

    },
    discoveryReset: (state)=>{
     state.appSuccess = null
    }
  },
});

export const { 
    discoveryRequest,
    discoverySuccess,
    discoveryFailure,
    discoveryReset } =
    discoverySlice.actions;

export default  discoverySlice.reducer;
