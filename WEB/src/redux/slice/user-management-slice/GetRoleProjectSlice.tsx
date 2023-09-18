import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserInfoState {
    projectData:any| null;
    loading: boolean;
    success: string | null;
    error: string | null;
    
    
  }

const initialState: UserInfoState = {
    projectData:null,
  loading: false,
  success: null,
  error: null,


};

export const getRoleProjectSlice = createSlice({
  name: "getRoleProject",
  initialState,
  reducers: {
    getRoleProjectRequest: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
      state.projectData = null;
      
    },
    getRoleProjectSuccess: (state,action) => {
      state.projectData = action.payload;
      state.loading = false;
      state.success = action.payload;
      
    },
    getRoleProjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    
  
    },
    getRoleProjectReset : ()=>{
      return initialState;
    }
  },
});

export const {
    getRoleProjectRequest,
    getRoleProjectSuccess,
    getRoleProjectFailure,
    getRoleProjectReset
} = getRoleProjectSlice.actions;


export default getRoleProjectSlice.reducer;
