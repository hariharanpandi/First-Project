import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ForgotPwdUser } from "../../@types/auth-types/ForgotPwdTypes";

export interface ForgotPwdState {
  user: ForgotPwdUser| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    isLoggedin:boolean;
    
  }

const initialState: ForgotPwdState = {
  user:null,
  loading: false,
  success: null,
  error: null,
  isLoggedin:false,

};

export const forgotPwdSlice = createSlice({
  name: "forgotPwd",
  initialState,
  reducers: {
    forgotPwdRequest: (state,action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.user = null;
      state.isLoggedin=false;
    },
    forgotPwdSuccess: (state,action) => {
      state.user = action.payload;
      state.loading = false;
      state.success = action.payload;
      state.isLoggedin=true;
    },
    forgotPwdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isLoggedin=false;
    },
    forgotPwdReset : ()=>{
      return initialState;
    }
  },
});

export const {
  forgotPwdRequest,
  forgotPwdSuccess,
  forgotPwdFailure,
  forgotPwdReset
} = forgotPwdSlice.actions;

export default forgotPwdSlice.reducer;
