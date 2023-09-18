import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PasswordRequest } from "../../../@types/setting-types/profile-setting/UpdatePassword";

export interface PasswordUpdateState {
    passwordData: PasswordRequest| null;
    Passwordloading: boolean;
    PasswordSuccess: string | null;
    PasswordError: string | null;
    isLoggedin:boolean;
    
  }

const initialState: PasswordUpdateState = {
  passwordData:null,
  Passwordloading: false,
  PasswordSuccess: null,
  PasswordError: null,
  isLoggedin:false,

};

export const passwordUpdateSlice = createSlice({
  name: "passwordUpdate",
  initialState,
  reducers: {
    passwordUpdateRequest: (state,action) => {
      state.Passwordloading = true;
      state.PasswordSuccess = null;
      state.PasswordError = null;
      state.passwordData = null;
      
    },
    passwordUpdateSuccess: (state,action) => {
      state.passwordData = action.payload;
      state.Passwordloading = false;
      state.PasswordSuccess = action.payload;
      state.isLoggedin=true;
    },
    passwordUpdateFailure: (state, action) => {
      state.Passwordloading = false;
      state.PasswordError = action.payload;
      state.passwordData = null;
      state.isLoggedin=false;
    },
    passwordUpdateReset : (state)=>{
     state.PasswordSuccess=null;
     state.PasswordError=null;
    }
  },
});

export const {
    passwordUpdateRequest,
    passwordUpdateSuccess,
    passwordUpdateFailure,
    passwordUpdateReset
} = passwordUpdateSlice.actions;


export default passwordUpdateSlice.reducer;
