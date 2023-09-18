import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {EditProfile,  } from "../../../@types/setting-types/profile-setting/EditProfileTypes";
import { ProfileRequests } from "../../../@types/setting-types/profile-setting/ChangeProfileTypes";

export interface ProfileImageState {
  profileImage: ProfileRequests| null;   
  error: string | null;
    
    
  }

const initialState: ProfileImageState = {
  profileImage:null,
  
 
  error: null,
  

};

export const profileImageSlice = createSlice({
  name: "profileImage",
  initialState,
  reducers: {
    profileImageRequest: (state,action) => {
      state.profileImage = null;    
      state.error = null;
      
      
    },
    profileImageSuccess: (state,action) => {
      state.profileImage = action.payload;
     
     
    },
    profileImageFailure: (state, action) => {
     
      state.error = action.payload;
      state.profileImage = null;
      
    },
    profileImageReset : ()=>{
      return initialState;
    }
  },
});

export const {
    profileImageRequest,
    profileImageSuccess,
    profileImageFailure,
    profileImageReset
} = profileImageSlice.actions;


export default profileImageSlice.reducer;
