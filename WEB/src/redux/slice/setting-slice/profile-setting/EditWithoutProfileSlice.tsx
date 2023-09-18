import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileEditWithoutState {
  profileEditWithout: any| null;
    EditWithoutLoading: boolean;
    ProfileWithoutImageSuccess: string | null;
    ProfileWithoutImageError: string | null;
    isLoggedin:boolean;
    
  }

const initialState: ProfileEditWithoutState = {
  profileEditWithout:null,
  EditWithoutLoading: false,
  ProfileWithoutImageSuccess: null,
  ProfileWithoutImageError: null,
  isLoggedin:false,

};

export const profileEditWithoutSlice = createSlice({
  name: "profileEditWithout",
  initialState,
  reducers: {
    profileEditWithoutRequest: (state,action) => {
      state.EditWithoutLoading = true;
      state.ProfileWithoutImageSuccess = null;
      state.ProfileWithoutImageError = null;
      state.profileEditWithout = null;
      
    },
    profileEditWithoutSuccess: (state,action) => {
      state.profileEditWithout = action.payload;
      state.EditWithoutLoading = false;
      state.ProfileWithoutImageSuccess = action.payload;
      state.isLoggedin=true;
    },
    profileEditWithoutFailure: (state, action) => {
      state.EditWithoutLoading = false;
      state.ProfileWithoutImageError = action.payload;
      state.profileEditWithout = null;
      state.isLoggedin=false;
    },
    profileEditWithoutReset : ()=>{
      return initialState;
    }
  },
});

export const {
    profileEditWithoutRequest,
    profileEditWithoutSuccess,
    profileEditWithoutFailure,
    profileEditWithoutReset
} = profileEditWithoutSlice.actions;


export default profileEditWithoutSlice.reducer;
