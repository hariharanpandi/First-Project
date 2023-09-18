import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserInfoState {
    manageUserData:any| null;
    manageLoading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: UserInfoState = {
    manageUserData:null,
    manageLoading: false,
  success: null,
  error: null,


};

export const getManageUserSlice = createSlice({
  name: "getManageUser",
  initialState,
  reducers: {
    getManageUserRequest: (state) => {
      state.manageLoading = true;
      state.success = null;
      state.error = null;
      state.manageUserData = null;
      
    },
    getManageUserSuccess: (state,action) => {
      state.manageUserData = action.payload;
      state.manageLoading = false;
      state.success = action.payload;
      
    },
    getManageUserFailure: (state, action) => {
      state.manageLoading = false;
      state.error = action.payload;
    
  
    },
    getManageUserReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getManageUserRequest,
    getManageUserSuccess,
    getManageUserFailure,
    getManageUserReset
} = getManageUserSlice.actions;


export default getManageUserSlice.reducer;
