import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../../@types/setting-types/profile-setting/ProfileSettingTypes";

export interface ProfileInfoState {
  profileData: UserProfile| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    isLoggedin:boolean;
    
  }

const initialState: ProfileInfoState = {
  profileData:null,
  loading: false,
  success: null,
  error: null,
  isLoggedin:false,

};

export const profileInfoSlice = createSlice({
  name: "profileInfo",
  initialState,
  reducers: {
    profileInfoRequest: (state,action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.profileData = null;
      
    },
    profileInfoSuccess: (state,action) => {
      state.profileData = action.payload;
      state.loading = false;
      state.success = action.payload;
      state.isLoggedin=true;
    },
    profileInfoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.profileData = null;
      state.isLoggedin=false;
    },
    profileInfoReset : ()=>{
      return initialState;
    }
  },
});

export const {
    profileInfoRequest,
    profileInfoSuccess,
    profileInfoFailure,
    profileInfoReset
} = profileInfoSlice.actions;


export default profileInfoSlice.reducer;
