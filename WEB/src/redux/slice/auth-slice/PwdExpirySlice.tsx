import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface PwdExpiry {
    expiryUser:any;
    loading: boolean;
    success: string | null;
    expiryError: string | null;
    isLoggedin:boolean;
    
  }

const initialState: PwdExpiry = {
  expiryUser:null,
  loading: false,
  success: null,
  expiryError: null,
  isLoggedin:false,

};

export const pwdExpirySlice = createSlice({
  name: "pwdExpiry",
  initialState,
  reducers: {
    pwdExpiryRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.expiryError = null;
    
      state.isLoggedin=false;
    },
    pwdExpirySuccess: (state,action) => {
      state.expiryUser = action.payload;
      state.loading = false;
      state.success = action.payload;
      state.isLoggedin=true;
    },
    pwdExpiryFailure: (state, action) => {
      state.loading = false;
      state.expiryError = action.payload;
      state.expiryUser = null;
      state.isLoggedin=false;
    },
    pwdExpiryReset : ()=>{
      return initialState;
    }
  },
});

export const {
    pwdExpiryRequest,
    pwdExpirySuccess,
    pwdExpiryFailure,
    pwdExpiryReset
} = pwdExpirySlice.actions;

export default pwdExpirySlice.reducer;
