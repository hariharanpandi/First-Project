import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserInfoState {
    appData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: UserInfoState = {
    appData:null,
  loading: false,
  success: null,
  error: null,


};

export const getRoleAppSlice = createSlice({
  name: "getRoleApp",
  initialState,
  reducers: {
    getRoleAppRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.appData = null;
      
    },
    getRoleAppSuccess: (state,action) => {
      state.appData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getRoleAppFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getRoleAppReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getRoleAppRequest,
    getRoleAppSuccess,
    getRoleAppFailure,
    getRoleAppReset
} = getRoleAppSlice.actions;


export default getRoleAppSlice.reducer;
