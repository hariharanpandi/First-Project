import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {EditProfile } from "../../../@types/setting-types/profile-setting/EditProfileTypes";

export interface ProfileEditState {
  profileEdit: any| null;
    Editloading: boolean;
    EditSuccess: string | null;
    error: string | null;
    isLoggedin:boolean;
    
  }

const initialState: ProfileEditState = {
  profileEdit:null,
  Editloading: false,
  EditSuccess: null,
  error: null,
  isLoggedin:false,

};

export const profileEditSlice = createSlice({
  name: "profileEdit",
  initialState,
  reducers: {
    profileEditRequest: (state,action) => {
      state.Editloading = true;
      state.EditSuccess = null;
      state.error = null;
      state.profileEdit = null;
      
    },
    profileEditSuccess: (state,action) => {
      state.profileEdit = action.payload;
      state.Editloading = false;
      state.EditSuccess = action.payload;
      state.isLoggedin=true;
    },
    profileEditFailure: (state, action) => {
      state.Editloading = false;
      state.error = action.payload;
      state.profileEdit = null;
      state.isLoggedin=false;
    },
    profileEditReset : (state)=>{
      state.EditSuccess=null;
      state.error=null;
    }
  },
});

export const {
    profileEditRequest,
    profileEditSuccess,
    profileEditFailure,
    profileEditReset
} = profileEditSlice.actions;


export default profileEditSlice.reducer;
